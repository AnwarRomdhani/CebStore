
import { ApiError } from './errors';
import { ApiRoutes } from '@/shared/api-routes';
import { AUTH_COOKIES } from '@/shared/auth-cookies';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'USER' | 'ADMIN';
  };
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN';
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

export async function login(dto: LoginDto): Promise<AuthResponse> {
  return request<AuthResponse>(`${ApiRoutes.proxy.auth}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  return request<AuthResponse>(`${ApiRoutes.proxy.auth}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
}

export async function logout(): Promise<void> {
  await request(`${ApiRoutes.proxy.auth}/logout`, { method: 'POST' });
}

export async function getCurrentUser(): Promise<UserDto | null> {
  try {
    return await request<UserDto>(`${ApiRoutes.proxy.auth}/me`, {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function refreshTokens(): Promise<AuthResponse> {
  return request<AuthResponse>(`${ApiRoutes.proxy.auth}/refresh`, {
    method: 'POST',
  });
}

export function clearAuthCookies(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIES.access}=; Max-Age=0; path=/`;
  document.cookie = `${AUTH_COOKIES.refresh}=; Max-Age=0; path=/`;
}
