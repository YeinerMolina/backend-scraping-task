import { Module } from '@nestjs/common';
import { BooksService } from './app/books.service';
import { BooksController } from './infra/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './domain/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})
export class BooksModule {}
