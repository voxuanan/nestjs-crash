import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { RequestStorageMiddleware } from './common/request-storage/request-storage.middleware';
import { ArticleModule } from './article/article.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { LogModule } from './test/cqrs/application/command/test.module';
import { MigrationModule } from './src/migration/migration.module';

@Module({
  imports: [CommonModule, KafkaModule, ArticleModule, LogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
