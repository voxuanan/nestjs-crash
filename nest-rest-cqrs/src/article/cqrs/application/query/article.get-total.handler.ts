import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindArticleQuery } from './article.find.query';
import { ArticleFindResult } from 'src/article/interfaces/article.interface';
import { ArticleQuery } from '../../infrastructure/query/article.query';
import { GetTotalArticleQuery } from './article.get-total.query';

@QueryHandler(GetTotalArticleQuery)
export class GetTotalArticleHandler
  implements IQueryHandler<GetTotalArticleQuery, any>
{
  constructor(private readonly articleQuery: ArticleQuery) {}

  async execute(query: GetTotalArticleQuery): Promise<any> {
    return this.articleQuery.getTotal();
  }
}
