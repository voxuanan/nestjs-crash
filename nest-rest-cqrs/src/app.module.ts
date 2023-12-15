import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CommonModule } from './common/common.module';
import { EventStoreModule } from './common/event-sourcing/event-store.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { TestModule } from './test/test.module';
import { RequestStorageMiddleware } from './common/request-storage/request-storage.middleware';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    EventStoreModule.forRoot(),
    CommonModule,
    CqrsModule,
    KafkaModule,
    ArticleModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
