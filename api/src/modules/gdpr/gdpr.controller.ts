import {
  Controller,
  Get,
  Delete,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GdprService } from './gdpr.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('gdpr')
@Controller('gdpr')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class GdprController {
  constructor(private readonly gdprService: GdprService) {}

  // Exporter mes données personnelles
  @Get('export')
  @ApiOperation({
    summary: 'Exporter mes données personnelles',
    description:
      'Téléchargez toutes vos données personnelles (Conformité RGPD - Article 15)',
  })
  @ApiResponse({
    status: 200,
    description: 'Données exportées avec succès',
  })
  async exportData(@GetUser('id') userId: string) {
    return this.gdprService.exportPersonalData(userId);
  }

  // Résumé des données stockées
  @Get('summary')
  @ApiOperation({
    summary: 'Résumé des données stockées',
    description:
      'Voir quelles données sont stockées et leur durée de conservation',
  })
  @ApiResponse({
    status: 200,
    description: 'Résumé des données',
  })
  async getDataSummary(@GetUser('id') userId: string) {
    return this.gdprService.getDataSummary(userId);
  }

  // Modifier mes données personnelles
  @Patch('update')
  @ApiOperation({
    summary: 'Modifier mes données personnelles',
    description:
      'Mettez à jour vos informations (Conformité RGPD - Article 16)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'nouvel.email@example.com' },
        firstName: { type: 'string', example: 'Jean' },
        lastName: { type: 'string', example: 'Dupont' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Données mises à jour',
  })
  async updateData(
    @GetUser('id') userId: string,
    @Body() data: { email?: string; firstName?: string; lastName?: string },
  ) {
    return this.gdprService.updatePersonalData(userId, data);
  }

  // Supprimer mon compte (droit à l'oubli)
  @Delete('delete-account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer mon compte',
    description:
      'Demandez la suppression de votre compte et de vos données (Conformité RGPD - Article 17)',
  })
  @ApiResponse({
    status: 200,
    description: 'Compte supprimé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Des commandes sont en cours',
  })
  async deleteAccount(@GetUser('id') userId: string) {
    return this.gdprService.deleteAccount(userId);
  }

  // Informations sur la conformité RGPD
  @Get('info')
  @ApiOperation({
    summary: 'Informations RGPD',
    description: 'Politique de confidentialité et droits des utilisateurs',
  })
  @ApiResponse({
    status: 200,
    description: 'Informations RGPD',
  })
  getGdprInfo() {
    return {
      title: 'Politique de Confidentialité - Cebstore',
      lastUpdated: '2026-02-17',
      rights: [
        {
          article: 'Article 15',
          right: 'Droit daccès',
          description: 'Vous pouvez accéder à toutes vos données personnelles',
          endpoint: 'GET /gdpr/export',
        },
        {
          article: 'Article 16',
          right: 'Droit de rectification',
          description: 'Vous pouvez modifier vos informations personnelles',
          endpoint: 'PATCH /gdpr/update',
        },
        {
          article: 'Article 17',
          right: 'Droit à leffacement',
          description: 'Vous pouvez demander la suppression de votre compte',
          endpoint: 'DELETE /gdpr/delete-account',
        },
        {
          article: 'Article 20',
          right: 'Droit à la portabilité',
          description: 'Vos données sont exportables au format JSON',
          endpoint: 'GET /gdpr/export',
        },
      ],
      dataRetention: {
        orders: '10 ans (obligation légale comptable)',
        reviews: 'Durée de vie du compte + 3 ans',
        analytics: '3 ans',
        logs: '1 an',
      },
      contact: {
        dpo: 'dpo@cebstore.com',
        address: 'Tunisie',
      },
    };
  }
}
