import { NextResponse } from 'next/server';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function POST() {
  const data = await backendFetch(`${ApiRoutes.backend.workflows}/stock/check-all`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
    retryOnUnauthorized: true,
  });
  return NextResponse.json(data);
}
