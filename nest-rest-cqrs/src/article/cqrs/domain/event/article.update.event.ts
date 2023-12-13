import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';

export class UpdateNameArticleEvent implements IEvent {
  public readonly id: string;
  public readonly aggregateId: string = '';

  constructor(
    readonly articleId: string,
    readonly name: string,
    aggregateId?: string,
  ) {
    this.id = crypto.randomUUID();
    this.aggregateId = aggregateId;
  }
}
