/**
 * Contrôleur de gestion des codes promo
 * @description Expose les endpoints REST pour la gestion des promotions (Admin uniquement)
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import {
  ApplyDiscountDto,
  ValidateDiscountDto,
} from './dto/apply-discount.dto';
import {
  DiscountResponseDto,
  ApplyDiscountResultDto,
  DiscountValidationDto,
  PaginatedDiscountsResponseDto,
} from './dto/discount-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  // ==================== ENDPOINTS ADMIN ====================

  /**
   * Créer un nouveau code promo (Admin uniquement)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer un code promo (Admin uniquement)',
  })
  @ApiBody({ type: CreateDiscountDto })
  @ApiResponse({
    status: 201,
    description: 'Code promo créé avec succès',
    type: DiscountResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Code promo déjà existant',
  })
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
  ): Promise<DiscountResponseDto> {
    return await this.discountsService.create(createDiscountDto);
  }

  /**
   * Récupérer tous les codes promo (Admin uniquement)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer tous les codes promo (Admin uniquement)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Numéro de page',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: "Nombre d'éléments par page",
    example: 10,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrer par statut actif',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des codes promo',
    type: PaginatedDiscountsResponseDto,
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive') isActive?: boolean,
  ): Promise<PaginatedDiscountsResponseDto> {
    const parsedIsActive =
      isActive === undefined ? undefined : isActive === true;
    return await this.discountsService.findAll(
      page || 1,
      limit || 10,
      parsedIsActive,
    );
  }

  /**
   * Récupérer les statistiques des codes promo (Admin uniquement)
   */
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Statistiques des codes promo (Admin uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques',
  })
  async getStats() {
    return await this.discountsService.getStats();
  }

  /**
   * Récupérer un code promo par ID (Admin uniquement)
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer un code promo par ID (Admin uniquement)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du code promo',
    example: 'uuid-discount',
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du code promo',
    type: DiscountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Code promo non trouvé',
  })
  async findOne(@Param('id') id: string): Promise<DiscountResponseDto> {
    return await this.discountsService.findOne(id);
  }

  /**
   * Mettre à jour un code promo (Admin uniquement)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour un code promo (Admin uniquement)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du code promo',
    example: 'uuid-discount',
  })
  @ApiBody({ type: CreateDiscountDto })
  @ApiResponse({
    status: 200,
    description: 'Code promo mis à jour',
    type: DiscountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Code promo non trouvé',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDiscountDto: Partial<CreateDiscountDto>,
  ): Promise<DiscountResponseDto> {
    return await this.discountsService.update(id, updateDiscountDto);
  }

  /**
   * Supprimer un code promo (Admin uniquement)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un code promo (Admin uniquement)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du code promo',
    example: 'uuid-discount',
  })
  @ApiResponse({
    status: 200,
    description: 'Code promo supprimé',
  })
  @ApiResponse({
    status: 404,
    description: 'Code promo non trouvé',
  })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.discountsService.remove(id);
  }

  /**
   * Activer un code promo (Admin uniquement)
   */
  @Patch(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Activer un code promo (Admin uniquement)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du code promo',
    example: 'uuid-discount',
  })
  @ApiResponse({
    status: 200,
    description: 'Code promo activé',
    type: DiscountResponseDto,
  })
  async activate(@Param('id') id: string): Promise<DiscountResponseDto> {
    return await this.discountsService.activate(id);
  }

  /**
   * Désactiver un code promo (Admin uniquement)
   */
  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Désactiver un code promo (Admin uniquement)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID du code promo',
    example: 'uuid-discount',
  })
  @ApiResponse({
    status: 200,
    description: 'Code promo désactivé',
    type: DiscountResponseDto,
  })
  async deactivate(@Param('id') id: string): Promise<DiscountResponseDto> {
    return await this.discountsService.deactivate(id);
  }

  // ==================== ENDPOINTS PUBLICS ====================

  /**
   * Valider un code promo (Public)
   */
  @Post('validate')
  @ApiOperation({
    summary: 'Valider un code promo',
    description: 'Vérifie si un code promo est valide et utilisable',
  })
  @ApiBody({ type: ValidateDiscountDto })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la validation',
    type: DiscountValidationDto,
  })
  async validate(
    @Body() validateDiscountDto: ValidateDiscountDto,
  ): Promise<DiscountValidationDto> {
    return await this.discountsService.validate(validateDiscountDto);
  }

  /**
   * Appliquer un code promo (Public)
   */
  @Post('apply')
  @ApiOperation({
    summary: 'Appliquer un code promo',
    description: 'Calcule la remise pour un montant donné',
  })
  @ApiBody({ type: ApplyDiscountDto })
  @ApiResponse({
    status: 200,
    description: "Résultat de l'application",
    type: ApplyDiscountResultDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Code promo invalide ou conditions non remplies',
  })
  async apply(
    @Body() applyDiscountDto: ApplyDiscountDto,
  ): Promise<ApplyDiscountResultDto> {
    return await this.discountsService.apply(applyDiscountDto);
  }
}
