import { IQueryResult } from '@nestjs/cqrs';

export class ArticleFindOneResult implements IQueryResult {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
