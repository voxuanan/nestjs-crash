import {
    HttpStatus,
    Module,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RequestTimeoutInterceptor } from 'src/common/request/interceptors/request.timeout.interceptor';
import { RequestMiddlewareModule } from 'src/common/request/middleware/request.middleware.module';
import { MobileNumberAllowedConstraint } from 'src/common/request/validations/request.mobile-number-allowed.validation';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from './constants/request.status-code.constant';
import { IsPasswordMediumConstraint } from './validations/request.is-password-medium.validation';
import { IsPasswordStrongConstraint } from './validations/request.is-password-strong.validation';
import { IsPasswordWeakConstraint } from './validations/request.is-password-weak.validation';
import { IsStartWithConstraint } from './validations/request.is-start-with.validation';
import { IsOnlyDigitsConstraint } from './validations/request.only-digits.validation';
import { SafeStringConstraint } from './validations/request.safe-string.validation';
import { MaxBinaryFileConstraint } from 'src/common/request/validations/request.max-binary-file.validation';
import {
    ThrottlerGuard,
    ThrottlerModule,
    ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DateLessThanEqualTodayConstraint } from 'src/common/request/validations/request.date-less-than-equal-today.validation';
import { DateGreaterThanEqualTodayConstraint } from 'src/common/request/validations/request.date-greater-than-equal-today.validation';
import { GreaterThanEqualConstraint } from 'src/common/request/validations/request.greater-than-equal.validation';
import { GreaterThanConstraint } from 'src/common/request/validations/request.greater-than.validation';
import { LessThanEqualConstraint } from 'src/common/request/validations/request.less-than-equal.validation';
import { LessThanConstraint } from 'src/common/request/validations/request.less-than.validation';

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestTimeoutInterceptor,
        },
        {
            provide: APP_PIPE,
            useFactory: () =>
                new ValidationPipe({
                    transform: true,
                    skipNullProperties: false,
                    skipUndefinedProperties: false,
                    skipMissingProperties: false,
                    forbidUnknownValues: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    exceptionFactory: async (errors: ValidationError[]) =>
                        new UnprocessableEntityException({
                            statusCode:
                                ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                            message: 'request.validation',
                            errors,
                        }),
                }),
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        DateGreaterThanEqualTodayConstraint,
        DateLessThanEqualTodayConstraint,
        GreaterThanEqualConstraint,
        GreaterThanConstraint,
        IsPasswordStrongConstraint,
        IsPasswordMediumConstraint,
        IsPasswordWeakConstraint,
        IsStartWithConstraint,
        LessThanEqualConstraint,
        LessThanConstraint,
        MaxBinaryFileConstraint,
        MobileNumberAllowedConstraint,
        IsOnlyDigitsConstraint,
        SafeStringConstraint,
    ],
    imports: [
        RequestMiddlewareModule,
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
                throttlers: [
                    {
                        ttl: config.get('request.throttle.ttl'),
                        limit: config.get('request.throttle.limit'),
                    },
                ],
            }),
        }),
    ],
})
export class RequestModule {}
