import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleWithMapDataQuery } from '../../infrastructure/query/article-with-map-data.query';
import { GetTotalArticleWithMapDataQuery } from './article-with-map-data.get-total.query';

@QueryHandler(GetTotalArticleWithMapDataQuery)
export class GetTotalArticleWithMapDataHandler
  implements IQueryHandler<GetTotalArticleWithMapDataQuery, any>
{
  constructor(
    private readonly articleWithMapDataQuery: ArticleWithMapDataQuery,
  ) {}
  async execute(query: GetTotalArticleWithMapDataQuery): Promise<any> {
    return this.articleWithMapDataQuery.getTotal();
  }
}
