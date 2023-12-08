import {
  ArticleWithMapDataFindOneResult,
  ArticleWithMapDataFindResult,
} from '../../interfaces/article-with-map-data.interface';
import { FindArticleWithMapDataQuery } from './article-with-map-data.find.query';

export interface IArticleWithMapDataQuery {
  findById: (id: string) => Promise<ArticleWithMapDataFindOneResult | null>;
  find: (
    query: FindArticleWithMapDataQuery,
  ) => Promise<ArticleWithMapDataFindResult>;
  getTotal: () => Promise<number>;
}
