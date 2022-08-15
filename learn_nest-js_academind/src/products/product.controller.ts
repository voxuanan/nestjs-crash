import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService } from './producut.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get(':id')
  async getProducts(@Param('id') prodID: string) {
    return await this.productService.getProductById(prodID);
  }

  @Post()
  async addProduct(
    // Another way
    // @Body() prodBody: {title:string, description:string, price:number}
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ) {
    return await this.productService.addProduct(
      prodTitle,
      prodDescription,
      prodPrice,
    );
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ) {
    return await this.productService.updateProduct(
      productId,
      prodTitle,
      prodDescription,
      prodPrice,
    );
  }

  @Delete(':id')
  async removeProduct(@Param('id') productId: string) {
    return await this.productService.removeProduct(productId);
  }
}
