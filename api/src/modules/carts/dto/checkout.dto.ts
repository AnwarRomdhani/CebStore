import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckoutDto {
  @ApiPropertyOptional({
    description: 'ID du panier (si non fourni, utilise le panier actif)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  cartId?: string;

  @ApiPropertyOptional({
    description: 'Code promo (si applicable)',
    example: 'PROMO2024',
  })
  @IsOptional()
  @IsString()
  discountCode?: string;

  @ApiProperty({
    description: 'Adresse de livraison',
    example: '123 Rue de Tunis, Tunis 1000',
  })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @ApiProperty({
    description: 'Méthode de paiement',
    example: 'flouci',
    enum: ['flouci', 'cash_on_delivery'],
  })
  @IsNotEmpty()
  @IsString()
  paymentMethod: 'flouci' | 'cash_on_delivery';

  @ApiPropertyOptional({
    description: 'Notes supplémentaires',
    example: 'Laisser le colis à la porte',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
