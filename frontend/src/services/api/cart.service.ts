import { ApiError } from './errors';
import { ApiRoutes } from '@/shared/api-routes';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  productImage: string | null;
  quantity: number;
  subtotal: string;
  productStock: number;
}

export interface CartSummary {
  cartId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: string;
  shippingCost: string;
  discount: string;
  total: string;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data && typeof data.message === 'string' && data.message) ||
      `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export async function getCart(): Promise<CartSummary | null> {
  try {
    return await request<CartSummary>(ApiRoutes.proxy.cart, { method: 'GET' });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function addToCart(dto: AddToCartDto): Promise<CartItem> {
  return request<CartItem>(`${ApiRoutes.proxy.cart}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  return request<CartItem>(`${ApiRoutes.proxy.cart}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeFromCart(itemId: string): Promise<void> {
  await request(`${ApiRoutes.proxy.cart}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function clearCart(): Promise<void> {
  await request(ApiRoutes.proxy.cart, { method: 'DELETE' });
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart?.totalItems ?? 0;
}
