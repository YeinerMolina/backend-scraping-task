import { Test, TestingModule } from '@nestjs/testing';
import { BookScraperService } from '../app/book-scraper.service';

describe('BookScraperService', () => {
  let service: BookScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookScraperService],
    }).compile();

    service = module.get<BookScraperService>(BookScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
