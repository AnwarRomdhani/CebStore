/**
 * Service Flouci Payments
 * @description Gère les paiements via l'API Flouci
 */

import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { tndToMillimes, millimesToTnd } from 'src/utils/tunisian.utils';
import {
  FlouciPaymentPayload,
  FlouciPaymentResponse,
  FlouciTransactionStatusResponse,
  FlouciWebhookData,
  FlouciTransactionStatus,
  FlouciErrorCode,
  FlouciException,
  PaymentInitiationResult,
} from './flouci.types';
import {
  InitiatePaymentDto,
  VerifyPaymentDto,
  TestWalletPaymentDto,
} from './dto/initiate-payment.dto';
import {
  PaymentInitiationResponseDto,
  PaymentVerificationResponseDto,
  WebhookResponseDto,
  PaymentStatusResponseDto,
} from './dto/payment-response.dto';
import {
  generatePaymentSignature,
  createAuthorizationHeader,
  generateTrackingId,
  extractOrderIdFromTrackingId,
  verifyFlouciWebhookSignature,
} from './utils/flouci-signature.util';
import { OrdersService } from 'src/modules/orders/orders.service';
import { Prisma } from '@prisma/client';
import { HttpException } from '@nestjs/common';

@Injectable()
export class FlouciService {
  private readonly logger = new Logger(FlouciService.name);
  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly successUrl: string;
  private readonly failUrl: string;
  private readonly webhookUrl: string;
  private readonly webhookSecret: string;
  private readonly sandbox: boolean;
  private readonly baseUrl = 'https://developers.flouci.com/api/v1';
  private readonly n8nWebhookUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly ordersService: OrdersService,
  ) {
    this.publicKey = this.configService.get<string>('FLOUCI_APP_PUBLIC') || '';
    this.privateKey = this.configService.get<string>('FLOUCI_APP_SECRET') || '';
    this.successUrl = this.configService.get<string>('FLOUCI_SUCCESS_URL') || '';
    this.failUrl = this.configService.get<string>('FLOUCI_FAIL_URL') || '';
    this.webhookUrl = this.configService.get<string>('FLOUCI_WEBHOOK_URL') || '';
    this.webhookSecret = this.configService.get<string>('FLOUCI_WEBHOOK_SECRET') || '';
    this.sandbox = this.configService.get<string>('FLOUCI_SANDBOX') === 'true';
    this.n8nWebhookUrl = this.configService.get<string>('N8N_PAYMENT_WEBHOOK') || '';

    if (!this.publicKey || !this.privateKey) {
      this.logger.warn('Flouci API keys not configured');
    }
  }

  /**
   * Initier un nouveau paiement
   */
  async initiatePayment(dto: InitiatePaymentDto): Promise<PaymentInitiationResponseDto> {
    try {
      // Vérifier que la commande existe
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
      });

      if (!order) {
        throw new NotFoundException(`Commande ${dto.orderId} non trouvée`);
      }

      // Vérifier le montant
      const amount = dto.amount || Number(order.totalAmount);
      if (amount <= 0) {
        throw new BadRequestException('Le montant doit être supérieur à 0');
      }

      // Convertir en millimes
      const amountMillimes = tndToMillimes(amount);

      // Générer le tracking ID
      const trackingId = generateTrackingId(dto.orderId);

      // Préparer le payload
      const payload: FlouciPaymentPayload = {
        amount: amountMillimes,
        success_link: dto.returnUrl || `${this.successUrl}?orderId=${dto.orderId}`,
        fail_link: `${this.failUrl}?orderId=${dto.orderId}`,
        webhook: this.webhookUrl,
        developer_tracking_id: trackingId,
        payment_reason: dto.paymentReason || `Paiement commande ${dto.orderId}`,
      };

      // Générer la signature
      const signature = generatePaymentSignature(
        payload.amount,
        payload.developer_tracking_id,
        payload.success_link,
        payload.fail_link,
        payload.webhook,
        this.privateKey,
      );

      // Créer l'en-tête d'autorisation
      const authHeader = createAuthorizationHeader(this.publicKey, signature);

      // Appeler l'API Flouci
      const response = await firstValueFrom(
        this.httpService.post<FlouciPaymentResponse>(
          `${this.baseUrl}/generate_payment`,
          payload,
          {
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.status !== 'success') {
        throw new FlouciException(
          FlouciErrorCode.NETWORK_ERROR,
          response.data.message || 'Erreur lors de la génération du paiement',
        );
      }

      // Sauvegarder le paiement dans la base de données
      await this.prisma.payment.create({
        data: {
          amount: new Prisma.Decimal(amount),
          status: 'PENDING',
          currency: 'TND',
          transactionId: response.data.result.payment_id,
          userId: order.userId,
          orderId: dto.orderId,
        },
      });

      // Logger en mode sandbox
      if (this.sandbox) {
        this.logger.log(`Sandbox mode: Payment ${response.data.result.payment_id} initiated`);
      }

      // Calculer la date d'expiration (30 minutes)
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      return {
        success: true,
        paymentId: response.data.result.payment_id,
        paymentLink: response.data.result.link,
        trackingId: trackingId,
        amount: amount,
        currency: 'TND',
        expiresAt: expiresAt.toISOString(),
        message: 'Paiement initié avec succès',
      };
    } catch (error) {
      if (error instanceof FlouciException || error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error initiating payment: ${error}`);
      throw new InternalServerErrorException('Erreur lors de l\'initiation du paiement');
    }
  }

  /**
   * Vérifier le statut d\'un paiement
   */
  async verifyPayment(dto: VerifyPaymentDto): Promise<PaymentVerificationResponseDto> {
    try {
      // Récupérer le paiement depuis la base de données
      const payment = await this.prisma.payment.findFirst({
        where: {
          OR: [
            { transactionId: dto.developerTrackingId },
            { orderId: dto.developerTrackingId },
          ],
        },
        include: { order: true },
      });

      if (!payment) {
        throw new NotFoundException('Paiement non trouvé');
      }

      // Si pas de transaction ID Flouci, on ne peut pas vérifier
      if (!payment.transactionId) {
        return {
          success: true,
          paymentId: payment.id,
          trackingId: dto.developerTrackingId,
          status: payment.status,
          amount: Number(payment.amount),
          currency: payment.currency,
          message: 'Paiement en attente',
        };
      }

      // Appeler l'API Flouci pour vérifier le statut
      const authHeader = createAuthorizationHeader(this.publicKey, this.privateKey);

      const response = await firstValueFrom(
        this.httpService.get<FlouciTransactionStatusResponse>(
          `${this.baseUrl}/get_pos_transaction_status?developer_tracking_id=${dto.developerTrackingId}`,
          { headers: { Authorization: authHeader } },
        ),
      );

      const transaction = response.data.transactions?.[0];
      if (!transaction) {
        throw new NotFoundException('Transaction non trouvée');
      }

      // Mapper le statut Flouci vers notre enum
      const status = this.mapFlouciStatus(transaction.status);

      // Mettre à jour le paiement si nécessaire
      if (payment.status !== status) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status },
        });

        // Si paiement réussi, mettre à jour la commande
        if (status === 'COMPLETED') {
          await this.handleSuccessfulPayment(payment);
        }
      }

      return {
        success: true,
        paymentId: payment.id,
        trackingId: dto.developerTrackingId,
        status: status,
        amount: Number(payment.amount),
        currency: payment.currency,
        paidAt: transaction.updated_at,
        message: this.getStatusMessage(status),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error verifying payment: ${error}`);
      throw new InternalServerErrorException('Erreur lors de la vérification du paiement');
    }
  }

  /**
   * Traiter le webhook Flouci
   */
  async handleWebhook(webhookDto: FlouciWebhookData, signature?: string): Promise<WebhookResponseDto> {
    try {
      // Vérifier la signature du webhook
      if (this.webhookSecret && signature) {
        const verification = verifyFlouciWebhookSignature(
          webhookDto as unknown as Record<string, unknown>,
          signature,
          this.webhookSecret,
        );

        if (!verification.valid) {
          this.logger.warn(`Webhook signature verification failed: ${verification.error}`);
          // En production, on pourrait rejeter les webhooks non signés
        }
      }

      // Extraire l'ID de commande du tracking ID
      const orderId = extractOrderIdFromTrackingId(webhookDto.developer_tracking_id);

      // Récupérer le paiement
      const payment = await this.prisma.payment.findFirst({
        where: { orderId },
        include: { order: true },
      });

      if (!payment) {
        this.logger.warn(`Payment not found for order ${orderId}`);
        return {
          received: true,
          message: 'Webhook reçu mais paiement non trouvé',
        };
      }

      // Mapper le statut
      const newStatus = this.mapFlouciStatus(webhookDto.status);

      // Vérifier si le paiement a déjà été traité
      if (payment.status === 'COMPLETED' && newStatus === 'COMPLETED') {
        this.logger.log(`Payment ${payment.id} already processed`);
        return {
          received: true,
          message: 'Paiement déjà traité',
          orderId: orderId,
          orderStatus: payment.order.status,
        };
      }

      // Mettre à jour le paiement
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: newStatus },
      });

      // Mettre à jour la commande
      if (newStatus === 'COMPLETED') {
        await this.handleSuccessfulPayment(payment);
      } else if (newStatus === 'FAILED') {
        await this.handleFailedPayment(payment, webhookDto);
      }

      // Déclencher le webhook n8n
      await this.triggerN8nWebhook(orderId, newStatus, webhookDto);

      return {
        received: true,
        message: 'Webhook traité avec succès',
        orderId: orderId,
        orderStatus: newStatus === 'COMPLETED' ? 'PAID' : 'PAYMENT_FAILED',
      };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error}`);
      throw new InternalServerErrorException('Erreur lors du traitement du webhook');
    }
  }

  /**
   * Effectuer un paiement de test avec wallet simulé
   */
  async simulateTestPayment(dto: TestWalletPaymentDto): Promise<PaymentInitiationResponseDto> {
    if (!this.sandbox) {
      throw new BadRequestException('Le mode sandbox nest pas activé');
    }

    // Générer un tracking ID
    const trackingId = generateTrackingId(dto.orderId);

    // Créer le paiement dans la base de données
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${dto.orderId} non trouvée`);
    }

    await this.prisma.payment.create({
      data: {
        amount: dto.amount,
        status: 'PENDING',
        currency: 'TND',
        transactionId: `test-${trackingId}`,
        userId: order.userId,
        orderId: dto.orderId,
      },
    });

    // Simuler un paiement réussi ( wallet 111111)
    const isSuccess = dto.testWalletNumber === '111111' || !dto.testWalletNumber;

    // Simuler le délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Traiter le paiement
    if (isSuccess) {
      await this.prisma.payment.update({
        where: { transactionId: `test-${trackingId}` },
        data: { status: 'COMPLETED' },
      });

      await this.handleSuccessfulPayment(await this.prisma.payment.findFirst({
        where: { transactionId: `test-${trackingId}` },
      }));
    } else {
      await this.prisma.payment.update({
        where: { transactionId: `test-${trackingId}` },
        data: { status: 'FAILED' },
      });
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return {
      success: true,
      paymentId: `test-${trackingId}`,
      paymentLink: `https://sandbox.flouci.com/test/${trackingId}`,
      trackingId: trackingId,
      amount: dto.amount,
      currency: 'TND',
      expiresAt: expiresAt.toISOString(),
      message: isSuccess
        ? 'Paiement test réussi (wallet 111111)'
        : 'Paiement test échoué (wallet 000000)',
    };
  }

  /**
   * Obtenir le statut complet d\'un paiement
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException('Paiement non trouvé');
    }

    return {
      paymentId: payment.id,
      trackingId: payment.transactionId || '',
      orderId: payment.orderId,
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      paymentReason: `Commande ${payment.orderId}`,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      paidAt: payment.status === 'COMPLETED' ? payment.updatedAt.toISOString() : undefined,
    };
  }

  /**
   * Annuler un paiement
   */
  async cancelPayment(trackingId: string): Promise<{ message: string }> {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: trackingId },
    });

    if (!payment) {
      throw new NotFoundException('Paiement non trouvé');
    }

    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Seuls les paiements en attente peuvent être annulés');
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    return { message: 'Paiement annulé avec succès' };
  }

  /**
   * Mapper le statut Flouci vers notre enum
   */
  private mapFlouciStatus(flouciStatus: string): 'PENDING' | 'COMPLETED' | 'FAILED' {
    switch (flouciStatus) {
      case 'SUCCESS':
        return 'COMPLETED';
      case 'FAILED':
      case 'EXPIRED':
        return 'FAILED';
      default:
        return 'PENDING';
    }
  }

  /**
   * Obtenir le message selon le statut
   */
  private getStatusMessage(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Paiement effectué avec succès';
      case 'FAILED':
        return 'Le paiement a échoué';
      case 'PENDING':
        return 'Paiement en attente';
      default:
        return 'Statut inconnu';
    }
  }

  /**
   * Gérer un paiement réussi
   */
  private async handleSuccessfulPayment(payment: {
    id: string;
    orderId: string;
    amount: Prisma.Decimal;
    userId: string;
  }): Promise<void> {
    try {
      // Mettre à jour le statut de la commande
      await this.ordersService.update(
        payment.orderId,
        { status: 'PROCESSING' } as any,
        undefined,
      );

      // Logger le succès
      this.logger.log(`Payment ${payment.id} completed for order ${payment.orderId}`);
    } catch (error) {
      this.logger.error(`Error handling successful payment: ${error}`);
    }
  }

  /**
   * Gérer un paiement échoué
   */
  private async handleFailedPayment(
    payment: { id: string; orderId: string; amount: Prisma.Decimal },
    webhookDto: FlouciWebhookData,
  ): Promise<void> {
    this.logger.warn(`Payment ${payment.id} failed: ${webhookDto.status}`);
  }

  /**
   * Déclencher le webhook n8n
   */
  private async triggerN8nWebhook(
    orderId: string,
    status: string,
    webhookDto: FlouciWebhookDto,
  ): Promise<void> {
    if (!this.n8nWebhookUrl) {
      return;
    }

    try {
      await firstValueFrom(
        this.httpService.post(this.n8nWebhookUrl, {
          orderId,
          status,
          amount: millimesToTnd(webhookDto.amount),
          paymentId: webhookDto.payment_id,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      this.logger.error(`Error triggering n8n webhook: ${error}`);
    }
  }
}

