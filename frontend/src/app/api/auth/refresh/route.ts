import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import {
  setAuthCookies,
  type AuthResponseDto,
} from '@/services/api/server';
import { cookies } from 'next/headers';
import { getBackendBaseUrl } from '@/services/api/base';
import { AUTH_COOKIES } from '@/shared/auth-cookies';
import { ApiRoutes } from '@/shared/api-routes';

export async function POST() {
  try {
    const refresh = cookies().get(AUTH_COOKIES.refresh)?.value;
    if (!refresh) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const res = await fetch(`${getBackendBaseUrl()}${ApiRoutes.backend.auth}/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refresh}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    const data = (await res.json().catch(() => null)) as AuthResponseDto | null;
    if (!res.ok || !data?.accessToken || !data.refreshToken) {
      return NextResponse.json({ message: 'Refresh failed' }, { status: res.status || 500 });
    }

    setAuthCookies(data);
    return NextResponse.json({ user: data.user });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: 'Refresh failed' }, { status: error.status });
    }
    return NextResponse.json({ message: 'Refresh failed' }, { status: 500 });
  }
}
