/**
 * DTO pour les requêtes avancées de produits
 */

import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

/**
 * Ordre de tri
 */
export enum ProductSortOrder {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  CREATED_AT_DESC = 'created_at_desc',
  CREATED_AT_ASC = 'created_at_asc',
  POPULARITY = 'popularity',
  RATING = 'rating',
  STOCK_DESC = 'stock_desc',
}

/**
 * Filtres avancés pour la recherche de produits
 */
export class AdvancedQueryProductDto {
  @ApiPropertyOptional({
    description: 'Recherche textuelle dans nom et description',
    example: 'iPhone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ID de la catégorie',
    example: 'category-uuid-123',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'IDs des catégories (filtre multiple)',
    isArray: true,
    example: ['category-uuid-1', 'category-uuid-2'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Filtrer par produits actifs uniquement',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

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

  @ApiPropertyOptional({
    description: 'Note minimum (1-5)',
    example: 4,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Disponibilité (en stock)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  inStock?: boolean;

  @ApiPropertyOptional({
    description: 'Marque',
    example: 'Apple',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    description: 'Tags',
    isArray: true,
    example: ['5G', 'Smartphone'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'SKU du produit',
    example: 'IPHONE-15-PRO',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Ordre de tri',
    enum: ProductSortOrder,
    example: ProductSortOrder.PRICE_ASC,
  })
  @IsOptional()
  @IsEnum(ProductSortOrder)
  sortBy?: ProductSortOrder;

  @ApiPropertyOptional({
    description: 'Numéro de page',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments par page',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Inclure les produits associés',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeRelated?: boolean;
}

/**
 * Requête pour la recherche avec similarité (RAG)
 */
export class SemanticSearchProductDto {
  @ApiProperty({
    description: 'Requête textuelle',
    example: 'smartphone appareil photo puissant',
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Nombre de résultats',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Seuil de similarité minimum',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  similarityThreshold?: number = 0;
}

/**
 * Filtres pour l\'administration
 */
export class AdminProductQueryDto extends AdvancedQueryProductDto {
  @ApiPropertyOptional({
    description: 'Inclure les produits inactifs',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeInactive?: boolean;

  @ApiPropertyOptional({
    description: 'Stock minimum',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStock?: number;

  @ApiPropertyOptional({
    description: 'Stock maximum',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxStock?: number;

  @ApiPropertyOptional({
    description: 'Produits sans stock uniquement',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  outOfStock?: boolean;
}

/**
 * Paramètres pour la génération d\'embeddings de produits
 */
export class GenerateProductEmbeddingDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'product-uuid-123',
  })
  @IsString()
  productId: string;

  @ApiPropertyOptional({
    description: 'Régénérer même si existant',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  regenerate?: boolean;
}

/**
 * Batch: Indexation de plusieurs produits
 */
export class BatchIndexProductsDto {
  @ApiProperty({
    description: 'IDs des produits à indexer',
    isArray: true,
    example: ['product-uuid-1', 'product-uuid-2'],
  })
  @IsArray()
  @IsString({ each: true })
  productIds: string[];

  @ApiPropertyOptional({
    description: 'Régénérer les embeddings existants',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  regenerate?: boolean;
}

