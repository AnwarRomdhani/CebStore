import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderStatusItemDto {
  @ApiProperty({ description: 'Statut de commande', enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ description: 'Nombre de commandes', example: 25 })
  count: number;

  @ApiProperty({ description: 'Pourcentage du total', example: 16.67 })
  percentage: number;
}

export class OrdersByStatusResponseDto {
  @ApiProperty({
    description: 'Répartition par statut',
    type: [OrderStatusItemDto],
  })
  data: OrderStatusItemDto[];

  @ApiProperty({ description: 'Nombre total de commandes', example: 150 })
  total: number;
}
