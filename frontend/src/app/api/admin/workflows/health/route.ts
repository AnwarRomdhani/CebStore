import { NextResponse } from 'next/server';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function GET() {
  const data = await backendFetch(`${ApiRoutes.backend.workflows}/health`, {
    method: 'GET',
    auth: false,
  });
  return NextResponse.json(data);
}
