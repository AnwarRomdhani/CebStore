import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
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
  ChatSessionResponseDto,
  KnowledgeBaseStatsResponseDto,
} from './dto/rag-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { User } from '@prisma/client';
import { StrictThrottle } from 'src/common/decorators/custom-throttler.decorator';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // Générer un embedding pour un texte
  @Post('embeddings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Générer un embedding vectoriel',
    description: 'Encode un texte en vecteur sémantique avec OpenAI',
  })
  @ApiBody({ type: GenerateEmbeddingDto })
  @ApiResponse({
    status: 200,
    description: 'Embedding généré avec succès',
    type: EmbeddingResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: "Erreur lors de la génération de l'embedding",
  })
  async generateEmbedding(
    @Body() dto: GenerateEmbeddingDto,
  ): Promise<EmbeddingResponseDto> {
    return this.aiService.generateEmbedding(dto);
  }

  // Effectuer une recherche sémantique
  @Post('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Recherche sémantique',
    description:
      'Recherche dans la base de connaissances par similarité cosinus',
  })
  @ApiBody({ type: SemanticSearchDto })
  @ApiResponse({
    status: 200,
    description: 'Résultats de recherche',
    type: SemanticSearchResponseDto,
  })
  async semanticSearch(
    @Body() dto: SemanticSearchDto,
  ): Promise<SemanticSearchResponseDto> {
    return this.aiService.semanticSearch(dto);
  }

  //Chatbot conversationnel
  @Post('chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Chatbot conversationnel',
    description: "Assistant commercial basé sur RAG pour l'e-commerce",
  })
  @ApiBody({ type: ChatbotQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Réponse du chatbot',
    type: ChatbotResponseDto,
  })
  async chatbot(@Body() dto: ChatbotQueryDto): Promise<ChatbotResponseDto> {
    return this.aiService.chatbot(dto);
  }

  // Créer une session de chat
  @Post('chat/session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer une session de chat',
  })
  @ApiResponse({
    status: 201,
    description: 'Session créée',
    type: ChatSessionResponseDto,
  })
  async createChatSession(
    @GetUser() user: User,
    @Body() dto: CreateChatSessionDto,
  ): Promise<ChatSessionResponseDto> {
    const session = await this.aiService.createChatSession(dto);
    return {
      id: session.id,
      userId: user.id,
      messages: session.messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
    };
  }

  //Obtenir des recommandations de produits
  @Post('recommendations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Recommandations de produits',
    description: 'Basées sur lhistorique dachat et le comportement',
  })
  @ApiBody({ type: RecommendationConfigDto })
  @ApiResponse({
    status: 200,
    description: 'Produits recommandés',
    type: ProductRecommendationResponseDto,
  })
  async getRecommendations(
    @GetUser() user: User,
    @Body() dto: RecommendationConfigDto,
  ): Promise<ProductRecommendationResponseDto> {
    return this.aiService.getProductRecommendations({
      ...dto,
      userId: user.id,
    });
  }

  //Analyser le sentiment d\'un texte
  @Post('sentiment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Analyse de sentiment',
    description: 'Analyse le sentiment dun texte (avis, commentaire, etc.)',
  })
  @ApiBody({ type: SentimentAnalysisDto })
  @ApiResponse({
    status: 200,
    description: 'Résultat de lanalyse',
    type: SentimentAnalysisResponseDto,
  })
  async analyzeSentiment(
    @Body() dto: SentimentAnalysisDto,
  ): Promise<SentimentAnalysisResponseDto> {
    return this.aiService.analyzeSentiment(dto);
  }

  // Générer une description SEO
  @Post('seo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Génération SEO',
    description: 'Génère des méta-données optimisées pour le SEO',
  })
  @ApiBody({ type: SEOGenerationDto })
  @ApiResponse({
    status: 200,
    description: 'Optimisation SEO générée',
    type: SEOGenerationResponseDto,
  })
  async generateSEO(
    @Body() dto: SEOGenerationDto,
  ): Promise<SEOGenerationResponseDto> {
    return this.aiService.generateSEO(dto);
  }

  //Ajouter un document à la base de connaissances (Admin)
  @Post('knowledge')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Ajouter un document (Admin)',
    description: 'Ajoute un document à la base de connaissances RAG',
  })
  @ApiBody({ type: AddKnowledgeDocumentDto })
  @ApiResponse({
    status: 201,
    description: 'Document ajouté',
    type: KnowledgeDocumentResponseDto,
  })
  async addKnowledgeDocument(
    @Body() dto: AddKnowledgeDocumentDto,
  ): Promise<KnowledgeDocumentResponseDto> {
    return this.aiService.addKnowledgeDocument(dto);
  }

  // Indexer un produit (Admin)
  @Post('knowledge/product')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Indexer un produit (Admin)',
    description: 'Crée un embedding pour un produit',
  })
  @ApiBody({ type: IndexProductDto })
  @ApiResponse({
    status: 201,
    description: 'Produit indexé',
    type: KnowledgeDocumentResponseDto,
  })
  async indexProduct(
    @Body() dto: IndexProductDto,
  ): Promise<KnowledgeDocumentResponseDto> {
    return this.aiService.indexProduct(dto);
  }

  // Obtenir les statistiques de la base de connaissances
  @Get('knowledge/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Statistiques de la base de connaissances',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
    type: KnowledgeBaseStatsResponseDto,
  })
  async getKnowledgeBaseStats(): Promise<KnowledgeBaseStatsResponseDto> {
    return this.aiService.getKnowledgeBaseStats();
  }

  //Rechercher des produits similaires par requête textuelle
  @Get('products/similar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Rechercher des produits similaires',
    description:
      'Recherche des produits similaires à une requête textuelle (ex: "chaussures pour homme") en utilisant la recherche vectorielle pgvector',
  })
  @ApiQuery({
    name: 'query',
    description: 'Requête de recherche',
    example: 'chaussures pour homme',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Nombre maximum de résultats',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Prix minimum',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Prix maximum',
    example: 500,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Produits similaires trouvés',
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        totalResults: { type: 'number' },
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number' },
              imageUrl: { type: 'string' },
              categoryName: { type: 'string' },
              similarityScore: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async searchSimilarProducts(
    @Query('query') query: string,
    @Query('limit') limit?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.aiService.searchSimilarProducts({
      query,
      limit: limit ? Number(limit) : 10,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  //Vérifier létat du service AI
  @Get('health')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @StrictThrottle()
  @ApiOperation({
    summary: 'Vérifier ltat du service AI',
  })
  @ApiResponse({
    status: 200,
    description: 'Service opérationnel',
  })
  healthCheck(): Promise<{ status: string; openaiConfigured: boolean }> {
    return Promise.resolve({
      status: 'ok',
      openaiConfigured: true,
    });
  }
}
