import { Injectable } from '@nestjs/common';
import { Order } from './checkout.model';

@Injectable()
export class CheckoutService {
  private orders: Order[] = [];
  private nextId = 1;

  getOrders() {
    return this.orders;
  }

  placeOrder(data: Omit<Order, 'id'>) {
    const order = {
      id: this.nextId++,
      ...data
    };

    this.orders.push(order);
    return order;
  }

  getOrder(id: number) {
    return this.orders.find(order => order.id === id);
  }
}