import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';

@Module({
  providers: [CategoryService],
  exports: [CategoryService], // Important: Export so Product can use it
})
export class CategoryModule {}