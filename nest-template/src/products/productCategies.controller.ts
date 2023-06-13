import {
  Body,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';
import CreateProductCategoryDto from './dto/createProductCategory.dto';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { ProductCategoriesService } from './productCategories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product-categories')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductCategoriesController {
  constructor(private readonly productsService: ProductCategoriesService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProductCategories();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(@Body() productCategory: CreateProductCategoryDto) {
    return this.productsService.createProductCategory(productCategory);
  }
}
