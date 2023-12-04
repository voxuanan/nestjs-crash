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
