import {
  ArticleFindOneResult,
  ArticleFindResult,
} from 'src/article/interfaces/article.interface';
import { FindArticleQuery } from './article.find.query';

export interface IArticleQuery {
  findById: (id: string) => Promise<ArticleFindOneResult | null>;
  find: (query: FindArticleQuery) => Promise<ArticleFindResult>;
  getTotal: () => Promise<number>;
}
