import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { join } from 'path';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import configs from 'src/configs';
import { UpperSnakeNamingStrategy } from 'src/upper-snake-naming.strategy';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AuthModule } from './auth/auth.module';
import { MyCacheModule } from './cache/cache.module';
import { DebuggerModule } from './debugger/debugger.module';
import { ErrorModule } from './error/error.module';
import { FileModule } from './file/file.module';
import { HelperModule } from './helper/helper.module';
import { MailModule } from './mail/mail.module';
import { ENUM_MESSAGE_LANGUAGE } from './message/constants/message.enum.constant';
import { MessageModule } from './message/message.module';
import { PaginationModule } from './pagination/pagination.module';
import { PolicyModule } from './policy/policy.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';
import { SettingModule } from './setting/setting.module';
import { MicroserviceModule } from './microservice/microservice.module';

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
                APP_NAME: Joi.string().required(),
                APP_ENV: Joi.string()
                    .valid(...Object.values(ENUM_APP_ENVIRONMENT))
                    .default('development')
                    .required(),
                APP_LANGUAGE: Joi.string()
                    .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
                    .default(APP_LANGUAGE)
                    .required(),

                FRONT_END_URL: Joi.string().optional(),

                HTTP_ENABLE: Joi.boolean().default(true).required(),
                HTTP_HOST: [
                    Joi.string().ip({ version: 'ipv4' }).required(),
                    Joi.valid('localhost').required(),
                ],
                HTTP_PORT: Joi.number().default(3000).required(),
                HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
                HTTP_VERSION: Joi.number().required(),

                DEBUGGER_HTTP_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_HTTP_WRITE_INTO_CONSOLE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_SYSTEM_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE: Joi.boolean()
                    .default(false)
                    .required(),
                SENTRY_DSN: Joi.string().allow(null, '').optional(),
                SENTRY_ENABLE: Joi.boolean().default(false).required(),

                JOB_ENABLE: Joi.boolean().default(false).required(),

                DATABASE_HOST: Joi.string().default('127.0.0.1').required(),
                DATABASE_PORT: Joi.number().default('3306').required(),
                DATABASE_NAME: Joi.string().default('ack').required(),
                DATABASE_USERNAME: Joi.string().allow(null, '').optional(),
                DATABASE_PASSWORD: Joi.string().allow(null, '').optional(),
                DATABASE_LOGGING: Joi.boolean().default(false).optional(),

                AUTH_JWT_SUBJECT: Joi.string().required(),
                AUTH_JWT_AUDIENCE: Joi.string().required(),
                AUTH_JWT_ISSUER: Joi.string().required(),

                AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
                    .alphanum()
                    .min(5)
                    .max(50)
                    .required(),
                AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string()
                    .default('15m')
                    .required(),

                AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
                    .alphanum()
                    .min(5)
                    .max(50)
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string()
                    .default('7d')
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string()
                    .default('15m')
                    .required(),

                AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean()
                    .default(false)
                    .required(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),

                SSO_GOOGLE_CLIENT_ID: Joi.string().allow(null, '').optional(),
                SSO_GOOGLE_CLIENT_SECRET: Joi.string()
                    .allow(null, '')
                    .optional(),

                MAIL_HOST: Joi.string().required(),
                MAIL_PORT: Joi.number().required(),
                MAIL_ACCOUNT: Joi.string().required(),
                MAIL_PASSWORD: Joi.string().required(),
                MAIL_NAME: Joi.string().required(),
                MAIL_FROM: Joi.string().required(),

                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.string().required(),
                CACHE_ENABLE: Joi.boolean().default(false).required(),
                CACHE_TTL: Joi.string().default('15m').required(),

                AWS_CREDENTIAL_KEY: Joi.string().allow(null, '').optional(),
                AWS_CREDENTIAL_SECRET: Joi.string().allow(null, '').optional(),
                AWS_S3_REGION: Joi.string().allow(null, '').optional(),
                AWS_S3_BUCKET: Joi.string().allow(null, '').optional(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const migrations = [
                    __dirname + '/migration/migrations/*{.ts,.js}',
                ];

                const entities = [
                    join(__dirname, '..') + '/modules/**/entities/*.entity.ts',
                    join(__dirname, '..') + '/common/**/entities/*.entity.ts',
                ];

                return {
                    autoLoadEntities: true,
                    entities,
                    migrations,
                    type: 'mysql',
                    host: configService.get<string>('database.host'),
                    port: configService.get<number>('database.port'),
                    username: configService.get<string>('database.username'),
                    password: configService.get<string>('database.password'),
                    database: configService.get<string>('database.name'),
                    // subscribers: [UserSubscriber],
                    migrationsRun: true,
                    logging: configService.get<boolean>('database.logging'),
                    namingStrategy: new UpperSnakeNamingStrategy(),
                    driver: require('mysql2'),
                    synchronize:
                        configService.get<ENUM_APP_ENVIRONMENT>('app.env') !=
                        ENUM_APP_ENVIRONMENT.PRODUCTION,
                };
            },
            inject: [ConfigService],
            dataSourceFactory: (options) => {
                if (!options) {
                    throw new Error('Invalid options passed');
                }

                return Promise.resolve(
                    addTransactionalDataSource(new DataSource(options)),
                );
            },
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    redis: {
                        host: configService.get<string>('redis.host'),
                        port: configService.get<number>('redis.port'),
                    },
                };
            },
            inject: [ConfigService],
        }),
        PolicyModule,
        PaginationModule,
        MicroserviceModule,
        MessageModule,
        FileModule,
        HelperModule,
        ErrorModule,
        SettingModule,
        ResponseModule,
        RequestModule,
        MailModule,
        MyCacheModule,
        DebuggerModule.forRoot(),
        AuthModule.forRoot(),
    ],
})
export class CommonModule {}
