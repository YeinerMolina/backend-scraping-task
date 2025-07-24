import { Module } from '@nestjs/common';
import { BookScraperController } from './infra/book-scraper.controller';
import { BookScraperService } from './app/book-scraper.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BookScraperController],
  providers: [BookScraperService],
})
export class BookScraperModule {}