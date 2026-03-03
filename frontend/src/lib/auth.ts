import { ApiError } from '../services/api/errors';
import { backendApi } from '../services/api/endpoints';
import type { AuthUserDto, Role } from '../types/auth';

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export async function getCurrentUser(): Promise<AuthUserDto | null> {
  try {
    const user = await backendApi.me();
    const extra = user as unknown as { firstName?: unknown; lastName?: unknown };
    return {
      id: user.id,
      email: user.email,
      firstName: toNullableString(extra.firstName),
      lastName: toNullableString(extra.lastName),
      role: user.role as Role,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export async function requireUser(): Promise<AuthUserDto> {
  const user = await getCurrentUser();
  if (!user) throw new ApiError('Unauthorized', 401);
  return user;
}

export async function requireRole(role: Role): Promise<AuthUserDto> {
  const user = await requireUser();
  if (user.role !== role) throw new ApiError('Forbidden', 403);
  return user;
}

