import { IQueryResult } from '@nestjs/cqrs';

export class ArticleFindResult implements IQueryResult {
  constructor(
    readonly data: Readonly<{
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    }>[],
  ) {}
}

export class ArticleFindOneResult implements IQueryResult {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
