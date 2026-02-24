import { ApiProperty } from '@nestjs/swagger';

export class ProductStatsDto {
  @ApiProperty({ description: 'Nombre total de produits', example: 250 })
  totalProducts: number;

  @ApiProperty({ description: 'Produits actifs', example: 230 })
  activeProducts: number;

  @ApiProperty({ description: 'Produits inactifs', example: 20 })
  inactiveProducts: number;

  @ApiProperty({ description: 'Valeur totale du stock', example: 50000.0 })
  totalStockValue: number;
}

export class ProductListItemDto {
  @ApiProperty({ description: 'ID du produit' })
  id: string;

  @ApiProperty({ description: 'Nom du produit', example: 'Produit X' })
  name: string;

  @ApiProperty({ description: 'SKU', example: 'PROD-001' })
  sku: string;

  @ApiProperty({ description: 'Prix', example: 99.99 })
  price: number;

  @ApiProperty({ description: 'Stock actuel', example: 50 })
  stock: number;

  @ApiProperty({ description: 'Statut actif', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Nom de la catégorie', example: 'Électronique' })
  categoryName: string;

  @ApiProperty({ description: 'Nombre de ventes', example: 120 })
  salesCount: number;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;
}

export class ProductsListResponseDto {
  @ApiProperty({ description: 'Liste des produits', type: [ProductListItemDto] })
  data: ProductListItemDto[];

  @ApiProperty({ description: 'Nombre total', example: 250 })
  total: number;

  @ApiProperty({ description: 'Page actuelle', example: 1 })
  page: number;

  @ApiProperty({ description: 'Limite par page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Nombre total de pages', example: 13 })
  totalPages: number;
}

export class StockAlertDto {
  @ApiProperty({ description: 'ID du produit' })
  productId: string;

  @ApiProperty({ description: 'Nom du produit', example: 'Produit X' })
  productName: string;

  @ApiProperty({ description: 'SKU', example: 'PROD-001' })
  sku: string;

  @ApiProperty({ description: 'Stock actuel', example: 3 })
  currentStock: number;

  @ApiProperty({ description: 'Seuil d\'alerte', example: 10 })
  alertThreshold: number;

  @ApiProperty({ description: 'Statut', enum: ['LOW_STOCK', 'OUT_OF_STOCK'] })
  status: 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export class StockAlertsResponseDto {
  @ApiProperty({ description: 'Alertes de stock', type: [StockAlertDto] })
  alerts: StockAlertDto[];

  @ApiProperty({ description: 'Nombre total d\'alertes', example: 7 })
  total: number;
}
