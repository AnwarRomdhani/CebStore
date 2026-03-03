import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({ description: 'ID du client' })
  id: string;

  @ApiProperty({ description: 'Email', example: 'client@example.com' })
  email: string;

  @ApiProperty({ description: 'Prénom', example: 'Mohamed', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Nom', example: 'Ben Ali', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Nombre de commandes', example: 15 })
  ordersCount: number;

  @ApiProperty({ description: 'Dépenses totales', example: 2500.75 })
  totalSpent: number;

  @ApiProperty({ description: 'Date de la dernière commande' })
  lastOrderDate: Date;
}

export class TopCustomersResponseDto {
  @ApiProperty({
    description: 'Liste des meilleurs clients',
    type: [CustomerDto],
  })
  data: CustomerDto[];

  @ApiProperty({ description: 'Nombre total de clients', example: 100 })
  total: number;
}
