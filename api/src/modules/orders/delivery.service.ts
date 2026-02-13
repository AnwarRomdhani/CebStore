/**
 * Service pour la gestion de la livraison et des statistiques
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  DeliveryStatus,
  UpdateDeliveryStatusDto,
  DeliveryTrackingResponseDto,
  TrackingHistoryDto,
} from './dto/delivery-status.dto';
import {
  SalesStatsDto,
  DailyRevenueDto,
  TopProductDto,
  TopCategoryDto,
  RealTimeStatsDto,
  PeriodStatsDto,
  StatsQueryDto,
} from './dto/order-stats.dto';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly n8nWebhookUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.n8nWebhookUrl = this.configService.get<string>('N8N_ORDER_WEBHOOK') || '';
  }

  /**
   * Mettre à jour le statut de livraison
   */
  async updateDeliveryStatus(dto: UpdateDeliveryStatusDto): Promise<DeliveryTrackingResponseDto> {
    try {
      // Vérifier que la commande existe
      const order = await this.prisma.order.findUnique({
        where: { id: dto.orderId },
        include: {
          user: true,
          orderItems: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Commande ${dto.orderId} non trouvée`);
      }

      // Créer l'entrée d'historique de suivi
      await this.prisma.$executeRaw`
        INSERT INTO delivery_tracking (id, order_id, status, tracking_number, carrier, tracking_url, notes, estimated_delivery_date, created_at)
        VALUES (
          ${crypto.randomUUID()}::uuid,
          ${dto.orderId}::uuid,
          ${dto.status}::text,
          ${dto.trackingNumber || null}::text,
          ${dto.carrier || null}::text,
          ${dto.trackingUrl || null}::text,
          ${dto.notes || null}::text,
          ${dto.estimatedDeliveryDate ? new Date(dto.estimatedDeliveryDate) : null}::timestamp,
          NOW()
        )
      `;

      // Déterminer le statut de la commande
      let orderStatus = order.status;
      if (dto.status === DeliveryStatus.DELIVERED) {
        orderStatus = OrderStatus.DELIVERED;
      } else if (dto.status === DeliveryStatus.SHIPPED || dto.status === DeliveryStatus.IN_TRANSIT) {
        orderStatus = OrderStatus.SHIPPED;
      }

      // Mettre à jour la commande
      await this.prisma.order.update({
        where: { id: dto.orderId },
        data: {
          status: orderStatus,
        },
      });

      // Déclencher la notification n8n
      await this.triggerDeliveryNotification(dto);

      // Récupérer et retourner le suivi
      return this.getDeliveryTracking(dto.orderId);
    } catch (error) {
      this.logger.error(`Error updating delivery status: ${error}`);
      throw error;
    }
  }

  /**
   * Obtenir le suivi de livraison d\'une commande
   */
  async getDeliveryTracking(orderId: string): Promise<DeliveryTrackingResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${orderId} non trouvée`);
    }

    // Récupérer l'historique de suivi
    const trackingHistory = await this.prisma.$queryRaw<
      Array<{
        id: string;
        status: string;
        description: string;
        location: string | null;
        timestamp: Date;
        notes: string | null;
      }>
    >`
      SELECT id, status, description, location, timestamp, notes
      FROM delivery_tracking
      WHERE order_id = ${orderId}::uuid
      ORDER BY timestamp DESC
    `;

    // Récupérer les infos de livraison
    const latestTracking = await this.prisma.$queryRaw<
      Array<{
        tracking_number: string | null;
        carrier: string | null;
        tracking_url: string | null;
        shipped_at: Date | null;
        estimated_delivery_date: Date | null;
        delivered_at: Date | null;
      }>
    >`
      SELECT tracking_number, carrier, tracking_url, shipped_at, estimated_delivery_date, delivered_at
      FROM delivery_tracking
      WHERE order_id = ${orderId}::uuid
      ORDER BY timestamp DESC
      LIMIT 1
    `;

    const latest = latestTracking[0];

    // Parser l'adresse de livraison
    const shippingAddress = this.parseShippingAddress(order.shippingAddress || '');

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      currentStatus: this.mapOrderStatusToDeliveryStatus(order.status),
      trackingNumber: latest?.tracking_number || undefined,
      carrier: latest?.carrier || undefined,
      trackingUrl: latest?.tracking_url || undefined,
      shippedAt: latest?.shipped_at?.toISOString() || undefined,
      estimatedDeliveryDate: latest?.estimated_delivery_date?.toISOString() || undefined,
      deliveredAt: latest?.delivered_at?.toISOString() || undefined,
      trackingHistory: trackingHistory.map((t) => ({
        id: t.id,
        status: t.status as DeliveryStatus,
        description: t.description,
        location: t.location || undefined,
        timestamp: t.timestamp,
        notes: t.notes || undefined,
      })),
      shippingAddress,
    };
  }

  /**
   * Obtenir les statistiques de ventes
   */
  async getSalesStats(query: StatsQueryDto): Promise<SalesStatsDto> {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    endDate.setHours(23, 59, 59, 999);

    // Récupérer les commandes de la période
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: ['DELIVERED', 'PROCESSING', 'SHIPPED'],
        },
      },
      include: {
        orderItems: {
          include: { 
            product: {
              include: { category: true }
            }
          },
        },
      },
    });

    // Calculer les métriques
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );
    const totalProductsSold = orders.reduce(
      (sum, order) => sum + order.orderItems.reduce((s, item) => s + item.quantity, 0),
      0,
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculer les revenus par jour
    const dailyMap = new Map<string, { orders: number; revenue: number; products: number }>();
    for (const order of orders) {
      const date = order.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { orders: 0, revenue: 0, products: 0 };
      dailyMap.set(date, {
        orders: existing.orders + 1,
        revenue: existing.revenue + Number(order.totalAmount),
        products:
          existing.products +
          order.orderItems.reduce((s, item) => s + item.quantity, 0),
      });
    }

    const dailyRevenue: DailyRevenueDto[] = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue,
        productsSold: data.products,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Produits les plus vendus
    const productSales = new Map<
      string,
      { name: string; quantity: number; revenue: number; imageUrl?: string }
    >();
    for (const order of orders) {
      for (const item of order.orderItems) {
        const existing = productSales.get(item.productId) || {
          name: item.product.name,
          quantity: 0,
          revenue: 0,
          imageUrl: item.product.imageUrl || undefined,
        };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.price) * item.quantity;
        productSales.set(item.productId, existing);
      }
    }

    const topProducts: TopProductDto[] = Array.from(productSales.entries())
      .map(([id, data]) => ({
        productId: id,
        productName: data.name,
        quantitySold: data.quantity,
        revenue: data.revenue,
        imageUrl: data.imageUrl,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Catégories les plus vendues
    const categorySales = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const order of orders) {
      for (const item of order.orderItems) {
        const existing = categorySales.get(item.product.categoryId) || {
          name: item.product.category?.name || 'Unknown Category',
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += Number(item.price) * item.quantity;
        categorySales.set(item.product.categoryId, existing);
      }
    }

    const topCategories: TopCategoryDto[] = Array.from(categorySales.entries())
      .map(([id, data]) => ({
        categoryId: id,
        categoryName: data.name,
        quantitySold: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      period: `${query.startDate} - ${query.endDate}`,
      totalOrders,
      totalRevenue,
      totalProductsSold,
      averageOrderValue,
      conversionRate: 3.5, // À calculer avec les vues
      dailyRevenue,
      topProducts,
      topCategories,
    };
  }

  /**
   * Obtenir les statistiques en temps réel
   */
  async getRealTimeStats(): Promise<RealTimeStatsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: today },
      },
    });

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    );

    const [
      pendingOrders,
      inDeliveryOrders,
      deliveredToday,
    ] = await Promise.all([
      this.prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),
      this.prisma.order.count({
        where: { status: OrderStatus.SHIPPED },
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.DELIVERED,
          updatedAt: { gte: today },
        },
      }),
    ]);

    return {
      ordersToday: todayOrders.length,
      revenueToday: todayRevenue,
      pendingOrders,
      inDeliveryOrders,
      deliveredToday,
      averageCartToday: todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0,
      conversionRateToday: 4.2, // À calculer
    };
  }

  /**
   * Déclencher la notification de livraison via n8n
   */
  private async triggerDeliveryNotification(dto: UpdateDeliveryStatusDto): Promise<void> {
    if (!this.n8nWebhookUrl) {
      return;
    }

    try {
      await firstValueFrom(
        this.httpService.post(this.n8nWebhookUrl, {
          event: 'delivery_update',
          orderId: dto.orderId,
          status: dto.status,
          trackingNumber: dto.trackingNumber,
          carrier: dto.carrier,
          estimatedDeliveryDate: dto.estimatedDeliveryDate,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      this.logger.error(`Error triggering n8n notification: ${error}`);
    }
  }

  /**
   * Mapper le statut de commande vers le statut de livraison
   */
  private mapOrderStatusToDeliveryStatus(status: OrderStatus): DeliveryStatus {
    switch (status) {
      case OrderStatus.PENDING:
        return DeliveryStatus.PREPARING;
      case OrderStatus.PROCESSING:
        return DeliveryStatus.PREPARING;
      case OrderStatus.SHIPPED:
        return DeliveryStatus.IN_TRANSIT;
      case OrderStatus.DELIVERED:
        return DeliveryStatus.DELIVERED;
      case OrderStatus.CANCELLED:
        return DeliveryStatus.DELIVERY_FAILED;
      default:
        return DeliveryStatus.PREPARING;
    }
  }

  /**
   * Parser l\'adresse de livraison
   */
  private parseShippingAddress(address: string): {
    street: string;
    city: string;
    postalCode: string;
    governorate: string;
  } {
    const parts = address.split(',').map((p) => p.trim());
    return {
      street: parts[0] || '',
      city: parts[1] || '',
      postalCode: parts[2] || '',
      governorate: parts[3] || '',
    };
  }
}

