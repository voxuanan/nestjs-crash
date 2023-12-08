import { IQueryResult } from '@nestjs/cqrs';

export class ArticleWithMapDataFindResult implements IQueryResult {
  constructor(
    readonly data: Readonly<{
      id: string;
      name: string;
      mapData?: string;
    }>[],
  ) {}
}

export class ArticleWithMapDataFindOneResult implements IQueryResult {
  readonly id: string;
  readonly name: string;
  readonly mapData?: string;
}
