import { UpdateNameArticleEvent } from 'src/article/cqrs/domain/event/article.update.event';
import { EventProcessingAttemptEntity } from '../entity/event-processcing-attempt.entity';
import { EventSourcingEntity } from '../entity/event-sourcing.entity';
import { CreateArticleEvent } from 'src/article/cqrs/domain/event/article.create.event';
import { RefreshArticleWithMapDataEvent } from 'src/common/common-cqrs/domain/event/refresh-article-with-map-data.event';

export function prepareEvent(
  event: EventSourcingEntity & {
    processAttempt: EventProcessingAttemptEntity;
  },
):
  | UpdateNameArticleEvent
  | CreateArticleEvent
  | RefreshArticleWithMapDataEvent {
  switch (event.name) {
    case 'UpdateNameArticleEvent':
      return new UpdateNameArticleEvent(
        (event.data as unknown as any).articleId,
        (event.data as unknown as any).name,
      );
    case 'CreateArticleEvent':
      return new CreateArticleEvent(
        (event.data as unknown as any).articleId,
        (event.data as unknown as any).name,
      );
    case 'RefreshArticleWithMapDataEvent':
      return new RefreshArticleWithMapDataEvent();
    default:
      throw new Error(`Cant find event for: ${event.name}`);
  }
}
