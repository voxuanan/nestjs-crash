import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import SubscribersService from './interfaces/subscribers.service.interface';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import CreateSubscriberDto from './dto/createSubscriber.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscriber')
@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersController implements OnModuleInit {
  private subscribersService: SubscribersService;

  constructor(@Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.subscribersService =
      this.client.getService<SubscribersService>('SubscribersService');
  }

  @Get()
  async getSubscribers() {
    return this.subscribersService.getAllSubscribers({});
  }

  @ApiBody({
    type: CreateSubscriberDto,
  })
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.addSubscriber(subscriber);
  }
}
