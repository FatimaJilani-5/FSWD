import { Injectable } from '@nestjs/common';
import { CartItem } from './cart.model';

@Injectable()
export class CartService {
  private cart: CartItem[] = [];

  getCart() {
    return this.cart;
  }

  addToCart(item: CartItem) {
    const existing = this.cart.find(
      p => p.productId === item.productId
    );

    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cart.push(item);
    }

    return this.cart;
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(
      item => item.productId !== productId
    );

    return this.cart;
  }

  getTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}