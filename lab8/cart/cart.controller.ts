import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import type { CartItem } from './cart.model';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Post()
  addToCart(@Body() item: CartItem) {
    return this.cartService.addToCart(item);
  }

  @Delete(':id')
  removeFromCart(@Param('id') id: string) {
    return this.cartService.removeFromCart(Number(id));
  }

  @Get('total')
  getTotal() {
    return this.cartService.getTotal();
  }
}
