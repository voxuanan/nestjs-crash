import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/common/helper/helper.module';
import { TestLogHandler } from './test.log.handler';

const infrastructure: Provider[] = [];

const application = [
  TestLogHandler,
  //Event
];

const domain = [];

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class LogModule {}
