/**
 * Tests unitaires pour ReviewsService
 * @description Tests pour la validation dachats et la gestion des avis
 */

import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

// Mock de PrismaService
const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
  },
  review: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orderItem: {
    findFirst: jest.fn(),
  },
};

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get(PrismaService);

    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-123';
    const createReviewDto: CreateReviewDto = {
      productId: 'product-123',
      rating: 5,
      comment: 'Excellent produit !',
    };

    it('devrait créer un avis avec achat vérifié', async () => {
      // Mock: produit trouvé
      prisma.product.findUnique.mockResolvedValue({
        id: 'product-123',
        name: 'Test Product',
      });

      // Mock: achat vérifié (commande livrée)
      prisma.orderItem.findFirst.mockResolvedValue({
        order: {
          id: 'order-123',
          createdAt: new Date(),
        },
      });

      // Mock: pas davis existant
      prisma.review.findUnique.mockResolvedValue(null);

      // Mock: création de lavis
      prisma.review.create.mockResolvedValue({
        id: 'review-123',
        rating: 5,
        comment: 'Excellent produit !',
        productId: 'product-123',
        userId: 'user-123',
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(userId, createReviewDto);

      expect(result).toBeDefined();
      expect(result.rating).toBe(5);
      expect(prisma.review.create).toHaveBeenCalled();
    });

    it('devrait rejeter si le produit nexiste pas', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, createReviewDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait rejeter si utilisateur na pas acheté le produit', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'product-123',
        name: 'Test Product',
      });

      prisma.orderItem.findFirst.mockResolvedValue(null);

      await expect(service.create(userId, createReviewDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('devrait rejeter si avis déjà existant', async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 'product-123',
        name: 'Test Product',
      });

      prisma.orderItem.findFirst.mockResolvedValue({
        order: { id: 'order-123' },
      });

      prisma.review.findUnique.mockResolvedValue({
        id: 'existing-review',
      });

      await expect(service.create(userId, createReviewDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByProduct', () => {
    const productId = 'product-123';

    it('devrait récupérer les avis dun produit', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: productId });
      prisma.review.findMany.mockResolvedValue([
        {
          id: 'review-1',
          rating: 5,
          comment: 'Super !',
          productId,
          userId: 'user-1',
          user: { firstName: 'John', lastName: 'Doe' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      prisma.review.count.mockResolvedValue(1);
      prisma.review.findMany.mockResolvedValueOnce([]);

      // Simuler le résumé des notes
      jest.spyOn(service, 'getProductRatingSummary').mockResolvedValue({
        productId,
        averageRating: 5,
        totalReviews: 1,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1 },
      });

      const result = await service.findByProduct(productId, 1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('devrait rejeter si produit nexiste pas', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findByProduct(productId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const reviewId = 'review-123';
    const userId = 'user-123';
    const updateReviewDto: UpdateReviewDto = {
      rating: 4,
      comment: 'Mise à jour du commentaire',
    };

    it('devrait mettre à jour son propre avis', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: reviewId,
        userId: 'user-123',
      });

      prisma.review.update.mockResolvedValue({
        id: reviewId,
        rating: 4,
        comment: 'Mise à jour du commentaire',
        productId: 'product-123',
        userId: 'user-123',
        user: { firstName: 'John', lastName: 'Doe' },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.update(reviewId, userId, updateReviewDto);

      expect(result.rating).toBe(4);
      expect(prisma.review.update).toHaveBeenCalled();
    });

    it('devrait rejeter si utilisateur nest pas propriétaire', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: reviewId,
        userId: 'autre-user',
      });

      await expect(
        service.update(reviewId, userId, updateReviewDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    const reviewId = 'review-123';
    const userId = 'user-123';

    it('devrait supprimer son propre avis', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: reviewId,
        userId: 'user-123',
      });

      prisma.review.delete.mockResolvedValue({ id: reviewId });

      const result = await service.remove(reviewId, userId);

      expect(result.message).toBe('Avis supprimé avec succès');
      expect(prisma.review.delete).toHaveBeenCalledWith({
        where: { id: reviewId },
      });
    });

    it('devrait rejeter si utilisateur nest pas propriétaire', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: reviewId,
        userId: 'autre-user',
      });

      await expect(service.remove(reviewId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('verifyPurchase', () => {
    const userId = 'user-123';
    const productId = 'product-123';

    it('devrait confirmer un achat', async () => {
      prisma.orderItem.findFirst.mockResolvedValue({
        order: {
          id: 'order-123',
          createdAt: new Date('2024-01-01'),
        },
      });

      const result = await service.verifyPurchase(userId, productId);

      expect(result.hasPurchased).toBe(true);
      expect(result.orderId).toBe('order-123');
    });

    it('devrait confirmer aucun achat', async () => {
      prisma.orderItem.findFirst.mockResolvedValue(null);

      const result = await service.verifyPurchase(userId, productId);

      expect(result.hasPurchased).toBe(false);
    });
  });

  describe('analyzeSentiment', () => {
    it('devrait analyser un sentiment positif', () => {
      const comment = 'Excellent produit, je recommande !';
      const score = service.analyzeSentiment(comment);

      expect(score).toBeGreaterThan(0);
    });

    it('devrait analyser un sentiment négatif', () => {
      const comment = 'Déçu, produit défectueux et retard de livraison';
      const score = service.analyzeSentiment(comment);

      expect(score).toBeLessThan(0);
    });

    it('devrait retourner 0 pour un commentaire vide', () => {
      const score = service.analyzeSentiment('');

      expect(score).toBe(0);
    });
  });
});
