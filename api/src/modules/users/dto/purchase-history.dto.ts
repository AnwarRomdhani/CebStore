import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Produit purchased dans l\'historique
export class PurchasedProductDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'product-uuid-123',
  })
  productId: string;

  @ApiProperty({
    description: 'Nom du produit',
    example: 'iPhone 15 Pro Max',
  })
  productName: string;

  @ApiProperty({
    description: 'SKU du produit',
    example: 'IPHONE-15-PRO-MAX',
  })
  sku: string;

  @ApiProperty({
    description: 'Quantité achetée',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Prix unitaire (TND)',
    example: 1299.99,
  })
  pricePerUnit: number;

  @ApiProperty({
    description: 'Sous-total (TND)',
    example: 1299.99,
  })
  subtotal: number;

  @ApiPropertyOptional({
    description: 'Image du produit',
    example: 'https://example.com/product.jpg',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Catégorie du produit',
    example: 'Smartphones',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'URL du produit',
    example: '/products/iphone-15-pro-max',
  })
  productUrl?: string;
}

// Produit le plus acheté
export class TopPurchasedProductDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'product-uuid-123',
  })
  productId: string;

  @ApiProperty({
    description: 'Nom du produit',
    example: 'iPhone 15 Pro Max',
  })
  productName: string;

  @ApiProperty({
    description: 'Quantité achetée',
    example: 3,
  })
  quantityPurchased: number;

  @ApiProperty({
    description: 'Total dépensé sur ce produit (TND)',
    example: 3899.97,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Nombre de commandes contenant ce produit',
    example: 2,
  })
  orderCount: number;
}

// Résumé d\'une commande dans l\'historique
export class PurchaseHistoryItemDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  orderId: string;

  @ApiProperty({
    description: 'Numéro de commande',
    example: 'ORD-12345',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Date de la commande',
    example: '2024-01-15T10:30:00Z',
  })
  orderDate: string;

  @ApiProperty({
    description: 'Statut de la commande',
    enum: {
      PENDING: 'PENDING',
      PROCESSING: 'PROCESSING',
      SHIPPED: 'SHIPPED',
      DELIVERED: 'DELIVERED',
      CANCELLED: 'CANCELLED',
    },
    example: 'DELIVERED',
  })
  status: string;

  @ApiProperty({
    description: 'Nombre de produits',
    example: 3,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Montant total (TND)',
    example: 299.97,
  })
  totalAmount: number;

  @ApiProperty({
    description: 'Produits commandés',
    type: [PurchasedProductDto],
  })
  products: PurchasedProductDto[];

  @ApiPropertyOptional({
    description: 'Lien de suivi de livraison',
    example: 'https://fedex.com/track/CH123456789',
  })
  trackingUrl?: string;

  @ApiPropertyOptional({
    description: 'Numéro de suivi',
    example: 'CH123456789',
  })
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Mode de paiement',
    example: 'Flouci',
  })
  paymentMethod?: string;
}

// Statistiques d\'achat de l\'utilisateur
export class PurchaseStatsDto {
  @ApiProperty({
    description: 'Nombre total de commandes',
    example: 15,
  })
  totalOrders: number;

  @ApiProperty({
    description: 'Total dépensé (TND)',
    example: 4500.0,
  })
  totalSpent: number;

  @ApiProperty({
    description: 'Panier moyen (TND)',
    example: 300.0,
  })
  averageOrderValue: number;

  @ApiProperty({
    description: 'Première commande',
    example: '2023-06-15T10:00:00Z',
  })
  firstOrderDate: string;

  @ApiProperty({
    description: 'Dernière commande',
    example: '2024-01-15T10:30:00Z',
  })
  lastOrderDate: string;

  @ApiProperty({
    description: 'Produits différents achetés',
    example: 25,
  })
  uniqueProducts: number;

  @ApiProperty({
    description: 'Catégories achetées',
    type: [String],
    example: ['Smartphones', 'Accessoires', 'Tablettes'],
  })
  categoriesPurchased: string[];

  @ApiProperty({
    description: 'Marques achetées',
    type: [String],
    example: ['Apple', 'Samsung', 'Sony'],
  })
  brandsPurchased: string[];

  @ApiProperty({
    description: 'Produits les plus achetés',
    type: [TopPurchasedProductDto],
  })
  topProducts: TopPurchasedProductDto[];
}

// Période d\'historique demandée
export enum HistoryPeriod {
  LAST_30_DAYS = '30d',
  LAST_90_DAYS = '90d',
  LAST_YEAR = '1y',
  ALL_TIME = 'all',
}

// Paramètres pour l\'historique d\'achat
export class PurchaseHistoryQueryDto {
  @ApiPropertyOptional({
    description: 'Période',
    enum: HistoryPeriod,
    example: HistoryPeriod.LAST_YEAR,
  })
  period?: HistoryPeriod;

  @ApiPropertyOptional({
    description: 'Statut de commande',
    enum: {
      PENDING: 'PENDING',
      PROCESSING: 'PROCESSING',
      SHIPPED: 'SHIPPED',
      DELIVERED: 'DELIVERED',
      CANCELLED: 'CANCELLED',
    },
    example: 'DELIVERED',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Numéro de page',
    example: 1,
  })
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Nombre d'éléments par page",
    example: 10,
  })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Trier par date',
    enum: { ASC: 'asc', DESC: 'desc' },
    example: 'DESC',
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// Réponse paginée de l\'historique d\'achat
export class PurchaseHistoryResponseDto {
  @ApiProperty({
    description: 'Liste des commandes',
    type: [PurchaseHistoryItemDto],
  })
  orders: PurchaseHistoryItemDto[];

  @ApiProperty({
    description: 'Métadonnées de pagination',
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiPropertyOptional({
    description: "Statistiques de l'utilisateur",
    type: PurchaseStatsDto,
  })
  stats?: PurchaseStatsDto;
}

// Produit recommandé basé sur l\'historique
export class RecommendedProductDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'product-uuid-456',
  })
  productId: string;

  @ApiProperty({
    description: 'Nom du produit',
    example: 'iPhone 15 Pro Case',
  })
  productName: string;

  @ApiProperty({
    description: 'Prix (TND)',
    example: 49.99,
  })
  price: number;

  @ApiProperty({
    description: 'Score de recommandation (0-1)',
    example: 0.85,
  })
  recommendationScore: number;

  @ApiProperty({
    description: 'Raison de la recommandation',
    example: 'Produits fréquemment achetés ensemble',
  })
  reason: string;

  @ApiPropertyOptional({
    description: 'Image du produit',
    example: 'https://example.com/case.jpg',
  })
  imageUrl?: string;
}

// Produit à racheter
export class ReorderProductDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'product-uuid-123',
  })
  productId: string;

  @ApiProperty({
    description: 'Quantité lors du dernier achat',
    example: 1,
  })
  lastQuantity: number;

  @ApiProperty({
    description: 'Prix actuel (TND)',
    example: 1299.99,
  })
  currentPrice: number;

  @ApiProperty({
    description: 'Prix payé lors du dernier achat (TND)',
    example: 1199.99,
  })
  lastPrice: number;

  @ApiPropertyOptional({
    description: 'Prix a augmenté',
    example: true,
  })
  priceIncreased?: boolean;

  @ApiPropertyOptional({
    description: 'Disponibilité',
    example: true,
  })
  inStock?: boolean;
}
