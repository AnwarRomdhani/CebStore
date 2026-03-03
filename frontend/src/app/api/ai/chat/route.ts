import { NextResponse } from 'next/server';
import { ApiError } from '@/services/api/errors';
import { backendFetch } from '@/services/api/server';
import type { ChatbotQueryDto } from '@/services/api/endpoints';
import { ApiRoutes } from '@/shared/api-routes';

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<ChatbotQueryDto> | null;

  const dto: ChatbotQueryDto = {
    message: typeof body?.message === 'string' ? body.message : '',
    sessionId: typeof body?.sessionId === 'string' ? body.sessionId : undefined,
    includeHistory: typeof body?.includeHistory === 'boolean' ? body.includeHistory : false,
    temperature: typeof body?.temperature === 'number' ? body.temperature : undefined,
  };

  if (!dto.message) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  try {
    const data = await backendFetch(`${ApiRoutes.backend.ai}/chat`, {
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
