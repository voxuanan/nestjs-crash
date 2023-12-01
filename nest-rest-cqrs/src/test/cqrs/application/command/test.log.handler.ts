import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'src/common/request-storage/transactional';
import { TestLogCommand } from './test.log.command';

@CommandHandler(TestLogCommand)
export class TestLogHandler implements ICommandHandler<TestLogCommand, void> {
  constructor() {}

  @Transactional()
  async execute(command: TestLogCommand): Promise<void> {
    console.log('TestLogHandler', command);
  }
}
