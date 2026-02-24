/**
 * Contrôleur d'analytics pour le tableau de bord admin
 * @description Expose les endpoints REST pour les statistiques et KPIs
 */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  OverviewQueryDto,
  SalesTrendQueryDto,
  PaginationDto,
} from './dto/analytics-query.dto';
import { OverviewResponseDto } from './dto/overview-response.dto';
import { SalesTrendResponseDto } from './dto/sales-trend-response.dto';
import { BestSellersResponseDto } from './dto/bestsellers-response.dto';
import { OrdersByStatusResponseDto } from './dto/orders-by-status-response.dto';
import { TopCustomersResponseDto } from './dto/top-customers-response.dto';
import { RevenueByCategoryResponseDto } from './dto/revenue-by-category-response.dto';

@ApiTags('analytics')
@Controller('admin/analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Vue d'ensemble des KPIs
   */
  @Get('overview')
  @ApiOperation({
    summary: 'Vue d\'ensemble des KPIs',
    description: 'Récupère les indicateurs clés : CA, commandes, clients, etc.',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
    description: 'Période d\'analyse',
    example: 'month',
  })
  @ApiResponse({
    status: 200,
    description: 'KPIs récupérés avec succès',
    type: OverviewResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès admin requis',
  })
  async getOverview(@Query() query: OverviewQueryDto) {
    return this.analyticsService.getOverview(query);
  }

  /**
   * Tendance des ventes
   */
  @Get('sales-trend')
  @ApiOperation({
    summary: 'Tendance des ventes',
    description: 'Évolution du CA et des commandes dans le temps',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Date de début (ISO 8601)',
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Date de fin (ISO 8601)',
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'groupBy',
    required: false,
    enum: ['day', 'week', 'month'],
    description: 'Groupement temporel',
    example: 'day',
  })
  @ApiResponse({
    status: 200,
    description: 'Tendance des ventes récupérée',
    type: SalesTrendResponseDto,
  })
  async getSalesTrend(@Query() query: SalesTrendQueryDto) {
    return this.analyticsService.getSalesTrend(query);
  }

  /**
   * Produits les plus vendus
   */
  @Get('products/bestsellers')
  @ApiOperation({
    summary: 'Produits les plus vendus',
    description: 'Top des produits par quantité vendue',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre de résultats',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des meilleurs ventes',
    type: BestSellersResponseDto,
  })
  async getBestSellers(@Query() query: PaginationDto) {
    return this.analyticsService.getBestSellers(query);
  }

  /**
   * Répartition des commandes par statut
   */
  @Get('orders/status')
  @ApiOperation({
    summary: 'Répartition des commandes par statut',
    description: 'Nombre de commandes par statut (PENDING, SHIPPED, etc.)',
  })
  @ApiResponse({
    status: 200,
    description: 'Répartition récupérée',
    type: OrdersByStatusResponseDto,
  })
  async getOrdersByStatus() {
    return this.analyticsService.getOrdersByStatus();
  }

  /**
   * Top clients
   */
  @Get('customers/top')
  @ApiOperation({
    summary: 'Top clients',
    description: 'Clients les plus actifs par nombre de commandes',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre de résultats',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Top clients récupéré',
    type: TopCustomersResponseDto,
  })
  async getTopCustomers(@Query() query: PaginationDto) {
    return this.analyticsService.getTopCustomers(query);
  }

  /**
   * Chiffre d'affaires par catégorie
   */
  @Get('revenue/by-category')
  @ApiOperation({
    summary: 'Chiffre d\'affaires par catégorie',
    description: 'Répartition du CA par catégorie de produits',
  })
  @ApiResponse({
    status: 200,
    description: 'CA par catégorie récupéré',
    type: RevenueByCategoryResponseDto,
  })
  async getRevenueByCategory() {
    return this.analyticsService.getRevenueByCategory();
  }

  /**
   * Dashboard complet (tous les KPIs en un seul appel)
   */
  @Get('dashboard')
  @ApiOperation({
    summary: 'Dashboard complet',
    description: 'Tous les KPIs principaux en un seul appel',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard complet',
    schema: {
      type: 'object',
      properties: {
        overview: { $ref: '#/components/schemas/OverviewResponseDto' },
        ordersByStatus: { $ref: '#/components/schemas/OrdersByStatusResponseDto' },
        bestSellers: { $ref: '#/components/schemas/BestSellersResponseDto' },
        revenueByCategory: { $ref: '#/components/schemas/RevenueByCategoryResponseDto' },
      },
    },
  })
  async getDashboard(@Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month') {
    const [overview, ordersByStatus, bestSellers, revenueByCategory] = await Promise.all([
      this.analyticsService.getOverview({ period }),
      this.analyticsService.getOrdersByStatus(),
      this.analyticsService.getBestSellers({ limit: 5 }),
      this.analyticsService.getRevenueByCategory(),
    ]);

    return {
      overview,
      ordersByStatus,
      bestSellers,
      revenueByCategory,
    };
  }
}
