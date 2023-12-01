import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperModule } from 'src/common/helper/helper.module';
import { ArticleController } from './article.controller';
import { CreateArticleHandler } from './cqrs/application/command/article.create.handler';
import { ArticleFactory } from './cqrs/domain/article.factory';
import { ArticleEntity } from './cqrs/infrastructure/entity/article.entity';
import { ArticleRepository } from './cqrs/infrastructure/repository/article.repository';
import { UpdateNameArticleHandler } from './cqrs/application/command/article.update-name.handler';
import { NameUpdatedEventHandler } from './cqrs/application/event/article.update-name.event.handler';
import { KafkaModule } from 'src/common/kafka/kafka.module';
import { ArticleIntegrationController } from './article.intergration.controller';

const infrastructure: Provider[] = [ArticleRepository];

const application = [
  CreateArticleHandler,
  UpdateNameArticleHandler,
  //Event
  NameUpdatedEventHandler,
];

const domain = [ArticleFactory];

@Module({
  imports: [
    KafkaModule,
    HelperModule,
    TypeOrmModule.forFeature([ArticleEntity]),
    CqrsModule,
  ],
  controllers: [ArticleController, ArticleIntegrationController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class ArticleModule {}
