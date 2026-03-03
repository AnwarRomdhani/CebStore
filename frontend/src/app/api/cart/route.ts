import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function GET() {
  try {
    const data = await backendFetch(ApiRoutes.backend.carts, {
      method: 'GET',
      retryOnUnauthorized: true,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: 'Failed to fetch cart' }, { status: error.status });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await backendFetch(ApiRoutes.backend.carts, {
      method: 'DELETE',
      retryOnUnauthorized: true,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: 'Failed to clear cart' }, { status: error.status });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
