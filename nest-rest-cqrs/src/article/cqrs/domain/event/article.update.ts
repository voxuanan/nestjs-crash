import { IEvent } from '@nestjs/cqrs';

export class UpdateNameArticleEvent implements IEvent {
  constructor(readonly articleId: string, readonly name: string) {}
}
