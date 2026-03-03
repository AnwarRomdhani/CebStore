import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time to live en secondes
  prefix?: string;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL: number;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD', '');

    this.defaultTTL = this.configService.get<number>('CACHE_DEFAULT_TTL', 3600);

    // Configuration Redis
    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        retryStrategy: (times) => {
          if (times > 10) {
            this.logger.error('Échec de connexion Redis après 10 tentatives');
            return null;
          }
          return Math.min(times * 200, 3000);
        },
      });
    } else {
      this.redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword || undefined,
        retryStrategy: (times) => {
          if (times > 10) {
            this.logger.error('Échec de connexion Redis après 10 tentatives');
            return null;
          }
          return Math.min(times * 200, 3000);
        },
      });
    }

    this.redis.on('connect', () => {
      this.logger.log('✅ Connecté à Redis');
    });

    this.redis.on('error', (error) => {
      this.logger.error(`❌ Erreur Redis: ${error.message}`);
    });
  }

  // Récupérer une valeur du cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Erreur lecture cache [${key}]: ${error.message}`);
      return null;
    }
  }

  // Stocker une valeur dans le cache
  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const ttl = options?.ttl || this.defaultTTL;
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttl, serialized);
      this.logger.debug(`Cache set [${key}] TTL: ${ttl}s`);
    } catch (error) {
      this.logger.error(`Erreur écriture cache [${key}]: ${error.message}`);
    }
  }

  // Supprimer une valeur du cache
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.debug(`Cache deleted [${key}]`);
    } catch (error) {
      this.logger.error(`Erreur suppression cache [${key}]: ${error.message}`);
    }
  }

  // Supprimer plusieurs clés par pattern
  async delByPattern(pattern: string): Promise<void> {
    try {
      let cursor = '0';
      let totalDeleted = 0;

      do {
        const [nextCursor, keys] = await this.redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await this.redis.del(...keys);
          totalDeleted += keys.length;
        }
      } while (cursor !== '0');

      if (totalDeleted > 0) {
        this.logger.debug(
          `Cache deleted by pattern [${pattern}]: ${totalDeleted} keys`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Erreur suppression cache par pattern [${pattern}]: ${error.message}`,
      );
    }
  }

  // Vérifier si une clé existe
  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Erreur vérification cache [${key}]: ${error.message}`);
      return false;
    }
  }

  // Incrémenter une valeur (pour les compteurs)
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const value = await this.redis.incr(key);
      if (ttl && value === 1) {
        await this.redis.expire(key, ttl);
      }
      return value;
    } catch (error) {
      this.logger.error(`Erreur incrément cache [${key}]: ${error.message}`);
      return 0;
    }
  }

  // Décémenter une valeur
  async decr(key: string): Promise<number> {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      this.logger.error(
        `Erreur décrémentation cache [${key}]: ${error.message}`,
      );
      return 0;
    }
  }

  // Récupérer les statistiques du cache
  async getStats(): Promise<{
    connected: boolean;
    keysCount?: number;
    memoryUsage?: number;
  }> {
    try {
      const connected = this.redis.status === 'ready';
      const [keysCount, memoryInfo] = await Promise.all([
        this.redis.dbsize(),
        this.redis.info('memory'),
      ]);

      const memoryUsage = memoryInfo
        .split('\n')
        .find((line) => line.includes('used_memory:'))
        ?.split(':')[1]
        .replace('\r', '');

      return {
        connected,
        keysCount: Number(keysCount),
        memoryUsage: memoryUsage ? parseInt(memoryUsage) / 1024 / 1024 : 0, // En MB
      };
    } catch (error) {
      this.logger.error(`Erreur stats cache: ${error.message}`);
      return { connected: false };
    }
  }

  // Vider tout le cache
  async flush(): Promise<void> {
    try {
      await this.redis.flushdb();
      this.logger.warn('Cache Redis vidé complètement');
    } catch (error) {
      this.logger.error(`Erreur flush cache: ${error.message}`);
    }
  }

  // Nettoyer les connexions à la fermeture du module
  onModuleDestroy() {
    this.redis.disconnect();
    this.logger.log('Connexion Redis fermée');
  }
}
