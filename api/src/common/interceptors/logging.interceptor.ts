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

interface RequestWithContext extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  requestId?: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const method = (request as any).method;
    const originalUrl = (request as any).originalUrl || (request as any).url;
    const ip = (request as any).ip || '';
    const userAgent = (request as any).headers?.['user-agent'] || '';
    const startTime = Date.now();

    const userId = request.user?.id || 'anonymous';
    const requestId =
      request.requestId || (request.headers['x-request-id'] as string) || '-';

    this.logger.log(
      `[${method}] ${originalUrl} - ${requestId} - IP: ${ip} - User: ${userId} - Agent: ${userAgent}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime;
          const statusCode = context.switchToHttp().getResponse().statusCode;

          this.logger.log(
            `[${method}] ${originalUrl} - ${requestId} - ${statusCode} - ${responseTime}ms - User: ${userId}`,
          );

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

          this.logger.error(
            `[${method}] ${originalUrl} - ${requestId} - ${statusCode} - ${responseTime}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
