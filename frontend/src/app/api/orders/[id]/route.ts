import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data = await backendFetch(`${ApiRoutes.backend.orders}/${params.id}`, {
      method: 'GET',
      retryOnUnauthorized: true,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data = await backendFetch(`${ApiRoutes.backend.orders}/${params.id}`, {
      method: 'DELETE',
      retryOnUnauthorized: true,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
