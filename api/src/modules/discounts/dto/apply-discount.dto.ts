import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class ApplyDiscountDto {
  @ApiProperty({
    description: 'Code promo à appliquer',
    example: 'SUMMER2024',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Montant total de la commande (en TND)',
    example: 150,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class ValidateDiscountDto {
  @ApiProperty({
    description: 'Code promo à valider',
    example: 'SUMMER2024',
  })
  @IsString()
  code: string;
}
