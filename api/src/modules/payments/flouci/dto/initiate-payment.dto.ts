/**
 * DTO pour initier un paiement Flouci
 */

import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  Min,
  Max,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Requête pour initier un paiement
 */
export class InitiatePaymentDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Montant en dinars tunisiens',
    example: 99.99,
  })
  @IsNumber()
  @Min(0.5)
  @Max(10000)
  amount: number;

  @ApiPropertyOptional({
    description: 'Raison du paiement',
    example: 'Paiement commande #12345',
  })
  @IsOptional()
  @IsString()
  paymentReason?: string;

  @ApiPropertyOptional({
    description: 'Email du client',
    example: 'client@example.com',
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone du client',
    example: '+216 98 765 432',
  })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'URL de retour personnalisée',
    example: 'http://localhost:3000/payment/return',
  })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiPropertyOptional({
    description: 'Métadonnées additionnelles',
    example: { cartId: 'cart-uuid', userId: 'user-uuid' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

/**
 * Requête pour vérifier le statut d\'un paiement
 */
export class VerifyPaymentDto {
  @ApiProperty({
    description: 'ID de tracking développeur',
    example: 'order-uuid-timestamp',
  })
  @IsString()
  @IsNotEmpty()
  developerTrackingId: string;

  @ApiPropertyOptional({
    description: 'ID du paiement Flouci',
    example: 'flouci-payment-id',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;
}

/**
 * Requête pour le webhook Flouci
 */
export class FlouciWebhookDto {
  @ApiProperty({
    description: 'ID du paiement',
    example: 'flouci-payment-id',
  })
  @IsString()
  @IsNotEmpty()
  payment_id: string;

  @ApiProperty({
    description: 'ID de tracking développeur',
    example: 'order-uuid-timestamp',
  })
  @IsString()
  @IsNotEmpty()
  developer_tracking_id: string;

  @ApiProperty({
    description: 'Statut du paiement',
    enum: { PENDING: 'PENDING', SUCCESS: 'SUCCESS', FAILED: 'FAILED' },
    example: 'SUCCESS',
  })
  @IsString()
  @IsNotEmpty()
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @ApiProperty({
    description: 'Montant en millimes',
    example: 99990,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Raison du paiement',
    example: 'Paiement commande #12345',
  })
  @IsString()
  payment_reason: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T12:00:00Z',
  })
  @IsString()
  created_at: string;

  @ApiPropertyOptional({
    description: 'Signature du webhook',
    example: 'sha256=abc123...',
  })
  @IsOptional()
  @IsString()
  signature?: string;
}

/**
 * Requête pour l\'annulation d\'un paiement
 */
export class CancelPaymentDto {
  @ApiProperty({
    description: 'ID de tracking développeur',
    example: 'order-uuid-timestamp',
  })
  @IsString()
  @IsNotEmpty()
  developerTrackingId: string;

  @ApiPropertyOptional({
    description: "Raison de l'annulation",
    example: 'Client a annulé',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * Requête pour configurer le wallet de test
 */
export class TestWalletPaymentDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Montant en dinars',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  amount: number;

  @ApiProperty({
    description: 'Numéro de wallet de test (111111 = succès, 000000 = échec)',
    example: '111111',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  testWalletNumber?: string;

  @ApiPropertyOptional({
    description: 'Raison du paiement',
    example: 'Test paiement',
  })
  @IsOptional()
  @IsString()
  paymentReason?: string;
}
