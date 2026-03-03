import 'server-only';

import { cookies } from 'next/headers';
import { getBackendBaseUrl } from './base';
import { ApiError } from './errors';
import { AUTH_COOKIES } from '@/shared/auth-cookies';
import { ApiRoutes } from '@/shared/api-routes';

type BackendFetchInit = RequestInit & {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

export type AuthResponseDto = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'USER' | 'ADMIN';
  };
};

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export function setAuthCookies(data: AuthResponseDto): void {
  const jar = cookies();
  jar.set(AUTH_COOKIES.access, data.accessToken, cookieBase);
  jar.set(AUTH_COOKIES.refresh, data.refreshToken, cookieBase);
}

export function clearAuthCookies(): void {
  const jar = cookies();
  jar.set(AUTH_COOKIES.access, '', { ...cookieBase, maxAge: 0 });
  jar.set(AUTH_COOKIES.refresh, '', { ...cookieBase, maxAge: 0 });
}

async function refreshSession(): Promise<boolean> {
  const jar = cookies();
  const refresh = jar.get(AUTH_COOKIES.refresh)?.value;
  if (!refresh) return false;

  const res = await fetch(`${getBackendBaseUrl()}${ApiRoutes.backend.auth}/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${refresh}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) return false;

  const data = (await res.json()) as AuthResponseDto;
  if (!data?.accessToken || !data?.refreshToken) return false;
  setAuthCookies(data);
  return true;
}

export async function backendFetch<T>(
  path: string,
  init: BackendFetchInit = {},
): Promise<T> {
  const baseUrl = getBackendBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  if (init.auth !== false) {
    const access = cookies().get(AUTH_COOKIES.access)?.value;
    if (access) headers.set('Authorization', `Bearer ${access}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: init.cache ?? 'no-store',
  });

  if (res.status === 401 && init.auth !== false && init.retryOnUnauthorized) {
    const refreshed = await refreshSession();
    if (refreshed) {
      const retryHeaders = new Headers(init.headers);
      retryHeaders.set('Accept', 'application/json');
      const access = cookies().get(AUTH_COOKIES.access)?.value;
      if (access) retryHeaders.set('Authorization', `Bearer ${access}`);

      const retryRes = await fetch(url, {
        ...init,
        headers: retryHeaders,
        cache: 'no-store',
      });

      if (retryRes.ok) return (await retryRes.json()) as T;
      const retryText = await retryRes.text().catch(() => '');
      throw new ApiError(
        `Backend request failed (${retryRes.status})`,
        retryRes.status,
        retryText,
      );
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(`Backend request failed (${res.status})`, res.status, text);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
