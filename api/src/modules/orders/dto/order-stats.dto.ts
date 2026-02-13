/**
 * DTO pour les statistiques de ventes
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Revenus par jour
 */
export class DailyRevenueDto {
  @ApiProperty({
    description: 'Date',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Nombre de commandes',
    example: 10,
  })
  orders: number;

  @ApiProperty({
    description: 'Revenus (TND)',
    example: 1000.50,
  })
  revenue: number;

  @ApiProperty({
    description: 'Produits vendus',
    example: 25,
  })
  productsSold: number;
}

/**
 * Produit le plus vendu
 */
export class TopProductDto {
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
    description: 'Nombre vendu',
    example: 50,
  })
  quantitySold: number;

  @ApiProperty({
    description: 'Revenus générés (TND)',
    example: 65000.00,
  })
  revenue: number;

  @ApiProperty({
    description: 'Image du produit',
    example: 'https://example.com/image.jpg',
  })
  imageUrl?: string;
}

/**
 * Catégorie la plus vendus
 */
export class TopCategoryDto {
  @ApiProperty({
    description: 'ID de la catégorie',
    example: 'category-uuid-123',
  })
  categoryId: string;

  @ApiProperty({
    description: 'Nom de la catégorie',
    example: 'Smartphones',
  })
  categoryName: string;

  @ApiProperty({
    description: 'Nombre de produits vendus',
    example: 100,
  })
  quantitySold: number;

  @ApiProperty({
    description: 'Revenus (TND)',
    example: 50000.00,
  })
  revenue: number;
}

/**
 * Statistiques de ventes agrégées
 */
export class SalesStatsDto {
  @ApiProperty({
    description: 'Période des statistiques',
    example: '2024-01',
  })
  period: string;

  @ApiProperty({
    description: 'Nombre de commandes',
    example: 150,
  })
  totalOrders: number;

  @ApiProperty({
    description: 'Revenus totaux (TND)',
    example: 15000.50,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Nombre de produits vendus',
    example: 350,
  })
  totalProductsSold: number;

  @ApiProperty({
    description: 'Panier moyen (TND)',
    example: 100.00,
  })
  averageOrderValue: number;

  @ApiProperty({
    description: 'Taux de conversion (%)',
    example: 3.5,
  })
  conversionRate: number;

  @ApiProperty({
    description: 'Revenus par jour',
    type: [DailyRevenueDto],
  })
  dailyRevenue: DailyRevenueDto[];

  @ApiProperty({
    description: 'Produits les plus vendus',
    type: [TopProductDto],
  })
  topProducts: TopProductDto[];

  @ApiProperty({
    description: 'Catégories les plus vendues',
    type: [TopCategoryDto],
  })
  topCategories: TopCategoryDto[];
}

/**
 * Statistiques en temps réel
 */
export class RealTimeStatsDto {
  @ApiProperty({
    description: 'Commandes aujourd\'hui',
    example: 15,
  })
  ordersToday: number;

  @ApiProperty({
    description: 'Revenus aujourd\'hui (TND)',
    example: 1500.00,
  })
  revenueToday: number;

  @ApiProperty({
    description: 'Commandes en attente',
    example: 5,
  })
  pendingOrders: number;

  @ApiProperty({
    description: 'Commandes en cours de livraison',
    example: 10,
  })
  inDeliveryOrders: number;

  @ApiProperty({
    description: 'Commandes livrées aujourd\'hui',
    example: 8,
  })
  deliveredToday: number;

  @ApiProperty({
    description: 'Panier moyen aujourd\'hui',
    example: 100.00,
  })
  averageCartToday: number;

  @ApiProperty({
    description: 'Taux de conversion du jour (%)',
    example: 4.2,
  })
  conversionRateToday: number;
}

/**
 * Statistiques par période
 */
export class PeriodStatsDto {
  @ApiProperty({
    description: 'Date de début',
    example: '2024-01-01',
  })
  startDate: string;

  @ApiProperty({
    description: 'Date de fin',
    example: '2024-01-31',
  })
  endDate: string;

  @ApiProperty({
    description: 'Nombre de nouvelles commandes',
    example: 100,
  })
  newOrders: number;

  @ApiProperty({
    description: 'Commandes complétées',
    example: 90,
  })
  completedOrders: number;

  @ApiProperty({
    description: 'Commandes annulées',
    example: 5,
  })
  cancelledOrders: number;

  @ApiProperty({
    description: 'Commandes en attente',
    example: 5,
  })
  pendingOrders: number;

  @ApiProperty({
    description: 'Revenus bruts (TND)',
    example: 15000.00,
  })
  grossRevenue: number;

  @ApiProperty({
    description: 'Remises accordées (TND)',
    example: 500.00,
  })
  discountsApplied: number;

  @ApiProperty({
    description: 'Revenus nets (TND)',
    example: 14500.00,
  })
  netRevenue: number;

  @ApiProperty({
    description: 'Revenus moyens par commande (TND)',
    example: 145.00,
  })
  averageOrderValue: number;

  @ApiProperty({
    description: 'Produits les plus vendus',
    type: [TopProductDto],
  })
  topProducts: TopProductDto[];
}

/**
 * Paramètres pour les statistiques
 */
export class StatsQueryDto {
  @ApiProperty({
    description: 'Date de début',
    example: '2024-01-01',
  })
  startDate: string;

  @ApiProperty({
    description: 'Date de fin',
    example: '2024-01-31',
  })
  endDate: string;

  @ApiPropertyOptional({
    description: 'Granularité',
    enum: ['day', 'week', 'month'],
    example: 'day',
  })
  granularity?: 'day' | 'week' | 'month';

  @ApiPropertyOptional({
    description: 'ID de la catégorie',
    example: 'category-uuid-123',
  })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID du produit',
    example: 'product-uuid-123',
  })
  productId?: string;
}