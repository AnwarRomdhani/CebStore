/**
 * Service de gestion des workflows n8n
 * @description Déclenche les workflows n8n pour les notifications automatisées
 */

import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { TriggerWorkflowDto } from './dto/trigger-workflow.dto';

/**
 * Type d'événement pour les workflows
 */
export enum WorkflowEventType {
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  ABANDONED_CART = 'abandoned_cart',
  USER_REGISTERED = 'user_registered',
  REVIEW_SUBMITTED = 'review_submitted',
}

/**
 * Payload pour les webhooks n8n
 */
export interface N8nWebhookPayload {
  event: WorkflowEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Réponse du webhook n8n
 */
export interface N8nWebhookResponse {
  success: boolean;
  message?: string;
  workflowId?: string;
}

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  // URLs des webhooks n8n
  private readonly orderWebhook: string;
  private readonly paymentWebhook: string;
  private readonly stockWebhook: string;
  private readonly userWebhook: string;
  private readonly cartWebhook: string;
  private readonly reviewWebhook: string;

  // Timeout pour les requêtes (30 secondes par défaut)
  private readonly timeout: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.orderWebhook = this.configService.get<string>('N8N_ORDER_WEBHOOK') || '';
    this.paymentWebhook = this.configService.get<string>('N8N_PAYMENT_WEBHOOK') || '';
    this.stockWebhook = this.configService.get<string>('N8N_STOCK_WEBHOOK') || '';
    this.userWebhook = this.configService.get<string>('N8N_USER_WEBHOOK') || '';
    this.cartWebhook = this.configService.get<string>('N8N_CART_WEBHOOK') || '';
    this.reviewWebhook = this.configService.get<string>('N8N_REVIEW_WEBHOOK') || '';
    this.timeout = this.configService.get<number>('N8N_TIMEOUT', 30000);
  }

  /**
   * Déclencher un workflow n8n
   * @param dto - Données du workflow à déclencher
   * @returns Réponse du webhook n8n
   */
  async triggerWorkflow(dto: TriggerWorkflowDto): Promise<N8nWebhookResponse> {
    const { eventType, data, webhookUrl } = dto;

    // Construire le payload
    const payload: N8nWebhookPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    // Utiliser l'URL fournie ou sélectionner le webhook approprié
    const targetUrl = webhookUrl || this.getWebhookUrlForEvent(eventType);

    if (!targetUrl) {
      this.logger.warn(`No webhook URL configured for event: ${eventType}`);
      return {
        success: false,
        message: `Aucun webhook configuré pour l'événement: ${eventType}`,
      };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(targetUrl, payload, {
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.log(`Workflow triggered: ${eventType}`);

      return {
        success: true,
        message: 'Workflow déclenché avec succès',
        workflowId: response.data?.workflowId || response.data?.executionId,
      };
    } catch (error) {
      this.logger.error(`Error triggering workflow ${eventType}: ${error}`);
      return {
        success: false,
        message: `Erreur lors du déclenchement du workflow: ${error.message}`,
      };
    }
  }

  /**
   * Obtenir l'URL du webhook approprié pour un type d'événement
   */
  private getWebhookUrlForEvent(eventType: WorkflowEventType): string {
    switch (eventType) {
      case WorkflowEventType.ORDER_CONFIRMED:
      case WorkflowEventType.ORDER_SHIPPED:
      case WorkflowEventType.ORDER_DELIVERED:
        return this.orderWebhook;
      case WorkflowEventType.PAYMENT_SUCCESS:
      case WorkflowEventType.PAYMENT_FAILED:
        return this.paymentWebhook;
      case WorkflowEventType.LOW_STOCK:
      case WorkflowEventType.OUT_OF_STOCK:
        return this.stockWebhook;
      case WorkflowEventType.USER_REGISTERED:
        return this.userWebhook;
      case WorkflowEventType.ABANDONED_CART:
        return this.cartWebhook;
      case WorkflowEventType.REVIEW_SUBMITTED:
        return this.reviewWebhook;
      default:
        return '';
    }
  }

  // ==================== WORKFLOWS PRÉDÉFINIS ====================

  /**
   * WORKFLOW 1: Confirmation de commande
   * Déclenché lorsqu'une commande est payée avec succès
   * Envoie un email de confirmation au client et une notification admin
   */
  async triggerOrderConfirmation(orderId: string): Promise<N8nWebhookResponse> {
    try {
      // Récupérer les détails de la commande
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          orderItems: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
      });

      if (!order) {
        throw new BadRequestException('Commande non trouvée');
      }

      // Convertir le montant en millimes pour l'affichage
      const totalAmountMillimes = Number(order.totalAmount) * 1000;

      const data = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customer: {
          id: order.user.id,
          email: order.user.email,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
        },
        items: order.orderItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
          imageUrl: item.product.imageUrl,
        })),
        totalAmount: Number(order.totalAmount),
        totalAmountMillimes,
        currency: 'TND',
        shippingAddress: order.shippingAddress,
        paymentMethod: order.payment?.paymentMethod || 'flouci',
        paymentStatus: order.payment?.status || 'COMPLETED',
        estimatedDelivery: this.calculateEstimatedDelivery(),
        createdAt: order.createdAt.toISOString(),
      };

      this.logger.log(`Triggering order confirmation for order: ${orderId}`);

      return this.triggerWorkflow({
        eventType: WorkflowEventType.ORDER_CONFIRMED,
        data,
      });
    } catch (error) {
      this.logger.error(`Error triggering order confirmation: ${error}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * WORKFLOW 2: Alerte stock faible
   * Déclenché automatiquement ou manuellement pour vérifier le stock
   * Envoie une notification à l'admin quand un produit est en rupture
   */
  async triggerLowStockAlert(productId: string): Promise<N8nWebhookResponse> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
        },
      });

      if (!product) {
        throw new BadRequestException('Produit non trouvé');
      }

      // Déterminer le type d'alerte
      const isOutOfStock = product.stock === 0;
      const isLowStock = product.stock > 0 && product.stock <= 5;

      const eventType = isOutOfStock
        ? WorkflowEventType.OUT_OF_STOCK
        : WorkflowEventType.LOW_STOCK;

      const data = {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        currentStock: product.stock,
        category: product.category?.name,
        categoryId: product.categoryId,
        alertType: isOutOfStock ? 'RUPTURE' : 'STOCK_FAIBLE',
        threshold: 5,
        recommendedAction: isOutOfStock
          ? 'Commander d\'urgence ce produit'
          : 'Prévoir une commande soon',
        productUrl: `/admin/products/${product.id}`,
        createdAt: new Date().toISOString(),
      };

      this.logger.log(
        `Triggering ${isOutOfStock ? 'out of stock' : 'low stock'} alert for product: ${product.name}`,
      );

      return this.triggerWorkflow({
        eventType,
        data,
      });
    } catch (error) {
      this.logger.error(`Error triggering low stock alert: ${error}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Vérifier tous les produits pour le stock faible
   * Utilisé par un cron job ou appelé manuellement
   */
  async checkAllProductsStock(): Promise<{
    checked: number;
    lowStock: number;
    outOfStock: number;
    alertsTriggered: number;
  }> {
    const lowStockThreshold = 5;

    // Trouver les produits avec stock faible
    const lowStockProducts = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stock: {
          lte: lowStockThreshold,
          gt: 0,
        },
      },
    });

    const outOfStockProducts = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stock: 0,
      },
    });

    let alertsTriggered = 0;

    // Déclencher les alertes pour chaque produit
    for (const product of [...lowStockProducts, ...outOfStockProducts]) {
      const result = await this.triggerLowStockAlert(product.id);
      if (result.success) {
        alertsTriggered++;
      }
    }

    return {
      checked: await this.prisma.product.count({ where: { isActive: true } }),
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      alertsTriggered,
    };
  }

  /**
   * WORKFLOW 3: Notification panier abandonné
   * Déclenché pour les paniers non convertis après un délai
   */
  async triggerAbandonedCartNotification(cartId: string): Promise<N8nWebhookResponse> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          user: true,
          cartItems: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.checkedOut) {
        return {
          success: false,
          message: 'Panier non trouvé ou déjà validé',
        };
      }

      // Calculer le total du panier
      let totalAmount = 0;
      for (const item of cart.cartItems) {
        totalAmount += Number(item.product.price) * item.quantity;
      }

      // Calculer depuis combien de temps le panier a été abandonné
      const hoursSinceCreation = Math.floor(
        (Date.now() - cart.updatedAt.getTime()) / (1000 * 60 * 60),
      );

      const data = {
        cartId: cart.id,
        customer: {
          id: cart.user.id,
          email: cart.user.email,
          firstName: cart.user.firstName,
          lastName: cart.user.lastName,
        },
        items: cart.cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: Number(item.product.price),
          imageUrl: item.product.imageUrl,
        })),
        totalAmount,
        itemCount: cart.cartItems.length,
        hoursSinceAbandonment: hoursSinceCreation,
        cartUrl: `/cart`,
        recoveryUrl: `/cart/recover?token=${cart.id}`,
        createdAt: cart.createdAt.toISOString(),
        updatedAt: cart.updatedAt.toISOString(),
      };

      this.logger.log(`Triggering abandoned cart notification for cart: ${cartId}`);

      return this.triggerWorkflow({
        eventType: WorkflowEventType.ABANDONED_CART,
        data,
      });
    } catch (error) {
      this.logger.error(`Error triggering abandoned cart notification: ${error}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Trouver et notifier les paniers abandonnés
   * Paniers non convertis depuis plus de 24 heures
   */
  async findAndNotifyAbandonedCarts(): Promise<{
    found: number;
    notified: number;
  }> {
    const abandonedHoursThreshold = 24;

    const abandonedCarts = await this.prisma.cart.findMany({
      where: {
        checkedOut: false,
        updatedAt: {
          lt: new Date(Date.now() - abandonedHoursThreshold * 60 * 60 * 1000),
        },
      },
      include: {
        cartItems: true,
      },
    });

    let notified = 0;

    for (const cart of abandonedCarts) {
      if (cart.cartItems.length > 0) {
        const result = await this.triggerAbandonedCartNotification(cart.id);
        if (result.success) {
          notified++;
        }
      }
    }

    return {
      found: abandonedCarts.length,
      notified,
    };
  }

  /**
   * Déclencher une notification de paiement réussi
   */
  async triggerPaymentSuccess(orderId: string): Promise<N8nWebhookResponse> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          payment: true,
        },
      });

      if (!order) {
        throw new BadRequestException('Commande non trouvée');
      }

      const data = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customer: {
          email: order.user.email,
          firstName: order.user.firstName,
        },
        amount: Number(order.totalAmount),
        amountMillimes: Number(order.totalAmount) * 1000,
        currency: 'TND',
        paymentMethod: order.payment?.paymentMethod || 'flouci',
        transactionId: order.payment?.transactionId,
        status: order.payment?.status || 'COMPLETED',
        paidAt: order.payment?.updatedAt.toISOString() || new Date().toISOString(),
      };

      return this.triggerWorkflow({
        eventType: WorkflowEventType.PAYMENT_SUCCESS,
        data,
      });
    } catch (error) {
      this.logger.error(`Error triggering payment success: ${error}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Calculer la date de livraison estimée (3-5 jours ouvrables)
   */
  private calculateEstimatedDelivery(): string {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 jours par défaut
    return deliveryDate.toISOString();
  }

  /**
   * Vérifier la santé du service n8n
   * Teste la connexion aux webhooks
   */
  async healthCheck(): Promise<{
    status: string;
    webhooks: Record<string, boolean>;
  }> {
    const webhooks = {
      order: !!this.orderWebhook,
      payment: !!this.paymentWebhook,
      stock: !!this.stockWebhook,
      user: !!this.userWebhook,
      cart: !!this.cartWebhook,
      review: !!this.reviewWebhook,
    };

    const configuredWebhooks = Object.values(webhooks).filter(Boolean).length;

    return {
      status: configuredWebhooks > 0 ? 'operational' : 'no_webhooks_configured',
      webhooks,
    };
  }
}

