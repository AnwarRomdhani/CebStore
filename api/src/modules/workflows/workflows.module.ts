/**
 * Module des workflows n8n
 * @description Gère le déclenchement des workflows n8n pour les notifications automatisées
 */

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
