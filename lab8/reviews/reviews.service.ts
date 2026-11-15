import { Injectable } from '@nestjs/common';
import { Review } from './review.model';

@Injectable()
export class ReviewsService {
  private reviews: Review[] = [];
  private nextId = 1;

  getReviews() {
    return this.reviews;
  }

  addReview(data: Omit<Review, 'id'>) {
    const review = {
      id: this.nextId++,
      ...data
    };

    this.reviews.push(review);
    return review;
  }
}