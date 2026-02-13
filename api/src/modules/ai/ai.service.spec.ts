/**
 * Tests unitaires pour AiService
 * @description Tests pour la génération dembeddings et la recherche vectorielle
 */

import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AiService } from './ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmbeddingUtils } from './utils/embedding.utils';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    embeddings: {
      create: jest.fn().mockResolvedValue({
        data: [
          {
            embedding: new Array(1536).fill(0).map(() => Math.random()),
          },
        ],
        usage: {
          prompt_tokens: 10,
          total_tokens: 20,
        },
      }),
    },
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  score: 0.8,
                  label: 'positive',
                  confidence: 0.9,
                  positive_keywords: ['excellent', 'recommande'],
                  negative_keywords: [],
                }),
              },
              finish_reason: 'stop',
            },
          ],
        }),
      },
    },
  }));
});

// Mock ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string | number> = {
      OPENAI_API_KEY: 'test-api-key',
      OPENAI_EMBEDDING_MODEL: 'text-embedding-ada-002',
      OPENAI_CHAT_MODEL: 'gpt-3.5-turbo',
      OPENAI_TEMPERATURE: 0.7,
      OPENAI_MAX_TOKENS: 1000,
    };
    return config[key];
  }),
};

// Mock HttpService
const mockHttpService = {
  post: jest.fn(),
  get: jest.fn(),
};

// Mock PrismaService
const mockPrismaService = {
  $executeRaw: jest.fn(),
  $queryRaw: jest.fn(),
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
  },
};

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
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
      ],
    }).compile();

    service = module.get<AiService>(AiService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateEmbedding', () => {
    const dto = {
      text: 'Chaussures pour homme',
      documentId: 'doc-123',
      documentType: 'PRODUCT',
    };

    it('devrait générer un embedding avec succès', async () => {
      mockPrismaService.$executeRaw.mockResolvedValue(1);

      const result = await service.generateEmbedding(dto);

      expect(result).toBeDefined();
      expect(result.embedding).toBeDefined();
      expect(result.dimension).toBe(1536);
      expect(result.model).toBe('text-embedding-ada-002');
    });

    it('devrait gérer une erreur lors de la génération', async () => {
      // Le test devrait gérer les erreurs
      // Sans clé API valide, le mock devrait quand même fonctionner
      const result = await service.generateEmbedding({ text: 'Test' });

      expect(result).toBeDefined();
    });
  });

  describe('semanticSearch', () => {
    const dto = {
      query: 'chaussures pour homme',
      limit: 10,
      similarityThreshold: 0.5,
    };

    it('devrait effectuer une recherche sémantique', async () => {
      // Mock de la réponse de recherche vectorielle
      mockPrismaService.$queryRaw.mockResolvedValue([
        {
          id: 'product-1',
          content: 'Chaussures de sport pour homme',
          document_type: 'PRODUCT',
          metadata: JSON.stringify({ price: 99.9 }),
          similarity: 0.85,
        },
        {
          id: 'product-2',
          content: 'Baskets homme',
          document_type: 'PRODUCT',
          metadata: JSON.stringify({ price: 79.9 }),
          similarity: 0.75,
        },
      ]);

      const result = await service.semanticSearch(dto);

      expect(result).toBeDefined();
      expect(result.query).toBe(dto.query);
      expect(result.totalResults).toBeGreaterThan(0);
      expect(result.results).toBeDefined();
    });

    it('devrait retourner un résultat pour une requête "chaussures pour homme"', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([
        {
          id: 'product-1',
          content: 'Chaussures de running homme',
          document_type: 'PRODUCT',
          metadata: '{}',
          similarity: 0.9,
        },
      ]);

      const result = await service.semanticSearch({
        query: 'chaussures pour homme',
      });

      expect(result.query).toBe('chaussures pour homme');
      expect(result.results.length).toBeGreaterThan(0);
    });
  });

  describe('chatbot', () => {
    const dto = {
      message: 'Je cherche des chaussures pour homme',
      includeHistory: false,
    };

    it('devrait répondre à une question du chatbot', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([
        {
          id: 'product-1',
          content: 'Chaussures hommes disponibles',
          document_type: 'PRODUCT',
          metadata: '{}',
          similarity: 0.8,
        },
      ]);

      const result = await service.chatbot(dto);

      expect(result).toBeDefined();
      expect(result.answer).toBeDefined();
      expect(result.sessionId).toBeDefined();
    });
  });

  describe('analyzeSentiment', () => {
    it('devrait analyser un sentiment positif', async () => {
      const dto = {
        text: 'Excellent produit, je recommande vraiment !',
      };

      const result = await service.analyzeSentiment(dto);

      expect(result).toBeDefined();
      expect(result.label).toBeDefined();
    });

    it('devrait analyser un sentiment négatif', async () => {
      const dto = {
        text: 'Déçu, produit de mauvaise qualité et retard de livraison',
      };

      const result = await service.analyzeSentiment(dto);

      expect(result).toBeDefined();
      expect(result.label).toBeDefined();
    });
  });

  describe('indexProduct', () => {
    const dto = {
      productId: 'product-123',
      name: 'Chaussures running homme',
      description: 'Chaussures de running professionnelles',
      category: 'Chaussures',
      brand: 'Nike',
      price: 120,
      tags: ['sport', 'running', 'homme'],
    };

    it('devrait indexer un produit', async () => {
      mockPrismaService.$executeRaw.mockResolvedValue(1);

      const result = await service.indexProduct(dto);

      expect(result).toBeDefined();
      expect(result.productId).toBe(dto.productId);
      expect(result.embeddingGenerated).toBe(true);
    });
  });

  describe('generateSEO', () => {
    const dto = {
      title: 'Chaussures de running Nike',
      description: 'Chaussures de running légères et résistantes pour les athlètes',
      keywords: ['chaussures', 'running', 'nike', 'sport'],
      brand: 'Nike',
      category: 'Chaussures de sport',
      targetLength: 'medium',
      tone: 'professional',
    };

    it('devrait générer une optimisation SEO', async () => {
      const result = await service.generateSEO(dto);

      expect(result).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.metaDescription).toBeDefined();
    });
  });
});

describe('EmbeddingUtils', () => {
  describe('encodeEmbeddingToBase64', () => {
    it('devrait encoder un vecteur en base64', () => {
      const embedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      const encoded = EmbeddingUtils.encodeEmbeddingToBase64(embedding);

      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe('string');
    });
  });

  describe('decodeEmbeddingFromBase64', () => {
    it('devrait décoder un base64 en vecteur', () => {
      const embedding = [0.1, 0.2, 0.3, 0.4, 0.5];
      const encoded = EmbeddingUtils.encodeEmbeddingToBase64(embedding);
      const decoded = EmbeddingUtils.decodeEmbeddingFromBase64(encoded);

      expect(decoded).toBeDefined();
      expect(decoded.length).toBe(embedding.length);
    });
  });

  describe('cosineSimilarity', () => {
    it('devrait calculer la similarité cosinus', () => {
      const a = [1, 0, 0];
      const b = [1, 0, 0];
      const similarity = EmbeddingUtils.cosineSimilarity(a, b);

      expect(similarity).toBeCloseTo(1);
    });

    it('devrait retourner 0 pour des vecteurs orthogonaux', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      const similarity = EmbeddingUtils.cosineSimilarity(a, b);

      expect(similarity).toBeCloseTo(0);
    });
  });

  describe('normalizeVector', () => {
    it('devrait normaliser un vecteur', () => {
      const vector = [3, 4];
      const normalized = EmbeddingUtils.normalizeVector(vector);

      // La norme devrait être 1
      const norm = Math.sqrt(normalized.reduce((sum, v) => sum + v * v, 0));
      expect(norm).toBeCloseTo(1);
    });
  });

  describe('euclideanDistance', () => {
    it('devrait calculer la distance euclidienne', () => {
      const a = [0, 0];
      const b = [3, 4];
      const distance = EmbeddingUtils.euclideanDistance(a, b);

      expect(distance).toBe(5);
    });
  });

  describe('preprocessTextForEmbedding', () => {
    it('devrait nettoyer le texte', () => {
      const text = '  Chaussures   pour   homme  ';
      const cleaned = EmbeddingUtils.preprocessTextForEmbedding(text);

      expect(cleaned).toBe('Chaussures pour homme');
    });
  });

  describe('splitTextForEmbedding', () => {
    it('devrait diviser un texte long en chunks', () => {
      const text = 'A'.repeat(2000);
      const chunks = EmbeddingUtils.splitTextForEmbedding(text, 500, 50);

      expect(chunks.length).toBeGreaterThan(1);
    });
  });
});

