import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FlouciController } from './flouci.controller';
import { FlouciService } from './flouci.service';
import { FlouciWebhookService } from './flouci.webhook.service';
import { OrdersModule } from '../../orders/orders.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (_configService: ConfigService) => ({
        baseURL: 'https://developers.flouci.com/api/v1',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    ConfigModule,
    PrismaModule,
    OrdersModule,
  ],
  controllers: [FlouciController],
  providers: [FlouciService, FlouciWebhookService],
  exports: [FlouciService, FlouciWebhookService],
})
export class FlouciModule {}
