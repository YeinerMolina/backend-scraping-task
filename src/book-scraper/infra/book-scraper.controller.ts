import { Controller, Get } from '@nestjs/common';
import { BookScraperService } from '../app/book-scraper.service';

@Controller('book-scraper')
export class BookScraperController {
  constructor(private readonly service: BookScraperService) {}

  @Get()
  public initializeScraping() {
    return this.service.initializeScraping();
  }
}
