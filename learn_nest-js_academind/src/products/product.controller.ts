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
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProducts(@Param('id') prodID: string) {
    return this.productService.getProductById(prodID);
  }

  @Post()
  addProduct(
    // Another way
    // @Body() prodBody: {title:string, description:string, price:number}
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ) {
    return this.productService.addProduct(
      prodTitle,
      prodDescription,
      prodPrice,
    );
  }

  @Patch(':id')
  updateProduct(
    @Param('id') productId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDescription: string,
    @Body('price') prodPrice: number,
  ) {
    return this.productService.updateProduct(
      productId,
      prodTitle,
      prodDescription,
      prodPrice,
    );
  }

  @Delete(':id')
  removeProduct(@Param('id') productId: string) {
    return this.productService.removeProduct(productId);
  }
}
