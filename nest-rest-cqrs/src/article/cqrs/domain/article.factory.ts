import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  ArticleImplement,
  ArticleProperties,
  IArticle,
} from './article.interface';

type CreateArticleOptions = Readonly<{
  id: string;
  name: string;
}>;

export class ArticleFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateArticleOptions): IArticle {
    return this.eventPublisher.mergeObjectContext(
      new ArticleImplement({
        ...options,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
  }

  reconstitute(properties: ArticleProperties): IArticle {
    return this.eventPublisher.mergeObjectContext(
      new ArticleImplement(properties),
    );
  }
}
