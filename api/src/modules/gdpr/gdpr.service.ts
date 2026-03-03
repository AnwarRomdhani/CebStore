import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GdprService {
  constructor(private prisma: PrismaService) {}

  // Exporter toutes les données personnelles d'un utilisateur
  async exportPersonalData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: true,
        carts: true,
        payments: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Supprimer les données sensibles
    const {
      password: _password,
      refreshToken: _refreshToken,
      ...safeUser
    } = user;

    return {
      data: {
        id: safeUser.id,
        email: safeUser.email,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        role: safeUser.role,
        createdAt: safeUser.createdAt,
        ordersCount: safeUser.orders.length,
        reviewsCount: safeUser.reviews.length,
      },
      rawData: safeUser,
      exportedAt: new Date(),
      format: 'JSON',
    };
  }

  // Supprimer un compte utilisateur (droit à l'oubli)
  async deleteAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier les commandes en cours
    const pendingOrders = await this.prisma.order.count({
      where: {
        userId,
        status: {
          in: ['PENDING', 'PROCESSING', 'SHIPPED'],
        },
      },
    });

    if (pendingOrders > 0) {
      throw new BadRequestException(
        `Impossible de supprimer le compte : ${pendingOrders} commande(s) en cours`,
      );
    }

    // Anonymiser les données plutôt que supprimer (pour l'historique des commandes)
    await this.prisma.$transaction([
      // Anonymiser l'utilisateur
      this.prisma.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${userId}@deleted.com`,
          firstName: null,
          lastName: null,
          password: '',
          refreshToken: null,
        },
      }),

      // Supprimer les paniers
      this.prisma.cart.deleteMany({
        where: { userId },
      }),

      // Anonymiser les avis (garder mais anonymiser)
      this.prisma.review.updateMany({
        where: { userId },
        data: {
          comment: '[Avis anonymisé - compte supprimé]',
        },
      }),

      // Supprimer les paiements (données sensibles)
      this.prisma.payment.deleteMany({
        where: { userId },
      }),
    ]);

    return {
      message: 'Compte supprimé avec succès. Vos données ont été anonymisées.',
      deletedAt: new Date(),
      retractationPeriodDays: 30,
    };
  }

  // Modifier les données personnelles
  async updatePersonalData(
    userId: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier que le nouvel email n'est pas déjà utilisé
    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé par un autre compte');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // Obtenir le résumé des données stockées
  async getDataSummary(userId: string) {
    const [user, ordersCount, reviewsCount, cartsCount, paymentsCount] =
      await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
          },
        }),
        this.prisma.order.count({ where: { userId } }),
        this.prisma.review.count({ where: { userId } }),
        this.prisma.cart.count({ where: { userId } }),
        this.prisma.payment.count({ where: { userId } }),
      ]);

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      user,
      statistics: {
        orders: ordersCount,
        reviews: reviewsCount,
        carts: cartsCount,
        payments: paymentsCount,
      },
      retentionPeriod: {
        orders: '10 ans (obligation légale)',
        reviews: 'Durée de vie du compte',
        analytics: '3 ans',
      },
    };
  }
}
