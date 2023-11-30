import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { RequestStorageMiddleware } from './common/request-storage/request-storage.middleware';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [CommonModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
