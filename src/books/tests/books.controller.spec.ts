import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../infra/books.controller';
import { BooksService } from '../app/books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const result = [{ title: 'Book 1' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return books by category', async () => {
      const result = [{ title: 'Book 1', category: 'Fiction' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
      expect(await controller.findAll('Fiction')).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith('Fiction');
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const result = { title: 'Book 1' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);
      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
