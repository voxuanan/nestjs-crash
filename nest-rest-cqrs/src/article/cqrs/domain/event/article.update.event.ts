import { IEvent } from '@nestjs/cqrs';

export class UpdateNameArticleEvent implements IEvent {
  constructor(readonly id: string, readonly name: string) {}
}
