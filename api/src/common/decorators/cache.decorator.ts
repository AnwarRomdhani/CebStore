import {
  SetMetadata,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

export const Cache = (key: string, ttl: number = 3600) => {
  return SetMetadata(CACHE_KEY, { key, ttl });
};

export const CacheInvalidate = (pattern: string) => {
  return SetMetadata('cache_invalidate', pattern);
};

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
        tap(() => {
          if (this.cacheService?.delByPattern) {
            void this.cacheService.delByPattern(invalidatePattern);
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
        const value =
          typeof arg === 'object' && arg !== null
            ? JSON.stringify(arg)
            : String(arg);
        cacheKeyGenerated = cacheKeyGenerated.replace(placeholder, value);
      }
    });

    // Vérifier si déjà en cache
    return new Observable((observer) => {
      this.cacheService
        .get(cacheKeyGenerated)
        .then((cachedValue: any) => {
          if (cachedValue !== null) {
            observer.next(cachedValue);
            observer.complete();
            return;
          }

          // Exécuter la méthode et mettre en cache
          next.handle().subscribe({
            next: (value) => {
              this.cacheService
                .set(cacheKeyGenerated, value, { ttl })
                .catch(() => {
                  // Ignore cache set errors
                });
              observer.next(value);
              observer.complete();
            },
            error: (err) => observer.error(err),
          });
        })
        .catch((_error: any) => {
          // En cas d'erreur Redis, passer directement
          next.handle().subscribe({
            next: (value) => observer.next(value),
            error: (err) => observer.error(err),
          });
        });
    });
  }
}
