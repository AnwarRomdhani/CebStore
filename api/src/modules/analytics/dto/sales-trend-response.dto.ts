import { ApiProperty } from '@nestjs/swagger';

export class SalesTrendItemDto {
  @ApiProperty({
    description: 'Période (jour/semaine/mois)',
    example: '2024-01',
  })
  period: string;

  @ApiProperty({ description: "Chiffre d'affaires", example: 5000.75 })
  revenue: number;

  @ApiProperty({ description: 'Nombre de commandes', example: 45 })
  orders: number;

  @ApiProperty({ description: 'Nombre de clients', example: 30 })
  customers?: number;

  @ApiProperty({ description: 'Panier moyen', example: 111.24 })
  avgOrderValue?: number;
}

export class SalesTrendResponseDto {
  @ApiProperty({
    description: 'Données de tendance',
    type: [SalesTrendItemDto],
  })
  data: SalesTrendItemDto[];

  @ApiProperty({ description: 'Période de début' })
  startDate: Date;

  @ApiProperty({ description: 'Période de fin' })
  endDate: Date;

  @ApiProperty({ description: 'Groupement temporel', example: 'day' })
  groupBy: 'day' | 'week' | 'month';

  @ApiProperty({ description: 'Chiffre daffaires total', example: 50000.0 })
  totalRevenue: number;

  @ApiProperty({ description: 'Nombre total de commandes', example: 450 })
  totalOrders: number;
}
