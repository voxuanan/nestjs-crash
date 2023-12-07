import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { errorsToTrackInSentry } from '../constants/debugger.sentry.constant';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    constructor() {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        const sentryEnvironment = Sentry.getCurrentHub()
            .getClient()
            .getOptions().environment;

        if (sentryEnvironment !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
            Sentry.setUser({ id: user?.id, email: user?.email });
            Sentry.setTag('request', request.url);
            Sentry.setTag('request method', request.method);
            Sentry.setContext('request body', request.body);
            Sentry.setContext('request params', request.params);
            Sentry.setContext('request query', request.query);
            return next.handle().pipe(catchError(this.enableSentry));
        }
        return next.handle();
    }

    enableSentry = (err: any) => {
        if (!err) return throwError(() => err);

        let sendToSentry = errorsToTrackInSentry.some(
            (errorType) => err instanceof errorType,
        );

        if (err?.name?.includes('Error')) {
            sendToSentry = true;
        }

        if (sendToSentry) Sentry.captureException(err);

        return throwError(() => err);
    };
}
