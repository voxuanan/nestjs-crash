import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleWithMapDataQuery } from '../../infrastructure/query/article-with-map-data.query';
import { FindOneArticleWithMapDataQuery } from './article-with-map-data.find-one.query';
import { ArticleWithMapDataFindOneResult } from '../../interfaces/article-with-map-data.interface';

@QueryHandler(FindOneArticleWithMapDataQuery)
export class FindOneArticleWithMapDataHandler
  implements
    IQueryHandler<
      FindOneArticleWithMapDataQuery,
      ArticleWithMapDataFindOneResult
    >
{
  constructor(
    private readonly articleWithMapDataQuery: ArticleWithMapDataQuery,
  ) {}

  async execute(
    query: FindOneArticleWithMapDataQuery,
  ): Promise<ArticleWithMapDataFindOneResult> {
    return this.articleWithMapDataQuery.findById(query.id);
  }
}
