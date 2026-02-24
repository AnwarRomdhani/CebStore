import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderStatsDto {
  @ApiProperty({ description: 'Nombre total de commandes', example: 1500 })
  totalOrders: number;

  @ApiProperty({ description: 'Commandes en attente', example: 25 })
  pendingOrders: number;

  @ApiProperty({ description: 'Commandes en traitement', example: 15 })
  processingOrders: number;

  @ApiProperty({ description: 'Commandes expédiées', example: 50 })
  shippedOrders: number;

  @ApiProperty({ description: 'Commandes livrées', example: 1350 })
  deliveredOrders: number;

  @ApiProperty({ description: 'Commandes annulées', example: 60 })
  cancelledOrders: number;

  @ApiProperty({ description: 'Taux d\'annulation (%)', example: 4.0 })
  cancellationRate: number;
}

export class OrderListItemDto {
  @ApiProperty({ description: 'ID de la commande' })
  id: string;

  @ApiProperty({ description: 'Numéro de commande', example: 'cmd-12345' })
  orderNumber: string;

  @ApiProperty({ description: 'Nom du client', example: 'Mohamed Ben Ali' })
  customerName: string;

  @ApiProperty({ description: 'Email du client', example: 'client@example.com' })
  customerEmail: string;

  @ApiProperty({ description: 'Nombre d\'articles', example: 3 })
  itemsCount: number;

  @ApiProperty({ description: 'Montant total', example: 250.75 })
  totalAmount: number;

  @ApiProperty({ description: 'Statut', enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;
}

export class OrdersListResponseDto {
  @ApiProperty({ description: 'Liste des commandes', type: [OrderListItemDto] })
  data: OrderListItemDto[];

  @ApiProperty({ description: 'Nombre total', example: 1500 })
  total: number;

  @ApiProperty({ description: 'Page actuelle', example: 1 })
  page: number;

  @ApiProperty({ description: 'Limite par page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Nombre total de pages', example: 75 })
  totalPages: number;
}
