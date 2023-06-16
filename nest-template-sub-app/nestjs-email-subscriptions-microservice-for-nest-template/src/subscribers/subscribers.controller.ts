import { Controller } from '@nestjs/common';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import CreateSubscriberDto from './dto/createSubscriber.dto';
import { SubscribersService } from './subscribers.service';

@Controller()
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @GrpcMethod('SubscribersService', 'AddSubscriber')
  addSubscriber(@Payload() subscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(subscriber);
  }

  @GrpcMethod('SubscribersService', 'GetAllSubscribers')
  async getAllSubscribers() {
    const subscribers = await this.subscribersService.getAllSubscribers();
    const response = {
      data: subscribers,
    };
    return response;
  }
}
