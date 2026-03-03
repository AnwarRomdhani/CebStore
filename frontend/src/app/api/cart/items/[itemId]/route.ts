import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function PUT(
  req: Request,
  { params }: { params: { itemId: string } },
) {
  try {
    const body = await req.json();
    const data = await backendFetch(
      `${ApiRoutes.backend.carts}/items/${params.itemId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        retryOnUnauthorized: true,
      },
    );
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
  { params }: { params: { itemId: string } },
) {
  try {
    await backendFetch(`${ApiRoutes.backend.carts}/items/${params.itemId}`, {
      method: 'DELETE',
      retryOnUnauthorized: true,
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
