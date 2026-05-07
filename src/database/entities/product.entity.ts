import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}