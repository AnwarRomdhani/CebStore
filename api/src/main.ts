import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Project description
  app.setGlobalPrefix('api/v1');

  // ==================== SÉCURITÉ ====================

  // Helmet : Headers de sécurité HTTP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
          frameSrc: ["'none'"], // Protection clickjacking
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' }, // Protection clickjacking
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

  // Cookie parser (nécessaire pour CSRF)
  app.use(cookieParser());

  // Protection CSRF (pour les API stateful)
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production', // HTTPS requis en prod
      },
    }),
  );

  // ==================== VALIDATION ====================

  // Set Global validation
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

  // ==================== CORS ====================

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-CSRF-Token'],
    exposedHeaders: ['X-CSRF-Token'],
  });

  // Enable Swagger docs
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication related endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter refresh JWT token',
        in: 'header',
      },
      'JWT-refresh',
    )
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.cebstore.com', 'Production server (HTTPS)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar {display: none}
      .swagger-ui .info { margin: 50px 0; }
      .swagger-ui .info .title {color: #4A90E2;}
    `,
  });

  await app.listen(process.env.PORT ?? 3001);
}

/**
 * Démarrage avec support HTTPS en production
 */
async function bootstrapSecure() {
  const httpsEnabled = process.env.HTTPS_ENABLED === 'true';

  if (httpsEnabled) {
    const https = require('https');
    const fs = require('fs');

    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/private.key'),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH || './ssl/certificate.crt'),
    };

    const app = await NestFactory.create(AppModule);
    // ... (même configuration que bootstrap)
    await app.listen(3001);
    Logger.log(`🔒 Serveur HTTPS démarré sur le port 3001`);
  } else {
    await bootstrap();
    Logger.log(`🚀 Serveur HTTP démarré sur le port 3001`);
    if (process.env.NODE_ENV === 'production') {
      Logger.warn('⚠️  HTTPS non activé en production ! Configurez HTTPS_ENABLED=true');
    }
  }
}

bootstrapSecure().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
