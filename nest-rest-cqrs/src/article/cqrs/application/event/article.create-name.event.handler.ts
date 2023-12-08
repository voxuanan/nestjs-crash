import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Transactional } from 'src/common/request-storage/transactional';
import { CreateArticleEvent } from '../../domain/event/article.create.event';

@EventsHandler(CreateArticleEvent)
export class CreateArticleEventHandler
  implements IEventHandler<CreateArticleEvent>
{
  @Transactional()
  async handle(event: CreateArticleEvent): Promise<void> {}
}
