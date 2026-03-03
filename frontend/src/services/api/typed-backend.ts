import 'server-only';

import type { paths } from '../../types/openapi';
import { backendFetch } from './server';

type PathKey = keyof paths & string;
type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type MethodForPath<P extends PathKey> = Extract<keyof paths[P], HttpMethod>;

type Operation<P extends PathKey, M extends MethodForPath<P>> = paths[P][M];

type JsonRequestBody<Op> = Op extends {
  requestBody: { content: { 'application/json': infer B } };
}
  ? B
  : Op extends {
        requestBody?: { content: { 'application/json': infer B } };
      }
    ? B
    : never;

type JsonResponseContent<R> = R extends {
  content: { 'application/json': infer C };
}
  ? C
  : never;

type SuccessResponse<Responses> =
  (200 extends keyof Responses ? JsonResponseContent<Responses[200]> : never) |
  (201 extends keyof Responses ? JsonResponseContent<Responses[201]> : never) |
  (202 extends keyof Responses ? JsonResponseContent<Responses[202]> : never) |
  (204 extends keyof Responses ? void : never);

type JsonResponseBody<Op> = Op extends { responses: infer R }
  ? SuccessResponse<R>
  : never;

export async function apiFetch<
  P extends PathKey,
  M extends MethodForPath<P>,
>(
  path: P,
  method: M,
  options: {
    body?: JsonRequestBody<Operation<P, M>>;
    auth?: boolean;
    retryOnUnauthorized?: boolean;
  } = {},
): Promise<JsonResponseBody<Operation<P, M>>> {
  const headers: Record<string, string> = {};
  const hasBody =
    typeof options.body !== 'undefined' && options.body !== null;
  if (hasBody) headers['Content-Type'] = 'application/json';

  return await backendFetch<JsonResponseBody<Operation<P, M>>>(path, {
    method: method.toUpperCase(),
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
    auth: options.auth,
    retryOnUnauthorized: options.retryOnUnauthorized,
  });
}

