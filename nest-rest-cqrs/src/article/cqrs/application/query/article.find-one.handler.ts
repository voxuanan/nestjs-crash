import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleQuery } from '../../infrastructure/query/article.query';
import { FindOneArticleQuery } from './article.find-one.query';
import { ArticleFindOneResult } from 'src/article/interfaces/article.interface';

@QueryHandler(FindOneArticleQuery)
export class FindOneArticleHandler
  implements IQueryHandler<FindOneArticleQuery, ArticleFindOneResult>
{
  constructor(private readonly articleQuery: ArticleQuery) {}

  async execute(query: FindOneArticleQuery): Promise<ArticleFindOneResult> {
    const data = await this.articleQuery.findById(query.id);
    if (!data) throw new NotFoundException('Article not found');

    return data;
  }
}
