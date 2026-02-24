/**
 * DTO pour la gestion du statut de livraison
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Statut de livraison
 */
export enum DeliveryStatus {
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  DELIVERY_FAILED = 'DELIVERY_FAILED',
  RETURNED = 'RETURNED',
}

/**
 * Mise à jour du statut de livraison
 */
export class UpdateDeliveryStatusDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'Nouveau statut de livraison',
    enum: DeliveryStatus,
    example: DeliveryStatus.SHIPPED,
  })
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @ApiPropertyOptional({
    description: 'Numéro de suivi du colis',
    example: 'CH123456789TN',
  })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Nom du transporteur',
    example: 'FedEx',
  })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional({
    description: 'Lien de suivi',
    example: 'https://fedex.com/track/CH123456789',
  })
  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @ApiPropertyOptional({
    description: 'Notes additionnelles',
    example: 'Colis déposé au point relais',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Date estimée de livraison',
    example: '2024-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @ApiPropertyOptional({
    description: 'URL de la photo du colis',
    example: 'https://example.com/photo-colis.jpg',
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

/**
 * Historique de suivi de livraison
 */
export class TrackingHistoryDto {
  @ApiProperty({
    description: "ID de l'historique",
    example: 'tracking-history-uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Statut',
    enum: DeliveryStatus,
  })
  status: DeliveryStatus;

  @ApiProperty({
    description: 'Description',
    example: 'Votre colis a été expédié',
  })
  description: string;

  @ApiProperty({
    description: 'Localisation',
    example: 'Tunis, Tunisie',
  })
  location?: string;

  @ApiProperty({
    description: "Date de l'événement",
    example: '2024-01-10T14:30:00Z',
  })
  timestamp: Date;

  @ApiPropertyOptional({
    description: 'Notes additionnelles',
  })
  notes?: string;
}

/**
 * Réponse du suivi de livraison
 */
export class DeliveryTrackingResponseDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  orderId: string;

  @ApiProperty({
    description: 'Numéro de commande',
    example: 'ORD-12345',
  })
  orderNumber: string;

  @ApiProperty({
    description: 'Statut actuel',
    enum: DeliveryStatus,
    example: DeliveryStatus.IN_TRANSIT,
  })
  currentStatus: DeliveryStatus;

  @ApiProperty({
    description: 'Numéro de suivi',
    example: 'CH123456789TN',
  })
  trackingNumber?: string;

  @ApiProperty({
    description: 'Transporteur',
    example: 'FedEx',
  })
  carrier?: string;

  @ApiProperty({
    description: 'Lien de suivi',
    example: 'https://fedex.com/track/CH123456789',
  })
  trackingUrl?: string;

  @ApiProperty({
    description: "Date d'expédition",
    example: '2024-01-10T09:00:00Z',
  })
  shippedAt?: string;

  @ApiProperty({
    description: 'Date estimée de livraison',
    example: '2024-01-12T18:00:00Z',
  })
  estimatedDeliveryDate?: string;

  @ApiProperty({
    description: 'Date de livraison réelle',
    example: '2024-01-12T15:30:00Z',
  })
  deliveredAt?: string;

  @ApiProperty({
    description: 'Historique de suivi',
    type: [TrackingHistoryDto],
  })
  trackingHistory: TrackingHistoryDto[];

  @ApiProperty({
    description: 'Adresse de livraison',
  })
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    governorate: string;
  };
}

/**
 * Configuration du transporteur
 */
export class CarrierConfigDto {
  @ApiProperty({
    description: 'Nom du transporteur',
    example: 'FedEx',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Code du transporteur',
    example: 'FEDEX',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({
    description: 'URL de suivi',
    example: 'https://www.fedex.com/track?tracknumbers=',
  })
  @IsOptional()
  @IsString()
  trackingUrlTemplate?: string;

  @ApiPropertyOptional({
    description: 'Logo du transporteur',
  })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'API Key',
  })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({
    description: 'Actif',
    example: true,
  })
  isActive: boolean;
}

/**
 * Notification de livraison
 */
export class DeliveryNotificationDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'order-uuid-123',
  })
  orderId: string;

  @ApiProperty({
    description: 'Type de notification',
    enum: [
      'SHIPPED',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'DELIVERY_FAILED',
    ],
    example: 'SHIPPED',
  })
  @IsString()
  notificationType: string;

  @ApiProperty({
    description: 'Message à envoyer',
    example: 'Votre commande a été expédiée',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Données additionnelles pour le webhook',
  })
  metadata?: Record<string, unknown>;
}
