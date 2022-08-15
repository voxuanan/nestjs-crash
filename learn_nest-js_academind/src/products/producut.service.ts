import { Injectable, NotFoundException } from '@nestjs/common';

import { Product } from './product.model';

@Injectable()
export class ProductService {
  products: Product[] = [];

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('No product found!');
    }
    return [product, productIndex];
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id: string) {
    const product = this.findProduct(id)[0];
    return { ...product };
  }

  addProduct(title: string, description: string, price: number) {
    const prodID = Math.random().toString();
    const newProduct = new Product(prodID, title, description, price);
    this.products.push(newProduct);
    return prodID;
  }

  updateProduct(id: string, title: string, description: string, price: number) {
    const [product, index] = this.findProduct(id);
    const updateProduct = { ...product };
    if (title) updateProduct.title = title;
    if (description) updateProduct.description = description;
    if (price) updateProduct.price = price;
    this.products[index] = updateProduct;
    return { ...updateProduct };
  }

  removeProduct(id: string) {
    const [product, index] = this.findProduct(id);
    this.products.splice(index, 1);
    return { ...product };
  }
}
