import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const data = await backendFetch(
      `${ApiRoutes.backend.products}/${params.id}/stock`,
      {
        method: 'PATCH',
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
