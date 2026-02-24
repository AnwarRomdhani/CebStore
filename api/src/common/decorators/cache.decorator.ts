/**
 * Décorateur de cache pour les méthodes
 * @description Met en cache le résultat d'une méthode
 */

import { SetMetadata, applyDecorators, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

/**
 * Décorateur pour mettre en cache une méthode
 * @param key Clé de cache (peut contenir des placeholders {arg0}, {arg1}, etc.)
 * @param ttl Time to live en secondes
 */
export const Cache = (key: string, ttl: number = 3600) => {
  return SetMetadata(CACHE_KEY, { key, ttl });
};

/**
 * Décorateur pour invalider le cache
 * @param pattern Pattern des clés à invalider (ex: 'product:*')
 */
export const CacheInvalidate = (pattern: string) => {
  return SetMetadata('cache_invalidate', pattern);
};

/**
 * Interceptor pour gérer le cache automatiquement
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private cacheService: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const cacheKey = context.getHandler();
    const cacheData = Reflect.getMetadata(CACHE_KEY, cacheKey);
    const invalidatePattern = Reflect.getMetadata('cache_invalidate', cacheKey);

    // Si invalidation, supprimer le cache après exécution
    if (invalidatePattern) {
      return next.handle().pipe(
        tap(async () => {
          if (this.cacheService?.delByPattern) {
            await this.cacheService.delByPattern(invalidatePattern);
          }
        }),
      );
    }

    // Si pas de configuration de cache, passer directement
    if (!cacheData || !this.cacheService) {
      return next.handle();
    }

    const { key: keyPattern, ttl } = cacheData;
    const args = context.getArgs();

    // Générer la clé de cache
    let cacheKeyGenerated = keyPattern;
    args.forEach((arg: any, index: number) => {
      const placeholder = `{arg${index}}`;
      if (keyPattern.includes(placeholder)) {
        const value = typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg);
        cacheKeyGenerated = cacheKeyGenerated.replace(placeholder, value);
      }
    });

    // Vérifier si déjà en cache
    return new Observable((observer) => {
      this.cacheService
        .get(cacheKeyGenerated)
        .then(async (cachedValue: any) => {
          if (cachedValue !== null) {
            observer.next(cachedValue);
            observer.complete();
            return;
          }

          // Exécuter la méthode et mettre en cache
          next.handle().subscribe({
            next: async (value) => {
              await this.cacheService.set(cacheKeyGenerated, value, { ttl });
              observer.next(value);
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
        })
        .catch((error: any) => {
          // En cas d'erreur Redis, passer directement
          next.handle().subscribe({
            next: (value) => observer.next(value),
            error: (error) => observer.error(error),
          });
        });
    });
  }
}
