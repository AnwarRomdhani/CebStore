import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // Obtenir ou créer la wishlist d'un utilisateur
  private async getOrCreateWishlist(userId: string) {
    let wishlist = await this.prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                isActive: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await this.prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true,
                  isActive: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    return wishlist;
  }

  // Obtenir la wishlist d'un utilisateur
  async getWishlist(userId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    return {
      id: wishlist.id,
      userId: wishlist.userId,
      itemCount: wishlist.items.length,
      items: wishlist.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        price: Number(item.product.price),
        imageUrl: item.product.imageUrl,
        isActive: item.product.isActive,
        createdAt: item.createdAt,
      })),
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    };
  }

  // Ajouter un produit à la wishlist
  async addItem(userId: string, dto: AddToWishlistDto) {
    const { productId } = dto;

    // Vérifier que le produit existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produit non trouvé');
    }

    // Obtenir ou créer la wishlist
    const wishlist = await this.getOrCreateWishlist(userId);

    // Vérifier si le produit est déjà dans la wishlist
    const existingItem = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    if (existingItem) {
      throw new ConflictException('Produit déjà dans la wishlist');
    }

    // Ajouter l'élément
    const newItem = await this.prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            isActive: true,
          },
        },
      },
    });

    return {
      id: newItem.id,
      productId: newItem.productId,
      productName: newItem.product.name,
      price: Number(newItem.product.price),
      imageUrl: newItem.product.imageUrl,
      isActive: newItem.product.isActive,
      createdAt: newItem.createdAt,
    };
  }

  // Retirer un produit de la wishlist
  async removeItem(userId: string, itemId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        id: itemId,
        wishlistId: wishlist.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Élément non trouvé dans la wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: itemId },
    });

    return { message: 'Produit retiré de la wishlist' };
  }

  // Retirer un produit par son ID de produit
  async removeProduct(userId: string, productId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException('Produit non trouvé dans la wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    return { message: 'Produit retiré de la wishlist' };
  }

  // Vider la wishlist
  async clearWishlist(userId: string) {
    const wishlist = await this.getOrCreateWishlist(userId);

    await this.prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });

    return { message: 'Wishlist vidée' };
  }

  // Vérifier si un produit est dans la wishlist
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await this.getOrCreateWishlist(userId);

    const item = await this.prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    return !!item;
  }
}
