import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import { ApiRoutes } from '@/shared/api-routes';

export async function GET(req: Request) {
  try {
    const query = new URL(req.url).searchParams.toString();
    const path = query
      ? `${ApiRoutes.backend.orders}?${query}`
      : ApiRoutes.backend.orders;
    const data = await backendFetch(path, {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await backendFetch(ApiRoutes.backend.orders, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
