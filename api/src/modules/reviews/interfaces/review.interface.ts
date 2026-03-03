import { Prisma } from '@prisma/client';

type Review = Prisma.ReviewGetPayload<Record<string, never>>;

// Interface pour un avis avec les relations
export interface ReviewWithUser extends Review {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
}

// Interface pour un avis avec les relations du produit
export interface ReviewWithRelations extends Review {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  product: {
    id: string;
    name: string;
    sku: string;
  };
}

// Type pour la création d'un avis
export interface CreateReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}

// Type pour la mise à jour d'un avis
export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

// Type pour le résumé des notes d'un produit
export interface RatingSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Type pour la vérification d'achat
export interface PurchaseVerification {
  hasPurchased: boolean;
  orderId?: string;
  orderDate?: Date;
}
