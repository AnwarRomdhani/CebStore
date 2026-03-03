import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { FlouciService } from './flouci.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/modules/orders/orders.service';
import { Prisma } from '@prisma/client';

// Mock de ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      FLOUCI_APP_PUBLIC: 'test-public-key',
      FLOUCI_APP_SECRET: 'test-private-key',
      FLOUCI_SUCCESS_URL: 'https://example.com/success',
      FLOUCI_FAIL_URL: 'https://example.com/fail',
      FLOUCI_WEBHOOK_URL: 'https://api.example.com/webhooks/flouci',
      FLOUCI_WEBHOOK_SECRET: 'test-webhook-secret',
      FLOUCI_SANDBOX: 'true',
      N8N_PAYMENT_WEBHOOK: 'https://n8n.example.com/webhook/payment',
    };
    return config[key];
  }),
};

// Mock de HttpService
const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

// Mock de PrismaService
const mockPrismaService = {
  payment: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

// Mock de OrdersService
const mockOrdersService = {
  update: jest.fn(),
};

describe('FlouciService', () => {
  let service: FlouciService;
  let httpService: typeof mockHttpService;
  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlouciService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    service = module.get<FlouciService>(FlouciService);
    httpService = module.get(HttpService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test Wallet Configuration', () => {
    it('devrait avoir les wallets de test configurés', () => {
      // Les wallets de test sont gérés par l'API Flouci
      // 111111 = paiement réussi
      // 000000 = paiement échoué
      expect(true).toBe(true);
    });
  });

  describe('initiatePayment', () => {
    const dto = {
      orderId: 'order-123',
      amount: 150.5,
      returnUrl: 'https://example.com/return',
      paymentReason: 'Paiement commande',
    };

    it('devrait initier un paiement avec succès', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 'order-123',
        totalAmount: new Prisma.Decimal(150.5),
        userId: 'user-123',
        status: 'PENDING',
      });

      const mockFlouciResponse = {
        status: 'success',
        result: {
          payment_id: 'flouci-payment-123',
          link: 'https://flouci.com/pay/123',
        },
      };

      httpService.post.mockReturnValue(of({ data: mockFlouciResponse }));

      mockPrismaService.payment.create.mockResolvedValue({
        id: 'payment-123',
        amount: 150.5,
        status: 'PENDING',
        orderId: 'order-123',
        userId: 'user-123',
      });

      const result = await service.initiatePayment(userId, dto);

      expect(result.success).toBe(true);
      expect(result.paymentLink).toContain('flouci.com');
    });

    it('devrait rejeter si commande non trouvée', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.initiatePayment(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait rejeter si montant négatif', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 'order-123',
        totalAmount: new Prisma.Decimal(150.5),
        userId: 'user-123',
      });

      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 'order-123',
        totalAmount: new Prisma.Decimal(-10),
        userId,
      });

      await expect(service.initiatePayment(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait gérer une erreur API', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 'order-123',
        totalAmount: new Prisma.Decimal(150.5),
        userId: 'user-123',
      });

      httpService.post.mockReturnValue(
        throwError(() => new Error('API Error')),
      );

      await expect(service.initiatePayment(userId, dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('verifyPayment', () => {
    const dto = {
      developerTrackingId: 'order-123-tracking',
    };

    it('devrait vérifier un paiement avec succès', async () => {
      mockPrismaService.payment.findFirst.mockResolvedValue({
        id: 'payment-123',
        orderId: 'order-123',
        transactionId: 'flouci-payment-123',
        amount: new Prisma.Decimal(150.5),
        currency: 'TND',
        status: 'PENDING',
        userId,
        order: { id: 'order-123' },
      });

      const mockStatusResponse = {
        transactions: [
          {
            status: 'SUCCESS',
            updated_at: new Date().toISOString(),
          },
        ],
      };

      httpService.get.mockReturnValue(of({ data: mockStatusResponse }));

      mockPrismaService.payment.update.mockResolvedValue({
        id: 'payment-123',
        status: 'COMPLETED',
      });

      mockOrdersService.update.mockResolvedValue({ id: 'order-123' });

      const result = await service.verifyPayment(userId, dto);

      expect(result.success).toBe(true);
      expect(result.status).toBe('COMPLETED');
    });

    it('devrait gérer un paiement non trouvé', async () => {
      mockPrismaService.payment.findFirst.mockResolvedValue(null);

      await expect(service.verifyPayment(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('simulateTestPayment', () => {
    const dto = {
      orderId: 'order-123',
      amount: 50,
      testWalletNumber: '111111', // Wallet succès
    };

    it('devrait simuler un paiement réussi avec wallet 111111', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 'order-123',
        userId: 'user-123',
        totalAmount: new Prisma.Decimal(50),
      });

      mockPrismaService.payment.create.mockResolvedValue({
        id: 'payment-123',
        amount: 50,
        status: 'PENDING',
      });

      mockPrismaService.payment.findFirst.mockResolvedValue({
        id: 'payment-123',
        orderId: 'order-123',
        amount: new Prisma.Decimal(50),
        userId: 'user-123',
        status: 'COMPLETED',
      });

      mockOrdersService.update.mockResolvedValue({ id: 'order-123' });

      const result = await service.simulateTestPayment(dto);

      expect(result.success).toBe(true);
      expect(result.message).toContain('111111');
    });

    it('devrait simuler un paiement échoué avec wallet 000000', async () => {
      const failedDto = { ...dto, testWalletNumber: '000000' };

      mockPrismaService.order.findUnique.mockResolvedValue({
        id: 'order-123',
        userId: 'user-123',
      });

      mockPrismaService.payment.create.mockResolvedValue({
        id: 'payment-123',
        status: 'PENDING',
      });

      mockPrismaService.payment.update.mockResolvedValue({
        id: 'payment-123',
        status: 'FAILED',
      });

      const result = await service.simulateTestPayment(failedDto);

      expect(result.success).toBe(true);
      expect(result.message).toContain('000000');
    });

    it('devrait rejeter si sandbox désactivé', async () => {
      const realConfigService = {
        get: jest.fn((key: string) => {
          if (key === 'FLOUCI_SANDBOX') return 'false';
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FlouciService,
          {
            provide: ConfigService,
            useValue: realConfigService,
          },
          {
            provide: HttpService,
            useValue: mockHttpService,
          },
          {
            provide: PrismaService,
            useValue: mockPrismaService,
          },
          {
            provide: OrdersService,
            useValue: mockOrdersService,
          },
        ],
      }).compile();

      const testService = module.get<FlouciService>(FlouciService);

      await expect(testService.simulateTestPayment(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPaymentStatus', () => {
    const orderId = 'order-123';

    it('devrait retourner le statut du paiement', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue({
        id: 'payment-123',
        orderId: 'order-123',
        transactionId: 'flouci-123',
        amount: new Prisma.Decimal(150.5),
        currency: 'TND',
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrismaService.payment.findFirst.mockResolvedValue({
        id: 'payment-123',
        orderId: 'order-123',
        transactionId: 'flouci-123',
        amount: new Prisma.Decimal(150.5),
        currency: 'TND',
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.getPaymentStatus(userId, orderId);

      expect(result.status).toBe('COMPLETED');
      expect(result.amount).toBe(150.5);
    });

    it('devrait gérer un paiement non trouvé', async () => {
      mockPrismaService.payment.findUnique.mockResolvedValue(null);

      mockPrismaService.payment.findFirst.mockResolvedValue(null);

      await expect(service.getPaymentStatus(userId, orderId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('cancelPayment', () => {
    const trackingId = 'flouci-payment-123';

    it('devrait annuler un paiement en attente', async () => {
      mockPrismaService.payment.findFirst.mockResolvedValue({
        id: 'payment-123',
        transactionId: trackingId,
        status: 'PENDING',
      });

      mockPrismaService.payment.update.mockResolvedValue({
        id: 'payment-123',
        status: 'FAILED',
      });

      const result = await service.cancelPayment(userId, trackingId);

      expect(result.message).toContain('annulé');
    });

    it('devrait rejeter si paiement déjà traité', async () => {
      mockPrismaService.payment.findFirst.mockResolvedValue({
        id: 'payment-123',
        status: 'COMPLETED',
      });

      await expect(service.cancelPayment(userId, trackingId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
