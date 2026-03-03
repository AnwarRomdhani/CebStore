import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import OpenAI from 'openai';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as EmbeddingUtils from './utils/embedding.utils';
import {
  GenerateEmbeddingDto,
  SemanticSearchDto,
  ChatbotQueryDto,
  RecommendationConfigDto,
  SentimentAnalysisDto,
  SEOGenerationDto,
  AddKnowledgeDocumentDto,
  IndexProductDto,
  CreateChatSessionDto,
} from './dto/ai-query.dto';
import {
  EmbeddingResponseDto,
  SemanticSearchResponseDto,
  ChatbotResponseDto,
  ProductRecommendationResponseDto,
  SentimentAnalysisResponseDto,
  SEOGenerationResponseDto,
  KnowledgeDocumentResponseDto,
  KnowledgeBaseStatsResponseDto,
  SearchResultDto,
} from './dto/rag-response.dto';
import {
  ChatSession,
  ProductRecommendation,
  KnowledgeDocumentType,
  ChatMessage,
  DocumentType,
} from './interfaces/ai.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;
  private readonly embeddingModel: string;
  private readonly chatModel: string;
  private readonly temperature: number;
  private readonly maxTokens: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.warn(
        'OpenAI API key not configured. AI features will not work.',
      );
    }

    this.openai = new OpenAI({ apiKey });

    this.embeddingModel = this.configService.get<string>(
      'OPENAI_EMBEDDING_MODEL',
      'text-embedding-ada-002',
    );
    this.chatModel = this.configService.get<string>(
      'OPENAI_CHAT_MODEL',
      'gpt-3.5-turbo',
    );
    this.temperature = this.configService.get<number>(
      'OPENAI_TEMPERATURE',
      0.7,
    );
    this.maxTokens = this.configService.get<number>('OPENAI_MAX_TOKENS', 1000);
  }

  // Générer un embedding pour un texte
  async generateEmbedding(
    dto: GenerateEmbeddingDto,
  ): Promise<EmbeddingResponseDto> {
    const startTime = Date.now();

    try {
      // Prétraiter le texte
      const cleanedText = EmbeddingUtils.preprocessTextForEmbedding(dto.text);

      // Appeler l'API OpenAI
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: cleanedText,
      });

      const embedding = response.data[0].embedding;

      // Encoder en base64 pour stockage
      const encodedEmbedding =
        EmbeddingUtils.encodeEmbeddingToBase64(embedding);

      // Sauvegarder le document si un ID est fourni
      if (dto.documentId) {
        await this.saveEmbeddingToDatabase(
          dto.documentId,
          this.convertDocumentType(dto.documentType || DocumentType.GENERAL),
          cleanedText,
          embedding,
        );
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(`Embedding generated in ${processingTime}ms`);

      return {
        documentId: dto.documentId,
        embedding: encodedEmbedding,
        dimension: embedding.length,
        model: this.embeddingModel,
        usage: {
          promptTokens: response.usage.prompt_tokens,
          totalTokens: response.usage.total_tokens,
        },
      };
    } catch (error) {
      this.logger.error(`Error generating embedding: ${error}`);
      throw new InternalServerErrorException('Failed to generate embedding');
    }
  }

  // Sauvegarder un embedding dans la base de données
  private convertDocumentType(docType: DocumentType): KnowledgeDocumentType {
    switch (docType) {
      case DocumentType.PRODUCT:
        return KnowledgeDocumentType.PRODUCT;
      case DocumentType.CATEGORY:
        return KnowledgeDocumentType.CATEGORY;
      case DocumentType.FAQ:
        return KnowledgeDocumentType.FAQ;
      case DocumentType.POLICY:
        return KnowledgeDocumentType.POLICY;
      case DocumentType.REVIEW:
        return KnowledgeDocumentType.REVIEW;
      case DocumentType.GENERAL:
      default:
        return KnowledgeDocumentType.GENERAL;
    }
  }

  private async saveEmbeddingToDatabase(
    documentId: string,
    documentType: KnowledgeDocumentType,
    content: string,
    embedding: number[],
  ): Promise<void> {
    try {
      const sqlVector = EmbeddingUtils.PgVectorUtils.toSqlVector(embedding);

      await this.prisma.$executeRaw`
        INSERT INTO ai_knowledge_base (id, content, document_type, embedding, created_at, updated_at)
        VALUES (
          ${documentId}::uuid,
          ${content},
          ${documentType.toString()}::text,
          ${sqlVector}::vector,
          NOW(),
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          content = EXCLUDED.content,
          document_type = EXCLUDED.document_type,
          embedding = EXCLUDED.embedding,
          updated_at = NOW()
      `;
    } catch (error) {
      this.logger.error(`Error saving embedding to database: ${error}`);
      // Ne pas throw l'erreur car l'embedding a déjà été généré
    }
  }

  // Effectuer une recherche sémantique
  async semanticSearch(
    dto: SemanticSearchDto,
  ): Promise<SemanticSearchResponseDto> {
    const startTime = Date.now();

    try {
      // Générer l'embedding de la requête
      const embeddingResponse = await this.generateEmbedding({
        text: dto.query,
      });

      const queryEmbedding = EmbeddingUtils.decodeEmbeddingFromBase64(
        embeddingResponse.embedding,
      );

      const sqlVector =
        EmbeddingUtils.PgVectorUtils.toSqlVector(queryEmbedding);
      const limit = dto.limit ?? 10;
      const threshold = dto.similarityThreshold ?? 0;

      const conditions: Prisma.Sql[] = [Prisma.sql`embedding IS NOT NULL`];
      if (dto.documentTypes && dto.documentTypes.length > 0) {
        conditions.push(
          Prisma.sql`document_type = ANY(${dto.documentTypes}::text[])`,
        );
      }

      const results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          content: string;
          document_type: string;
          metadata: unknown;
          similarity: number;
        }>
      >(
        Prisma.sql`
          SELECT
            id,
            content,
            document_type,
            metadata,
            1 - (embedding <=> ${sqlVector}::vector) as similarity
          FROM ai_knowledge_base
          WHERE ${Prisma.join(conditions, ' AND ')}
            AND 1 - (embedding <=> ${sqlVector}::vector) > ${threshold}
          ORDER BY embedding <=> ${sqlVector}::vector
          LIMIT ${limit}
        `,
      );

      const searchResults: SearchResultDto[] = results.map((row, index) => ({
        id: row.id,
        score: Number(row.similarity),
        documentType: row.document_type,
        content: row.content,
        rank: index + 1,
      }));

      const processingTime = Date.now() - startTime;
      this.logger.log(`Semantic search completed in ${processingTime}ms`);

      return {
        query: dto.query,
        totalResults: searchResults.length,
        searchTimeMs: processingTime,
        results: searchResults,
        model: this.embeddingModel,
      };
    } catch (error) {
      this.logger.error(`Error in semantic search: ${error}`);
      throw new InternalServerErrorException(
        'Failed to perform semantic search',
      );
    }
  }

  // Chatbot conversationnel
  async chatbot(dto: ChatbotQueryDto): Promise<ChatbotResponseDto> {
    const startTime = Date.now();

    try {
      // Récupérer ou créer la session de chat
      let session: ChatSession;
      if (dto.sessionId) {
        session = await this.getChatSession(dto.sessionId);
      } else {
        session = await this.createChatSession({
          metadata: {},
        });
      }

      // Ajouter le message de l'utilisateur
      const userMessage: ChatMessage = {
        role: 'user',
        content: dto.message,
        timestamp: new Date(),
      };
      session.messages.push(userMessage);

      // Récupérer les documents pertinents
      const searchResults = await this.semanticSearch({
        query: dto.message,
        limit: 5,
        similarityThreshold: 0.5,
      });

      // Construire le contexte
      const context = searchResults.results.map((r) => r.content).join('\n\n');

      // Construire le prompt système
      const systemPrompt = `Tu es un assistant commercial expert pour un site e-commerce.
Ta mission est d'aider les clients à trouver les produits qu'ils recherchent.

CONNAISSANCE DU PRODUIT:
${context}

RÈGLES:
1. Réponds de manière helpful et professionnelle
2. Si tu recommandes des produits, cite leurs noms et prix
3. Si tu ne connais pas la réponse, dis-le honnêtement
4. Reste dans ton rôle d'assistant commercial
5. Réponds en français
6. Ne révèle pas que tu utilises de l'IA ou des embeddings`;

      // Préparer les messages pour l'API
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
      ];

      // Ajouter l'historique récent si demandé
      if (dto.includeHistory) {
        const recentMessages = session.messages.slice(-10);
        for (const msg of recentMessages) {
          messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          });
        }
      }

      // Appeler l'API de chat
      const completion = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages,
        temperature: dto.temperature || this.temperature,
        max_tokens: this.maxTokens,
      });

      const assistantResponse = completion.choices[0]?.message?.content || '';

      // Ajouter la réponse de l'assistant
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date(),
      };
      session.messages.push(assistantMessage);

      // Sauvegarder la session mise à jour
      await this.saveChatSession(session);

      const processingTime = Date.now() - startTime;

      return {
        sessionId: session.id,
        answer: assistantResponse,
        sources: searchResults.results.map((r) => r.id),
        processingTimeMs: processingTime,
        model: this.chatModel,
        confidenceScore:
          completion.choices[0]?.finish_reason === 'stop' ? 0.9 : 0.7,
        recommendedProducts: this.extractProductRecommendations(
          searchResults.results,
        ).map((r) => ({
          productId: r.productId,
          name: r.productName,
          price: r.price,
          imageUrl: r.imageUrl,
          matchReason: r.reason,
        })),
      };
    } catch (error) {
      this.logger.error(`Error in chatbot: ${error}`);
      throw new InternalServerErrorException(
        'Failed to process chatbot request',
      );
    }
  }

  //Créer une session de chat
  createChatSession(dto: CreateChatSessionDto): Promise<ChatSession> {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      messages: [],
      metadata: dto.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Sauvegarder en base de données (à implémenter selon le schéma)
    return Promise.resolve(session);
  }

  // Récupérer une session de chat
  getChatSession(sessionId: string): Promise<ChatSession> {
    // Récupérer depuis la base de données
    // Pour l'instant, retourner une session vide
    return Promise.resolve({
      id: sessionId,
      messages: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Sauvegarder une session de chat
  saveChatSession(session: ChatSession): Promise<void> {
    session.updatedAt = new Date();
    // Sauvegarder en base de données
    return Promise.resolve();
  }

  // Générer des recommandations de produits (amélioré avec historique et sentiments)
  async getProductRecommendations(
    dto: RecommendationConfigDto,
  ): Promise<ProductRecommendationResponseDto> {
    try {
      if (!dto.userId) {
        throw new BadRequestException('userId is required');
      }

      // 1. Récupérer l'historique d'achat de l'utilisateur
      const userPurchases = await this.prisma.order.findMany({
        where: {
          userId: dto.userId,
          status: 'DELIVERED',
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      // 2. Récupérer l'historique des recherches
      const searchHistory = await this.prisma.searchHistory.findMany({
        where: { userId: dto.userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      // 3. Récupérer les avis de l'utilisateur (pour sentiments)
      const userReviews = await this.prisma.review.findMany({
        where: { userId: dto.userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      // Extraire les catégories et produits achetés
      const purchasedProductIds: string[] = [];
      const categoryIds: string[] = [];
      const preferredCategories: Record<string, number> = {};

      for (const order of userPurchases) {
        for (const item of order.orderItems) {
          purchasedProductIds.push(item.productId);
          if (item.product.categoryId) {
            categoryIds.push(item.product.categoryId);
            preferredCategories[item.product.categoryId] =
              (preferredCategories[item.product.categoryId] || 0) + 1;
          }
        }
      }

      // Analyser les sentiments des avis
      let sentimentScore = 0;
      const sentimentKeywords: string[] = [];

      for (const review of userReviews) {
        if (review.comment) {
          const sentiment = await this.analyzeSentiment({
            text: review.comment,
          });
          sentimentScore += sentiment.score;
          if (sentiment.positiveKeywords) {
            sentimentKeywords.push(...sentiment.positiveKeywords);
          }
        }
      }

      const avgSentiment =
        userReviews.length > 0 ? sentimentScore / userReviews.length : 0;

      // Extraire les termes de recherche fréquents
      const searchTerms = searchHistory
        .map((s) => s.query)
        .filter((q, i, arr) => arr.indexOf(q) === i) // Unique
        .slice(0, 5);

      // 4. Construire les requêtes de recommandation
      const queries = [
        ...searchTerms, // Basé sur les recherches
        ...Object.keys(preferredCategories).map(
          (catId) => `catégorie:${catId}`,
        ), // Basé sur les catégories
        'produits populaires', // Découverte
      ];

      const allRecommendations: any[] = [];

      for (const query of queries) {
        const searchResults = await this.semanticSearch({
          query,
          limit: Math.ceil((dto.limit || 5) / queries.length),
          documentTypes: [DocumentType.PRODUCT],
        });

        for (const result of searchResults.results) {
          if (
            !purchasedProductIds.includes(result.id) &&
            !allRecommendations.find((r) => r.productId === result.id)
          ) {
            allRecommendations.push({
              productId: result.id,
              productName: result.documentType || 'Produit',
              description: result.content,
              price: Number(result.metadata?.['price']) || 0,
              imageUrl:
                (result.metadata?.['imageUrl'] as string) ||
                (result.metadata?.['image_url'] as string) ||
                undefined,
              score: result.score,
              reason: this.getRecommendationReason(query, avgSentiment),
              query,
            });
          }
        }
      }

      // Trier par score et prendre le top
      const recommendations = allRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, dto.limit || 10);

      return {
        userId: dto.userId,
        recommendationType: 'personalized',
        products: recommendations.map((rec) => ({
          productId: rec.productId,
          name: rec.productName,
          description: rec.description,
          price: rec.price,
          imageUrl: rec.imageUrl,
          score: rec.score,
          reason: rec.reason,
        })),
        totalRecommendations: recommendations.length,
        metadata: {
          basedOnSearches: searchTerms.length,
          basedOnPurchases: purchasedProductIds.length,
          avgSentiment: Math.round(avgSentiment * 100) / 100,
        },
      };
    } catch (error) {
      this.logger.error(`Error generating recommendations: ${error}`);
      throw new InternalServerErrorException(
        'Failed to generate recommendations',
      );
    }
  }

  // Helper: Obtenir la raison de la recommandation
  private getRecommendationReason(query: string, sentiment: number): string {
    if (query.startsWith('catégorie:')) {
      return 'Basé sur vos achats précédents';
    }
    if (sentiment > 0.5) {
      return 'Sélectionné selon vos préférences';
    }
    if (sentiment < -0.5) {
      return 'Nouveautés pour vous';
    }
    return 'Recommandé pour vous';
  }

  // Analyser le sentiment d'un texte
  async analyzeSentiment(
    dto: SentimentAnalysisDto,
  ): Promise<SentimentAnalysisResponseDto> {
    try {
      // Utiliser l'API pour analyser le sentiment
      const systemPrompt = `Analyse le sentiment du texte suivant.
Retourne un JSON avec:
- score: nombre entre -1 (négatif) et 1 (positif)
- label: "positive", "neutral", ou "negative"
- positive_keywords: liste des mots-clés positifs
- negative_keywords: liste des mots-clés négatifs
- confidence: nombre entre 0 et 1`;

      const completion = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: dto.text },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const parsed = JSON.parse(responseText);

      return {
        score: parsed.score || 0,
        label: parsed.label || 'neutral',
        confidence: parsed.confidence || 0.5,
        positiveKeywords: parsed.positive_keywords || [],
        negativeKeywords: parsed.negative_keywords || [],
      };
    } catch (error) {
      this.logger.error(`Error analyzing sentiment: ${error}`);

      // Fallback: analyse simple par mots-clés
      return this.simpleSentimentAnalysis(dto.text);
    }
  }

  // Analyse simple de sentiment (fallback)
  private simpleSentimentAnalysis(text: string): SentimentAnalysisResponseDto {
    const positiveWords = [
      'excellent',
      'superbe',
      'parfait',
      'génial',
      'fantastique',
      'recommande',
      'satisfait',
      'content',
      'heureux',
      'qualité',
    ];
    const negativeWords = [
      'déçu',
      'mauvais',
      'nul',
      'horrible',
      'terrible',
      'problème',
      'retard',
      'cher',
      'décevant',
      'arnaque',
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) positiveCount++;
    }
    for (const word of negativeWords) {
      if (lowerText.includes(word)) negativeCount++;
    }

    const total = positiveCount + negativeCount;
    const score = total > 0 ? (positiveCount - negativeCount) / total : 0;
    const label =
      score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
    const confidence = Math.min(0.5 + total * 0.1, 0.8);

    return {
      score,
      label,
      confidence,
      positiveKeywords: positiveWords.filter((w) => lowerText.includes(w)),
      negativeKeywords: negativeWords.filter((w) => lowerText.includes(w)),
    };
  }

  // Générer une description SEO
  async generateSEO(dto: SEOGenerationDto): Promise<SEOGenerationResponseDto> {
    try {
      const systemPrompt = `Génère une optimisation SEO complète pour ce produit.

Produit:
- Titre: ${dto.title}
- Description: ${dto.description}
- Mots-clés: ${dto.keywords.join(', ')}
- Marque: ${dto.brand || 'N/A'}
- Catégorie: ${dto.category || 'N/A'}
- Longueur: ${dto.targetLength || 'medium'}
- Ton: ${dto.tone || 'professional'}

Retourne un JSON avec:
- title: titre SEO optimisé (max 60-70 caractères)
- meta_description: meta description optimisée (max 150-160 caractères)
- keywords: 5-10 mots-clés principaux
- suggested_h1: suggestion de balise H1
- long_tail_keywords: 5 mots-clés à longue traîne
- html_content: description formatée en HTML si demandé`;

      const completion = await this.openai.chat.completions.create({
        model: this.chatModel,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Génère le SEO pour: ${dto.title}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      const parsed = JSON.parse(responseText);

      return {
        title: parsed.title || dto.title,
        metaDescription:
          parsed.meta_description || dto.description.substring(0, 150),
        keywords: parsed.keywords || dto.keywords,
        suggestedH1: parsed.suggested_h1,
        longTailKeywords: parsed.long_tail_keywords || [],
        htmlContent: parsed.html_content,
      };
    } catch (error) {
      this.logger.error(`Error generating SEO: ${error}`);

      // Fallback: génération simple
      return {
        title: `${dto.title} | ${dto.brand || 'Boutique'}`,
        metaDescription: dto.description.substring(0, 150),
        keywords: dto.keywords.slice(0, 5),
      };
    }
  }

  // Ajouter un document à la base de connaissances
  async addKnowledgeDocument(
    dto: AddKnowledgeDocumentDto,
  ): Promise<KnowledgeDocumentResponseDto> {
    try {
      const documentId = dto.externalId || crypto.randomUUID();
      const embeddingResponse = await this.generateEmbedding({
        text: dto.content,
        documentId,
        documentType: dto.documentType,
      });

      const vector = EmbeddingUtils.decodeEmbeddingFromBase64(
        embeddingResponse.embedding,
      );
      const sqlVector = EmbeddingUtils.PgVectorUtils.toSqlVector(vector);

      // Sauvegarder les métadonnées
      await this.prisma.$executeRaw`
        INSERT INTO ai_knowledge_base (id, content, document_type, metadata, embedding, created_at, updated_at)
        VALUES (
          ${documentId}::uuid,
          ${dto.content}::text,
          ${this.convertDocumentType(dto.documentType).toString()}::text,
          ${JSON.stringify(dto.metadata || {})}::jsonb,
          ${sqlVector}::vector,
          NOW(),
          NOW()
        )
      `;

      return {
        id: documentId,
        documentType: dto.documentType,
        title: dto.title,
        embeddingGenerated: true,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error adding knowledge document: ${error}`);
      throw new InternalServerErrorException(
        'Failed to add knowledge document',
      );
    }
  }

  // Indexer un produit dans la base de connaissances
  async indexProduct(
    dto: IndexProductDto,
  ): Promise<KnowledgeDocumentResponseDto> {
    const content = `
      Produit: ${dto.name}
      Description: ${dto.description}
      Catégorie: ${dto.category || 'Non catégorisé'}
      Marque: ${dto.brand || 'N/A'}
      Prix: ${dto.price || 'N/A'} TND
      Tags: ${dto.tags?.join(', ') || 'Aucun'}
    `.trim();

    return this.addKnowledgeDocument({
      content,
      documentType: DocumentType.PRODUCT,
      title: dto.name,
      metadata: {
        productId: dto.productId,
        name: dto.name,
        price: dto.price,
        category: dto.category,
        brand: dto.brand,
        tags: dto.tags,
      },
      externalId: dto.productId,
    });
  }

  // Obtenir les statistiques de la base de connaissances
  async getKnowledgeBaseStats(): Promise<KnowledgeBaseStatsResponseDto> {
    try {
      const stats = await this.prisma.$queryRaw<
        Array<{
          total_documents: bigint;
          document_type: string;
          embedding_dimension: bigint;
          last_updated: Date;
        }>
      >`
        SELECT
          COUNT(*) as "totalDocuments",
          document_type as "documentType",
          vector_dim(embedding) as "embeddingDimension",
          MAX(updated_at) as "lastUpdated"
        FROM ai_knowledge_base
        GROUP BY document_type
      `;

      const documentsByType: Record<string, number> = {};
      let totalDocuments = 0;
      let lastUpdated = new Date();

      for (const row of stats) {
        documentsByType[row.document_type] = Number(row.total_documents);
        totalDocuments += Number(row.total_documents);
        if (row.last_updated > lastUpdated) {
          lastUpdated = row.last_updated;
        }
      }

      return {
        totalDocuments,
        documentsByType,
        embeddingDimension: stats[0]?.embedding_dimension
          ? Number(stats[0].embedding_dimension)
          : 1536,
        lastUpdated: lastUpdated.toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting knowledge base stats: ${error}`);

      return {
        totalDocuments: 0,
        documentsByType: {},
        embeddingDimension: 1536,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  // Extraire les recommandations de produits depuis les résultats de recherche
  private extractProductRecommendations(
    results: SearchResultDto[],
  ): ProductRecommendation[] {
    return results.slice(0, 3).map((r) => ({
      productId: r.id,
      productName: r.title || 'Produit',
      price: r.price || 0,
      imageUrl: r.imageUrl,
      score: r.score || 0,
      reason: `Correspondance: ${Math.round(r.score * 100)}%`,
    }));
  }

  // Batch: Générer des embeddings pour plusieurs textes
  async generateBatchEmbeddings(
    texts: string[],
  ): Promise<Array<{ text: string; embedding: string; dimension: number }>> {
    const results = await Promise.all(
      texts.map(async (text) => {
        const response = await this.generateEmbedding({ text });
        return {
          text,
          embedding: response.embedding,
          dimension: response.dimension,
        };
      }),
    );

    return results;
  }

  // Rechercher des produits similaires par requête textuelle
  async searchSimilarProducts(dto: {
    query: string;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: string[];
    excludeIds?: string[];
  }): Promise<{
    query: string;
    totalResults: number;
    results: Array<{
      productId: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      categoryName: string | null;
      similarityScore: number;
    }>;
  }> {
    const startTime = Date.now();

    try {
      // 1. Générer l'embedding de la requête
      const embeddingResponse = await this.generateEmbedding({
        text: dto.query,
      });

      const queryEmbedding = EmbeddingUtils.decodeEmbeddingFromBase64(
        embeddingResponse.embedding,
      );

      const sqlVector =
        EmbeddingUtils.PgVectorUtils.toSqlVector(queryEmbedding);
      const limit = dto.limit ?? 10;

      const conditions: Prisma.Sql[] = [Prisma.sql`p."isActive" = true`];
      if (dto.categoryIds && dto.categoryIds.length > 0) {
        conditions.push(
          Prisma.sql`p."categoryId" = ANY(${dto.categoryIds}::text[])`,
        );
      }
      if (dto.excludeIds && dto.excludeIds.length > 0) {
        conditions.push(
          Prisma.sql`NOT (p.id = ANY(${dto.excludeIds}::text[]))`,
        );
      }
      if (dto.minPrice !== undefined) {
        conditions.push(Prisma.sql`p.price >= ${dto.minPrice}`);
      }
      if (dto.maxPrice !== undefined) {
        conditions.push(Prisma.sql`p.price <= ${dto.maxPrice}`);
      }

      // 3. Exécuter la recherche vectorielle via le Knowledge Base
      // On cherche d'abord dans les produits indexés
      const searchResults = await this.prisma.$queryRaw<
        Array<{
          id: string;
          name: string;
          description: string | null;
          price: number;
          imageUrl: string | null;
          categoryName: string | null;
          similarity: number;
        }>
      >(
        Prisma.sql`
          SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p."imageUrl" as "imageUrl",
            c."name" as "categoryName",
            1 - (kb.embedding <=> ${sqlVector}::vector) as similarity
          FROM "products" p
          LEFT JOIN "categories" c ON p."categoryId" = c.id
          LEFT JOIN ai_knowledge_base kb ON kb.metadata->>'productId' = p.id
          WHERE ${Prisma.join(
            [...conditions, Prisma.sql`kb.embedding IS NOT NULL`],
            ' AND ',
          )}
          ORDER BY kb.embedding <=> ${sqlVector}::vector
          LIMIT ${limit}
        `,
      );

      // 4. Si pas assez de résultats, rechercher dans tous les produits
      if (searchResults.length < limit) {
        const fallbackResults = await this.prisma.$queryRaw<
          Array<{
            id: string;
            name: string;
            description: string | null;
            price: number;
            imageUrl: string | null;
            categoryName: string | null;
            similarity: number;
          }>
        >(
          Prisma.sql`
            SELECT
              p.id,
              p.name,
              p.description,
              p.price,
              p."imageUrl" as "imageUrl",
              c."name" as "categoryName",
              0.5 as similarity
            FROM "products" p
            LEFT JOIN "categories" c ON p."categoryId" = c.id
            WHERE ${Prisma.join(conditions, ' AND ')}
            ORDER BY p."createdAt" DESC
            LIMIT ${limit - searchResults.length}
          `,
        );

        searchResults.push(...fallbackResults);
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `Product similarity search for "${dto.query}" completed in ${processingTime}ms`,
      );

      return {
        query: dto.query,
        totalResults: searchResults.length,
        results: searchResults.map((row) => ({
          productId: row.id,
          name: row.name,
          description: row.description,
          price: Number(row.price),
          imageUrl: row.imageUrl,
          categoryName: row.categoryName,
          similarityScore: Number(row.similarity),
        })),
      };
    } catch (error) {
      this.logger.error(`Error in product similarity search: ${error}`);
      // Fallback: recherche textuelle simple
      return this.fallbackProductSearch(dto);
    }
  }

  // Recherche de produits simple (fallback si pas de pgvector)
  private async fallbackProductSearch(dto: {
    query: string;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: string[];
    excludeIds?: string[];
  }): Promise<{
    query: string;
    totalResults: number;
    results: Array<{
      productId: string;
      name: string;
      description: string | null;
      price: number;
      imageUrl: string | null;
      categoryName: string | null;
      similarityScore: number;
    }>;
  }> {
    // Extraire les mots-clés de la requête
    const keywords = dto.query
      .toLowerCase()
      .split(' ')
      .filter((k) => k.length > 2);

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (dto.categoryIds) {
      where.categoryId = { in: dto.categoryIds };
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      take: dto.limit || 10,
    });

    // Filtrer et scorer par mots-clés
    const scoredProducts = products
      .filter((p) => {
        if (dto.excludeIds?.includes(p.id)) return false;
        if (dto.minPrice && Number(p.price) < dto.minPrice) return false;
        if (dto.maxPrice && Number(p.price) > dto.maxPrice) return false;
        return true;
      })
      .map((product) => {
        const searchText =
          `${product.name} ${product.description || ''}`.toLowerCase();
        const matches = keywords.filter((k) => searchText.includes(k)).length;
        return {
          product,
          score: matches / Math.max(keywords.length, 1),
        };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, dto.limit || 10);

    return {
      query: dto.query,
      totalResults: scoredProducts.length,
      results: scoredProducts.map(({ product, score }) => ({
        productId: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        imageUrl: product.imageUrl,
        categoryName: product.category?.name || null,
        similarityScore: score,
      })),
    };
  }
}
