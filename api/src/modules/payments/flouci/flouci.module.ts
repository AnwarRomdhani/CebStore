import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FlouciController } from './flouci.controller';
import { FlouciService } from './flouci.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      useFactory: (_configService: ConfigService) => ({
        baseURL: 'https://developers.flouci.com/api/v1',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  ],
  controllers: [FlouciController],
  providers: [FlouciService],
  exports: [FlouciService],
})
export class FlouciModule {}
