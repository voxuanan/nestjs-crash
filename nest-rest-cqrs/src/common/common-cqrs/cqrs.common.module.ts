import { Module, Provider } from '@nestjs/common';
import { RefreshArticleWithMapDataHandler } from './application/event/refresh-article-with-map-data.handle';
import { ArticleWithDataController } from './article-with-data.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ArticleWithMapDataQuery } from './infrastructure/query/article-with-map-data.query';
import { FindOneArticleWithMapDataHandler } from './application/query/article-with-map-data.find-one.handler';
import { FindArticleWithMapDataHandler } from './application/query/article-with-map-data.find.handler';
import { GetTotalArticleWithMapDataHandler } from './application/query/article-with-map-data.get-total.handler';
import { ArticleWithMapDataViewUpdater } from './application/view/article-with-map-data.view.update';

const infrastructure: Provider[] = [ArticleWithMapDataQuery];

const application = [
  //Query
  FindArticleWithMapDataHandler,
  FindOneArticleWithMapDataHandler,
  GetTotalArticleWithMapDataHandler,
  //Event
  RefreshArticleWithMapDataHandler,
];

const domain = [];

@Module({
  imports: [CqrsModule],
  controllers: [ArticleWithDataController],
  providers: [
    ...infrastructure,
    ...application,
    ...domain,
    ArticleWithMapDataViewUpdater,
  ],
  exports: [],
})
export class CqrsCommonModule {}
