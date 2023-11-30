import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/common/helper/helper.module';
import { ArticleController } from './article.controller';
import { CreateArticleHandler } from './cqrs/application/command/article.create.handler';
import { ArticleFactory } from './cqrs/domain/article.factory';
import { ArticleEntity } from './cqrs/infrastructure/entity/article.entity';
import { ArticleRepository } from './cqrs/infrastructure/repository/article.repository';

const infrastructure: Provider[] = [ArticleRepository];

const application = [CreateArticleHandler];

const domain = [ArticleFactory];

@Module({
  imports: [
    HelperModule,
    TypeOrmModule.forFeature([ArticleEntity]),
    CqrsModule,
  ],
  controllers: [ArticleController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class ArticleModule {}
