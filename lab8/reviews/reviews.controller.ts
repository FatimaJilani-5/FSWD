import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.model';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  getReviews() {
    return this.reviewsService.getReviews();
  }

  @Post()
  addReview(@Body() data: Omit<Review, 'id'>) {
    return this.reviewsService.addReview(data);
  }
}