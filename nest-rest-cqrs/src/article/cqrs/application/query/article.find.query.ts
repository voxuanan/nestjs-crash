import { IQuery } from '@nestjs/cqrs';

export class FindArticleQuery implements IQuery {
  readonly skip: number;
  readonly take: number;

  constructor(options: FindArticleQuery) {
    Object.assign(this, options);
  }
}
