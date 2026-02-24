import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  /**
   * Gère toutes les exceptions non capturées
   * @param exception - Exception levée
   * @param host - Contexte d'exécution
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = this.getErrorName(status);
      } else if (typeof exceptionResponse === 'object') {
        message =
          (exceptionResponse as { message?: string | string[] }).message ||
          exceptionResponse;
        error =
          (exceptionResponse as { error?: string }).error ||
          this.getErrorName(status);
      } else {
        message = exceptionResponse;
        error = this.getErrorName(status);
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handlePrismaError(exception as PrismaError);
      error = 'Database Error';
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided';
      error = 'Validation Error';
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message =
        process.env.NODE_ENV === 'development'
          ? exception.message
          : 'Internal server error';
      error = 'Internal Server Error';

      if (process.env.NODE_ENV === 'development') {
        this.logger.error(
          `Unhandled error: ${exception.message}`,
          exception.stack,
        );
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An unexpected error occurred';
      error = 'Internal Server Error';
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      ...(process.env.NODE_ENV === 'development' && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    };

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${JSON.stringify(message)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  /**
   * Convertit le code HTTP en nom d'erreur
   * @param status - Code HTTP
   * @returns Nom de l'erreur
   */
  private getErrorName(status: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };

    return errorNames[status] || 'Error';
  }

  /**
   * Gère les erreurs spécifiques à Prisma
   * @param error - Erreur Prisma
   * @returns Message d'erreur formaté
   */
  private handlePrismaError(error: PrismaError): string {
    const errorMessages: Record<string, string> = {
      P2000: 'The value provided is too long for the field',
      P2001: 'Record not found',
      P2002: 'A unique constraint has been violated',
      P2003: 'A foreign key constraint has been violated',
      P2004: 'A constraint failed on the database',
      P2005: 'The value stored in the database is invalid for this field type',
      P2006: 'The provided value is invalid',
      P2007: 'Data validation error',
      P2008: 'Failed to run the query',
      P2009: 'Failed to validate the query',
      P2010: 'Raw query failed',
      P2011: 'Null constraint violation',
      P2012: 'Missing required value',
      P2013: 'Missing the required argument',
      P2014:
        'The change you are trying to make would violate the required relation',
      P2015: 'A related record could not be found',
      P2016: 'Query interpretation error',
      P2017: 'The records for the relation are not connected',
      P2018: 'The required connected records were not found',
      P2019: 'Input error',
      P2020: 'Value out of range for the type',
      P2021: 'The table does not exist in the database',
      P2022: 'The column does not exist in the database',
      P2023: 'Inconsistent column data',
      P2024: 'Timed out fetching a new connection from the pool',
      P2025:
        'An operation failed because it depends on one or more required records',
    };

    const defaultMessage = 'A database error occurred';
    return errorMessages[error.code || ''] || defaultMessage;
  }
}

/**
 * Filter pour les erreurs de validation
 * @description Formate spécifiquement les erreurs de class-validator
 */
@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Validation');

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (
      status === 400 &&
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const messages = exceptionResponse.message;

      let formattedMessages: string[];

      if (Array.isArray(messages)) {
        formattedMessages = messages.map((msg: string) => {
          if (typeof msg === 'string') return msg;
          return JSON.stringify(msg);
        });
      } else {
        formattedMessages = [String(messages)];
      }

      const errorResponse = {
        success: false,
        statusCode: status,
        error: 'Validation Error',
        message: formattedMessages,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      };

      this.logger.warn(
        `[${request.method}] ${request.url} - Validation Error: ${JSON.stringify(formattedMessages)}`,
      );

      response.status(status).json(errorResponse);
      return;
    }

    throw exception;
  }
}
