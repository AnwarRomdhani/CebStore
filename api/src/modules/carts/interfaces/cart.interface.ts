export interface CartSummary {
  cartId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: string; // Decimal
  shippingCost: string; // Decimal
  discount: string; // Decimal
  total: string; // Decimal
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: string; // Decimal
  productImage?: string;
  quantity: number;
  subtotal: string; // Decimal
}

export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  validatedItems: ValidatedCartItem[];
}

export interface ValidatedCartItem {
  cartItemId: string;
  productId: string;
  requestedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
}
