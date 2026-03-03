import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import {
  backendFetch,
  setAuthCookies,
  type AuthResponseDto,
} from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await backendFetch<AuthResponseDto>(
      `${ApiRoutes.backend.auth}/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        auth: false,
      },
    );

    setAuthCookies(data);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
