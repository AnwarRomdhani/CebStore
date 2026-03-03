import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FlouciModule } from './modules/payments/flouci/flouci.module';
import { CartsModule } from './modules/carts/carts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { AiModule } from './modules/ai/ai.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdminModule } from './modules/admin/admin.module';
import { GdprModule } from './modules/gdpr/gdpr.module';
import { CacheModule } from './modules/cache/cache.module';
import { ImagesModule } from './modules/images/images.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { SearchHistoryModule } from './modules/search-history/search-history.module';
import { ChatFeedbackModule } from './modules/chat-feedback/chat-feedback.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL', 60),
          limit: configService.get<number>('THROTTLE_LIMIT', 10),
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    ProductsModule,
    OrdersModule,
    FlouciModule,
    CartsModule,
    ReviewsModule,
    DiscountsModule,
    AiModule,
    WorkflowsModule,
    AnalyticsModule,
    AdminModule,
    GdprModule,
    CacheModule,
    ImagesModule,
    WishlistModule,
    SearchHistoryModule,
    ChatFeedbackModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
