/**
 * Contrôleur de gestion des avis clients
 * @description Expose les endpoints REST pour la gestion des avis
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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ReviewResponseDto,
  ProductRatingSummaryDto,
  PaginatedReviewsResponseDto,
} from './dto/review-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { User } from '@prisma/client';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Créer un nouvel avis
   * @description L'utilisateur doit avoir acheté le produit pour laisser un avis
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Créer un avis sur un produit',
    description:
      "L'utilisateur doit avoir acheté et reçu le produit pour laisser un avis",
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Avis créé avec succès',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Avis déjà existant pour ce produit',
  })
  @ApiResponse({
    status: 403,
    description: "L'utilisateur n'a pas acheté ce produit",
  })
  @ApiResponse({
    status: 404,
    description: 'Produit non trouvé',
  })
  async create(
    @GetUser() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.create(user.id, createReviewDto);
  }

  /**
   * Récupérer tous les avis d'un produit
   */
  @Get('product/:productId')
  @ApiOperation({
    summary: "Récupérer les avis d'un produit",
    description: 'Liste paginée des avis avec résumé des notes',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID du produit',
    example: 'uuid-produit',
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
  @ApiResponse({
    status: 200,
    description: 'Liste des avis avec pagination',
    type: PaginatedReviewsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produit non trouvé',
  })
  async findByProduct(
    @Param('productId') productId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<PaginatedReviewsResponseDto> {
    return await this.reviewsService.findByProduct(
      productId,
      page || 1,
      limit || 10,
    );
  }

  /**
   * Récupérer le résumé des notes d'un produit
   */
  @Get('product/:productId/summary')
  @ApiOperation({
    summary: "Récupérer le résumé des notes d'un produit",
    description: 'Moyenne, total et distribution des notes',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID du produit',
    example: 'uuid-produit',
  })
  @ApiResponse({
    status: 200,
    description: 'Résumé des notes',
    type: ProductRatingSummaryDto,
  })
  async getProductRatingSummary(
    @Param('productId') productId: string,
  ): Promise<ProductRatingSummaryDto> {
    return await this.reviewsService.getProductRatingSummary(productId);
  }

  /**
   * Récupérer mes avis
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer mes avis',
    description: "Liste paginée des avis de l'utilisateur connecté",
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
  @ApiResponse({
    status: 200,
    description: 'Liste de mes avis',
    type: PaginatedReviewsResponseDto,
  })
  async findMyReviews(
    @GetUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<PaginatedReviewsResponseDto> {
    return await this.reviewsService.findByUser(
      user.id,
      page || 1,
      limit || 10,
    );
  }

  /**
   * Récupérer un avis par son ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un avis par son ID',
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'avis",
    example: 'uuid-avis',
  })
  @ApiResponse({
    status: 200,
    description: "Détails de l'avis",
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Avis non trouvé',
  })
  async findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    return await this.reviewsService.findOne(id);
  }

  /**
   * Mettre à jour son propre avis
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour mon avis',
    description: 'Modifier la note et/ou le commentaire de son avis',
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'avis",
    example: 'uuid-avis',
  })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Avis mis à jour',
    type: ReviewResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Vous ne pouvez modifier que vos propres avis',
  })
  @ApiResponse({
    status: 404,
    description: 'Avis non trouvé',
  })
  async update(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.update(id, user.id, updateReviewDto);
  }

  /**
   * Supprimer son propre avis
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer mon avis',
  })
  @ApiParam({
    name: 'id',
    description: "ID de l'avis",
    example: 'uuid-avis',
  })
  @ApiResponse({
    status: 200,
    description: 'Avis supprimé avec succès',
  })
  @ApiResponse({
    status: 403,
    description: 'Vous ne pouvez supprimer que vos propres avis',
  })
  @ApiResponse({
    status: 404,
    description: 'Avis non trouvé',
  })
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return await this.reviewsService.remove(id, user.id);
  }

  /**
   * Vérifier si l'utilisateur peut laisser un avis sur un produit
   */
  @Get('can-review/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Vérifier si l'utilisateur peut laisser un avis",
    description: "Vérifie si l'utilisateur a acheté le produit",
  })
  @ApiParam({
    name: 'productId',
    description: 'ID du produit',
    example: 'uuid-produit',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification',
    schema: {
      type: 'object',
      properties: {
        canReview: { type: 'boolean' },
        hasPurchased: { type: 'boolean' },
        hasReviewed: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  async canReview(
    @GetUser() user: User,
    @Param('productId') productId: string,
  ): Promise<{
    canReview: boolean;
    hasPurchased: boolean;
    hasReviewed: boolean;
    message: string;
  }> {
    const purchaseVerification = await this.reviewsService.verifyPurchase(
      user.id,
      productId,
    );

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
    const review = await this.reviewsService.findByUser(user.id, 1, 100);
    const hasReviewed = review.data.some((r) => r.productId === productId);

    let message = '';
    if (!purchaseVerification.hasPurchased) {
      message = "Vous n'avez pas encore acheté ce produit";
    } else if (hasReviewed) {
      message = 'Vous avez déjà laissé un avis pour ce produit';
    } else {
      message = 'Vous pouvez laisser un avis pour ce produit';
    }

    return {
      canReview: purchaseVerification.hasPurchased && !hasReviewed,
      hasPurchased: purchaseVerification.hasPurchased,
      hasReviewed,
      message,
    };
  }
}
