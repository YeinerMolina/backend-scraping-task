import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiResponse } from 'src/core/domain/api-response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractErrorMessage(exception);
    const apiResponse: IApiResponse<null> = {
      message,
      success: false,
      statusCode: status,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status).json(apiResponse);
  }

  private extractErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        return resObj.message ?? 'An error occurred';
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Internal server error';
  }
}
