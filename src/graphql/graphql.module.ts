import { Module } from '@nestjs/common';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';

// Ensure these paths match your "common" folder structure
import { CategoryModule } from '../common/category/category.module';
import { ProductModule } from '../common/product/product.module';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [
    CategoryCodeFirstResolver, 
    ProductCodeFirstResolver
  ],
})
export class GraphqlModule {}