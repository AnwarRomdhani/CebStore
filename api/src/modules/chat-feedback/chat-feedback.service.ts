import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatFeedbackService {
  constructor(private prisma: PrismaService) {}

  // Soumettre un feedback
  async submitFeedback(
    sessionId: string,
    userId: string | null,
    rating: number,
    comment?: string,
    helpful?: boolean,
  ) {
    return this.prisma.chatFeedback.create({
      data: {
        sessionId,
        userId,
        rating,
        comment,
        helpful: helpful ?? rating >= 4,
      },
    });
  }

  // Obtenir les statistiques de feedback
  async getStats(period: 'day' | 'week' | 'month' = 'week') {
    const startDate = new Date();

    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const [total, averageRating, positive, negative] = await Promise.all([
      this.prisma.chatFeedback.count({
        where: { createdAt: { gte: startDate } },
      }),
      this.prisma.chatFeedback.aggregate({
        where: { createdAt: { gte: startDate } },
        _avg: { rating: true },
      }),
      this.prisma.chatFeedback.count({
        where: {
          createdAt: { gte: startDate },
          helpful: true,
        },
      }),
      this.prisma.chatFeedback.count({
        where: {
          createdAt: { gte: startDate },
          helpful: false,
        },
      }),
    ]);

    return {
      total,
      averageRating: Number(averageRating._avg.rating?.toFixed(2) || 0),
      positive,
      negative,
      satisfactionRate: total > 0 ? Math.round((positive / total) * 100) : 0,
    };
  }

  // Obtenir les feedbacks récents
  async getRecentFeedbacks(limit: number = 20) {
    const feedbacks = await this.prisma.chatFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return feedbacks;
  }

  // Analyser les tendances de satisfaction
  async getSatisfactionTrends() {
    const last7Days: Array<{
      date: string;
      total: number;
      positive: number;
      satisfactionRate: number;
    }> = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [total, positive] = await Promise.all([
        this.prisma.chatFeedback.count({
          where: {
            createdAt: { gte: date, lt: nextDate },
          },
        }),
        this.prisma.chatFeedback.count({
          where: {
            createdAt: { gte: date, lt: nextDate },
            helpful: true,
          },
        }),
      ]);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        total,
        positive,
        satisfactionRate: total > 0 ? Math.round((positive / total) * 100) : 0,
      });
    }

    return last7Days;
  }

  // Obtenir les commentaires négatifs pour amélioration
  async getNegativeFeedbacks(limit: number = 10) {
    return this.prisma.chatFeedback.findMany({
      where: {
        helpful: false,
        comment: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
