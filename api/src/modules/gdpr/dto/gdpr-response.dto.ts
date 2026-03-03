import { ApiProperty } from '@nestjs/swagger';

export class PersonalDataDto {
  @ApiProperty({ description: 'ID de lutilisateur' })
  id: string;

  @ApiProperty({ description: 'Email' })
  email: string;

  @ApiProperty({ description: 'Prénom', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Nom', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Rôle' })
  role: string;

  @ApiProperty({ description: 'Date dinscription' })
  createdAt: Date;

  @ApiProperty({ description: 'Nombre de commandes', type: Number })
  ordersCount: number;

  @ApiProperty({ description: 'Nombre davis', type: Number })
  reviewsCount: number;

  @ApiProperty({ description: 'Données complètes au format JSON' })
  rawData: Record<string, any>;
}

export class DataExportResponseDto {
  @ApiProperty({ description: 'Données personnelles exportées' })
  data: PersonalDataDto;

  @ApiProperty({ description: 'Date dexport' })
  exportedAt: Date;

  @ApiProperty({ description: 'Format', example: 'JSON' })
  format: string;
}

export class DeleteAccountResponseDto {
  @ApiProperty({ description: 'Message de confirmation' })
  message: string;

  @ApiProperty({ description: 'Date de suppression' })
  deletedAt: Date;

  @ApiProperty({ description: 'Délai de rétractation (jours)', example: 30 })
  retractationPeriodDays: number;
}
