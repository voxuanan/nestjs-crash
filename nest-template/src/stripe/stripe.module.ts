import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentController } from './payment.controller';
import CreditCardController from './creditCard.controller';

@Module({
  controllers: [PaymentController, CreditCardController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
