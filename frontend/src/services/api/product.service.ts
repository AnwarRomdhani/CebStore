import { ApiError } from './errors';
import { ApiRoutes } from '@/shared/api-routes';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export async function getProducts(query: ProductsQuery = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.search) params.set('search', query.search);
  if (query.category) params.set('category', query.category);
  if (query.isActive !== undefined) params.set('isActive', String(query.isActive));

  const url = params.toString()
    ? `${ApiRoutes.proxy.products}?${params.toString()}`
    : ApiRoutes.proxy.products;

  return request<ProductsResponse>(url, { method: 'GET' });
}

export async function getProduct(id: string): Promise<Product> {
  return request<Product>(`${ApiRoutes.proxy.products}/${id}`, { method: 'GET' });
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  return request<Product>(ApiRoutes.proxy.products, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  return request<Product>(`${ApiRoutes.proxy.products}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await request<void>(`${ApiRoutes.proxy.products}/${id}`, { method: 'DELETE' });
}

export async function updateProductStock(id: string, quantity: number): Promise<Product> {
  return request<Product>(`${ApiRoutes.proxy.products}/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
}
