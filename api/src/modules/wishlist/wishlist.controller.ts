import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
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
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { WishlistResponseDto } from './dto/wishlist-response.dto';

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // Obtenir ma wishlist
  @Get()
  @ApiOperation({
    summary: 'Obtenir ma wishlist',
    description: 'Récupère la liste des produits favoris de lutilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Wishlist récupérée',
    type: WishlistResponseDto,
  })
  async getWishlist(@GetUser('id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  //Ajouter un produit à la wishlist
  @Post('items')
  @ApiOperation({
    summary: 'Ajouter un produit à la wishlist',
  })
  @ApiBody({ type: AddToWishlistDto })
  @ApiResponse({
    status: 201,
    description: 'Produit ajouté à la wishlist',
  })
  @ApiResponse({
    status: 409,
    description: 'Produit déjà dans la wishlist',
  })
  async addItem(@GetUser('id') userId: string, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.addItem(userId, dto);
  }

  // Retirer un produit de la wishlist (par ID d'élément)
  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retirer un produit (par ID élément)',
  })
  @ApiParam({
    name: 'itemId',
    description: 'ID de lélément dans la wishlist',
  })
  @ApiResponse({
    status: 200,
    description: 'Produit retiré',
  })
  async removeItem(
    @GetUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.wishlistService.removeItem(userId, itemId);
  }

  // Retirer un produit de la wishlist (par ID de produit)
  @Delete('product/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retirer un produit (par ID produit)',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID du produit',
  })
  @ApiResponse({
    status: 200,
    description: 'Produit retiré',
  })
  async removeProduct(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeProduct(userId, productId);
  }

  // Vider la wishlist
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vider la wishlist',
  })
  @ApiResponse({
    status: 200,
    description: 'Wishlist vidée',
  })
  async clearWishlist(@GetUser('id') userId: string) {
    return this.wishlistService.clearWishlist(userId);
  }

  // Vérifier si un produit est dans la wishlist
  @Get('check/:productId')
  @ApiOperation({
    summary: 'Vérifier si un produit est dans la wishlist',
  })
  @ApiParam({
    name: 'productId',
    description: 'ID du produit à vérifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification',
    schema: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
        isInWishlist: { type: 'boolean' },
      },
    },
  })
  async checkProduct(
    @GetUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    const isInWishlist = await this.wishlistService.isInWishlist(
      userId,
      productId,
    );

    return {
      productId,
      isInWishlist,
    };
  }
}
