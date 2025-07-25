import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  price: string;

  @Column('decimal')
  priceNumber: number;

  @Column()
  availability: string;

  @Column()
  rating: string;

  @Column('int')
  ratingNumber: number;

  @Column()
  category: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  imageUrl: string;

  constructor(book: Partial<Book>) {
    Object.assign(this, book);
  }
}
