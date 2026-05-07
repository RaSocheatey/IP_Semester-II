import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from '../../common/category/category.service';
import { CategoryType } from '../types/category.type';
@Resolver('CategoryType')
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query('categorType')
  categories() {
    return this.categoryService.findAll();
  }

  @Mutation('createCategoryType')
  createCategory(@Args('name') name: string) {
    return this.categoryService.create({ name });
  }
}