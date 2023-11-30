import { ICommand } from '@nestjs/cqrs';

export class CreateArticleCommand implements ICommand {
  constructor(readonly name: string) {}
}
