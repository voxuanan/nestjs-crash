import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RefreshArticleWithMapDataEvent } from '../../domain/event/refresh-article-with-map-data.event';
import { Transactional } from 'src/common/request-storage/transactional';
import { ArticleWithMapDataViewUpdater } from '../view/article-with-map-data.view.update';

@EventsHandler(RefreshArticleWithMapDataEvent)
export class RefreshArticleWithMapDataHandler
  implements IEventHandler<RefreshArticleWithMapDataEvent>
{
  constructor(
    private readonly articleWithMapDataViewUpdater: ArticleWithMapDataViewUpdater,
  ) {}

  @Transactional()
  async handle(event: any): Promise<void> {
    await this.articleWithMapDataViewUpdater.updateArticleView();
  }
}
