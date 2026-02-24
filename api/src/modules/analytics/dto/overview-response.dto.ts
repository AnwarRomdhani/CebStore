import { ApiProperty } from '@nestjs/swagger';

export class OverviewResponseDto {
  @ApiProperty({ description: 'Chiffre d\'affaires total', example: 15000.5 })
  totalRevenue: number;

  @ApiProperty({ description: 'Nombre total de commandes', example: 150 })
  totalOrders: number;

  @ApiProperty({ description: 'Nombre total de clients', example: 85 })
  totalCustomers: number;

  @ApiProperty({ description: 'Nombre de nouveaux clients', example: 12 })
  newCustomers: number;

  @ApiProperty({ description: 'Valeur moyenne des commandes', example: 100.03 })
  avgOrderValue: number;

  @ApiProperty({ description: 'Nombre de produits vendus', example: 450 })
  totalProductsSold: number;

  @ApiProperty({ description: 'Taux de conversion (commandes/visiteurs)', example: 3.5 })
  conversionRate?: number;

  @ApiProperty({ description: 'Période analysée', example: 'month' })
  period: string;

  @ApiProperty({ description: 'Date de début de la période' })
  startDate: Date;

  @ApiProperty({ description: 'Date de fin de la période' })
  endDate: Date;
}
