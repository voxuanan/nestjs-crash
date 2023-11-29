import { Controller, Get, Inject } from '@nestjs/common';
import { TestService, TestStrategy10, TestStrategy100 } from './test.service';

@Controller('test')
export class TestController {
  constructor(
    // @Inject(TestStrategy100)
    @Inject(TestStrategy10)
    private readonly testService: TestService,
  ) {}

  @Get()
  test(): number {
    console.log('123456');
    return this.testService.mutipleTest(10);
  }
}
