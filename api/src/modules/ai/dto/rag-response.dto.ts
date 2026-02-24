import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class EmbeddingResponseDto {
  @ApiProperty({
    description: 'ID du document si fourni',
    example: 'product-uuid-123',
  })
  documentId?: string;

  @ApiProperty({
    description: 'Embedding vectoriel encodé en base64',
    example: 'W3sidmFsdWUiOjAuMTIzLCJkZWYiOjB9XQ==',
  })
  embedding: string;

  @ApiProperty({
    description: 'Dimension du vecteur',
    example: 1536,
  })
  dimension: number;

  @ApiProperty({
    description: 'Modèle utilisé',
    example: 'text-embedding-ada-002',
  })
  model: string;

  @ApiProperty({
    description: 'Tokens utilisés',
    example: 10,
  })
  usage: {
    promptTokens: number;
    totalTokens: number;
  };
}
export class SearchResultDto {
  @ApiProperty({
    description: 'ID du document',
    example: 'product-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Score de similarité cosinus',
    example: 0.85,
  })
  score: number;

  @ApiProperty({
    description: 'Type de document',
    enum: {
      PRODUCT: 'PRODUCT',
      CATEGORY: 'CATEGORY',
      FAQ: 'FAQ',
      POLICY: 'POLICY',
      REVIEW: 'REVIEW',
      GENERAL: 'GENERAL',
    },
    example: 'PRODUCT',
  })
  documentType: string;

  @ApiPropertyOptional({
    description: 'Titre ou nom du document',
    example: 'Samsung Galaxy S24 Ultra',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Contenu textuel',
    example:
      "Le Samsung Galaxy S24 Ultra dispose d'un appareil photo de 200MP...",
  })
  content?: string;

  @ApiPropertyOptional({
    description: "URL de l'image",
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Prix si applicable',
    example: 1299.99,
  })
  price?: number;

  @ApiPropertyOptional({
    description: 'Métadonnées additionnelles',
    example: { category: 'Smartphones', brand: 'Samsung' },
  })
  metadata?: Record<string, unknown>;
}
export class SemanticSearchResponseDto {
  @ApiProperty({
    description: 'Requête utilisée',
    example: 'smartphone bon appareil photo',
  })
  query: string;

  @ApiProperty({
    description: 'Nombre de résultats',
    example: 10,
  })
  totalResults: number;

  @ApiProperty({
    description: 'Temps de recherche en ms',
    example: 150,
  })
  searchTimeMs: number;

  @ApiProperty({
    description: 'Résultats de recherche',
    type: [SearchResultDto],
  })
  results: SearchResultDto[];

  @ApiProperty({
    description: 'Modèle utilisé',
    example: 'text-embedding-ada-002',
  })
  model: string;
}
export class ChatbotResponseDto {
  @ApiProperty({
    description: 'ID de la session',
    example: 'session-uuid-123',
  })
  sessionId: string;

  @ApiProperty({
    description: 'Réponse générée',
    example:
      'Basé sur votre recherche, je vous recommande le Samsung Galaxy S24 Ultra...',
  })
  answer: string;

  @ApiProperty({
    description: 'Sources utilisées pour générer la réponse',
    type: [String],
    example: ['product-uuid-1', 'product-uuid-2'],
  })
  sources: string[];

  @ApiProperty({
    description: 'Temps de génération en ms',
    example: 2500,
  })
  processingTimeMs: number;

  @ApiProperty({
    description: 'Nom du modèle utilisé',
    example: 'gpt-3.5-turbo',
  })
  model: string;

  @ApiPropertyOptional({
    description: 'Score de confiance (0-1)',
    example: 0.92,
  })
  confidenceScore?: number;

  @ApiPropertyOptional({
    description: 'Produits recommandés',
    type: [Object],
  })
  recommendedProducts?: Array<{
    productId: string;
    name: string;
    price: number;
    imageUrl?: string;
    matchReason: string;
  }>;
}
export class ChatSessionResponseDto {
  @ApiProperty({
    description: 'ID de la session',
    example: 'session-uuid-123',
  })
  id: string;

  @ApiPropertyOptional({
    description: "ID de l'utilisateur",
    example: 'user-uuid-123',
  })
  userId?: string;

  @ApiProperty({
    description: 'Messages de la conversation',
    type: [Object],
    example: [
      { role: 'user', content: 'Bonjour', timestamp: '2024-01-01T10:00:00Z' },
      {
        role: 'assistant',
        content: 'Bonjour! Comment puis-je vous aider?',
        timestamp: '2024-01-01T10:00:01Z',
      },
    ],
  })
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T10:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-01-01T10:30:00Z',
  })
  updatedAt: string;
}
export class ProductRecommendationResponseDto {
  @ApiProperty({
    description: "ID de l'utilisateur",
    example: 'user-uuid-123',
  })
  userId: string;

  @ApiProperty({
    description: 'Type de recommandation',
    example: 'similar-to-purchased',
  })
  recommendationType: string;

  @ApiProperty({
    description: 'Produits recommandés',
    type: [Object],
  })
  products: Array<{
    productId: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category?: string;
    score: number;
    reason: string;
  }>;

  @ApiProperty({
    description: 'Nombre de produits recommandés',
    example: 5,
  })
  totalRecommendations: number;

  @ApiPropertyOptional({
    description: 'Métadonnées de recommandation',
    example: {
      basedOnSearches: 3,
      basedOnPurchases: 5,
      avgSentiment: 0.75,
    },
  })
  metadata?: {
    basedOnSearches: number;
    basedOnPurchases: number;
    avgSentiment: number;
  };
}
export class SentimentAnalysisResponseDto {
  @ApiProperty({
    description: 'Score de sentiment (-1 à 1)',
    example: 0.75,
  })
  score: number;

  @ApiProperty({
    description: 'Label du sentiment',
    enum: { positive: 'positive', neutral: 'neutral', negative: 'negative' },
    example: 'positive',
  })
  label: 'positive' | 'neutral' | 'negative';

  @ApiProperty({
    description: "Confiance de l'analyse (0-1)",
    example: 0.88,
  })
  confidence: number;

  @ApiProperty({
    description: 'Mots-clés positifs détectés',
    type: [String],
    example: ['excellent', 'recommande', 'qualité'],
  })
  positiveKeywords: string[];

  @ApiProperty({
    description: 'Mots-clés négatifs détectés',
    type: [String],
    example: [],
  })
  negativeKeywords: string[];
}
export class SEOGenerationResponseDto {
  @ApiProperty({
    description: 'Titre SEO optimisé',
    example:
      'Samsung Galaxy S24 Ultra | Smartphone 5G avec Appareil Photo 200MP',
  })
  title: string;

  @ApiProperty({
    description: 'Meta description optimisée',
    example:
      'Découvrez le Samsung Galaxy S24 Ultra, le smartphone le plus avancé...',
  })
  metaDescription: string;

  @ApiProperty({
    description: 'Mots-clés détectés/suggérés',
    type: [String],
    example: [
      'Samsung Galaxy S24 Ultra',
      'smartphone 5G',
      'appareil photo 200MP',
    ],
  })
  keywords: string[];

  @ApiPropertyOptional({
    description: 'Balises H1 suggérées',
    example: 'Samsung Galaxy S24 Ultra - Le Roi de la Photographie Mobile',
  })
  suggestedH1?: string;

  @ApiPropertyOptional({
    description: 'Liste de mots-clés à long format',
    type: [String],
    example: [
      'meilleur smartphone pour photo 2024',
      'Samsung Galaxy S24 Ultra caractéristiques',
    ],
  })
  longTailKeywords?: string[];

  @ApiPropertyOptional({
    description: 'Description générée au format HTML',
    example: '<h1>Samsung Galaxy S24 Ultra</h1><p>...</p>',
  })
  htmlContent?: string;
}
export class KnowledgeDocumentResponseDto {
  @ApiProperty({
    description: 'ID du document',
    example: 'doc-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Type de document',
    enum: {
      PRODUCT: 'PRODUCT',
      CATEGORY: 'CATEGORY',
      FAQ: 'FAQ',
      POLICY: 'POLICY',
      REVIEW: 'REVIEW',
      GENERAL: 'GENERAL',
    },
    example: 'PRODUCT',
  })
  documentType: string;

  @ApiPropertyOptional({
    description: 'Titre du document',
    example: 'Samsung Galaxy S24 Ultra',
  })
  title?: string;

  @ApiProperty({
    description: 'Embedding généré avec succès',
    example: true,
  })
  embeddingGenerated: boolean;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T10:00:00Z',
  })
  createdAt: string;
}
export class KnowledgeBaseStatsResponseDto {
  @ApiProperty({
    description: 'Nombre total de documents',
    example: 1500,
  })
  totalDocuments: number;

  @ApiProperty({
    description: 'Nombre de documents par type',
    example: {
      PRODUCT: 500,
      CATEGORY: 50,
      FAQ: 100,
      POLICY: 20,
      REVIEW: 800,
      GENERAL: 30,
    },
  })
  documentsByType: Record<string, number>;

  @ApiProperty({
    description: 'Dimension des embeddings',
    example: 1536,
  })
  embeddingDimension: number;

  @ApiProperty({
    description: 'Dernier document indexé',
    example: '2024-01-01T12:00:00Z',
  })
  lastUpdated: string;
}
export class AIErrorResponseDto {
  @ApiProperty({
    description: "Type d'erreur",
    example: 'VALIDATION_ERROR',
  })
  error: string;

  @ApiProperty({
    description: "Message d'erreur",
    example: 'Le texte fourni est vide',
  })
  message: string;

  @ApiPropertyOptional({
    description: "Détails de l'erreur",
  })
  details?: Record<string, unknown>;
}
