import { AggregateRoot } from '@nestjs/cqrs';
import { CreateArticleEvent } from './event/article.create.event';
import { UpdateNameArticleEvent } from './event/article.update.event';
import { ARTICLE_AGGREGATE_PREFIX } from 'src/article/constant/article.constant';

export type ArticleEssentialProperties = Readonly<
  Required<{
    id: string;
    name: string;
  }>
>;

export type ArticleOptionalProperties = Readonly<
  Partial<{
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export type ArticleProperties = ArticleEssentialProperties &
  Required<ArticleOptionalProperties>;

export interface IArticle {
  create: (name: string) => void;
  updateName: (name: string) => void;
  commit: () => void;
}

export class ArticleImplement extends AggregateRoot implements IArticle {
  private readonly id: string;
  private name: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private readonly aggregateId: string;

  private makeAggregateId(): string {
    return `${ARTICLE_AGGREGATE_PREFIX}-${this.id}`;
  }

  constructor(properties: ArticleProperties) {
    super();
    Object.assign(this, properties);
    this.aggregateId = this.makeAggregateId();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
    this.apply(
      new UpdateNameArticleEvent(this.id, this.name, this.aggregateId),
    );
  }

  create(name: string): void {
    this.apply(new CreateArticleEvent(this.id, name, this.aggregateId));
  }
}
