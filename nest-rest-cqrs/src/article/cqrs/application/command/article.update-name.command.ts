import { ICommand } from '@nestjs/cqrs';

export class UpdateNameArticleCommand implements ICommand {
  constructor(readonly id: string, readonly name: string) {}
}
