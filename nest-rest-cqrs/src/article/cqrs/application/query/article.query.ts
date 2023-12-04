import { ArticleFindOneResult } from 'src/article/interfaces/article.find-one.interface';
import { ArticleFindResult } from 'src/article/interfaces/article.find.interface';
import { FindArticleQuery } from './article.find.query';

export interface IArticleQuery {
  findById: (id: string) => Promise<ArticleFindOneResult | null>;
  find: (query: FindArticleQuery) => Promise<ArticleFindResult>;
  getTotal: () => Promise<number>;
}
