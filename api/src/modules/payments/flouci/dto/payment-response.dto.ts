/**
 * DTO pour les réponses de paiement Flouci
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Réponse de l\'initialisation du paiement
 */
export class PaymentInitiationResponseDto {
  @ApiProperty({
    description: 'Succès de l\'opération',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'ID du paiement Flouci',
    example: 'flouci-payment-id',
  })
  paymentId: string;

  @ApiProperty({
    description: 'Lien de redirection vers Flouci',
    example: 'https://sandbox.flouci.com/payment/xxx',
  })
  paymentLink: string;

  @ApiProperty({
    description: 'ID de tracking',
    example: 'order-uuid-timestamp',
  })
  trackingId: string;

  @ApiProperty({
    description: 'Montant en dinars',
    example: 99.99,
  })
  amount: number;

  @ApiProperty({
    description: 'Devise',
    example: 'TND',
  })
  currency: string;

  @ApiProperty({
    description: 'Date d\'expiration',
    example: '2024-01-01T13:00:00Z',
  })
  expiresAt: string;

  @ApiPropertyOptional({
    description: 'Message',
    example: 'Paiement initié avec succès',
  })
  message?: string;
}

/**
 * Réponse de vérification du paiement
 */
export class PaymentVerificationResponseDto {
  @ApiProperty({
    description: 'Succès',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'ID du paiement',
    example: 'flouci-payment-id',
  })
  paymentId: string;

  @ApiProperty({
    description: 'ID de tracking',
    example: 'order-uuid-timestamp',
  })
  trackingId: string;

  @ApiProperty({
    description: 'Statut du paiement',
    enum: { PENDING: 'PENDING', SUCCESS: 'SUCCESS', FAILED: 'FAILED', EXPIRED: 'EXPIRED' },
    example: 'SUCCESS',
  })
  status: string;

  @ApiProperty({
    description: 'Montant en dinars',
    example: 99.99,
  })
  amount: number;

  @ApiProperty({
    description: 'Devise',
    example: 'TND',
  })
  currency: string;

  @ApiProperty({
    description: 'Date du paiement',
    example: '2024-01-01T12:05:00Z',
  })
  paidAt?: string;

  @ApiPropertyOptional({
    description: 'Message d\'erreur',
    example: 'Paiement effectué avec succès',
  })
  message?: string;
}

/**
 * Réponse du webhook
 */
export class WebhookResponseDto {
  @ApiProperty({
    description: 'Webhook reçu avec succès',
    example: true,
  })
  received: boolean;

  @ApiProperty({
    description: 'Message de confirmation',
    example: 'Webhook traité avec succès',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'ID de la commande mise à jour',
    example: 'order-uuid-123',
  })
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Nouveau statut de la commande',
    example: 'PAID',
  })
  orderStatus?: string;
}

/**
 * Erreur de paiement
 */
export class PaymentErrorResponseDto {
  @ApiProperty({
    description: 'Succès',
    example: false,
  })
  success: false;

  @ApiProperty({
    description: 'Code d\'erreur',
    example: 'INVALID_SIGNATURE',
  })
  error: string;

  @ApiProperty({
    description: 'Message d\'erreur',
    example: 'Signature du webhook invalide',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Détails de l\'erreur',
    example: { orderId: 'order-uuid-123' },
  })
  details?: Record<string, unknown>;
}

/**
 * Statut complet du paiement
 */
export class PaymentStatusResponseDto {
  @ApiProperty({
    description: 'ID du paiement',
    example: 'flouci-payment-id',
  })
  paymentId: string;

  @ApiProperty({
    description: 'ID de tracking',
    example: 'order-uuid-timestamp',
  })
  trackingId: string;

  @ApiProperty({
    description: 'ID de la commande associée',
    example: 'order-uuid-123',
  })
  orderId: string;

  @ApiProperty({
    description: 'Montant',
    example: 99.99,
  })
  amount: number;

  @ApiProperty({
    description: 'Devise',
    example: 'TND',
  })
  currency: string;

  @ApiProperty({
    description: 'Statut',
    enum: { PENDING: 'PENDING', SUCCESS: 'SUCCESS', FAILED: 'FAILED', EXPIRED: 'EXPIRED', CANCELLED: 'CANCELLED' },
    example: 'SUCCESS',
  })
  status: string;

  @ApiProperty({
    description: 'Raison du paiement',
    example: 'Paiement commande #12345',
  })
  paymentReason: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-01T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de mise à jour',
    example: '2024-01-01T12:05:00Z',
  })
  updatedAt: string;

  @ApiPropertyOptional({
    description: 'Date de paiement',
    example: '2024-01-01T12:05:00Z',
  })
  paidAt?: string;

  @ApiPropertyOptional({
    description: 'Mode de paiement',
    example: 'CARD',
  })
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Métadonnées',
    example: { userId: 'user-uuid' },
  })
  metadata?: Record<string, unknown>;
}

/**
 * Configuration du mode test
 */
export class TestModeConfigResponseDto {
  @ApiProperty({
    description: 'Mode sandbox activé',
    example: true,
  })
  sandboxEnabled: boolean;

  @ApiProperty({
    description: 'Numéro de wallet pour succès',
    example: '111111',
  })
  successWallet: string;

  @ApiProperty({
    description: 'Numéro de wallet pour échec',
    example: '000000',
  })
  failureWallet: string;

  @ApiProperty({
    description: 'Instructions pour le mode test',
    example: 'Utilisez le numéro 111111 pour simuler un paiement réussi',
  })
  instructions: string;
}

