import { Injectable } from '@nestjs/common';
import { readConnection } from 'src/common/common.module';
import { FindArticleWithMapDataQuery } from '../../application/query/article-with-map-data.find.query';
import { IArticleWithMapDataQuery } from '../../application/query/article-with-map-data.query';
import { ArticlWithMapDataeMaterializedView } from '../../application/view/article-with-map-data.materialized-view.entity';
import {
  ArticleWithMapDataFindOneResult,
  ArticleWithMapDataFindResult,
} from '../../interfaces/article-with-map-data.interface';

@Injectable()
export class ArticleWithMapDataQuery implements IArticleWithMapDataQuery {
  async getTotal(): Promise<number> {
    return readConnection
      .getRepository(ArticlWithMapDataeMaterializedView)
      .count();
  }

  async findById(id: string): Promise<ArticleWithMapDataFindOneResult | null> {
    return readConnection
      .getRepository(ArticlWithMapDataeMaterializedView)
      .findOneBy({ id })
      .then((entity) =>
        entity
          ? {
              id: entity.id,
              name: entity.name,
              mapData: entity.mapData,
            }
          : null,
      );
  }

  async find(
    query: FindArticleWithMapDataQuery,
  ): Promise<ArticleWithMapDataFindResult> {
    return readConnection
      .getRepository(ArticlWithMapDataeMaterializedView)
      .find({
        skip: query.skip,
        take: query.take,
      })
      .then((entities) => ({
        data: entities.map((entity) => ({
          id: entity.id,
          name: entity.name,
          mapData: entity.mapData,
        })),
      }));
  }
}
