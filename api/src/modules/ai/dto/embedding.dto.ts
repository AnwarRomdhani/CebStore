import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmbeddingDto {
  @ApiProperty({
    description: "Vecteur d'embedding",
    type: [Number],
    example: [0.1, 0.2, 0.3, 0.4],
  })
  values: number[];

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
}
export class EncodedEmbeddingDto {
  @ApiProperty({
    description: 'Embedding encodé en base64',
    example: 'W3sidmFsdWUiOjAuMTIzLCJkZWYiOjB9XQ==',
  })
  encoded: string;

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
}
export class EmbeddingWithMetadataDto extends EmbeddingDto {
  @ApiProperty({
    description: 'ID du document source',
    example: 'product-uuid-123',
  })
  documentId: string;

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

  @ApiProperty({
    description: 'Métadonnées additionnelles',
    example: { category: 'Smartphones', brand: 'Samsung' },
  })
  metadata?: Record<string, unknown>;
}
export class EmbeddingSimilarityDto {
  @ApiProperty({
    description: 'ID du premier embedding',
    example: 'embedding-1',
  })
  embeddingId1: string;

  @ApiProperty({
    description: 'ID du second embedding',
    example: 'embedding-2',
  })
  embeddingId2: string;

  @ApiProperty({
    description: 'Score de similarité cosinus',
    example: 0.85,
  })
  similarity: number;
}
export class BatchEmbeddingRequestDto {
  @ApiProperty({
    description: 'Liste des textes à encoder',
    type: [String],
    example: ['Texte 1', 'Texte 2', 'Texte 3'],
  })
  texts: string[];

  @ApiPropertyOptional({
    description: 'ID de base pour les documents',
    example: 'product-',
  })
  baseId?: string;

  @ApiPropertyOptional({
    description: 'Type de document pour tous les éléments',
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
  documentType?: string;
}
export class BatchEmbeddingResultDto {
  @ApiProperty({
    description: "Index de l'élément dans la requête",
    example: 0,
  })
  index: number;

  @ApiPropertyOptional({
    description: 'ID du document',
    example: 'product-1',
  })
  documentId?: string;

  @ApiProperty({
    description: 'Embedding généré',
    type: EmbeddingDto,
  })
  embedding: EmbeddingDto;

  @ApiProperty({
    description: 'Succès ou échec',
    example: true,
  })
  success: boolean;

  @ApiPropertyOptional({
    description: "Message d'erreur",
    example: 'Token limit exceeded',
  })
  error?: string;
}
export class BatchEmbeddingResponseDto {
  @ApiProperty({
    description: 'Résultats',
    type: [BatchEmbeddingResultDto],
  })
  results: BatchEmbeddingResultDto[];

  @ApiProperty({
    description: 'Nombre de succès',
    example: 9,
  })
  successCount: number;

  @ApiProperty({
    description: "Nombre d'échecs",
    example: 1,
  })
  failureCount: number;

  @ApiProperty({
    description: 'Tokens totaux utilisés',
    example: 4500,
  })
  totalTokens: number;
}
export class DocumentSimilarityQueryDto {
  @ApiProperty({
    description: 'Texte de la requête',
    example: 'smartphone bon appareil photo',
  })
  query: string;

  @ApiProperty({
    description: 'IDs des documents à comparer',
    type: [String],
    example: ['product-1', 'product-2', 'product-3'],
  })
  documentIds: string[];

  @ApiPropertyOptional({
    description: 'Inclure le contenu des documents',
    example: false,
  })
  includeContent?: boolean;
}
export class DocumentSimilarityResultDto {
  @ApiProperty({
    description: 'ID du document',
    example: 'product-1',
  })
  documentId: string;

  @ApiProperty({
    description: 'Score de similarité',
    example: 0.85,
  })
  similarity: number;

  @ApiPropertyOptional({
    description: 'Rang du document',
    example: 1,
  })
  rank?: number;

  @ApiPropertyOptional({
    description: 'Contenu du document',
    example: 'Samsung Galaxy S24 Ultra...',
  })
  content?: string;
}
export class DocumentSimilarityResponseDto {
  @ApiProperty({
    description: 'Requête utilisée',
    example: 'smartphone bon appareil photo',
  })
  query: string;

  @ApiProperty({
    description: "ID de l'embedding de la requête",
  })
  queryEmbeddingId: string;

  @ApiProperty({
    description: 'Résultats de similarité',
    type: [DocumentSimilarityResultDto],
  })
  similarities: DocumentSimilarityResultDto[];

  @ApiProperty({
    description: 'Temps de calcul en ms',
    example: 150,
  })
  processingTimeMs: number;
}
