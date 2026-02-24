import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ description: 'ID du produit à ajouter' })
  @IsNotEmpty({ message: 'Le produit est requis' })
  @IsString()
  productId: string;
}
