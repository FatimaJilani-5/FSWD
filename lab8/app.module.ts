import { Module } from '@nestjs/common';

import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';

import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';

import { CheckoutController } from './checkout/checkout.controller';
import { CheckoutService } from './checkout/checkout.service';

import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';

import { NewsletterController } from './newsletter/newsletter.controller';
import { NewsletterService } from './newsletter/newsletter.service';

@Module({
  imports: [],
  controllers: [
    ProductsController,
    CartController,
    CheckoutController,
    ReviewsController,
    NewsletterController
  ],
  providers: [
    ProductsService,
    CartService,
    CheckoutService,
    ReviewsService,
    NewsletterService
  ],
})
export class AppModule {}