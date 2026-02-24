/**
 * Contrôleur de gestion de l'historique des recherches
 * @description Endpoints pour l'historique et les tendances de recherche
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchHistoryService } from './search-history.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('search')
@Controller('search')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  /**
   * Enregistrer une recherche (automatique via interceptor)
   */
  @Post('log')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Enregistrer une recherche',
    description: 'Log une recherche utilisateur pour les recommandations',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string', example: 'chaussures sport' },
        resultsCount: { type: 'number', example: 25 },
        clickedProductId: { type: 'string' },
      },
      required: ['query', 'resultsCount'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Recherche enregistrée',
  })
  async logSearch(
    @GetUser('id') userId: string,
    @Body() body: { query: string; resultsCount: number; clickedProductId?: string },
  ) {
    return this.searchHistoryService.logSearch(
      userId,
      body.query,
      body.resultsCount,
      body.clickedProductId,
    );
  }

  /**
   * Obtenir mon historique de recherches
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtenir mon historique',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Historique des recherches',
  })
  async getHistory(
    @GetUser('id') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchHistoryService.getUserHistory(userId, Number(limit) || 20);
  }

  /**
   * Recherches populaires (public)
   */
  @Get('trends/popular')
  @ApiOperation({
    summary: 'Recherches populaires',
    description: 'Top des recherches sur la plateforme',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month'],
    example: 'week',
  })
  @ApiResponse({
    status: 200,
    description: 'Recherches populaires',
  })
  async getPopularSearches(
    @Query('limit') limit?: number,
    @Query('period') period?: 'day' | 'week' | 'month',
  ) {
    return this.searchHistoryService.getPopularSearches(
      Number(limit) || 10,
      period || 'week',
    );
  }

  /**
   * Tendances de recherche (admin)
   */
  @Get('trends')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Tendances de recherche (Admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tendances',
  })
  async getTrends(@Query('userId') userId?: string) {
    return this.searchHistoryService.getSearchTrends(userId);
  }

  /**
   * Nettoyer l'historique ancien (admin)
   */
  @Post('cleanup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Nettoyer l\'historique ancien (Admin)',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    example: 90,
  })
  @ApiResponse({
    status: 200,
    description: 'Historique nettoyé',
  })
  async cleanup(@Query('days') days?: number) {
    return this.searchHistoryService.cleanupOldHistory(Number(days) || 90);
  }
}
