import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  getAllProducts() {
    return this.products;
  }

  getProduct(id: number) {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  addProduct(data: Omit<Product, 'id'>) {
    const product = { id: this.nextId++, ...data };
    this.products.push(product);
    return product;
  }

  deleteProduct(id: number) {
    const product = this.getProduct(id);
    this.products = this.products.filter(p => p.id !== id);
    return product;
  }
}