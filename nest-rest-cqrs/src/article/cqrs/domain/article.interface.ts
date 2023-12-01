import { AggregateRoot } from '@nestjs/cqrs';
import { UpdateNameArticleEvent } from './event/article.update';

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
  updateName: (name: string) => void;
  commit: () => void;
}

export class ArticleImplement extends AggregateRoot implements IArticle {
  private readonly id: string;
  private name: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(properties: ArticleProperties) {
    super();
    Object.assign(this, properties);
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
    this.apply(new UpdateNameArticleEvent(this.id, this.name));
  }
}
