import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../app/books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../domain/entities/book.entity';
import { EntityManager, Repository } from 'typeorm';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            merge: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateByTitle', () => {
    it('should create a new book if it does not exist', async () => {
      const newBook = { title: 'Test Book', price: '10.00', availability: 'In stock', rating: 'Five', ratingNumber: 5, category: 'Fiction', description: 'A test book', imageUrl: 'test.jpg' };
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bookRepository, 'create').mockReturnValue(newBook as Book);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(newBook as Book);

      const result = await service.createOrUpdateByTitle(newBook);
      expect(bookRepository.findOne).toHaveBeenCalledWith({ where: { title: newBook.title } });
      expect(bookRepository.create).toHaveBeenCalledWith(newBook);
      expect(bookRepository.save).toHaveBeenCalledWith(newBook);
      expect(result).toEqual(newBook);
    });

    it('should update an existing book if it exists', async () => {
      const existingBook = { id: 1, title: 'Test Book', price: '10.00', availability: 'In stock', rating: 'Five', ratingNumber: 5, category: 'Fiction', description: 'A test book', imageUrl: 'test.jpg' };
      const updatedBook = { ...existingBook, price: '12.00' };
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(existingBook as Book);
      jest.spyOn(bookRepository, 'merge').mockReturnValue(updatedBook as Book);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(updatedBook as Book);

      const result = await service.createOrUpdateByTitle(updatedBook);
      expect(bookRepository.findOne).toHaveBeenCalledWith({ where: { title: updatedBook.title } });
      expect(bookRepository.merge).toHaveBeenCalledWith(existingBook, updatedBook);
      expect(bookRepository.save).toHaveBeenCalledWith(updatedBook);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('findAll', () => {
    it('should return all books if no category is provided', async () => {
      const books = [{ id: 1, title: 'Book 1' }];
      jest.spyOn(bookRepository, 'find').mockResolvedValue(books as Book[]);

      const result = await service.findAll();
      expect(bookRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(books);
    });

    it('should return books filtered by category if a category is provided', async () => {
      const books = [{ id: 1, title: 'Book 1', category: 'Fiction' }];
      jest.spyOn(bookRepository, 'find').mockResolvedValue(books as Book[]);

      const result = await service.findAll('Fiction');
      expect(bookRepository.find).toHaveBeenCalledWith({ where: { category: 'Fiction' } });
      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should return a single book by id', async () => {
      const book = { id: 1, title: 'Book 1' };
      jest.spyOn(bookRepository, 'findOneBy').mockResolvedValue(book as Book);

      const result = await service.findOne(1);
      expect(bookRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(book);
    });
  });

  describe('remove', () => {
    it('should delete a book by id', async () => {
      jest.spyOn(bookRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(bookRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
