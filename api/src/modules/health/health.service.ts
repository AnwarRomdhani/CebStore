import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/modules/cache/cache.service';
import { ConfigService } from '@nestjs/config';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: ServiceHealth;
    cache: ServiceHealth;
    environment: ServiceHealth;
  };
  version: {
    node: string;
    uptime: string;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime: number;

  constructor(
    private prismaService: PrismaService,
    private cacheService: CacheService,
    private configService: ConfigService,
  ) {
    this.startTime = Date.now();
  }

  // Check overall system health
  async checkHealth(): Promise<HealthStatus> {
    const [databaseHealth, cacheHealth, environmentHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
      Promise.resolve(this.checkEnvironment()),
    ]);

    const services = {
      database: databaseHealth,
      cache: cacheHealth,
      environment: environmentHealth,
    };

    const status = this.determineOverallStatus(services);

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      services,
      version: {
        node: process.version,
        uptime: this.formatUptime(process.uptime()),
      },
    };
  }

  // Check database connectivity
  async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        status: responseTime > 1000 ? 'degraded' : 'up',
        responseTime,
        message: responseTime > 1000 ? 'High latency detected' : 'Connected',
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check cache connectivity
  async checkCache(): Promise<ServiceHealth> {
    const startTime = Date.now();
    try {
      const stats = await this.cacheService.getStats();
      const responseTime = Date.now() - startTime;

      if (!stats.connected) {
        return {
          status: 'down',
          message: 'Redis not connected',
        };
      }

      return {
        status: 'up',
        responseTime,
        message: `Connected (${stats.keysCount ?? 0} keys)`,
      };
    } catch (error) {
      this.logger.error('Cache health check failed', error);
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check environment configuration
  checkEnvironment(): ServiceHealth {
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
    const missing = requiredEnvVars.filter((varName) => !this.configService.get(varName));
    const hasRefreshSecret =
      !!this.configService.get('REFRESH_SECRET') ||
      !!this.configService.get('REFRESH_TOKEN_SECRET');
    if (!hasRefreshSecret) {
      missing.push('REFRESH_SECRET (or REFRESH_TOKEN_SECRET)');
    }

    if (missing.length > 0) {
      return {
        status: 'degraded',
        message: `Missing environment variables: ${missing.join(', ')}`,
      };
    }

    return {
      status: 'up',
      message: 'All required environment variables present',
    };
  }

  // Determine overall health status
  private determineOverallStatus(services: {
    database: ServiceHealth;
    cache: ServiceHealth;
    environment: ServiceHealth;
  }): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(services).map((s) => s.status);

    if (statuses.includes('down')) {
      return 'unhealthy';
    }

    if (statuses.includes('degraded')) {
      return 'degraded';
    }

    return 'healthy';
  }

  // Format uptime to human-readable string
  private formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(' ') || '< 1m';
  }
}
