import { Module } from '@nestjs/common';
import { BookScraperController } from './infra/book-scraper.controller';
import { BookScraperService } from './app/book-scraper.service';

@Module({
  controllers: [BookScraperController],
  providers: [BookScraperService],
})
export class BookScraperModule {}
