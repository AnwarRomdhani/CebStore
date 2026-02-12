import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CartsService } from './carts.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Carts - Panier')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  /**
   * Obtenir le panier de l'utilisateur connecté
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtenir le panier de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Panier récupéré avec succès',
  })
  async getCart(@Request() req: RequestWithUser) {
    return this.cartsService.getCart(req.user.id);
  }

  /**
   * Obtenir le nombre d'items dans le panier
   */
  @Get('count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtenir le nombre d'items dans le panier" })
  @ApiResponse({ status: 200, description: "Nombre d'items récupéré" })
  async getCartCount(@Request() req: RequestWithUser) {
    const count = await this.cartsService.getCartItemCount(req.user.id);
    return { count };
  }

  /**
   * Ajouter un produit au panier
   */
  @Post('items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un produit au panier' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({ status: 201, description: 'Produit ajouté au panier' })
  @ApiResponse({ status: 400, description: 'Stock insuffisant' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async addToCart(
    @Request() req: RequestWithUser,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartsService.addToCart(req.user.id, addToCartDto);
  }

  /**
   * Mettre à jour un item du panier
   */
  @Put('items/:cartItemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un item du panier' })
  @ApiParam({ name: 'cartItemId', description: "ID de l'item du panier" })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Item du panier mis à jour' })
  @ApiResponse({ status: 404, description: 'Item du panier non trouvé' })
  async updateCartItem(
    @Request() req: RequestWithUser,
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartsService.updateCartItem(
      req.user.id,
      cartItemId,
      updateCartDto,
    );
  }

  /**
   * Supprimer un item du panier
   */
  @Delete('items/:cartItemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un item du panier' })
  @ApiParam({ name: 'cartItemId', description: "ID de l'item du panier" })
  @ApiResponse({ status: 204, description: 'Item du panier supprimé' })
  @ApiResponse({ status: 404, description: 'Item du panier non trouvé' })
  async removeCartItem(
    @Request() req: RequestWithUser,
    @Param('cartItemId') cartItemId: string,
  ) {
    await this.cartsService.removeCartItem(req.user.id, cartItemId);
    return;
  }

  /**
   * Vider le panier
   */
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vider le panier' })
  @ApiResponse({ status: 204, description: 'Panier vidé' })
  async clearCart(@Request() req: RequestWithUser) {
    await this.cartsService.clearCartItems(req.user.id);
    return;
  }

  /**
   * Valider le panier
   */
  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Valider le panier avant checkout' })
  @ApiResponse({ status: 200, description: 'Validation du panier' })
  async validateCart(@Request() req: RequestWithUser) {
    return this.cartsService.validateCart(req.user.id);
  }

  /**
   * Checkout - Passer commande
   */
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Passer commande (checkout)' })
  @ApiBody({ type: CheckoutDto })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès' })
  @ApiResponse({ status: 400, description: 'Panier invalide ou vide' })
  async checkout(
    @Request() req: RequestWithUser,
    @Body() checkoutDto: CheckoutDto,
  ) {
    return this.cartsService.checkout(req.user.id, checkoutDto);
  }
}
