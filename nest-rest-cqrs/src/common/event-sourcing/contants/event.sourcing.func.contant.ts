import { UpdateNameArticleEvent } from 'src/article/cqrs/domain/event/article.update.event';
import { EventProcessingAttemptEntity } from '../entity/event-processcing-attempt.entity';
import { EventSourcingEntity } from '../entity/event-sourcing.entity';

export function prepareEvent(
  event: EventSourcingEntity & {
    processAttempt: EventProcessingAttemptEntity;
  },
): UpdateNameArticleEvent {
  switch (event.name) {
    case 'UpdateNameArticleEvent':
      return new UpdateNameArticleEvent(
        (event.data as unknown as any).articleId,
        (event.data as unknown as any).name,
      );
    default:
      throw new Error(`Cant find event for: ${event.name}`);
  }
}
