import { ApiProperty } from '@nestjs/swagger';

export class DashboardSummaryDto {
  @ApiProperty({ description: 'Chiffre daffaires du jour', example: 1250.5 })
  todayRevenue: number;

  @ApiProperty({ description: 'Commandes du jour', example: 15 })
  todayOrders: number;

  @ApiProperty({ description: 'Commandes en attente', example: 8 })
  pendingOrders: number;

  @ApiProperty({ description: 'Nouveaux clients du mois', example: 45 })
  newCustomersThisMonth: number;

  @ApiProperty({ description: 'Produits en stock faible', example: 5 })
  lowStockProducts: number;

  @ApiProperty({ description: 'Produits en rupture de stock', example: 2 })
  outOfStockProducts: number;
}

export class RecentOrderDto {
  @ApiProperty({ description: 'ID de la commande' })
  id: string;

  @ApiProperty({ description: 'Numéro de commande', example: 'cmd-12345' })
  orderNumber: string;

  @ApiProperty({ description: 'Nom du client', example: 'Mohamed Ben Ali' })
  customerName: string;

  @ApiProperty({
    description: 'Email du client',
    example: 'client@example.com',
  })
  customerEmail: string;

  @ApiProperty({ description: 'Montant total', example: 250.75 })
  totalAmount: number;

  @ApiProperty({ description: 'Statut', example: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'Résumé des KPIs', type: DashboardSummaryDto })
  summary: DashboardSummaryDto;

  @ApiProperty({ description: 'Dernières commandes', type: [RecentOrderDto] })
  recentOrders: RecentOrderDto[];

  @ApiProperty({ description: 'Ventes des 7 derniers jours', type: 'array' })
  last7DaysSales: Array<{ date: string; revenue: number; orders: number }>;

  @ApiProperty({ description: 'Top catégories', type: 'array' })
  topCategories: Array<{ name: string; revenue: number }>;
}
