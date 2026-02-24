import { ApiProperty } from '@nestjs/swagger';

export class CategoryRevenueDto {
  @ApiProperty({ description: 'ID de la catégorie' })
  categoryId: string;

  @ApiProperty({ description: 'Nom de la catégorie', example: 'Électronique' })
  categoryName: string;

  @ApiProperty({ description: 'Chiffre d\'affaires', example: 8500.5 })
  revenue: number;

  @ApiProperty({ description: 'Nombre de ventes', example: 85 })
  salesCount: number;

  @ApiProperty({ description: 'Pourcentage du CA total', example: 35.5 })
  percentage: number;
}

export class RevenueByCategoryResponseDto {
  @ApiProperty({ description: 'CA par catégorie', type: [CategoryRevenueDto] })
  data: CategoryRevenueDto[];

  @ApiProperty({ description: 'Chiffre d\'affaires total', example: 25000.0 })
  totalRevenue: number;
}
