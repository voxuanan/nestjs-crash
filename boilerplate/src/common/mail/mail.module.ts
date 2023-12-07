import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';
import { BullModule } from '@nestjs/bull';
import {
    MAIL_QUEUE,
    MAIL_QUEUE_LIMITTER_DURATION,
    MAIL_QUEUE_LIMITTER_MAX,
} from './constants/mail.queue.constant';
import { MailService } from './service/mail.service';
import { MailConsumer } from './processors/mail.processor';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    transport: {
                        host: configService.get<string>('mail.host'),
                        port: configService.get<number>('mail.port'),
                        secure: configService.get<boolean>('mail.secure'),
                        auth: {
                            user: configService.get<string>('mail.account'),
                            pass: configService.get<string>('mail.password'),
                        },
                    },
                    defaults: {
                        from: `"${configService.get(
                            'MAIL_NAME',
                        )}" <${configService.get('MAIL_FROM')}>`,
                    },
                    template: {
                        dir: path.join(__dirname, 'templates', 'views'),
                        adapter: new EjsAdapter({
                            inlineCssEnabled: true,
                        }),
                        options: {
                            strict: false,
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: MAIL_QUEUE,
            limiter: {
                max: MAIL_QUEUE_LIMITTER_MAX,
                duration: MAIL_QUEUE_LIMITTER_DURATION,
            },
        }),
    ],
    controllers: [],
    providers: [MailService, MailConsumer],
    exports: [MailService, MailConsumer],
})
export class MailModule {}
