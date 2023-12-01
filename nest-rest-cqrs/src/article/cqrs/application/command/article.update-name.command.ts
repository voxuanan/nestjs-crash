import { ICommand } from '@nestjs/cqrs';

export class UpdateNameArticleCommand implements ICommand {
  constructor(readonly articleId: string, readonly name: string) {}
}
