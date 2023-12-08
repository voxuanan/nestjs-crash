import { Injectable } from '@nestjs/common';
import { EventBus, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UpdateNameArticleEvent } from '../domain/event/article.update.event';
import { RefreshArticleWithMapDataEvent } from 'src/common/common-cqrs/domain/event/refresh-article-with-map-data.event';
import { CreateArticleEvent } from '../domain/event/article.create.event';

@Injectable()
export class ArticleSagas {
  constructor(private readonly eventBus: EventBus) {}

  @Saga()
  articleNameCreated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(CreateArticleEvent),
      delay(1000),
      map((event) => {
        this.eventBus.publish(new RefreshArticleWithMapDataEvent());
      }),
    );
  };

  @Saga()
  articleNameUpdated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(UpdateNameArticleEvent),
      delay(1000),
      map((event) => {
        this.eventBus.publish(new RefreshArticleWithMapDataEvent());
      }),
    );
  };
}
