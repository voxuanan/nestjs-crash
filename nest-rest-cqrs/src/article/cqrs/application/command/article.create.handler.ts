import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'src/common/request-storage/transactional';
import { ArticleFactory } from '../../domain/article.factory';
import { ArticleRepository } from '../../infrastructure/repository/article.repository';
import { CreateArticleCommand } from './article.create.command';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler
  implements ICommandHandler<CreateArticleCommand, void>
{
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleFactory: ArticleFactory,
  ) {}

  @Transactional()
  async execute(command: CreateArticleCommand): Promise<void> {
    const article = this.articleFactory.create({
      ...command,
      id: await this.articleRepository.newId(),
    });

    article.create(command.name);

    await this.articleRepository.save(article);

    article.commit();
  }
}
