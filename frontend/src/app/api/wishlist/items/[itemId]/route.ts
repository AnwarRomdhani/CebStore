import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function DELETE(
  _req: Request,
  { params }: { params: { itemId: string } },
) {
  try {
    const data = await backendFetch(
      `${ApiRoutes.backend.wishlist}/items/${params.itemId}`,
      {
        method: 'DELETE',
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
