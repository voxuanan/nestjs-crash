import { ICommand } from '@nestjs/cqrs';

export class TestLogCommand implements ICommand {
  constructor(readonly data: any) {}
}
