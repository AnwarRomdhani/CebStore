/**
 * Controller Flouci Payments
 * @description Expose les endpoints REST pour les paiements Flouci
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FlouciService } from './flouci.service';
import { FlouciWebhookService } from './flouci.webhook.service';
import {
  InitiatePaymentDto,
  VerifyPaymentDto,
  TestWalletPaymentDto,
} from './dto/initiate-payment.dto';
import type { FlouciWebhookData } from './flouci.types';
import {
  PaymentInitiationResponseDto,
  PaymentVerificationResponseDto,
  WebhookResponseDto,
  PaymentStatusResponseDto,
  TestModeConfigResponseDto,
} from './dto/payment-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('payments')
@Controller('payments/flouci')
export class FlouciController {
  constructor(
    private readonly flouciService: FlouciService,
    private readonly webhookService: FlouciWebhookService,
  ) {}

  /**
   * Initier un paiement
   */
  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Initier un paiement',
    description: 'Génère un lien de paiement Flouci pour une commande',
  })
  @ApiBody({ type: InitiatePaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Paiement initié avec succès',
    type: PaymentInitiationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 404,
    description: 'Commande non trouvée',
  })
  async initiatePayment(
    @GetUser() user: User,
    @Body() dto: InitiatePaymentDto,
  ): Promise<PaymentInitiationResponseDto> {
    return this.flouciService.initiatePayment(dto);
  }

  /**
   * Webhook pour les notifications de paiement
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook Flouci',
    description: 'Endpoint pour recevoir les notifications de paiement',
  })
  @ApiBody({ type: Object }) // Using Object as FlouciWebhookData is a type alias
  @ApiResponse({
    status: 200,
    description: 'Webhook traité',
    type: WebhookResponseDto,
  })
  async handleWebhook(
    @Body() dto: FlouciWebhookData,
    @Headers('x-flouci-signature') signature?: string,
  ): Promise<WebhookResponseDto> {
    return this.webhookService.processWebhook(dto, signature);
  }

  /**
   * Vérifier le statut d\'un paiement
   */
  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Vérifier le statut d'un paiement",
  })
  @ApiBody({ type: VerifyPaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Statut du paiement',
    type: PaymentVerificationResponseDto,
  })
  async verifyPayment(
    @Body() dto: VerifyPaymentDto,
  ): Promise<PaymentVerificationResponseDto> {
    return this.flouciService.verifyPayment(dto);
  }

  /**
   * Obtenir le statut complet d\'un paiement
   */
  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Obtenir le statut d'un paiement",
  })
  @ApiParam({
    name: 'orderId',
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Statut du paiement',
    type: PaymentStatusResponseDto,
  })
  async getPaymentStatus(
    @Param('orderId') orderId: string,
  ): Promise<PaymentStatusResponseDto> {
    return this.flouciService.getPaymentStatus(orderId);
  }

  /**
   * Annuler un paiement
   */
  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Annuler un paiement',
    description: 'Annule un paiement en attente',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        trackingId: {
          type: 'string',
          description: 'ID de tracking du paiement',
          example: 'order-uuid-timestamp-random',
        },
      },
      required: ['trackingId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Paiement annulé',
  })
  async cancelPayment(
    @Body('trackingId') trackingId: string,
  ): Promise<{ message: string }> {
    return this.flouciService.cancelPayment(trackingId);
  }

  // ==================== ENDPOINTS DE TEST ====================

  /**
   * Simuler un paiement de test (sandbox)
   */
  @Post('test/simulate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Simuler un paiement de test (sandbox uniquement)',
    description: 'Utiliser 111111 pour succès, 000000 pour échec',
  })
  @ApiBody({ type: TestWalletPaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Paiement simulé',
    type: PaymentInitiationResponseDto,
  })
  async simulateTestPayment(
    @Body() dto: TestWalletPaymentDto,
  ): Promise<PaymentInitiationResponseDto> {
    return this.flouciService.simulateTestPayment(dto);
  }

  /**
   * Obtenir la configuration du mode test
   */
  @Get('test/config')
  @ApiOperation({
    summary: 'Configuration du mode test',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration du mode test',
    type: TestModeConfigResponseDto,
  })
  getTestConfig(): Promise<TestModeConfigResponseDto> {
    return Promise.resolve({
      sandboxEnabled: true,
      successWallet: '111111',
      failureWallet: '000000',
      instructions:
        'Utilisez le numéro de wallet 111111 pour simuler un paiement réussi, ou 000000 pour simuler un échec.',
    });
  }

  // ==================== ENDPOINTS ADMIN ====================

  /**
   * Obtenir les statistiques de paiement (Admin)
   */
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Statistiques de paiement (Admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques des paiements',
  })
  async getPaymentStats(): Promise<{
    totalPayments: number;
    completedPayments: number;
    failedPayments: number;
    pendingPayments: number;
    totalRevenue: number;
  }> {
    const [total, completed, failed, pending, revenue] = await Promise.all([
      this.flouciService['prisma'].payment.count(),
      this.flouciService['prisma'].payment.count({
        where: { status: 'COMPLETED' },
      }),
      this.flouciService['prisma'].payment.count({
        where: { status: 'FAILED' },
      }),
      this.flouciService['prisma'].payment.count({
        where: { status: 'PENDING' },
      }),
      this.flouciService['prisma'].payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalPayments: total,
      completedPayments: completed,
      failedPayments: failed,
      pendingPayments: pending,
      totalRevenue: Number(revenue._sum.amount) || 0,
    };
  }

  /**
   * [ADMIN] Liste des paiements
   */
  @Get('admin/payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Liste des paiements',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des paiements',
  })
  async getPayments(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.flouciService.getPayments(
      Number(page) || 1,
      Number(limit) || 20,
      status,
    );
  }

  /**
   * [ADMIN] Détail d'un paiement
   */
  @Get('admin/payments/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Détail d\'un paiement',
  })
  @ApiResponse({
    status: 200,
    description: 'Détail du paiement',
  })
  async getPaymentDetail(@Param('id') id: string) {
    return this.flouciService.getPaymentDetail(id);
  }

  /**
   * [ADMIN] Rembourser un paiement
   */
  @Post('admin/payments/:id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Rembourser un paiement',
  })
  @ApiResponse({
    status: 200,
    description: 'Remboursement effectué',
  })
  async refundPayment(
    @Param('id') id: string,
    @Body('amount') amount?: number,
    @Body('reason') reason?: string,
  ) {
    return this.flouciService.refundPayment(id, amount, reason);
  }

  /**
   * [ADMIN] Configuration Flouci
   */
  @Get('admin/config')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Configuration Flouci',
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration actuelle',
  })
  async getConfig() {
    return this.flouciService.getConfig();
  }

  /**
   * [ADMIN] Tendance des paiements
   */
  @Get('admin/trends')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Tendance des paiements',
  })
  @ApiResponse({
    status: 200,
    description: 'Tendance',
  })
  async getPaymentTrends(
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
  ) {
    return this.flouciService.getPaymentTrends(period);
  }
}
