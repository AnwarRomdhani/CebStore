import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class OverviewQueryDto {
  @ApiPropertyOptional({
    description: 'Période d\'analyse',
    enum: ['day', 'week', 'month', 'year'],
    default: 'month',
  })
  @IsOptional()
  @IsString()
  period?: 'day' | 'week' | 'month' | 'year' = 'month';
}

export class SalesTrendQueryDto {
  @ApiPropertyOptional({
    description: 'Date de début (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Date de fin (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Groupement temporel',
    enum: ['day', 'week', 'month'],
    default: 'day',
  })
  @IsOptional()
  @IsString()
  groupBy?: 'day' | 'week' | 'month' = 'day';
}

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Limite de résultats', example: 10, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
