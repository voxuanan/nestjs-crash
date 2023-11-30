import { AggregateRoot } from '@nestjs/cqrs';

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

export interface IArticle {}

export class ArticleImplement extends AggregateRoot implements IArticle {
  private readonly name: string;
  private readonly createdAt: Date;

  constructor(properties: ArticleProperties) {
    super();
    Object.assign(this, properties);
  }
}
