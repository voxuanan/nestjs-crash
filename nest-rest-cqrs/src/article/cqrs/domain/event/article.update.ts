import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';

export class UpdateNameArticleEvent implements IEvent {
  public readonly id: string;
  public readonly oldProcess: boolean = false;

  constructor(readonly articleId: string, readonly name: string, id?: string) {
    this.id = crypto.randomUUID();
    if (id) {
      this.id = id;
      this.oldProcess = true;
    }
  }
}
