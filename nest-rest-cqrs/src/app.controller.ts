import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MessageHandler } from './common/kafka/services/kafka.consumer.service';
import { ENUM_KAFKA_TOPIC } from './common/kafka/constants/topic.enum.constant';

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
    console.log('Test override onMessage: ', message.value.toString());
  }
}
