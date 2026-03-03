import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserStatsDto {
  @ApiProperty({ description: 'Nombre total dutilisateurs', example: 500 })
  totalUsers: number;

  @ApiProperty({ description: 'Nouveaux utilisateurs aujourdhui', example: 5 })
  newToday: number;

  @ApiProperty({
    description: 'Nouveaux utilisateurs cette semaine',
    example: 35,
  })
  newThisWeek: number;

  @ApiProperty({
    description: 'Nouveaux utilisateurs ce mois-ci',
    example: 150,
  })
  newThisMonth: number;

  @ApiProperty({ description: 'Répartition par rôle', type: Object })
  byRole: Record<Role, number>;
}

export class UserListItemDto {
  @ApiProperty({ description: 'ID de lutilisateur' })
  id: string;

  @ApiProperty({ description: 'Email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Prénom', example: 'Mohamed', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Nom', example: 'Ben Ali', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Rôle', enum: Role })
  role: Role;

  @ApiProperty({ description: 'Nombre de commandes', example: 12 })
  ordersCount: number;

  @ApiProperty({ description: 'Dépenses totales', example: 1500.5 })
  totalSpent: number;

  @ApiProperty({ description: 'Date dinscription' })
  createdAt: Date;

  @ApiProperty({ description: 'Dernière connexion', required: false })
  lastLoginAt?: Date;
}

export class UsersListResponseDto {
  @ApiProperty({
    description: 'Liste des utilisateurs',
    type: [UserListItemDto],
  })
  data: UserListItemDto[];

  @ApiProperty({ description: 'Nombre total', example: 500 })
  total: number;

  @ApiProperty({ description: 'Page actuelle', example: 1 })
  page: number;

  @ApiProperty({ description: 'Limite par page', example: 20 })
  limit: number;

  @ApiProperty({ description: 'Nombre total de pages', example: 25 })
  totalPages: number;
}
