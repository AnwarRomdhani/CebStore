/**
 * Contrôleur de gestion du cache
 * @description Endpoints pour administrer le cache Redis
 */

import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
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
import { CacheService } from './cache.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('cache')
@Controller('cache')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  /**
   * Statistiques du cache
   */
  @Get('stats')
  @ApiOperation({
    summary: 'Statistiques du cache Redis',
    description: 'Nombre de clés, mémoire utilisée, état de la connexion',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques récupérées',
  })
  async getStats() {
    return this.cacheService.getStats();
  }

  /**
   * Vérifier si une clé existe
   */
  @Get('exists/:key')
  @ApiOperation({
    summary: 'Vérifier si une clé existe',
  })
  @ApiParam({
    name: 'key',
    description: 'Clé à vérifier',
    example: 'product:uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification',
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        exists: { type: 'boolean' },
      },
    },
  })
  async exists(@Param('key') key: string) {
    return {
      key,
      exists: await this.cacheService.exists(key),
    };
  }

  /**
   * Supprimer une clé du cache
   */
  @Delete(':key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer une clé du cache',
  })
  @ApiParam({
    name: 'key',
    description: 'Clé à supprimer',
    example: 'product:uuid-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Clé supprimée',
  })
  async delete(@Param('key') key: string) {
    await this.cacheService.del(key);
    return { message: `Clé "${key}" supprimée du cache` };
  }

  /**
   * Vider le cache par pattern
   */
  @Delete('pattern/*')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vider le cache par pattern',
    description: 'Supprime toutes les clés correspondant au pattern',
  })
  @ApiQuery({
    name: 'pattern',
    description: 'Pattern (ex: product:*, user:*)',
    example: 'product:*',
  })
  @ApiResponse({
    status: 200,
    description: 'Cache vidé',
  })
  async deleteByPattern(@Query('pattern') pattern: string) {
    await this.cacheService.delByPattern(pattern);
    return { message: `Clés correspondant à "${pattern}" supprimées` };
  }

  /**
   * Vider tout le cache
   */
  @Delete('flush')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vider tout le cache',
    description: '⚠️ Action destructive - Supprime toutes les clés',
  })
  @ApiResponse({
    status: 200,
    description: 'Cache vidé complètement',
  })
  async flush() {
    await this.cacheService.flush();
    return { message: 'Cache Redis vidé complètement' };
  }

  /**
   * Liste des clés (pour debug)
   */
  @Get('keys')
  @ApiOperation({
    summary: 'Lister les clés du cache',
    description: 'Retourne les clés correspondant au pattern (max 100)',
  })
  @ApiQuery({
    name: 'pattern',
    required: false,
    description: 'Pattern de recherche',
    example: '*',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des clés',
  })
  async getKeys(@Query('pattern') pattern: string = '*') {
    const redis = (this.cacheService as any).redis;
    const keys = await redis.keys(pattern);
    return {
      pattern,
      count: keys.length,
      keys: keys.slice(0, 100), // Max 100 clés
    };
  }
}
