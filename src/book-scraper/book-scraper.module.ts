import { Module } from '@nestjs/common';
import { BookScraperController } from './infra/book-scraper.controller';
import { BookScraperService } from './app/book-scraper.service';
import { SharedModule } from '../shared/shared.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [SharedModule, BooksModule],
  controllers: [BookScraperController],
  providers: [BookScraperService],
})
export class BookScraperModule {}