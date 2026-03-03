import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { HealthService, HealthStatus } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Basic health check (for load balancers)
  @Get()
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  basicHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  // Detailed health check with service status
  @Get('detailed')
  @ApiOperation({
    summary: 'Detailed health check',
    description: 'Returns detailed health status of all services',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
  })
  async detailedHealth(): Promise<HealthStatus> {
    return this.healthService.checkHealth();
  }

  // Readiness probe (for Kubernetes)
  @Get('ready')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  async readiness(): Promise<{ ready: boolean; timestamp: string }> {
    const health = await this.healthService.checkHealth();
    const isReady = health.status !== 'unhealthy';

    return {
      ready: isReady,
      timestamp: new Date().toISOString(),
    };
  }

  // Liveness probe (for Kubernetes)
  @Get('live')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  liveness(): { alive: boolean; timestamp: string } {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
    };
  }
}
