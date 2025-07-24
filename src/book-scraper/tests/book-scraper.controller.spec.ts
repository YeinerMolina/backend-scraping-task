import { Test, TestingModule } from '@nestjs/testing';
import { BookScraperController } from './book-scraper.controller';

describe('BookScraperController', () => {
  let controller: BookScraperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookScraperController],
    }).compile();

    controller = module.get<BookScraperController>(BookScraperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
