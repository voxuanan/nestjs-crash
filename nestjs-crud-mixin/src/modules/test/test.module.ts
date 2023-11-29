import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestStrategy10, TestStrategy100 } from './test.service';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestStrategy10, TestStrategy100],
  exports: [TestStrategy10, TestStrategy100],
})
export class TestModule {}
