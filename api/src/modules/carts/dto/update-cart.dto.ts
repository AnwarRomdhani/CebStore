import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { AddToCartDto } from './add-to-cart.dto';

export class UpdateCartDto extends PartialType(AddToCartDto) {
  @ApiProperty({
    description: 'Nouvelle quantité du produit',
    minimum: 1,
    maximum: 99,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  quantity?: number;
}
