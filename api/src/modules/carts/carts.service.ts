import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItemDto } from './dto/cart-item.dto';
import {
  CartSummary,
  CartValidationResult,
  ValidatedCartItem,
} from './interfaces/cart.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { Prisma } from '@prisma/client';

interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: unknown;
    imageUrl: string | null;
    stock: number;
  };
}

interface DiscountType {
  value: unknown;
  type: string;
}

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtenir ou créer le panier actif de l'utilisateur
   */
  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId, checkedOut: false },
        include: { cartItems: true },
      });
    }

    return cart;
  }

  /**
   * Ajouter un produit au panier
   */
  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Vérification de l'existence et du stock du produit
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec ID ${productId} non trouvé`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(
        `Stock insuffisant. Disponible: ${product.stock}, Demandé: ${quantity}`,
      );
    }

    // Obtenir ou créer le panier
    const cart = await this.getOrCreateCart(userId);

    // Vérifier si le produit existe déjà dans le panier
    const existingCartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let cartItem;

    if (existingCartItem) {
      // Mettre à jour la quantité
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `Stock insuffisant. Maximum possible: ${product.stock - existingCartItem.quantity}`,
        );
      }

      cartItem = await this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Créer un nouvel item
      cartItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Récupérer l'item complet avec le produit
    const cartItemWithProduct = await this.prisma.cartItem.findUnique({
      where: { id: cartItem.id },
      include: { product: true },
    });

    return this.mapToCartItemDto(cartItemWithProduct);
  }

  /**
   * Obtenir le panier de l'utilisateur
   */
  async getCart(userId: string): Promise<CartSummary> {
    const cart = await this.getOrCreateCart(userId);

    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const items = cartItems.map((item) => this.mapToCartItemDto(item));

    // Calcul du sous-total
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price.toString()) * item.quantity;
    }, 0);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Coût de livraison (gratuit au-delà de 100 TND)
    const shippingCost = subtotal >= 100 ? 0 : 10;

    return {
      cartId: cart.id,
      items,
      totalItems,
      subtotal: subtotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      discount: '0.00',
      total: (subtotal + shippingCost).toFixed(2),
    };
  }

  /**
   * Mettre à jour un item du panier
   */
  async updateCartItem(
    userId: string,
    cartItemId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartItemDto> {
    // Vérifier que l'item appartient à l'utilisateur
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId },
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Item du panier non trouvé');
    }

    // Vérification du stock
    if (
      updateCartDto.quantity &&
      updateCartDto.quantity > cartItem.product.stock
    ) {
      throw new BadRequestException(
        `Stock insuffisant. Disponible: ${cartItem.product.stock}`,
      );
    }

    const updatedItem = await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: updateCartDto.quantity },
    });

    const updatedItemWithProduct = await this.prisma.cartItem.findUnique({
      where: { id: updatedItem.id },
      include: { product: true },
    });

    return this.mapToCartItemDto(updatedItemWithProduct);
  }

  /**
   * Supprimer un item du panier
   */
  async removeCartItem(userId: string, cartItemId: string): Promise<void> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, cart: { userId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Item du panier non trouvé');
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  /**
   * Vider le panier
   */
  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  /**
   * Vider TOUS les items du panier (supprimer les CartItem)
   */
  async clearCartItems(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findFirst({
      where: { userId, checkedOut: false },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
  }

  /**
   * Valider le panier avant checkout
   */
  async validateCart(
    userId: string,
    cartId?: string,
  ): Promise<CartValidationResult> {
    let cart;

    if (cartId) {
      cart = await this.prisma.cart.findFirst({
        where: { id: cartId, userId },
      });
    } else {
      cart = await this.getOrCreateCart(userId);
    }

    if (!cart) {
      throw new NotFoundException('Panier non trouvé');
    }

    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    const validatedItems: ValidatedCartItem[] = [];
    const errors: string[] = [];

    for (const item of cartItems) {
      const isAvailable = item.quantity <= item.product.stock;
      validatedItems.push({
        cartItemId: item.id,
        productId: item.productId,
        requestedQuantity: item.quantity,
        availableQuantity: item.product.stock,
        isAvailable,
      });

      if (!isAvailable) {
        errors.push(
          `Produit "${item.product.name}": Stock insuffisant. ` +
            `Demandé: ${item.quantity}, Disponible: ${item.product.stock}`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedItems,
    };
  }

  /**
   * Checkout - Créer une commande à partir du panier
   */
  async checkout(userId: string, checkoutDto: CheckoutDto) {
    const { cartId, discountCode, shippingAddress, paymentMethod } =
      checkoutDto;

    // 1. Obtenir le panier
    const cart = cartId
      ? await this.prisma.cart.findFirst({ where: { id: cartId, userId } })
      : await this.getOrCreateCart(userId);

    if (!cart) {
      throw new NotFoundException('Panier non trouvé');
    }

    // 2. Validation du panier
    const validation = await this.validateCart(userId, cart.id);
    if (!validation.isValid) {
      throw new BadRequestException({
        message: 'Panier invalide',
        errors: validation.errors,
      });
    }

    // 3. Récupération des items du panier
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Le panier est vide');
    }

    // 4. Calcul du total
    const subtotal = cartItems.reduce(
      (sum, item) =>
        sum + parseFloat(item.product.price.toString()) * item.quantity,
      0,
    );

    const shippingCost = subtotal >= 100 ? 0 : 10;
    let discount = 0;

    // 5. Application du code promo (si fourni)
    if (discountCode) {
      const promoCode = await this.prisma.discount.findFirst({
        where: {
          code: discountCode,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      if (promoCode) {
        discount = this.calculateDiscount(promoCode, subtotal);
      }
    }

    const total = subtotal + shippingCost - discount;

    // 6. Création de la commande dans une transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Appliquer le code promo dans la transaction si nécessaire
      if (discountCode) {
        const promoCode = await tx.discount.findFirst({
          where: {
            code: discountCode,
            isActive: true,
            expiresAt: { gt: new Date() },
          },
        });

        if (promoCode) {
          await tx.discount.update({
            where: { id: promoCode.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      // Créer la commande
      const newOrder = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          status: 'PENDING',
          totalAmount: new Prisma.Decimal(total.toFixed(2)),
          shippingAddress,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      // Créer le paiement
      await tx.payment.create({
        data: {
          userId,
          orderId: newOrder.id,
          amount: new Prisma.Decimal(total.toFixed(2)),
          status:
            paymentMethod === 'cash_on_delivery' ? 'COMPLETED' : 'PENDING',
          paymentMethod,
          currency: 'TND',
        },
      });

      // Marquer le panier comme checkout
      await tx.cart.update({
        where: { id: cart.id },
        data: { checkedOut: true },
      });

      return newOrder;
    });

    return order;
  }

  /**
   * Obtenir le nombre d'items dans le panier
   */
  async getCartItemCount(userId: string): Promise<number> {
    const cart = await this.getOrCreateCart(userId);

    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      select: { quantity: true },
    });

    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Mapper CartItem vers CartItemDto
   */
  private mapToCartItemDto(cartItem: CartItemWithProduct): CartItemDto {
    return {
      id: cartItem.id,
      productId: cartItem.productId,
      productName: cartItem.product.name,
      productDescription: cartItem.product.description,
      productPrice: cartItem.product.price.toString(),
      productImage: cartItem.product.imageUrl,
      quantity: cartItem.quantity,
      subtotal: (
        parseFloat(cartItem.product.price.toString()) * cartItem.quantity
      ).toFixed(2),
      productStock: cartItem.product.stock,
    };
  }

  /**
   * Calculer la remise
   */
  private calculateDiscount(discount: DiscountType, subtotal: number): number {
    const discountValue = parseFloat(discount.value.toString());

    if (discount.type === 'PERCENTAGE') {
      return (subtotal * discountValue) / 100;
    }
    return discountValue; // Montant fixe
  }
}
