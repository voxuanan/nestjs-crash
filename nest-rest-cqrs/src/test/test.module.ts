import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TestLogHandler } from './cqrs/application/command/test.log.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity } from './cqrs/infrastructure/entity/test.entity';
import { TestFactory } from './cqrs/domain/test.factory';
import { TestRepository } from './cqrs/infrastructure/repository/test.repository';

const infrastructure: Provider[] = [TestRepository];

const application = [
  TestLogHandler,
  //Event
];

const domain = [TestFactory];

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity]), CqrsModule],
  controllers: [],
  providers: [Logger, ...infrastructure, ...application, ...domain],
  exports: [...infrastructure, ...domain],
})
export class TestModule {}
