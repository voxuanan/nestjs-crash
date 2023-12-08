import { IQuery } from '@nestjs/cqrs';

export class FindArticleWithMapDataQuery implements IQuery {
  readonly skip: number;
  readonly take: number;

  constructor(options: FindArticleWithMapDataQuery) {
    Object.assign(this, options);
  }
}
