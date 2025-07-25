import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseTransformInterceptor } from './core/interceptors/response-transform-interceptor/response-transform.interceptor';
import { GlobalExceptionFilter } from './core/exception-filters/global-exception-filter/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
