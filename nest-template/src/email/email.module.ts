import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bull';
import { Queue_Enum } from 'src/common/enums/queue.enum';
import { EmailConsumer } from './email.consumer';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { EmailScheduleService } from './emailSchedule.service';
import EmailSchedulingController from './emailSchedule.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          // host: configService.get<string>('MAIL_HOST'),
          // port: configService.get<string>('MAIL_PORT'),
          service: configService.get<string>('MAIL_SERVICE'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_ACCOUNT'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"<${configService.get('MAIL_NAME')}" <${configService.get(
            'MAIL_FROM',
          )}>`,
        },
        template: {
          dir: path.join(__dirname, '../', 'common', 'ejs', 'views'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: Queue_Enum.EmailQueue,
      limiter: {
        max: 2,
        duration: 1000,
      },
    }),
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [EmailSchedulingController],
  providers: [EmailService, EmailConsumer, EmailScheduleService],
  exports: [EmailService, EmailConsumer, EmailScheduleService],
})
export class EmailModule {}
