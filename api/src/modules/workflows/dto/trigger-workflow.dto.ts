/**
 * DTO pour le déclenchement des workflows
 * @description Définit les données nécessaires pour déclencher un workflow n8n
 */

import {
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WorkflowEventType } from '../workflows.service';

/**
 * DTO pour déclencher un workflow
 */
export class TriggerWorkflowDto {
  @ApiProperty({
    description: "Type d'événement du workflow",
    enum: WorkflowEventType,
    example: WorkflowEventType.ORDER_CONFIRMED,
  })
  @IsEnum(WorkflowEventType)
  eventType!: WorkflowEventType;

  @ApiProperty({
    description: 'Données à envoyer au workflow',
    example: {
      orderId: 'uuid-commande',
      customerEmail: 'client@example.com',
      amount: 150.5,
    },
  })
  @IsObject()
  data!: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'URL du webhook n8n spécifique (optionnel)',
    example: 'https://n8n.example.com/webhook/order-confirmation',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  webhookUrl?: string;
}

/**
 * Réponse du déclenchement d'un workflow
 */
export class WorkflowTriggerResponseDto {
  @ApiProperty({
    description: 'Succès du déclenchement',
    example: true,
  })
  success!: boolean;

  @ApiPropertyOptional({
    description: 'Message de réponse',
    example: 'Workflow déclenché avec succès',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'ID du workflow exécuté',
    example: 'execution-123',
  })
  workflowId?: string;
}

/**
 * DTO pour la confirmation de commande
 */
export class OrderConfirmationDto {
  @ApiProperty({
    description: 'ID de la commande',
    example: 'uuid-commande',
  })
  @IsString()
  orderId!: string;
}

/**
 * DTO pour l'alerte de stock faible
 */
export class LowStockAlertDto {
  @ApiProperty({
    description: 'ID du produit',
    example: 'uuid-produit',
  })
  @IsString()
  productId!: string;
}

/**
 * DTO pour la notification de panier abandonné
 */
export class AbandonedCartDto {
  @ApiProperty({
    description: 'ID du panier',
    example: 'uuid-panier',
  })
  @IsString()
  cartId!: string;
}

/**
 * Statut de santé du service workflows
 */
export class WorkflowHealthDto {
  @ApiProperty({
    description: 'Statut du service',
    example: 'operational',
  })
  status!: string;

  @ApiProperty({
    description: 'Webhooks configurés',
    example: {
      order: true,
      payment: true,
      stock: false,
    },
  })
  webhooks!: Record<string, boolean>;
}
