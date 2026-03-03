import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from 'src/modules/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
