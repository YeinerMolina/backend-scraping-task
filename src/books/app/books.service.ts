import { Injectable } from '@nestjs/common';
import { CreateBookDto } from '../domain/dto/create-book.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual, EntityManager, Repository, FindOptionsWhere } from 'typeorm';
import { Book } from '../domain/entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly entityManager: EntityManager
  ) {}

  async createOrUpdateByTitle(book: Partial<CreateBookDto>) {
    const existingBook = await this.bookRepository.findOne({
      where: { title: book.title },
    });

    if (existingBook) {
      const updated = this.bookRepository.merge(existingBook, book);
      return await this.bookRepository.save(updated);
    } else {
      const newBook = this.bookRepository.create(book);
      return await this.bookRepository.save(newBook);
    }
  }

  async findAll(category?: string, min?: number, max?: number) {
    const where: FindOptionsWhere<Book> = {};

    if (category) {
      where.category = category;
    }

    if (min !== undefined && max !== undefined) {
      where.priceNumber = Between(min, max);
    } else if (min !== undefined) {
      where.priceNumber = MoreThanOrEqual(min);
    } else if (max !== undefined) {
      where.priceNumber = LessThanOrEqual(max);
    }

    return this.bookRepository.find({ where });
  }

  async findOne(id: number) {
    return this.bookRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.bookRepository.delete({ id });
  }
}
