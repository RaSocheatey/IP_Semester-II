import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ProductService } from '../../common/product/product.service';
import { CategoryService } from '../../common/category/category.service';

@Resolver('Product')
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @Query('products')
  products() {
    return this.productService.findAll();
  }

  @Mutation('createProduct')
  createProduct(
    @Args('name') name: string,
    @Args('price') price: number,
    @Args('categoryId') categoryId: string,
  ) {
    return this.productService.create({
      name,
      price,
      categoryId: categoryId,
    });
  }

  @ResolveField('category')
  category(@Parent() product: any) {
    return this.categoryService.findOne(product.categoryId);
  }
}