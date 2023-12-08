import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { ArticleEntity } from 'src/article/cqrs/infrastructure/entity/article.entity';
import configs from 'src/configs';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { HelperModule } from './helper/helper.module';
import { EventSourcingEntity } from './event-sourcing/entity/event-sourcing.entity';
import { EventProcessingAttemptEntity } from './event-sourcing/entity/event-processcing-attempt.entity';
import { TestEntity } from 'src/test/cqrs/infrastructure/entity/test.entity';
import { ArticlWithMapDataeMaterializedView } from './common-cqrs/application/view/article-with-map-data.materialized-view.entity';
import { CqrsCommonModule } from './common-cqrs/cqrs.common.module';

interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

interface ReadConnection {
  readonly getRepository: <T extends ObjectLiteral>(
    target: EntityTarget<T>,
  ) => Repository<T>;
  readonly query: (query: string) => Promise<void>;
  readonly createQueryBuilder: <Entity extends ObjectLiteral>(
    entityClass: EntityTarget<Entity>,
    alias: string,
    queryRunner?: QueryRunner,
  ) => SelectQueryBuilder<Entity>;
}

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,

      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().default('127.0.0.1').required(),
        DATABASE_PORT: Joi.number().default('3306').required(),
        DATABASE_NAME: Joi.string().default('ack').required(),
        DATABASE_USERNAME: Joi.string().allow(null, '').optional(),
        DATABASE_PASSWORD: Joi.string().allow(null, '').optional(),
        DATABASE_LOGGING: Joi.boolean().default(false).optional(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          autoLoadEntities: true,
          entities: [
            ArticleEntity,
            EventSourcingEntity,
            EventProcessingAttemptEntity,
            TestEntity,
            //View
            ArticlWithMapDataeMaterializedView,
          ],
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          migrationsRun: true,
          logging: configService.get<boolean>('database.logging'),
          driver: require('pg'),
          synchronize: true,
        };
      },
      inject: [ConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const dataSource = new DataSource(options);
        writeConnection = dataSource.createQueryRunner();
        readConnection = dataSource.manager;

        return Promise.resolve(dataSource);
      },
    }),
    ScheduleModule.forRoot(),
    HelperModule,
    CqrsCommonModule,
  ],
})
export class CommonModule {}
