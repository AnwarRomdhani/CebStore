/**
 * DTO pour la mise à jour d'un avis client
 * @description Permet de modifier la note et/ou le commentaire d'un avis existant
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Nouvelle note du produit (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Nouveau commentaire de l\'avis',
    example: 'Produit de bonne qualité, livraison rapide.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}

