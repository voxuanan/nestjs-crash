import { IQuery } from '@nestjs/cqrs';

export class FindOneArticleWithMapDataQuery implements IQuery {
  constructor(readonly id: string) {}
}
