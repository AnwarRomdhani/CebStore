/**
 * Logging Interceptor
 * @description Intercepte toutes les requêtes pour logger les informations de debugging
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Extension de Request avec les informations utilisateur
 */
interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  startTime?: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  /**
   * Intercepte la requête pour ajouter le logging
   * @param context - Contexte d'exécution NestJS
   * @param next - Gestionnaire d'appel suivant
   * @returns Observable de la réponse
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const method = (request as any).method;
    const originalUrl = (request as any).originalUrl || (request as any).url;
    const ip = (request as any).ip || '';
    const userAgent = (request as any).headers?.['user-agent'] || '';
    const startTime = Date.now();

    // Ajouter le temps de début à la requête pour utilisation ultérieure
    request.startTime = startTime;

    // Log de la requête entrante
    const userId = request.user?.id || 'anonymous';
    this.logger.log(
      `[${method}] ${originalUrl} - IP: ${ip} - User: ${userId} - Agent: ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          const statusCode = context.switchToHttp().getResponse().statusCode;

          // Log de la réponse avec le temps de réponse
          this.logger.log(
            `[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms - User: ${userId}`,
          );

          // Logger les données de réponse (limité pour éviter les logs trop volumineux)
          if (process.env.NODE_ENV === 'development') {
            const responsePreview =
              typeof data === 'object'
                ? JSON.stringify(data).substring(0, 200) + '...'
                : data;
            this.logger.debug(`Response: ${responsePreview}`);
          }
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log des erreurs
          this.logger.error(
            `[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}

/**
 * Interceptor pour ajouter les headers de logging
 * @description Ajoute des headers pour faciliter le debugging distribué
 */
@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestId');

  /**
   * Génère un ID unique pour chaque requête
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = this.generateRequestId();

    // Ajouter l'ID de requête aux headers
    request.headers['x-request-id'] = requestId;

    // Ajouter l'ID de requête à la réponse
    const response = context.switchToHttp().getResponse();
    response.setHeader('x-request-id', requestId);

    const { method, originalUrl } = request;
    this.logger.debug(`Request ID: ${requestId} - ${method} ${originalUrl}`);

    return next.handle();
  }
}

/**
 * Interceptor pour logger les erreurs de validation
 * @description Capture et log les erreurs de validation DTO
 */
@Injectable()
export class ValidationErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Validation');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
    );
  }
}

