import { Injectable } from '@nestjs/common';
import { Subscriber } from './subscriber.model';

@Injectable()
export class NewsletterService {
  private subscribers: Subscriber[] = [];
  private nextId = 1;

  getSubscribers() {
    return this.subscribers;
  }

  subscribe(email: string) {
    const existing = this.subscribers.find(
      subscriber => subscriber.email === email
    );

    if (existing) {
      return 'Email already subscribed';
    }

    const subscriber = {
      id: this.nextId++,
      email
    };

    this.subscribers.push(subscriber);
    return subscriber;
  }
}