import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindArticleQuery } from './article.find.query';
import { ArticleFindResult } from 'src/article/interfaces/article.find.interface';
import { ArticleQuery } from '../../infrastructure/query/article.query';

@QueryHandler(FindArticleQuery)
export class FindArticleHandler
  implements IQueryHandler<FindArticleQuery, ArticleFindResult>
{
  constructor(private readonly articleQuery: ArticleQuery) {}

  async execute(query: FindArticleQuery): Promise<ArticleFindResult> {
    return this.articleQuery.find(query);
  }
}
