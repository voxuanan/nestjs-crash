import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'src/common/request-storage/transactional';
import { ArticleRepository } from '../../infrastructure/repository/article.repository';
import { ArticleFactory } from '../../domain/article.factory';
import { UpdateNameArticleCommand } from './article.update-name.command';

@CommandHandler(UpdateNameArticleCommand)
export class UpdateNameArticleHandler
  implements ICommandHandler<UpdateNameArticleCommand, void>
{
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleFactory: ArticleFactory,
  ) {}

  @Transactional()
  async execute(command: UpdateNameArticleCommand): Promise<void> {
    const article = await this.articleRepository.findById(command.id);

    if (!article) throw new NotFoundException('not found');

    article.updateName(command.name);

    await this.articleRepository.save(article);

    article.commit();
  }
}
