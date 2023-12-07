import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

export default async function (app: NestApplication) {
    const configService = app.get(ConfigService);
    const dsn: string = configService.get<string>('debugger.sentry.dsn');
    const environment: ENUM_APP_ENVIRONMENT =
        configService.get<ENUM_APP_ENVIRONMENT>('app.env');
    const release: string = configService.get<string>('app.repoVersion');
    const enabled: boolean = configService.get<boolean>(
        'debugger.sentry.enable',
    );

    const logger = new Logger();

    Sentry.init({
        dsn,
        tracesSampleRate: 1.0,
        debug: false,
        environment,
        release,
        enabled,
    });

    if (enabled) {
        logger.log(
            `==========================================================`,
        );

        logger.log(`SenTry initialized with environment: ${environment}`);

        logger.log(
            `==========================================================`,
        );
    }
}
