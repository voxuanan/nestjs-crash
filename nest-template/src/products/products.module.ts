import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import ProductCategory from './entity/productCategory.entity';
import Product from './entity/product.entity';
import { ProductCategoriesController } from './productCategies.controller';
import { ProductCategoriesService } from './productCategories.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory, Product])],
  controllers: [ProductsController, ProductCategoriesController],
  providers: [ProductsService, ProductCategoriesService],
})
export class ProductsModule {}
