import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentFailedEvent } from './events/payment-failed.event';
import { ModuleRef } from '@nestjs/core';
import { EventContext } from './context/event-context';

@Injectable()
export class NotificationsService {
  constructor(private readonly moduleRef: ModuleRef) {}

  @OnEvent(PaymentFailedEvent.key)
  async sendPaymentNotification(event: PaymentFailedEvent) {
    const eventContext = await this.moduleRef.resolve(
      EventContext,
      event.meta.contextId,
    );
    console.log(
      'Sending a payment failed notification',
      eventContext.request.url,
    );
  }
}
