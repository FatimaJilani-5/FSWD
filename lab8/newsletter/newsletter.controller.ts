import { Controller, Get, Post, Body } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}

  @Get()
  getSubscribers() {
    return this.newsletterService.getSubscribers();
  }

  @Post()
  subscribe(@Body('email') email: string) {
    return this.newsletterService.subscribe(email);
  }
}