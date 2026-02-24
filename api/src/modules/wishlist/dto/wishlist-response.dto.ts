import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemResponseDto {
  @ApiProperty({ description: 'ID de l\'élément' })
  id: string;

  @ApiProperty({ description: 'ID du produit' })
  productId: string;

  @ApiProperty({ description: 'Nom du produit' })
  productName: string;

  @ApiProperty({ description: 'Prix du produit' })
  price: number;

  @ApiProperty({ description: 'URL de l\'image', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Produit actif' })
  isActive: boolean;

  @ApiProperty({ description: 'Date d\'ajout' })
  createdAt: Date;
}

export class WishlistResponseDto {
  @ApiProperty({ description: 'ID de la wishlist' })
  id: string;

  @ApiProperty({ description: 'ID de l\'utilisateur' })
  userId: string;

  @ApiProperty({ description: 'Nombre d\'éléments' })
  itemCount: number;

  @ApiProperty({ description: 'Éléments de la wishlist', type: [WishlistItemResponseDto] })
  items: WishlistItemResponseDto[];

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
