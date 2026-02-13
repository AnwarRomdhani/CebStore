/**
 * Service de gestion des avis clients
 * @description Gère la logique métier pour les avis produits
 */

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ReviewResponseDto,
  ProductRatingSummaryDto,
  PaginatedReviewsResponseDto,
} from './dto/review-response.dto';
import {
  ReviewWithUser,
  RatingSummary,
  PurchaseVerification,
} from './interfaces/review.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créer un nouvel avis
   * @description L'utilisateur doit avoir acheté le produit pour laisser un avis
   * @param userId ID de l'utilisateur
   * @param createReviewDto Données de l'avis
   * @returns L'avis créé
   */
  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const { productId, rating, comment } = createReviewDto;

    // Vérifier que le produit existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // Vérifier que l'utilisateur a acheté le produit
    const purchaseVerification = await this.verifyPurchase(userId, productId);
    if (!purchaseVerification.hasPurchased) {
      throw new ForbiddenException(
        'Vous devez avoir acheté ce produit pour laisser un avis',
      );
    }

    // Vérifier que l'utilisateur n'a pas déjà laissé un avis pour ce produit
    const existingReview = await this.prisma.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Vous avez déjà laissé un avis pour ce produit',
      );
    }

    // Créer l'avis
    const review = await this.prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.formatReview(review);
  }

  /**
   * Récupérer tous les avis d'un produit avec pagination
   * @param productId ID du produit
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page
   * @returns Liste paginée des avis avec résumé des notes
   */
  async findByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedReviewsResponseDto> {
    // Vérifier que le produit existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    const where: Prisma.ReviewWhereInput = { productId };

    // Récupérer le nombre total d'avis
    const total = await this.prisma.review.count({ where });

    // Récupérer les avis paginés
    const reviews = await this.prisma.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Récupérer le résumé des notes
    const ratingSummary = await this.getProductRatingSummary(productId);

    return {
      data: reviews.map((review) => this.formatReview(review)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      ratingSummary,
    };
  }

  /**
   * Récupérer un avis par son ID
   * @param id ID de l'avis
   * @returns L'avis trouvé
   */
  async findOne(id: string): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    return this.formatReview(review);
  }

  /**
   * Mettre à jour son propre avis
   * @param id ID de l'avis
   * @param userId ID de l'utilisateur
   * @param updateReviewDto Données de mise à jour
   * @returns L'avis mis à jour
   */
  async update(
    id: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    // Vérifier que l'utilisateur est le propriétaire de l'avis
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres avis',
      );
    }

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return this.formatReview(updatedReview);
  }

  /**
   * Supprimer son propre avis
   * @param id ID de l'avis
   * @param userId ID de l'utilisateur
   * @returns Message de confirmation
   */
  async remove(id: string, userId: string): Promise<{ message: string }> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    // Vérifier que l'utilisateur est le propriétaire de l'avis
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres avis',
      );
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return { message: 'Avis supprimé avec succès' };
  }

  /**
   * Récupérer le résumé des notes d'un produit
   * @param productId ID du produit
   * @returns Résumé des notes (moyenne, total, distribution)
   */
  async getProductRatingSummary(
    productId: string,
  ): Promise<ProductRatingSummaryDto> {
    // Récupérer tous les avis du produit
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;

    // Calculer la moyenne
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // Calculer la distribution des notes
    const ratingDistribution: RatingSummary['ratingDistribution'] = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    return {
      productId,
      averageRating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
      totalReviews,
      ratingDistribution,
    };
  }

  /**
   * Vérifier si un utilisateur a acheté un produit
   * @param userId ID de l'utilisateur
   * @param productId ID du produit
   * @returns Informations sur l'achat
   */
  async verifyPurchase(
    userId: string,
    productId: string,
  ): Promise<PurchaseVerification> {
    // Rechercher une commande livrée contenant le produit
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
      include: {
        order: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    if (orderItem) {
      return {
        hasPurchased: true,
        orderId: orderItem.order.id,
        orderDate: orderItem.order.createdAt,
      };
    }

    return { hasPurchased: false };
  }

  /**
   * Récupérer les avis de l'utilisateur connecté
   * @param userId ID de l'utilisateur
   * @param page Numéro de page
   * @param limit Nombre d'éléments par page
   * @returns Liste paginée des avis de l'utilisateur
   */
  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedReviewsResponseDto> {
    const where: Prisma.ReviewWhereInput = { userId };

    const total = await this.prisma.review.count({ where });

    const reviews = await this.prisma.review.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      data: reviews.map((review) => this.formatReview(review)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Analyser le sentiment d'un commentaire (simple analyse basée sur des mots-clés)
   * @param comment Commentaire à analyser
   * @returns Score de sentiment (-1 à 1)
   */
  analyzeSentiment(comment: string): number {
    if (!comment) return 0;

    const positiveWords = [
      'excellent',
      'superbe',
      'parfait',
      'génial',
      'fantastique',
      'merveilleux',
      'recommend',
      'satisfait',
      'content',
      'heureux',
      'qualité',
      'rapide',
      'efficace',
    ];

    const negativeWords = [
      'déçu',
      'mauvais',
      'nul',
      'horrible',
      'terrible',
      'défectueux',
      'cassé',
      'problème',
      'retard',
      'cher',
      'décevant',
      'arnaque',
    ];

    const lowerComment = comment.toLowerCase();
    let score = 0;

    positiveWords.forEach((word) => {
      if (lowerComment.includes(word)) score += 1;
    });

    negativeWords.forEach((word) => {
      if (lowerComment.includes(word)) score -= 1;
    });

    // Normaliser le score entre -1 et 1
    const maxScore = Math.max(positiveWords.length, negativeWords.length);
    return Math.max(-1, Math.min(1, score / (maxScore / 2)));
  }

  /**
   * Formater un avis pour la réponse
   * @param review Avis avec relations
   * @returns Avis formaté
   */
  private formatReview(
    review: ReviewWithUser & {
      product?: {
        id: string;
        name: string;
        imageUrl?: string | null;
      };
    },
  ): ReviewResponseDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment || undefined,
      productId: review.productId,
      userId: review.userId,
      userFirstName: review.user.firstName,
      userLastName: review.user.lastName,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
