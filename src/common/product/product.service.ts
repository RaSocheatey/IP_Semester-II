import { Injectable } from '@nestjs/common';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class ProductService {
  private products: Product[] = [];

  findAll() {
    return this.products;
  }

  findOne(id: string) {
    return this.products.find(prod => prod.id === id);
  }

  create(data: { name: string; price: number; categoryId: string }) {
      const newProduct: Product = { 
        id: Math.random().toString(36).substring(7), // Using string ID[cite: 1]
        name: data.name,
        price: data.price,
        categoryId: data.categoryId,
        category: null as any // Satisfies the requirement in product.entity.ts[cite: 1]
      };
      this.products.push(newProduct);
      return newProduct;
    }
}