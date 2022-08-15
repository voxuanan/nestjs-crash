import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly ProductModel: Model<Product>,
  ) {}

  private findProduct(id: string): Promise<Product> {
    const product = this.ProductModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('No product found!');
    }
    return product;
  }

  async getAllProducts() {
    const products = await this.ProductModel.find().exec();
    return products as Product[];
  }

  async getProductById(id: string) {
    const product = await this.findProduct(id);
    return product as Product;
  }

  async addProduct(title: string, description: string, price: number) {
    const newProduct = new this.ProductModel({ title, description, price });
    await newProduct.save();
    return newProduct.id as string;
  }

  async updateProduct(
    id: string,
    title: string,
    description: string,
    price: number,
  ) {
    const updateProduct = await this.findProduct(id);
    if (title) updateProduct.title = title;
    if (description) updateProduct.description = description;
    if (price) updateProduct.price = price;
    updateProduct.save();
    return updateProduct;
  }

  async removeProduct(id: string) {
    const result = await this.ProductModel.findOneAndRemove({ _id: id });
    if (result === null) throw new NotFoundException('No product found!');
    return result;
  }
}
