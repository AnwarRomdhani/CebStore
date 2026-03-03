'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  type CartSummary,
  type CartItem as ApiCartItem,
} from '@/services/api';

export interface CartItem extends ApiCartItem {}

interface UseCartReturn {
  cart: CartSummary | null;
  loading: boolean;
  error: Error | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  cartItemCount: number;
}

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cart'));
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity: number) => {
    await addToCartApi({ productId, quantity });
    await fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCartApi(itemId);
      await fetchCart();
      return;
    }
    await updateCartItemApi(itemId, quantity);
    await fetchCart();
  }, [fetchCart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    await removeFromCartApi(itemId);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    await clearCartApi();
    setCart(null);
  }, []);

  const refreshCart = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  const cartItemCount = cart?.totalItems ?? 0;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    cartItemCount,
  };
}
