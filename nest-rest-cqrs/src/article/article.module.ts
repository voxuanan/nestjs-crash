import { Logger, Module, OnModuleInit, Provider } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventStore } from 'src/common/event-sourcing/event-store';
import { EventStoreModule } from 'src/common/event-sourcing/event-store.module';
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

const CommandHandlers = [CreateArticleHandler, UpdateNameArticleHandler];
const EventHandlers = [CreateArticleEventHandler, NameUpdatedEventHandler];

const application = [
  //Command
  ...CommandHandlers,
  //Query
  GetTotalArticleHandler,
  FindArticleHandler,
  FindOneArticleHandler,
  //Event
  ...EventHandlers,
];

const domain = [ArticleFactory];

@Module({
  imports: [
    KafkaModule,
    HelperModule,
    TypeOrmModule.forFeature([ArticleEntity]),
    EventStoreModule.forFeature(),
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
export class ArticleModule implements OnModuleInit {
  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    this.eventStore.setCategory('articles');
    this.eventStore.setEventHandlers(EventHandlers);
    this.eventStore.bridgeEventsTo((this.event$ as any).subject$);
    this.event$.publisher = this.eventStore;
    // /** ------------ */
    this.event$.register(EventHandlers);
    this.command$.register(CommandHandlers);
  }
}
