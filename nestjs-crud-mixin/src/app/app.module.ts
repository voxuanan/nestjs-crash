import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppEntity } from './entities/app.entity';
import { TestModule } from 'src/modules/test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          autoLoadEntities: true,
          entities: [AppEntity],
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'test',
          password: '123456',
          database: 'test',
          migrationsRun: true,
          logging: configService.get<boolean>('database.logging'),
          driver: require('mysql2'),
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([AppEntity]),
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
