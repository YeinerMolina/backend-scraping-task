import { Module } from '@nestjs/common';
import { BookScraperModule } from './book-scraper/book-scraper.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentKeys } from './shared/environment.keys';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    BookScraperModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get(EnvironmentKeys.DB_HOST),
          port: Number(config.get<number>(EnvironmentKeys.DB_PORT) ?? 0),
          username: config.get(EnvironmentKeys.DB_USER),
          password: config.get(EnvironmentKeys.DB_PASS),
          database: config.get(EnvironmentKeys.DB_NAME),
          autoLoadEntities: true,
          synchronize: config.get(EnvironmentKeys.DB_SYNC) === 'true',
        };
      },
    }),
    BooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
