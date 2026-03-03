import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchHistoryService {
  constructor(private prisma: PrismaService) {}

  // Enregistrer une recherche
  async logSearch(
    userId: string | null,
    query: string,
    resultsCount: number,
    clickedProductId?: string,
  ) {
    return this.prisma.searchHistory.create({
      data: {
        userId,
        query: query.toLowerCase().trim(),
        resultsCount,
        clickedProductId,
      },
    });
  }

  // Obtenir l'historique d'un utilisateur
  async getUserHistory(userId: string, limit: number = 20) {
    return this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // Obtenir les recherches populaires
  async getPopularSearches(
    limit: number = 10,
    period: 'day' | 'week' | 'month' = 'week',
  ) {
    const startDate = new Date();

    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      where: {
        createdAt: { gte: startDate },
      },
      _count: {
        id: true,
      },
      _sum: {
        resultsCount: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    });

    return searches.map((s) => ({
      query: s.query,
      count: s._count.id,
      avgResults: s._sum.resultsCount
        ? Math.round(s._sum.resultsCount / s._count.id)
        : 0,
    }));
  }

  // Obtenir les tendances de recherche
  async getSearchTrends(userId?: string) {
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    // Recherches les plus fréquentes
    const topSearches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    // Taux de clic (recherches avec clic / total recherches)
    const totalSearches = await this.prisma.searchHistory.count({ where });
    const searchesWithClicks = await this.prisma.searchHistory.count({
      where: {
        ...where,
        clickedProductId: { not: null },
      },
    });

    return {
      topSearches: topSearches.map((s) => s.query),
      totalSearches,
      searchesWithClicks,
      clickThroughRate:
        totalSearches > 0
          ? Math.round((searchesWithClicks / totalSearches) * 100)
          : 0,
    };
  }

  // Nettoyer l'historique ancien (> 90 jours)
  async cleanupOldHistory(days: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await this.prisma.searchHistory.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });

    return { deleted: result.count };
  }
}
