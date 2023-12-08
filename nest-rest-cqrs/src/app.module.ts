import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CommonModule } from './common/common.module';
import { EventSourcingModule } from './common/event-sourcing/event-sourcing.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { RequestStorageMiddleware } from './common/request-storage/request-storage.middleware';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    CommonModule,
    EventSourcingModule.forRoot(),
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
