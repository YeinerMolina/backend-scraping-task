import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { response } from 'express';
import { map, Observable } from 'rxjs';
import { IApiResponse } from 'src/core/domain/api-response';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, IApiResponse<T>>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IApiResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        const message = this.getStatusMessage(statusCode);

        return {
          statusCode,
          data: data ?? null,
          message,
          success: true,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }

  private getStatusMessage(statusCode: number): string {
    const messages: Record<number, string> = {
      [HttpStatus.OK]: 'OK',
      [HttpStatus.CREATED]: 'Created',
      [HttpStatus.NO_CONTENT]: 'No Content',
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    };

    return messages[statusCode] || 'Unknown Status';
  }
}
