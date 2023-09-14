import { Module, forwardRef } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentController } from './payment.controller';
import CreditCardController from './creditCard.controller';
import SubscriptionController from './subscription.controller';
import SubscriptionsService from './subscriptions.service';
import StripeWebhookController from './stripeWebhook.controller';
import { UsersModule } from 'src/users/users.module';
import StripeWebhookService from './stripeWebhook.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import StripeEvent from './entity/stripeEvent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StripeEvent]),
    forwardRef(() => UsersModule),
  ],
  controllers: [
    PaymentController,
    CreditCardController,
    SubscriptionController,
    StripeWebhookController,
  ],
  providers: [StripeService, SubscriptionsService, StripeWebhookService],
  exports: [StripeService, SubscriptionsService, StripeWebhookService],
})
export class StripeModule {}
