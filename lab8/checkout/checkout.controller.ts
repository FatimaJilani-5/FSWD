import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { Order } from './checkout.model';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Get('orders')
  getOrders() {
    return this.checkoutService.getOrders();
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.checkoutService.getOrder(Number(id));
  }

  @Post()
  placeOrder(@Body() data: Omit<Order, 'id'>) {
    return this.checkoutService.placeOrder(data);
  }
}