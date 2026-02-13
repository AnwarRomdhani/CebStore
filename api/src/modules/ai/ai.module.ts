/**
 * Module AI RAG
 * @description Module NestJS pour les fonctionnalités dintelligence artificielle
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  controllers: [AiController],
  providers: [AiService, JwtAuthGuard, RolesGuard],
  exports: [AiService],
})
export class AiModule {}

