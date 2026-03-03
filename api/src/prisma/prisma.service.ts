import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private readonly slowQueryThreshold: number;

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
      max: 10, // Maximum number of connections in the pool
      min: 2, // Minimum number of connections in the pool
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 5000, // Fail fast if can't connect
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });

    this.slowQueryThreshold = configService.get<number>(
      'SLOW_QUERY_THRESHOLD_MS',
      1000,
    );
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
    }
  }

  // Enable explicit transactions with timeout
  async withTransaction<T>(
    fn: (
      tx: Omit<
        PrismaService,
        '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
      >,
    ) => Promise<T>,
    timeout = 30000,
  ): Promise<T> {
    return this.$transaction(fn, { timeout });
  }

  // Clean database (development only)
  async cleanDatabase(): Promise<void> {
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      throw new Error('Cannot clean database in production environment');
    }

    // Delete in order respecting foreign key constraints
    await this.chatFeedback.deleteMany();
    await this.searchHistory.deleteMany();
    await this.wishlistItem.deleteMany();
    await this.wishlist.deleteMany();
    await this.review.deleteMany();
    await this.discount.deleteMany();
    await this.payment.deleteMany();
    await this.orderItem.deleteMany();
    await this.order.deleteMany();
    await this.cartItem.deleteMany();
    await this.cart.deleteMany();
    await this.product.deleteMany();
    await this.category.deleteMany();
    await this.user.deleteMany();

    this.logger.log('Database cleaned successfully');
  }
}
