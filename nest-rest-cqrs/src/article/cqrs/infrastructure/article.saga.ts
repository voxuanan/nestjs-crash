import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UpdateNameArticleEvent } from '../domain/event/article.update';
var clc = require('cli-color');

@Injectable()
export class ArticleSagas {
  // You can throw ICommand or any other event here
  @Saga()
  articleNameUpdated = (events$: Observable<any>): Observable<void> => {
    return events$.pipe(
      ofType(UpdateNameArticleEvent),
      delay(1000),
      map((event) => {
        console.log(clc.blue('Saga running! ,', JSON.stringify(event)));
      }),
    );
  };
}
