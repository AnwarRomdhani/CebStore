import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemResponseDto {
  @ApiProperty({ description: 'ID de lélément' })
  id: string;

  @ApiProperty({ description: 'ID du produit' })
  productId: string;

  @ApiProperty({ description: 'Nom du produit' })
  productName: string;

  @ApiProperty({ description: 'Prix du produit' })
  price: number;

  @ApiProperty({ description: 'URL de limage', required: false })
  imageUrl?: string;

  @ApiProperty({ description: 'Produit actif' })
  isActive: boolean;

  @ApiProperty({ description: 'Date dajout' })
  createdAt: Date;
}

export class WishlistResponseDto {
  @ApiProperty({ description: 'ID de la wishlist' })
  id: string;

  @ApiProperty({ description: 'ID de lutilisateur' })
  userId: string;

  @ApiProperty({ description: 'Nombre déléments' })
  itemCount: number;

  @ApiProperty({
    description: 'Éléments de la wishlist',
    type: [WishlistItemResponseDto],
  })
  items: WishlistItemResponseDto[];

  @ApiProperty({ description: 'Date de création' })
  createdAt: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  updatedAt: Date;
}
