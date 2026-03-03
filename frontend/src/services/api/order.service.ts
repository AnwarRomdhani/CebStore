import { ApiError } from './errors';
import { ApiRoutes } from '@/shared/api-routes';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod?: string;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (data && typeof data.message === 'string' && data.message) ||
      `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export async function getOrders(query: OrdersQuery = {}): Promise<OrdersResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.status) params.set('status', query.status);
  if (query.search) params.set('search', query.search);

  const url = params.toString()
    ? `${ApiRoutes.proxy.orders}?${params.toString()}`
    : ApiRoutes.proxy.orders;

  return request<OrdersResponse>(url, { method: 'GET' });
}

export async function getOrder(id: string): Promise<Order> {
  return request<Order>(`${ApiRoutes.proxy.orders}/${id}`, { method: 'GET' });
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  return request<Order>(ApiRoutes.proxy.orders, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function cancelOrder(id: string): Promise<Order> {
  return request<Order>(`${ApiRoutes.proxy.orders}/${id}/cancel`, {
    method: 'POST',
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  return request<Order>(`${ApiRoutes.proxy.orders}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
