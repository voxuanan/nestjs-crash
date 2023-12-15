import { IEvent } from '@nestjs/cqrs';

export class CreateArticleEvent implements IEvent {
  constructor(readonly id: string, readonly name: string) {}
}
