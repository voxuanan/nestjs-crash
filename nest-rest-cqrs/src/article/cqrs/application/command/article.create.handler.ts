import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'src/common/request-storage/transactional';
import { CreateArticleCommand } from './article.create.command';
import { ArticleRepository } from '../../infrastructure/repository/article.repository';
import { ArticleFactory } from '../../domain/article.factory';

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

    if (!article) throw new NotFoundException('not found');

    // article.close();
    await this.articleRepository.save(article);
    // article.commit();
  }
}
