import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import type { RecommendationConfigDto } from '@/services/api/endpoints';
import { ApiRoutes } from '@/shared/api-routes';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<RecommendationConfigDto> | null;

  const dto: RecommendationConfigDto = {
    userId: undefined,
    limit: typeof body?.limit === 'number' ? body.limit : undefined,
    preferredCategories: Array.isArray(body?.preferredCategories)
      ? body.preferredCategories
      : undefined,
    minPrice: typeof body?.minPrice === 'number' ? body.minPrice : undefined,
    maxPrice: typeof body?.maxPrice === 'number' ? body.maxPrice : undefined,
  };

  try {
    const data = await backendFetch(`${ApiRoutes.backend.ai}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
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
