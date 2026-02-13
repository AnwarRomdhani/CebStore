/**
 * DTO pour la création d'un avis client
 * @description Valide les données entrantes pour la création d'un avis
 */

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'ID du produit à évaluer',
    example: 'uuid-du-produit',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Note du produit (1-5 étoiles)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Commentaire optionnel de l\'avis',
    example: 'Excellent produit, je recommande vivement !',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

