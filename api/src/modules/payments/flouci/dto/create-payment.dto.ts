import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 100.50, description: 'Payment amount in TND' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'uuid-here', description: 'Order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}

