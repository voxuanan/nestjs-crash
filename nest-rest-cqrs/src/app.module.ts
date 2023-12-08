import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CommonModule } from './common/common.module';
import { EventSourcingModule } from './common/event-sourcing/event-sourcing.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { RequestStorageMiddleware } from './common/request-storage/request-storage.middleware';
import { TestModule } from './test/test.module';
import { EventStore } from './common/event-sourcing/event-store';
import { CqrsModule, EventBus } from '@nestjs/cqrs';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    CommonModule,
    CqrsModule,
    EventSourcingModule,
    KafkaModule,
    ArticleModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  onModuleInit() {
    this.eventStore.bridgeEventsTo(this.eventBus.subject$);
    this.eventBus.publisher = this.eventStore;
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
