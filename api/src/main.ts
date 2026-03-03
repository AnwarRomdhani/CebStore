import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as fs from 'fs';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { requestIdMiddleware } from './common/middleware/request-id.middleware';
import { ConfigService } from '@nestjs/config';

// Configure application-wide settings
function configureApp(app: INestApplication): void {
  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Request ID middleware for tracing
  app.use(requestIdMiddleware);

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
          ],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global error handling
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS configuration
  const configService = app.get(ConfigService);
  const allowedOrigins = configService
    .get<string>('ALLOWED_ORIGINS')
    ?.split(',') ?? ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-request-id'],
    exposedHeaders: ['x-request-id'],
    maxAge: 86400, // 24 hours
  });
}

// Setup Swagger documentation
function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('CebStore E-Commerce API')
    .setDescription('AI-powered e-commerce platform API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('products', 'Product catalog')
    .addTag('orders', 'Order management')
    .addTag('payments', 'Payment processing')
    .addTag('ai', 'AI features (chatbot, recommendations)')
    .addTag('admin', 'Admin operations')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh',
        description: 'Enter JWT refresh token',
        in: 'header',
      },
      'JWT-refresh',
    )
    .addServer('http://localhost:3001', 'Development')
    .addServer('https://api.cebstore.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'CebStore API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar {display: none}
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title {color: #4A90E2;}
      .swagger-ui .scheme-container {background: #fff;}
    `,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  configureApp(app);
  setupSwagger(app);

  // Graceful shutdown
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3001;

  // Handle shutdown signals
  const shutdownSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.log(`${signal} received. Starting graceful shutdown...`);

    try {
      await app.close();
      logger.log('Application closed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error);
      process.exit(1);
    }
  };

  shutdownSignals.forEach((signal) =>
    process.on(signal, () => {
      void shutdown(signal);
    }),
  );

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    void shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', reason as Error);
    void shutdown('unhandledRejection');
  });

  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

// Démarrage avec support HTTPS en production
async function bootstrapSecure() {
  const httpsEnabled = process.env.HTTPS_ENABLED === 'true';

  if (httpsEnabled) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/private.key'),
      cert: fs.readFileSync(
        process.env.SSL_CERT_PATH || './ssl/certificate.crt',
      ),
    };

    const app = await NestFactory.create(AppModule, {
      httpsOptions,
    });
    // ... (même configuration que bootstrap)
    await app.listen(3001);
    Logger.log(`🔒 Serveur HTTPS démarré sur le port 3001`);
  } else {
    await bootstrap();
    Logger.log(`🚀 Serveur HTTP démarré sur le port 3001`);
    if (process.env.NODE_ENV === 'production') {
      Logger.warn(
        '⚠️  HTTPS non activé en production ! Configurez HTTPS_ENABLED=true',
      );
    }
  }
}

bootstrapSecure().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
