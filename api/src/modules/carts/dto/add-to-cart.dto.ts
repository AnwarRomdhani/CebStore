import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID du produit à ajouter au panier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Quantité du produit',
    minimum: 1,
    maximum: 99,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number = 1;
}
