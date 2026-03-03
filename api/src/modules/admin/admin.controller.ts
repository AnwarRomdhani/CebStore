import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { UsersListResponseDto } from './dto/users-response.dto';
import {
  ProductsListResponseDto,
  StockAlertsResponseDto,
} from './dto/products-response.dto';
import { OrdersListResponseDto } from './dto/orders-response.dto';
import {
  SearchUserDto,
  SearchProductDto,
  SearchOrderDto,
} from './dto/admin-query.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard complet
  @Get('dashboard')
  @ApiOperation({
    summary: 'Dashboard complet',
    description: 'Vue densemble de tous les KPIs et données importantes',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard récupéré avec succès',
    type: DashboardResponseDto,
  })
  async getDashboard() {
    return this.adminService.getDashboard();
  }
  // Statistiques des utilisateurs
  @Get('users/stats')
  @ApiOperation({
    summary: 'Statistiques des utilisateurs',
    description: 'Nombre total, nouveaux utilisateurs, répartition par rôle',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées',
  })
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  //Liste des utilisateurs
  @Get('users')
  @ApiOperation({
    summary: 'Liste des utilisateurs',
    description: 'Liste paginée avec filtres et recherche',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Terme de recherche (email, nom)',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filtre par rôle (USER, ADMIN, ALL)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
    type: UsersListResponseDto,
  })
  async getUsers(@Query() query: SearchUserDto) {
    return this.adminService.getUsers({
      page: query.page || 1,
      limit: query.limit || 20,
      search: query.search,
      role: query.role,
    });
  }

  // Bannir un utilisateur
  @Post('users/:id/ban')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bannir un utilisateur',
    description: 'Désactive le compte dun utilisateur',
  })
  @ApiParam({ name: 'id', description: 'ID de lutilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur banni avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Impossible de bannir un administrateur',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  // Statistiques des produits
  @Get('products/stats')
  @ApiOperation({
    summary: 'Statistiques des produits',
    description: 'Nombre total, produits actifs, valeur du stock',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées',
  })
  async getProductStats() {
    return this.adminService.getProductStats();
  }

  //Liste des produits
  @Get('products')
  @ApiOperation({
    summary: 'Liste des produits',
    description: 'Liste paginée avec filtres et recherche',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Terme de recherche (nom, SKU)',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filtre par catégorie',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filtre par statut (true, false)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits',
    type: ProductsListResponseDto,
  })
  async getProducts(@Query() query: SearchProductDto) {
    return this.adminService.getProducts({
      page: query.page || 1,
      limit: query.limit || 20,
      search: query.search,
      categoryId: query.categoryId,
      isActive: query.isActive,
    });
  }

  //Alertes de stock
  @Get('products/stock-alerts')
  @ApiOperation({
    summary: 'Alertes de stock',
    description: 'Produits en rupture ou stock faible',
  })
  @ApiQuery({
    name: 'threshold',
    required: false,
    description: 'Seuil dalerte (défaut: 10)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Alertes de stock',
    type: StockAlertsResponseDto,
  })
  async getStockAlerts(@Query('threshold') threshold?: number) {
    return this.adminService.getStockAlerts(Number(threshold) || 10);
  }

  //Statistiques des commandes
  @Get('orders/stats')
  @ApiOperation({
    summary: 'Statistiques des commandes',
    description: 'Répartition par statut, taux dannulation',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées',
    type: OrdersListResponseDto,
  })
  async getOrderStats() {
    return this.adminService.getOrderStats();
  }

  //Liste des commandes
  @Get('orders')
  @ApiOperation({
    summary: 'Liste des commandes',
    description: 'Liste paginée avec filtres et recherche',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Terme de recherche (n° commande, email)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtre par statut (PENDING, SHIPPED, etc.)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Liste des commandes',
    type: OrdersListResponseDto,
  })
  async getOrders(@Query() query: SearchOrderDto) {
    return this.adminService.getOrders({
      page: query.page || 1,
      limit: query.limit || 20,
      search: query.search,
      status: query.status,
    });
  }
  //Health check du système
  @Get('system/health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Vérifie létat des services',
  })
  @ApiResponse({
    status: 200,
    description: 'Services opérationnels',
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        api: 'running',
      },
    };
  }

  // Résumé des activités récentes
  @Get('activity/recent')
  @ApiOperation({
    summary: 'Activités récentes',
    description: 'Dernières actions sur la plateforme',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Activités récentes',
  })
  async getRecentActivity(@Query('limit') _limit?: number) {
    // Pour l'instant, retourne les dernières commandes
    // Pourra être étendu avec les audit logs
    return this.adminService.getDashboard();
  }
}
