/**
 * Controller des workflows n8n
 * @description Expose les endpoints REST pour gérer les workflows n8n
 */

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WorkflowsService, WorkflowEventType } from './workflows.service';
import {
  TriggerWorkflowDto,
  WorkflowTriggerResponseDto,
  OrderConfirmationDto,
  LowStockAlertDto,
  AbandonedCartDto,
  WorkflowHealthDto,
} from './dto/trigger-workflow.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('workflows')
@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  /**
   * Déclencher un workflow personnalisé
   */
  @Post('trigger')
  @ApiOperation({
    summary: 'Déclencher un workflow personnalisé',
    description: 'Envoie un événement à un webhook n8n spécifique',
  })
  @ApiBody({ type: TriggerWorkflowDto })
  @ApiResponse({
    status: 200,
    description: 'Workflow déclenché',
    type: WorkflowTriggerResponseDto,
  })
  async triggerWorkflow(
    @Body() dto: TriggerWorkflowDto,
  ): Promise<WorkflowTriggerResponseDto> {
    return this.workflowsService.triggerWorkflow(dto);
  }

  /**
   * WORKFLOW 1: Confirmer une commande
   * Envoie un email de confirmation au client
   */
  @Post('order/confirmation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Confirmer une commande (Admin)',
    description: "Déclenche l'email de confirmation de commande",
  })
  @ApiBody({ type: OrderConfirmationDto })
  @ApiResponse({
    status: 200,
    description: 'Confirmation de commande envoyée',
    type: WorkflowTriggerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Commande non trouvée',
  })
  async confirmOrder(
    @Body() dto: OrderConfirmationDto,
  ): Promise<WorkflowTriggerResponseDto> {
    return this.workflowsService.triggerOrderConfirmation(dto.orderId);
  }

  /**
   * WORKFLOW 2: Alerte stock faible
   * Notifie l'admin quand un produit est en rupture
   */
  @Post('stock/alert')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Alerte stock faible (Admin)',
    description: 'Déclenche une alerte pour un produit en rupture',
  })
  @ApiBody({ type: LowStockAlertDto })
  @ApiResponse({
    status: 200,
    description: 'Alerte de stock envoyée',
    type: WorkflowTriggerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Produit non trouvé',
  })
  async triggerLowStock(
    @Body() dto: LowStockAlertDto,
  ): Promise<WorkflowTriggerResponseDto> {
    return this.workflowsService.triggerLowStockAlert(dto.productId);
  }

  /**
   * Vérifier tous les produits pour le stock
   */
  @Post('stock/check-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vérifier tout le stock (Admin)',
    description: 'Vérifie tous les produits et envoie des alertes',
  })
  @ApiResponse({
    status: 200,
    description: 'Vérification terminée',
  })
  async checkAllStock(): Promise<{
    checked: number;
    lowStock: number;
    outOfStock: number;
    alertsTriggered: number;
  }> {
    return this.workflowsService.checkAllProductsStock();
  }

  /**
   * WORKFLOW 3: Panier abandonné
   * Notifie un client pour son panier nonconverti
   */
  @Post('cart/abandoned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Notifier panier abandonné (Admin)',
    description: 'Envoie une notification pour un panier abandonné',
  })
  @ApiBody({ type: AbandonedCartDto })
  @ApiResponse({
    status: 200,
    description: 'Notification envoyée',
    type: WorkflowTriggerResponseDto,
  })
  async triggerAbandonedCart(
    @Body() dto: AbandonedCartDto,
  ): Promise<WorkflowTriggerResponseDto> {
    return this.workflowsService.triggerAbandonedCartNotification(dto.cartId);
  }

  /**
   * Trouver et notifier tous les paniers abandonnés
   */
  @Post('cart/check-abandoned')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Notifier tous les paniers abandonnés (Admin)',
    description: 'Trouve et notifie tous les paniers abandonnés',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications terminées',
  })
  async checkAbandonedCarts(): Promise<{
    found: number;
    notified: number;
  }> {
    return this.workflowsService.findAndNotifyAbandonedCarts();
  }

  /**
   * Vérifier la santé du service
   */
  @Get('health')
  @ApiOperation({
    summary: 'Vérifier la santé du service',
    description: 'Retourne le statut des webhooks n8n',
  })
  @ApiResponse({
    status: 200,
    description: 'Statut du service',
    type: WorkflowHealthDto,
  })
  async healthCheck(): Promise<WorkflowHealthDto> {
    return this.workflowsService.healthCheck();
  }

  /**
   * Liste des types d'événements disponibles
   */
  @Get('events')
  @ApiOperation({
    summary: 'Liste des événements disponibles',
    description: 'Retourne la liste des types de workflows disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Types dévénements',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        enum: Object.values(WorkflowEventType),
      },
    },
  })
  getEventTypes(): string[] {
    return Object.values(WorkflowEventType);
  }
}

