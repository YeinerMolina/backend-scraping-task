import { Module } from '@nestjs/common';
import { BookScraperModule } from './book-scraper/book-scraper.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BookScraperModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
