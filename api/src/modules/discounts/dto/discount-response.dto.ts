import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountType } from './create-discount.dto';

export class DiscountResponseDto {
  @ApiProperty({
    description: 'ID unique du code promo',
    example: 'uuid-discount',
  })
  id: string;

  @ApiProperty({
    description: 'Code promo',
    example: 'SUMMER2024',
  })
  code: string;

  @ApiProperty({
    description: 'Type de remise',
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  type: DiscountType;

  @ApiProperty({
    description: 'Valeur de la remise',
    example: 20,
  })
  value: number;

  @ApiPropertyOptional({
    description: 'Description de la promotion',
    example: 'Réduction été 2024',
  })
  description?: string;

  @ApiProperty({
    description: 'Code actif ou non',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: "Date d'expiration",
    example: '2024-12-31T23:59:59.000Z',
  })
  expiresAt: Date;

  @ApiPropertyOptional({
    description: 'Montant minimum pour appliquer le code',
    example: 50,
  })
  minAmount?: number;

  @ApiPropertyOptional({
    description: "Nombre maximum d'utilisations",
    example: 100,
  })
  maxUses?: number;

  @ApiProperty({
    description: "Nombre d'utilisations actuelles",
    example: 25,
  })
  usedCount: number;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

// DTO pour le résultat de l'application d'un code promo
export class ApplyDiscountResultDto {
  @ApiProperty({
    description: 'Code promo appliqué',
    example: 'SUMMER2024',
  })
  code: string;

  @ApiProperty({
    description: 'Type de remise',
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  type: DiscountType;

  @ApiProperty({
    description: 'Valeur de la remise',
    example: 20,
  })
  value: number;

  @ApiProperty({
    description: 'Montant original (avant remise)',
    example: 150,
  })
  originalAmount: number;

  @ApiProperty({
    description: 'Montant de la remise',
    example: 30,
  })
  discountAmount: number;

  @ApiProperty({
    description: 'Montant final (après remise)',
    example: 120,
  })
  finalAmount: number;

  @ApiProperty({
    description: 'Message de confirmation',
    example: 'Code promo appliqué avec succès ! Vous économisez 30 TND',
  })
  message: string;
}

// DTO pour la validation d'un code promo
export class DiscountValidationDto {
  @ApiProperty({
    description: 'Code valide ou non',
    example: true,
  })
  isValid: boolean;

  @ApiProperty({
    description: 'Code promo',
    example: 'SUMMER2024',
  })
  code: string;

  @ApiPropertyOptional({
    description: 'Message explicatif',
    example: 'Code promo valide',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Détails du code promo si valide',
    type: DiscountResponseDto,
  })
  discount?: DiscountResponseDto;
}

// DTO pour la réponse paginée des codes promo
export class PaginatedDiscountsResponseDto {
  @ApiProperty({
    description: 'Liste des codes promo',
    type: [DiscountResponseDto],
  })
  data: DiscountResponseDto[];

  @ApiProperty({
    description: 'Métadonnées de pagination',
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
