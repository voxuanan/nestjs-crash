import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import SubscriptionsService from './subscriptions.service';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';

@Controller('subscriptions')
export default class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('monthly')
  @UseGuards(JwtAuthenticationGuard)
  async createMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.createMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @UseGuards(JwtAuthenticationGuard)
  async getMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.getMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }
}
