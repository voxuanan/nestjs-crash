import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';

export class UpdateNameArticleEvent implements IEvent {
  public readonly id: string;

  constructor(readonly articleId: string, readonly name: string) {
    this.id = crypto.randomUUID();
  }
}
