import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  productId: string;

  @ApiProperty({ example: 'Produit Test' })
  productName: string;

  @ApiProperty({ example: 'Description du produit' })
  productDescription?: string;

  @ApiProperty({ example: '150.50' })
  productPrice: string; // Decimal en string pour JSON

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  productImage?: string;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiProperty({ example: '301.00' })
  subtotal: string; // Decimal en string

  @ApiProperty({ example: 10 })
  productStock: number;
}
