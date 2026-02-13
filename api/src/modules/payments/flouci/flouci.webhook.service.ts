/**
 * Service de webhook Flouci
 * @description Gère spécifiquement les webhooks Flouci de manière découplée
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { FlouciWebhookDto, FlouciWebhookData } from './flouci.types';
import { Prisma } from '@prisma/client';
import { verifyFlouciWebhookSignature, extractOrderIdFromTrackingId } from './utils/flouci-signature.util';
import { OrdersService } from 'src/modules/orders/orders.service';

@Injectable()
export class FlouciWebhookService {
  private readonly logger = new Logger(FlouciWebhookService.name);
  private readonly webhookSecret: string;
  private readonly n8nWebhookUrl: string;
  private readonly baseUrl = 'https://developers.flouci.com/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly ordersService: OrdersService,
  ) {
    this.webhookSecret = this.configService.get<string>('FLOUCI_WEBHOOK_SECRET') || '';
    this.n8nWebhookUrl = this.configService.get<string>('N8N_PAYMENT_WEBHOOK') || '';
  }

  /**
   * Traiter un webhook Flouci
   * @param payload - Corps du webhook
   * @param signature - Signature du webhook (header)
   * @returns Résultat du traitement
   */
  async processWebhook(
    payload: FlouciWebhookDto,
    signature?: string,
  ): Promise<{
    received: boolean;
    success: boolean;
    orderId?: string;
    status?: string;
    message: string;
  }> {
    try {
      // 1. Vérifier la signature
      const signatureValid = await this.verifyWebhookSignature(payload, signature);
      if (!signatureValid) {
        this.logger.warn(`Invalid webhook signature for order tracking: ${payload.developer_tracking_id}`);
      }

      // 2. Extraire l'ID de commande
      const orderId = this.extractOrderId(payload.developer_tracking_id);

      // 3. Récupérer le paiement associé
      const payment = await this.findPaymentByOrderId(orderId);
      if (!payment) {
        this.logger.warn(`Payment not found for order: ${orderId}`);
        return {
          success: true,
          message: 'Webhook reçu, paiement non trouvé',
        };
      }

      // 4. Vérifier que le webhook nest pas un doublon
      if (this.isDuplicateWebhook(payment, payload)) {
        this.logger.warn(`Duplicate webhook for payment: ${payment.id}`);
        return {
          received: true,
          success: true,
          orderId,
          status: payment.status,
          message: 'Webhook déjà traité',
        };
      }

      // 5. Mettre à jour le paiement
      const newStatus = this.mapStatus(payload.status);
      await this.updatePayment(payment.id, newStatus);

      // 6. Mettre à jour la commande si nécessaire
      if (newStatus === 'COMPLETED') {
        await this.handleSuccessfulPayment(orderId, payment);
      } else if (newStatus === 'FAILED') {
        await this.handleFailedPayment(orderId, payload);
      }

      // 7. Déclencher les workflows n8n
      await this.triggerN8nWorkflow(orderId, newStatus, payload);

      // 8. Logger le traitement
      this.logger.log(`Webhook processed: ${payload.developer_tracking_id} -> ${newStatus}`);

      return {
        received: true,
        success: true,
        orderId,
        status: newStatus,
        message: 'Webhook traité avec succès',
      };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error}`);
      return {
        received: true,
        success: false,
        message: 'Erreur lors du traitement du webhook',
      };
    }
  }

  /**
   * Vérifier la signature du webhook
   */
  private async verifyWebhookSignature(
    payload: FlouciWebhookDto,
    signature?: string,
  ): Promise<boolean> {
    if (!this.webhookSecret || !signature) {
      return true; // Pas de secret configuré, on accepte
    }

    try {
      const payloadCopy = { ...payload };
      delete payloadCopy.signature;

      const result = verifyFlouciWebhookSignature(
        payloadCopy as unknown as Record<string, unknown>,
        signature,
        this.webhookSecret,
      );

      return result.valid;
    } catch {
      return false;
    }
  }

  /**
   * Extraire l'ID de commande du tracking ID
   */
  private extractOrderId(trackingId: string): string {
    try {
      return extractOrderIdFromTrackingId(trackingId);
    } catch {
      // Fallback: essayer de parser directement
      return trackingId.split('-')[0];
    }
  }

  /**
   * Trouver le paiement par ID de commande
   */
  private async findPaymentByOrderId(orderId: string) {
    return this.prisma.payment.findUnique({
      where: { orderId },
    });
  }

  /**
   * Vérifier si le webhook est un doublon
   */
  private isDuplicateWebhook(
    payment: { status: string; updatedAt: Date },
    payload: FlouciWebhookDto,
  ): boolean {
    // Si le paiement est déjà complété et le webhook indique SUCCESS
    if (payment.status === 'COMPLETED' && payload.status === 'SUCCESS') {
      // Vérifier si le webhook est récent (moins de 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return payment.updatedAt > fiveMinutesAgo;
    }
    return false;
  }

  /**
   * Mapper le statut Flouci vers notre enum
   */
  private mapStatus(
    status: 'PENDING' | 'SUCCESS' | 'FAILED',
  ): 'PENDING' | 'COMPLETED' | 'FAILED' {
    switch (status) {
      case 'SUCCESS':
        return 'COMPLETED';
      case 'FAILED':
        return 'FAILED';
      default:
        return 'PENDING';
    }
  }

  /**
   * Mettre à jour le paiement
   */
  private async updatePayment(
    paymentId: string,
    status: 'PENDING' | 'COMPLETED' | 'FAILED',
  ): Promise<void> {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
  }

  /**
   * Gérer un paiement réussi
   */
  private async handleSuccessfulPayment(
    orderId: string,
    payment: { id: string; userId: string; amount: Prisma.Decimal },
  ): Promise<void> {
    try {
      // Mettre à jour le statut de la commande
      await this.ordersService.update(
        orderId,
        { status: 'PROCESSING' } as any,
        undefined,
      );

      this.logger.log(`Order ${orderId} marked as processing after successful payment`);
    } catch (error) {
      this.logger.error(`Error handling successful payment for order ${orderId}: ${error}`);
    }
  }

  /**
   * Gérer un paiement échoué
   */
  private async handleFailedPayment(
    orderId: string,
    payload: FlouciWebhookDto,
  ): Promise<void> {
    this.logger.warn(`Payment failed for order ${orderId}: ${payload.status}`);
  }

  /**
   * Déclencher les workflows n8n
   */
  private async triggerN8nWorkflow(
    orderId: string,
    status: string,
    payload: FlouciWebhookDto,
  ): Promise<void> {
    if (!this.n8nWebhookUrl) {
      return;
    }

    try {
      await firstValueFrom(
        this.httpService.post(this.n8nWebhookUrl, {
          event: 'payment_completed',
          orderId,
          paymentId: payload.payment_id,
          status,
          amount: payload.amount / 1000, // Convertir en TND
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      this.logger.error(`Error triggering n8n workflow for order ${orderId}: ${error}`);
    }
  }

  /**
   * Obtenir l\'historique des webhooks pour un paiement
   */
  async getWebhookHistory(orderId: string): Promise<Array<{
    timestamp: Date;
    status: string;
    payload: Record<string, unknown>;
  }>> {
    // Cette fonctionnalité nécessiterait une table de logs de webhooks
    // Pour linstant, retourner un tableau vide
    return [];
  }
}

