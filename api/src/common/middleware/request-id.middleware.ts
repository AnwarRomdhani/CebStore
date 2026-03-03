import type { Request, Response, NextFunction } from 'express';

export type RequestWithRequestId = Request & { requestId?: string };

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function requestIdMiddleware(
  req: RequestWithRequestId,
  res: Response,
  next: NextFunction,
) {
  const incoming = req.header('x-request-id');
  const requestId =
    incoming && incoming.trim().length > 0 ? incoming : generateRequestId();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  next();
}
