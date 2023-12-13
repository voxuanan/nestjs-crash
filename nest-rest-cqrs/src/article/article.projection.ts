import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventSourcingEntity } from 'src/common/event-sourcing/entity/event-sourcing.entity';
import { EventSourcingProjectionService } from 'src/common/event-sourcing/interfaces/event-sourcing.projection.service';
import { Like, Repository } from 'typeorm';
import { ARTICLE_AGGREGATE_PREFIX } from './constant/article.constant';
import { ArticleEntity } from './cqrs/infrastructure/entity/article.entity';

@Injectable()
export class ArticleProjectionStrategy
  implements EventSourcingProjectionService<ArticleEntity>
{
  public _entity: ArticleEntity[] = [];
  public readonly _name: string = ARTICLE_AGGREGATE_PREFIX;

  @InjectRepository(EventSourcingEntity)
  public eventSourcingRepository: Repository<EventSourcingEntity>;

  makeAggregateId(id: string): string {
    return `${this._name}-${id}`;
  }

  loadAggregateItems(id: string): Promise<EventSourcingEntity[]> {
    return this.eventSourcingRepository.find({
      where: { aggregateId: this.makeAggregateId(id) },
      order: { createdAt: 'ASC' },
    });
  }

  async loadByAggregateName(): Promise<EventSourcingEntity[]> {
    return this.eventSourcingRepository.find({
      where: {
        aggregateId: Like(`${this._name}%`),
      },
    });
  }

  findEntity(aggregateId: string): ArticleEntity | undefined {
    return this._entity.find(
      (entity) => this.makeAggregateId(entity.id) === aggregateId,
    );
  }

  async projection(events: EventSourcingEntity[]): Promise<void> {
    for (const event of events) {
      const article = this.findEntity(event.aggregateId);
      const data = JSON.parse(event.data);
      switch (event.name) {
        case 'CreateArticleEvent':
          if (!article) {
            this._entity.push(
              new ArticleEntity({
                id: data.articleId,
                name: data.name,
              }),
            );
          }
          break;
        case 'UpdateNameArticleEvent':
          if (article) {
            article.name = data.name;
          }
          break;
        default:
          throw new Error('Unknow event on ArticleProjectionStrategy');
      }
    }
  }
}
