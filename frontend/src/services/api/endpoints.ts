import 'server-only';

import type { components } from '../../types/openapi';
import { apiFetch } from './typed-backend';

export type LoginDto = components['schemas']['LoginDto'];
export type RegisterDto = components['schemas']['RegisterDto'];
export type AuthResponseDto = components['schemas']['AuthResponseDto'];
export type UserResponseDto = components['schemas']['UserResponseDto'];
export type ChatbotQueryDto = components['schemas']['ChatbotQueryDto'];
export type ChatbotResponseDto = components['schemas']['ChatbotResponseDto'];
export type RecommendationConfigDto = components['schemas']['RecommendationConfigDto'];
export type ProductRecommendationResponseDto = components['schemas']['ProductRecommendationResponseDto'];

export const backendApi = {
  login: (dto: LoginDto) =>
    apiFetch('/auth/login', 'post', { body: dto, auth: false }),
  register: (dto: RegisterDto) =>
    apiFetch('/auth/register', 'post', { body: dto, auth: false }),
  refresh: () => apiFetch('/auth/refresh', 'post'),
  logout: () => apiFetch('/auth/logout', 'post'),
  me: () => apiFetch('/users/me', 'get', { retryOnUnauthorized: true }),
  chat: (dto: ChatbotQueryDto) =>
    apiFetch('/ai/chat', 'post', { body: dto, retryOnUnauthorized: true }),
  recommendations: (dto: RecommendationConfigDto) =>
    apiFetch('/ai/recommendations', 'post', { body: dto }),
};
