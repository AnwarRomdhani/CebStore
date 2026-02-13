/**
 * DTO pour la réponse d'un avis client
 * @description Format de données retourné après création ou récupération d'un avis
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({
    description: 'ID unique de l\'avis',
    example: 'uuid-avis',
  })
  id: string;

  @ApiProperty({
    description: 'Note du produit (1-5)',
    example: 5,
  })
  rating: number;

  @ApiPropertyOptional({
    description: 'Commentaire de l\'avis',
    example: 'Excellent produit !',
  })
  comment?: string;

  @ApiProperty({
    description: 'ID du produit évalué',
    example: 'uuid-produit',
  })
  productId: string;

  @ApiProperty({
    description: 'ID de l\'utilisateur qui a rédigé l\'avis',
    example: 'uuid-utilisateur',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'Prénom de l\'utilisateur',
    example: 'Mohamed',
  })
  userFirstName?: string;

  @ApiPropertyOptional({
    description: 'Nom de l\'utilisateur',
    example: 'Ben Ali',
  })
  userLastName?: string;

  @ApiProperty({
    description: 'Date de création de l\'avis',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

/**
 * DTO pour la note moyenne d'un produit
 */
export class ProductRatingSummaryDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'uuid-produit',
  })
  productId: string;

  @ApiProperty({
    description: 'Note moyenne calculée',
    example: 4.5,
  })
  averageRating: number;

  @ApiProperty({
    description: 'Nombre total d\'avis',
    example: 42,
  })
  totalReviews: number;

  @ApiProperty({
    description: 'Répartition des notes',
    example: {
      1: 2,
      2: 5,
      3: 8,
      4: 15,
      5: 12,
    },
  })
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * DTO pour la réponse paginée des avis
 */
export class PaginatedReviewsResponseDto {
  @ApiProperty({
    description: 'Liste des avis',
    type: [ReviewResponseDto],
  })
  data: ReviewResponseDto[];

  @ApiProperty({
    description: 'Métadonnées de pagination',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiPropertyOptional({
    description: 'Résumé des notes du produit',
    type: ProductRatingSummaryDto,
  })
  ratingSummary?: ProductRatingSummaryDto;
}

