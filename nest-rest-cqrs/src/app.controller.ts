import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { EventStoreService } from './common/event-sourcing/event-store.service';
import { ENUM_KAFKA_TOPIC } from './common/kafka/constants/topic.enum.constant';
import { MessageHandler } from './common/kafka/services/kafka.consumer.service';
var clc = require('cli-color');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @Get('health')
  health(): void {
    return;
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @MessageHandler(ENUM_KAFKA_TOPIC.TEST)
  async test(message: any) {
    console.log(
      clc.blue('Test override onMessage: ', message.value.toString()),
    );
  }
}
