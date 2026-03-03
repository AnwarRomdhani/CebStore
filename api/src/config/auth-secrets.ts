import { ConfigService } from '@nestjs/config';

function isProduction(configService: ConfigService): boolean {
  return configService.get<string>('NODE_ENV') === 'production';
}

export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (secret) return secret;

  if (isProduction(configService)) {
    throw new Error('Missing JWT_SECRET in environment');
  }

  return 'dev-jwt-secret-change-me';
}

export function getRefreshSecret(configService: ConfigService): string {
  const secret =
    configService.get<string>('REFRESH_SECRET') ||
    configService.get<string>('REFRESH_TOKEN_SECRET');
  if (secret) return secret;

  if (isProduction(configService)) {
    throw new Error(
      'Missing REFRESH_SECRET (or REFRESH_TOKEN_SECRET) in environment',
    );
  }

  return 'dev-refresh-secret-change-me';
}
