import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestLogHandler } from './cqrs/application/command/test.log.handler';
import { TestFactory } from './cqrs/domain/test.factory';
import { TestEntity } from './cqrs/infrastructure/entity/test.entity';
import { TestRepository } from './cqrs/infrastructure/repository/test.repository';

const infrastructure: Provider[] = [TestRepository];

const CommandHandlers = [TestLogHandler];
const EventHandlers = [];

const application = [...CommandHandlers, ...EventHandlers];

const domain = [TestFactory];

@Module({
  imports: [TypeOrmModule.forFeature([TestEntity]), CqrsModule],
  controllers: [],
  providers: [Logger, ...infrastructure, ...application, ...domain],
  exports: [...infrastructure, ...domain],
})
export class TestModule {}
