import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OverviewQueryDto,
  SalesTrendQueryDto,
  PaginationDto,
} from './dto/analytics-query.dto';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Obtenir une vue d'ensemble des KPIs
  async getOverview(query: OverviewQueryDto) {
    const { period = 'month' } = query;

    // Calculer les dates de début et fin de période
    const { startDate, endDate } = this.getDateRange(period);

    // Période précédente pour comparaison
    const { startDate: prevStartDate, endDate: prevEndDate } =
      this.getDateRange(period, true);

    // Récupérer les données de la période actuelle
    const [
      currentRevenue,
      currentOrders,
      currentCustomers,
      currentProductsSold,
    ] = await Promise.all([
      // Chiffre d'affaires
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: { totalAmount: true },
      }),

      // Nombre de commandes
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Nouveaux clients
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),

      // Produits vendus
      this.prisma.orderItem.aggregate({
        where: {
          order: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
            status: {
              not: 'CANCELLED',
            },
          },
        },
        _sum: { quantity: true },
      }),
    ]);

    // Données de la période précédente
    const [prevRevenue, prevOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: prevStartDate,
            lte: prevEndDate,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: prevStartDate,
            lte: prevEndDate,
          },
        },
      }),
    ]);

    const totalRevenue = Number(currentRevenue._sum.totalAmount) || 0;
    const totalOrders = currentOrders;
    const totalCustomers = await this.prisma.user.count();
    const newCustomers = currentCustomers;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProductsSold = Number(currentProductsSold._sum.quantity) || 0;

    // Calculer les taux de croissance
    const revenueGrowth = prevRevenue._sum.totalAmount
      ? ((totalRevenue - Number(prevRevenue._sum.totalAmount)) /
          Number(prevRevenue._sum.totalAmount)) *
        100
      : 0;

    const ordersGrowth = prevOrders
      ? ((totalOrders - prevOrders) / prevOrders) * 100
      : 0;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      newCustomers,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      totalProductsSold,
      period,
      startDate,
      endDate,
      growth: {
        revenue: Math.round(revenueGrowth * 100) / 100,
        orders: Math.round(ordersGrowth * 100) / 100,
      },
    };
  }

  // Obtenir la tendance des ventes
  async getSalesTrend(query: SalesTrendQueryDto) {
    const { groupBy = 'day', startDate: startStr, endDate: endStr } = query;

    let startDate: Date;
    let endDate: Date;

    if (startStr && endStr) {
      startDate = new Date(startStr);
      endDate = new Date(endStr);
    } else {
      // Par défaut : 30 derniers jours
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    // Valider la plage de dates
    if (endDate < startDate) {
      throw new BadRequestException(
        'La date de fin doit être après la date de début',
      );
    }

    // Générer les périodes
    const periods = this.generatePeriods(startDate, endDate, groupBy);

    const data = await Promise.all(
      periods.map(async (period) => {
        const { start, end, label } = period;

        const [revenueResult, ordersResult, customersResult] =
          await Promise.all([
            this.prisma.order.aggregate({
              where: {
                createdAt: {
                  gte: start,
                  lte: end,
                },
                status: {
                  not: 'CANCELLED',
                },
              },
              _sum: { totalAmount: true },
            }),
            this.prisma.order.count({
              where: {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
            }),
            this.prisma.order.groupBy({
              by: ['userId'],
              where: {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
            }),
          ]);

        const revenue = Number(revenueResult._sum.totalAmount) || 0;
        const orders = ordersResult;
        const customers = customersResult.length;
        const avgOrderValue = orders > 0 ? revenue / orders : 0;

        return {
          period: label,
          revenue: Math.round(revenue * 100) / 100,
          orders,
          customers,
          avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        };
      }),
    );

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

    return {
      data,
      startDate,
      endDate,
      groupBy,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
    };
  }

  // Obtenir les produits les plus vendus
  async getBestSellers(query: PaginationDto) {
    const { limit = 10 } = query;

    const bestSellers = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const data = await Promise.all(
      bestSellers.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            category: true,
          },
        });

        const quantitySold = item._sum.quantity || 0;
        const revenue = (Number(item._sum.price) || 0) * quantitySold;

        return {
          productId: item.productId,
          productName: product?.name || 'Produit inconnu',
          price: product?.price ? Number(product.price) : 0,
          quantitySold,
          revenue: Math.round(revenue * 100) / 100,
          imageUrl: product?.imageUrl,
          categoryName: product?.category?.name,
        };
      }),
    );

    return {
      data,
      total: data.length,
    };
  }

  // Obtenir la répartition des commandes par statut
  async getOrdersByStatus() {
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const total = ordersByStatus.reduce((sum, item) => sum + item._count.id, 0);

    const data = ordersByStatus.map((item) => ({
      status: item.status,
      count: item._count.id,
      percentage:
        total > 0 ? Math.round((item._count.id / total) * 10000) / 100 : 0,
    }));

    return {
      data,
      total,
    };
  }

  // Obtenir les meilleurs clients
  async getTopCustomers(query: PaginationDto) {
    const { limit = 10 } = query;

    const topCustomers = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        orders: {
          select: {
            totalAmount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    const data = topCustomers.map((user) => {
      const ordersCount = user.orders.length;
      const totalSpent = user.orders.reduce(
        (sum, order) => sum + Number(order.totalAmount),
        0,
      );
      const lastOrderDate = user.orders[0]?.createdAt || null;

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        ordersCount,
        totalSpent: Math.round(totalSpent * 100) / 100,
        lastOrderDate,
      };
    });

    return {
      data,
      total: data.length,
    };
  }

  // Obtenir le chiffre d'affaires par catégorie
  async getRevenueByCategory() {
    const categories = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          select: {
            id: true,
            orderItems: {
              select: {
                quantity: true,
                price: true,
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

    const data = categories
      .map((category) => {
        let revenue = 0;
        let salesCount = 0;

        category.products.forEach((product) => {
          product.orderItems.forEach((item) => {
            if (item.order.status !== 'CANCELLED') {
              revenue += Number(item.price) * item.quantity;
              salesCount += item.quantity;
            }
          });
        });

        return {
          categoryId: category.id,
          categoryName: category.name,
          revenue: Math.round(revenue * 100) / 100,
          salesCount,
          percentage: 0, // Sera calculé après
        };
      })
      .filter((item) => item.revenue > 0);

    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

    // Calculer les pourcentages
    const dataWithPercentage = data.map((item) => ({
      ...item,
      percentage:
        totalRevenue > 0
          ? Math.round((item.revenue / totalRevenue) * 10000) / 100
          : 0,
    }));

    // Trier par revenu décroissant
    dataWithPercentage.sort((a, b) => b.revenue - a.revenue);

    return {
      data: dataWithPercentage,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    };
  }

  // Helper : Obtenir la plage de dates pour une période
  private getDateRange(
    period: string,
    previous: boolean = false,
  ): { startDate: Date; endDate: Date } {
    const now = new Date();
    const startDate = new Date();
    let endDate = now;

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - (previous ? 2 : 1));
        startDate.setHours(0, 0, 0, 0);
        if (previous) {
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          endDate = now;
        }
        break;

      case 'week': {
        const currentDay = now.getDay();
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

        if (previous) {
          startDate.setDate(now.getDate() - diffToMonday - 7);
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate.setDate(now.getDate() - diffToMonday);
          startDate.setHours(0, 0, 0, 0);
        }
        break;
      }

      case 'month':
        if (previous) {
          startDate.setMonth(now.getMonth() - 2);
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            0,
            23,
            59,
            59,
            999,
          );
        } else {
          startDate.setMonth(now.getMonth());
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
        }
        break;

      case 'year':
        if (previous) {
          startDate.setFullYear(now.getFullYear() - 2);
          startDate.setMonth(0, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        } else {
          startDate.setFullYear(now.getFullYear());
          startDate.setMonth(0, 1);
          startDate.setHours(0, 0, 0, 0);
        }
        break;

      default:
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    return { startDate, endDate };
  }

  // Helper : Générer les périodes pour la tendance
  private generatePeriods(
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'week' | 'month',
  ) {
    const periods: { start: Date; end: Date; label: string }[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const periodStart = new Date(current);
      let periodEnd: Date;

      switch (groupBy) {
        case 'day':
          periodEnd = new Date(current);
          periodEnd.setHours(23, 59, 59, 999);
          periods.push({
            start: periodStart,
            end: periodEnd,
            label: periodStart.toISOString().split('T')[0],
          });
          current.setDate(current.getDate() + 1);
          current.setHours(0, 0, 0, 0);
          break;

        case 'week':
          periodEnd = new Date(current);
          periodEnd.setDate(periodEnd.getDate() + 6);
          periodEnd.setHours(23, 59, 59, 999);
          if (periodEnd > endDate) {
            periodEnd = endDate;
          }
          periods.push({
            start: periodStart,
            end: periodEnd,
            label: `Semaine ${this.getWeekNumber(periodStart)}`,
          });
          current.setDate(current.getDate() + 7);
          break;

        case 'month':
          periodEnd = new Date(
            current.getFullYear(),
            current.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          );
          if (periodEnd > endDate) {
            periodEnd = endDate;
          }
          periods.push({
            start: periodStart,
            end: periodEnd,
            label: `${current.getMonth() + 1}/${current.getFullYear()}`,
          });
          current.setMonth(current.getMonth() + 1);
          current.setDate(1);
          break;
      }
    }

    return periods;
  }

  // Helper : Obtenir le numéro de la semaine
  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }
}
