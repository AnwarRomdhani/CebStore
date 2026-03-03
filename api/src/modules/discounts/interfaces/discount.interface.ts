import { Discount } from '@prisma/client';

// Type pour le type de remise
export type DiscountTypeValue = 'PERCENTAGE' | 'FIXED';

// Interface pour la création d'un code promo
export interface CreateDiscountInput {
  code: string;
  type: DiscountTypeValue;
  value: number;
  description?: string;
  expiresAt: Date;
  minAmount?: number;
  maxUses?: number;
  isActive?: boolean;
}

// Interface pour la mise à jour d'un code promo
export interface UpdateDiscountInput {
  code?: string;
  type?: DiscountTypeValue;
  value?: number;
  description?: string;
  expiresAt?: Date;
  minAmount?: number;
  maxUses?: number;
  isActive?: boolean;
}

// Interface pour le résultat de validation d'un code promo
export interface DiscountValidationResult {
  isValid: boolean;
  discount: Discount | null;
  message: string;
}

// Interface pour le résultat de l'application d'un code promo
export interface ApplyDiscountResult {
  code: string;
  type: DiscountTypeValue;
  value: number;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  message: string;
}

// Interface pour les statistiques des codes promo
export interface DiscountStats {
  totalCodes: number;
  activeCodes: number;
  expiredCodes: number;
  totalUsage: number;
  mostUsedCode: {
    code: string;
    usedCount: number;
  } | null;
}
