import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';

export class RefreshArticleWithMapDataEvent implements IEvent {
  public readonly id: string;

  constructor() {
    this.id = crypto.randomUUID();
  }
}
