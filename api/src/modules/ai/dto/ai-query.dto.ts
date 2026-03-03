import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsEnum,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export enum DocumentType {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  FAQ = 'FAQ',
  POLICY = 'POLICY',
  REVIEW = 'REVIEW',
  GENERAL = 'GENERAL',
}
export class GenerateEmbeddingDto {
  @ApiProperty({
    description: 'Texte à encoder en embedding',
    example: 'Samsung Galaxy S24 Ultra smartphone Android 5G',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(8000)
  text: string;

  @ApiPropertyOptional({
    description: 'ID optionnel pour associer à un document',
    example: 'product-uuid-123',
  })
  @IsOptional()
  @IsString()
  documentId?: string;

  @ApiPropertyOptional({
    description: 'Type de document',
    enum: DocumentType,
    example: DocumentType.PRODUCT,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}

export class SemanticSearchDto {
  @ApiProperty({
    description: 'Requête de recherche',
    example: 'smartphone bon appareil photo',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  query: string;

  @ApiPropertyOptional({
    description: 'Types de documents à rechercher',
    enum: DocumentType,
    isArray: true,
    example: [DocumentType.PRODUCT],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DocumentType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  documentTypes?: DocumentType[];

  @ApiPropertyOptional({
    description: 'Nombre maximum de résultats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Seuil de similarité minimum (0-1)',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  similarityThreshold?: number = 0;
}

export class ChatbotQueryDto {
  @ApiProperty({
    description: "Message de l'utilisateur",
    example: 'Quel est le meilleur smartphone pour la photo?',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional({
    description: 'ID de session de conversation existante',
    example: 'session-uuid-123',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({
    description: "Inclure l'historique récent dans le contexte",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeHistory?: boolean = true;

  @ApiPropertyOptional({
    description: 'Température pour la génération (0-1)',
    example: 0.7,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  @Type(() => Number)
  temperature?: number = 0.7;
}
export class ChatMessageDto {
  @ApiProperty({
    description: 'Rôle du message',
    enum: ['user', 'assistant', 'system'],
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({
    description: 'Contenu du message',
    example: 'Bonjour, comment puis-je vous aider?',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  content: string;
}
export class CreateChatSessionDto {
  @ApiPropertyOptional({
    description: 'Métadonnées initiales de la session',
    example: { source: 'website' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
export class RecommendationConfigDto {
  @ApiPropertyOptional({
    description: "ID de l'utilisateur (injecté depuis le token si authentifié)",
    example: 'user-uuid-123',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Nombre de recommandations',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  limit?: number = 5;

  @ApiPropertyOptional({
    description: 'Catégories à privilégier',
    isArray: true,
    example: ['category-uuid-1', 'category-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCategories?: string[];

  @ApiPropertyOptional({
    description: 'Prix minimum',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Prix maximum',
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;
}
export class SentimentAnalysisDto {
  @ApiProperty({
    description: 'Texte à analyser',
    example: 'Excellent produit, je recommande vivement!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5000)
  text: string;

  @ApiPropertyOptional({
    description: 'Type de texte',
    enum: DocumentType,
    example: DocumentType.REVIEW,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;
}
export class SEOGenerationDto {
  @ApiProperty({
    description: 'Titre du produit',
    example: 'Samsung Galaxy S24 Ultra',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Description courte du produit',
    example:
      'Le smartphone le plus avancé de Samsung avec un appareil photo de 200MP',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Mots-clés à inclure',
    isArray: true,
    example: ['smartphone', 'Samsung', '5G', 'photo'],
  })
  @IsArray()
  @IsString({ each: true })
  @MinLength(1)
  keywords: string[];

  @ApiPropertyOptional({
    description: 'Marque du produit',
    example: 'Samsung',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Catégorie du produit',
    example: 'Smartphones',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({
    description: 'Longueur souhaitée',
    enum: ['short', 'medium', 'long'],
    example: 'medium',
  })
  @IsOptional()
  @IsString()
  targetLength?: 'short' | 'medium' | 'long' = 'medium';

  @ApiPropertyOptional({
    description: 'Ton du contenu',
    enum: ['professional', 'casual', 'persuasive'],
    example: 'professional',
  })
  @IsOptional()
  @IsString()
  tone?: 'professional' | 'casual' | 'persuasive' = 'professional';
}
export class AddKnowledgeDocumentDto {
  @ApiProperty({
    description: 'Contenu textuel du document',
    example:
      'Notre politique de retour permet de retourner les produits dans les 30 jours',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @ApiProperty({
    description: 'Type de document',
    enum: DocumentType,
    example: DocumentType.POLICY,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiPropertyOptional({
    description: 'Titre du document',
    example: 'Politique de retour',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  title?: string;

  @ApiPropertyOptional({
    description: 'Métadonnées additionnelles',
    example: { section: 'retour', updatedAt: '2024-01-01' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'ID de référence externe',
    example: 'policy-return-v1',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  externalId?: string;
}
export class IndexProductDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'product-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Nom du produit',
    example: 'iPhone 15 Pro Max',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  name: string;

  @ApiProperty({
    description: 'Description du produit',
    example: 'Le nouvel iPhone avec appareil photo 48MP et puce A17 Pro',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiPropertyOptional({
    description: 'Catégorie du produit',
    example: 'Smartphones',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({
    description: 'Prix du produit',
    example: 1299.99,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Marque du produit',
    example: 'Apple',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  brand?: string;

  @ApiPropertyOptional({
    description: 'Tags additionnels',
    isArray: true,
    example: ['5G', '智能手机', 'premium'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
export class ProductSimilaritySearchDto {
  @ApiProperty({
    description: 'Requête de recherche textuelle',
    example: 'chaussures pour homme',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  query: string;

  @ApiPropertyOptional({
    description: 'Nombre maximum de résultats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Prix minimum',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Prix maximum',
    example: 500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'IDs de catégories à inclure',
    isArray: true,
    example: ['category-uuid-1'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({
    description: 'Exclure certains produits par ID',
    isArray: true,
    example: ['product-uuid-1'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeIds?: string[];
}
