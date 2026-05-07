import { Injectable } from '@nestjs/common';
import { Category } from '../../database/entities/category.entity';

@Injectable()
export class CategoryService {
  private categories: Category[] = [];

  findAll() {
    return this.categories;
  }

  findOne(id: string) { // Changed parameter to string
    return this.categories.find(cat => cat.id === id);
  }

  create(data: { name: string }) {
    const newCategory: Category = { 
      id: Math.random().toString(36).substring(7), // Using string ID
      name: data.name,
      products: [] // Satisfies the requirement in category.entity.ts
    };
    this.categories.push(newCategory);
    return newCategory;
  }
}