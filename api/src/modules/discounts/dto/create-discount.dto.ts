/**
 * DTO pour la création d'un code promo
 * @description Valide les données entrantes pour la création d'une promotion
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsEnum,
  Min,
  MaxLength,
  IsPositive,
} from 'class-validator';

/**
 * Enum pour le type de remise
 */
export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export class CreateDiscountDto {
  @ApiProperty({
    description: 'Code promo unique',
    example: 'SUMMER2024',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Type de remise (PERCENTAGE ou FIXED)',
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  @IsEnum(DiscountType)
  type: DiscountType;

  @ApiProperty({
    description: 'Valeur de la remise (pourcentage ou montant fixe en TND)',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({
    description: 'Description de la promotion',
    example: 'Réduction été 2024',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: "Date d'expiration du code promo",
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  expiresAt: string;

  @ApiPropertyOptional({
    description: 'Montant minimum pour appliquer le code (en TND)',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({
    description: "Nombre maximum d'utilisations",
    example: 100,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxUses?: number;

  @ApiPropertyOptional({
    description: 'Code actif ou non',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
