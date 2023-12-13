import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventSourcingModule } from 'src/common/event-sourcing/event-sourcing.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { KafkaModule } from 'src/common/kafka/kafka.module';
import { ArticleController } from './article.controller';
import { ArticleIntegrationController } from './article.intergration.controller';
import { CreateArticleHandler } from './cqrs/application/command/article.create.handler';
import { UpdateNameArticleHandler } from './cqrs/application/command/article.update-name.handler';
import { CreateArticleEventHandler } from './cqrs/application/event/article.create-name.event.handler';
import { NameUpdatedEventHandler } from './cqrs/application/event/article.update-name.event.handler';
import { FindOneArticleHandler } from './cqrs/application/query/article.find-one.handler';
import { FindArticleHandler } from './cqrs/application/query/article.find.handler';
import { GetTotalArticleHandler } from './cqrs/application/query/article.get-total.handler';
import { ArticleFactory } from './cqrs/domain/article.factory';
import { ArticleSagas } from './cqrs/infrastructure/article.saga';
import { ArticleEntity } from './cqrs/infrastructure/entity/article.entity';
import { ArticleQuery } from './cqrs/infrastructure/query/article.query';
import { ArticleRepository } from './cqrs/infrastructure/repository/article.repository';

const infrastructure: Provider[] = [ArticleRepository, ArticleQuery];

const application = [
  //Command
  CreateArticleHandler,
  UpdateNameArticleHandler,
  //Query
  GetTotalArticleHandler,
  FindArticleHandler,
  FindOneArticleHandler,
  //Event
  CreateArticleEventHandler,
  NameUpdatedEventHandler,
];

const domain = [ArticleFactory];

@Module({
  imports: [
    KafkaModule,
    HelperModule,
    TypeOrmModule.forFeature([ArticleEntity]),
    EventSourcingModule,
    CqrsModule,
  ],
  controllers: [ArticleController, ArticleIntegrationController],
  providers: [
    Logger,
    ...infrastructure,
    ...application,
    ...domain,
    ArticleSagas,
  ],
})
export class ArticleModule {}
