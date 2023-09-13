import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import CreateChargeDto from './dto/createCharge.dto';
import { StripeService } from 'src/stripe/stripe.service';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('charge')
  @UseGuards(JwtAuthenticationGuard)
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Req() request: RequestWithUser,
  ) {
    return this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }
}
