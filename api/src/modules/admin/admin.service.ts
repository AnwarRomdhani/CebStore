/**
 * Service d'administration centralisée
 * @description Fournit les fonctionnalités de gestion pour le tableau de bord admin
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtenir le dashboard complet
   */
  async getDashboard() {
    // Résumé des KPIs
    const [
      todayRevenue,
      todayOrders,
      pendingOrders,
      newCustomersThisMonth,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      // CA du jour
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: this.getStartOfDay(),
          },
          status: { not: 'CANCELLED' },
        },
        _sum: { totalAmount: true },
      }),

      // Commandes du jour
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: this.getStartOfDay(),
          },
        },
      }),

      // Commandes en attente
      this.prisma.order.count({
        where: { status: 'PENDING' },
      }),

      // Nouveaux clients ce mois
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: this.getStartOfMonth(),
          },
        },
      }),

      // Produits en stock faible (< 10)
      this.prisma.product.count({
        where: {
          stock: { lt: 10, gt: 0 },
          isActive: true,
        },
      }),

      // Produits en rupture
      this.prisma.product.count({
        where: {
          stock: 0,
          isActive: true,
        },
      }),
    ]);

    // Dernières commandes
    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Ventes des 7 derniers jours
    const last7Days = await this.getLast7DaysSales();

    // Top catégories
    const topCategories = await this.getTopCategories();

    return {
      summary: {
        todayRevenue: Number(todayRevenue._sum.totalAmount) || 0,
        todayOrders,
        pendingOrders,
        newCustomersThisMonth,
        lowStockProducts,
        outOfStockProducts,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
        customerEmail: order.user.email,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        createdAt: order.createdAt,
      })),
      last7DaysSales: last7Days,
      topCategories,
    };
  }

  /**
   * Statistiques des utilisateurs
   */
  async getUserStats() {
    const [total, newToday, newThisWeek, newThisMonth] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: { createdAt: { gte: this.getStartOfDay() } },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: this.getStartOfWeek() } },
      }),
      this.prisma.user.count({
        where: { createdAt: { gte: this.getStartOfMonth() } },
      }),
    ]);

    const byRole = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    });

    const roleStats = {} as Record<Role, number>;
    (Object.values(Role) as Role[]).forEach((role) => {
      const found = byRole.find((r) => r.role === role);
      roleStats[role] = found?._count.id || 0;
    });

    return {
      totalUsers: total,
      newToday,
      newThisWeek,
      newThisMonth,
      byRole: roleStats,
    };
  }

  /**
   * Liste des utilisateurs avec pagination et filtres
   */
  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
  }) {
    const { page, limit, search, role } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && role !== 'ALL') {
      where.role = role as Role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              totalAmount: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const data = users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      ordersCount: user.orders.length,
      totalSpent: user.orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      ),
      createdAt: user.createdAt,
      lastLoginAt: undefined, // À implémenter avec login history
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Bannir un utilisateur
   */
  async banUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.role === 'ADMIN') {
      throw new BadRequestException('Impossible de bannir un administrateur');
    }

    // Soft delete : désactiver le compte
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        // On pourrait ajouter un champ isActive ou deletedAt
        // Pour l'instant, on supprime le refreshToken pour empêcher la connexion
        refreshToken: null,
      },
    });
  }

  /**
   * Statistiques des produits
   */
  async getProductStats() {
    const [total, active, inactive, products] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { isActive: false } }),
      this.prisma.product.findMany({
        select: {
          price: true,
          stock: true,
        },
      }),
    ]);

    const totalStockValue = products.reduce(
      (sum, product) => sum + Number(product.price) * product.stock,
      0,
    );

    return {
      totalProducts: total,
      activeProducts: active,
      inactiveProducts: inactive,
      totalStockValue: Math.round(totalStockValue * 100) / 100,
    };
  }

  /**
   * Liste des produits avec pagination et filtres
   */
  async getProducts(params: {
    page: number;
    limit: number;
    search?: string;
    categoryId?: string;
    isActive?: string;
  }) {
    const { page, limit, search, categoryId, isActive } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { name: true },
          },
          orderItems: {
            select: { id: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const data = products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: Number(product.price),
      stock: product.stock,
      isActive: product.isActive,
      categoryName: product.category.name,
      salesCount: product.orderItems.length,
      createdAt: product.createdAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Alertes de stock
   */
  async getStockAlerts(threshold: number = 10) {
    const [lowStock, outOfStock] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          stock: { lt: threshold, gt: 0 },
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
        },
      }),
      this.prisma.product.findMany({
        where: {
          stock: 0,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
        },
      }),
    ]);

    const alerts = [
      ...outOfStock.map((product) => ({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        currentStock: product.stock,
        alertThreshold: threshold,
        status: 'OUT_OF_STOCK' as const,
      })),
      ...lowStock.map((product) => ({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        currentStock: product.stock,
        alertThreshold: threshold,
        status: 'LOW_STOCK' as const,
      })),
    ];

    return {
      alerts,
      total: alerts.length,
    };
  }

  /**
   * Statistiques des commandes
   */
  async getOrderStats() {
    const [total, pending, processing, shipped, delivered, cancelled] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.count({ where: { status: 'PENDING' } }),
        this.prisma.order.count({ where: { status: 'PROCESSING' } }),
        this.prisma.order.count({ where: { status: 'SHIPPED' } }),
        this.prisma.order.count({ where: { status: 'DELIVERED' } }),
        this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      ]);

    const cancellationRate =
      total > 0 ? (cancelled / total) * 100 : 0;

    return {
      totalOrders: total,
      pendingOrders: pending,
      processingOrders: processing,
      shippedOrders: shipped,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
    };
  }

  /**
   * Liste des commandes avec pagination et filtres
   */
  async getOrders(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }) {
    const { page, limit, search, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status as OrderStatus;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          orderItems: {
            select: { id: true },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const data = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
      customerEmail: order.user.email,
      itemsCount: order.orderItems.length,
      totalAmount: Number(order.totalAmount),
      status: order.status,
      createdAt: order.createdAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Helper : Début du jour
   */
  private getStartOfDay(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  /**
   * Helper : Début de la semaine
   */
  private getStartOfWeek(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    now.setDate(diff);
    now.setHours(0, 0, 0, 0);
    return now;
  }

  /**
   * Helper : Début du mois
   */
  private getStartOfMonth(): Date {
    const now = new Date();
    now.setDate(1);
    now.setHours(0, 0, 0, 0);
    return now;
  }

  /**
   * Helper : Ventes des 7 derniers jours
   */
  private async getLast7DaysSales() {
    const today = new Date();
    const last7Days: Array<{ date: string; revenue: number; orders: number }> = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [revenueResult, ordersResult] = await Promise.all([
        this.prisma.order.aggregate({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
            status: { not: 'CANCELLED' },
          },
          _sum: { totalAmount: true },
        }),
        this.prisma.order.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
      ]);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: Number(revenueResult._sum.totalAmount) || 0,
        orders: ordersResult,
      });
    }

    return last7Days;
  }

  /**
   * Helper : Top catégories
   */
  private async getTopCategories() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            orderItems: {
              select: {
                price: true,
                quantity: true,
                order: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const categoryRevenue = categories
      .map((cat) => {
        let revenue = 0;
        cat.products.forEach((product) => {
          product.orderItems.forEach((item) => {
            if (item.order.status !== 'CANCELLED') {
              revenue += Number(item.price) * item.quantity;
            }
          });
        });
        return { name: cat.name, revenue };
      })
      .filter((c) => c.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return categoryRevenue;
  }
}
