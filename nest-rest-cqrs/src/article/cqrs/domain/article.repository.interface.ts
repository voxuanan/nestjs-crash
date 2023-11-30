import { IArticle } from './article.interface';

export interface IArticleRepository {
  newId: () => Promise<string>;
  save: (article: IArticle | IArticle[]) => Promise<void>;
  findById: (id: string) => Promise<IArticle | null>;
  findByName: (name: string) => Promise<IArticle[]>;
}
