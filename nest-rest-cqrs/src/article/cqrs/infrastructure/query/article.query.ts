import { Inject, Injectable } from '@nestjs/common';
import { IArticleQuery } from '../../application/query/article.query';
import { readConnection } from 'src/common/common.module';
import { ArticleEntity } from '../entity/article.entity';
import { FindArticleQuery } from '../../application/query/article.find.query';
import {
  ArticleFindOneResult,
  ArticleFindResult,
} from 'src/article/interfaces/article.interface';

@Injectable()
export class ArticleQuery implements IArticleQuery {
  async getTotal(): Promise<number> {
    return readConnection.getRepository(ArticleEntity).count();
  }

  async findById(id: string): Promise<ArticleFindOneResult | null> {
    return readConnection
      .getRepository(ArticleEntity)
      .findOneBy({ id })
      .then((entity) =>
        entity
          ? {
              id: id,
              name: entity.name,
              createdAt: entity.createdAt,
              updatedAt: entity.updatedAt,
            }
          : null,
      );
  }

  async find(query: FindArticleQuery): Promise<ArticleFindResult> {
    return readConnection
      .getRepository(ArticleEntity)
      .find({
        skip: query.skip,
        take: query.take,
      })
      .then((entities) => ({
        data: entities.map((entity) => ({
          id: entity.id,
          name: entity.name,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })),
      }));
  }
}
