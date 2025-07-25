import { Test, TestingModule } from '@nestjs/testing';
import { BookScraperController } from '../infra/book-scraper.controller';
import { BookScraperService } from '../app/book-scraper.service';

describe('BookScraperController', () => {
  let controller: BookScraperController;
  let service: BookScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookScraperController],
      providers: [
        {
          provide: BookScraperService,
          useValue: {
            getBooks: jest.fn(),
            getCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BookScraperController>(BookScraperController);
    service = module.get<BookScraperService>(BookScraperService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getBooks from service', async () => {
    await controller.getBooks();
    expect(service.getBooks).toHaveBeenCalled();
  });

  it('should call getCategories from service', async () => {
    await controller.getCategories();
    expect(service.getCategories).toHaveBeenCalled();
  });
});
