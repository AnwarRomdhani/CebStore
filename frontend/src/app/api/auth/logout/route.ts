import { NextResponse } from 'next/server';
import { backendFetch, clearAuthCookies } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function POST() {
  try {
    await backendFetch(`${ApiRoutes.backend.auth}/logout`, {
      method: 'POST',
      retryOnUnauthorized: true,
    });
  } catch {
    // Clear cookies even if backend logout fails
  }

  clearAuthCookies();
  return NextResponse.json({ message: 'Logged out successfully' });
}
