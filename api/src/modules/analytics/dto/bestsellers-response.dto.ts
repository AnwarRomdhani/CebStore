import { ApiProperty } from '@nestjs/swagger';

export class ProductSalesDto {
  @ApiProperty({ description: 'ID du produit' })
  productId: string;

  @ApiProperty({ description: 'Nom du produit', example: 'Produit X' })
  productName: string;

  @ApiProperty({ description: 'Prix unitaire', example: 99.99 })
  price: number;

  @ApiProperty({ description: 'Quantité vendue', example: 150 })
  quantitySold: number;

  @ApiProperty({ description: 'Chiffre d\'affaires généré', example: 14998.5 })
  revenue: number;

  @ApiProperty({ description: 'URL de l\'image', example: 'https://example.com/image.jpg', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Nom de la catégorie', example: 'Électronique' })
  categoryName?: string;
}

export class BestSellersResponseDto {
  @ApiProperty({ description: 'Liste des produits les plus vendus', type: [ProductSalesDto] })
  data: ProductSalesDto[];

  @ApiProperty({ description: 'Nombre total de produits', example: 10 })
  total: number;
}
