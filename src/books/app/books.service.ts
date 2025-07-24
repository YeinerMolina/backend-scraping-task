import { Injectable } from '@nestjs/common';
import { CreateBookDto } from '../domain/dto/create-book.dto';
import { EntityManager, Repository } from 'typeorm';
import { Book } from '../domain/entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly entityManager: EntityManager
  ){}

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

  async findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    return this.bookRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.bookRepository.delete({ id })
  }
}
