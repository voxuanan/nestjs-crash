import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleWithMapDataQuery } from '../../infrastructure/query/article-with-map-data.query';
import { FindArticleWithMapDataQuery } from './article-with-map-data.find.query';
import { ArticleWithMapDataFindResult } from '../../interfaces/article-with-map-data.interface';

@QueryHandler(FindArticleWithMapDataQuery)
export class FindArticleWithMapDataHandler
  implements
    IQueryHandler<FindArticleWithMapDataQuery, ArticleWithMapDataFindResult>
{
  constructor(
    private readonly articleWithMapDataQuery: ArticleWithMapDataQuery,
  ) {}

  async execute(
    query: FindArticleWithMapDataQuery,
  ): Promise<ArticleWithMapDataFindResult> {
    return this.articleWithMapDataQuery.find(query);
  }
}
