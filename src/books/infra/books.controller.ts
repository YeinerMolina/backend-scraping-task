import { Controller, Delete, Get, Param, Query } from '@nestjs/common';

import { BooksService } from '../app/books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async findAll(@Query('category') category?: string, @Query('min') min?: number, @Query('max') max?: number) {
    return this.booksService.findAll(category, min, max);
  }

  @Get('/categories')
  async categories() {
    return this.booksService.findAll().then(resp => Array.from(new Set(resp.map(item => item.category).values())));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
