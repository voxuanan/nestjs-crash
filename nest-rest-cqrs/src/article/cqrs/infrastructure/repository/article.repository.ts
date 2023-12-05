import { ArticleFactory } from 'src/article/cqrs/domain/article.factory';
import {
  ArticleProperties,
  IArticle,
} from 'src/article/cqrs/domain/article.interface';
import { IArticleRepository } from 'src/article/cqrs/domain/article.repository.interface';
import { writeConnection } from 'src/common/common.module';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ArticleEntity } from '../entity/article.entity';
import { Inject } from '@nestjs/common';

export class ArticleRepository implements IArticleRepository {
  @Inject()
  private readonly articleFactory: ArticleFactory;
  @Inject() private readonly helperStringService: HelperStringService;

  async newId(): Promise<string> {
    return this.helperStringService.random(16);
  }

  async save(data: IArticle | IArticle[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(ArticleEntity).save(entities);
  }

  async findById(id: string): Promise<IArticle | null> {
    const entity = await writeConnection.manager
      .getRepository(ArticleEntity)
      .findOneBy({ id: id });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByName(name: string): Promise<IArticle[]> {
    const entities = await writeConnection.manager
      .getRepository(ArticleEntity)
      .findBy({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: IArticle): ArticleEntity {
    const properties = JSON.parse(JSON.stringify(model)) as ArticleProperties;
    return new ArticleEntity({
      ...properties,
      id: properties.id,
      createdAt: properties.createdAt,
    });
  }

  private entityToModel(entity: ArticleEntity): IArticle {
    return this.articleFactory.reconstitute({
      ...entity,
      id: entity.id,
      createdAt: entity.createdAt,
    });
  }
}
