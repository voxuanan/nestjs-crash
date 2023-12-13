import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArticleProjectionStrategy } from 'src/article/article.projection';
import { ArticleFindOneResult } from 'src/article/interfaces/article.interface';
import { EventSourcingProjectionService } from 'src/common/event-sourcing/interfaces/event-sourcing.projection.service';
import { ArticleEntity } from '../../infrastructure/entity/article.entity';
import { ArticleQuery } from '../../infrastructure/query/article.query';
import { FindOneArticleQuery } from './article.find-one.query';

@QueryHandler(FindOneArticleQuery)
export class FindOneArticleHandler
  implements IQueryHandler<FindOneArticleQuery, ArticleFindOneResult>
{
  constructor(
    private readonly articleQuery: ArticleQuery,
    @Inject(ArticleProjectionStrategy)
    private readonly articleProjection: EventSourcingProjectionService<ArticleEntity>,
  ) {}

  async execute(query: FindOneArticleQuery): Promise<ArticleFindOneResult> {
    const events = await this.articleProjection.loadAggregateItems(query.id);
    await this.articleProjection.projection(events);

    // const data = await this.articleQuery.findById(query.id);
    const data = this.articleProjection.findEntity(
      this.articleProjection.makeAggregateId(query.id),
    );

    if (!data) throw new NotFoundException('Article not found');

    return data;
  }
}
