import { IQuery } from '@nestjs/cqrs';

export class FindOneArticleQuery implements IQuery {
  constructor(readonly id: string) {}
}
