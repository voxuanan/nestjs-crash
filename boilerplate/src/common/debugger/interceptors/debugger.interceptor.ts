import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { Observable } from 'rxjs';
import {
    IDebuggerHttpConfig,
    IDebuggerHttpConfigOptions,
    IDebuggerHttpMiddleware,
} from 'src/common/debugger/interfaces/debugger.interface';
import {
    DEBUGGER_HTTP_FORMAT,
    DEBUGGER_HTTP_NAME,
} from '../constants/debugger.constant';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { createStream } from 'rotating-file-stream';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

@Injectable()
export class DebuggerHttpResponseInterceptor implements NestInterceptor {
    private readonly writeIntoFile: boolean;
    private readonly writeIntoConsole: boolean;

    constructor(private readonly configService: ConfigService) {
        this.writeIntoConsole = this.configService.get<boolean>(
            'debugger.http.writeIntoConsole',
        );
        this.writeIntoFile = this.configService.get<boolean>(
            'debugger.http.writeIntoFile',
        );
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        let response = context.switchToHttp().getResponse<Response>();

        if (this.writeIntoConsole || this.writeIntoFile) {
            const send: any = response.send;
            const resOld: any = response;

            // Add response data to request
            // this is for morgan
            resOld.send = (body: any) => {
                resOld.body = body;
                resOld.send = send;
                resOld.send(body);

                response = resOld as Response;
            };
        }

        return next.handle();
    }
}

@Injectable()
export class DebuggerHttpInterceptor implements NestInterceptor {
    private readonly writeIntoFile: boolean;
    private readonly writeIntoConsole: boolean;

    constructor(private readonly configService: ConfigService) {
        this.writeIntoFile = this.configService.get<boolean>(
            'debugger.http.writeIntoFile',
        );
        this.writeIntoConsole = this.configService.get<boolean>(
            'debugger.http.writeIntoConsole',
        );
    }

    private customToken(): void {
        morgan.token('req-params', (req: Request) =>
            JSON.stringify(req.params),
        );

        morgan.token('req-body', (req: Request) => JSON.stringify(req.body));

        morgan.token(
            'res-body',
            (req: Request, res: IDebuggerHttpMiddleware) => res.body,
        );

        morgan.token('req-headers', (req: Request) =>
            JSON.stringify(req.headers),
        );
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (this.writeIntoConsole || this.writeIntoFile) {
            this.customToken();
        }

        return next.handle();
    }
}

@Injectable()
export class DebuggerHttpWriteIntoConsoleInterceptor
    implements NestInterceptor
{
    private readonly writeIntoConsole: boolean;

    constructor(private readonly configService: ConfigService) {
        this.writeIntoConsole = this.configService.get<boolean>(
            'debugger.http.writeIntoConsole',
        );
    }

    private async httpLogger(): Promise<IDebuggerHttpConfig> {
        return {
            debuggerHttpFormat: DEBUGGER_HTTP_FORMAT, // Ensure DEBUGGER_HTTP_FORMAT is defined
        };
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return this.writeIntoConsole
            ? new Observable((observer) => {
                  this.httpLogger().then((config) => {
                      morgan(config.debuggerHttpFormat)(
                          request,
                          response,
                          () => {
                              next.handle().subscribe({
                                  next: (data) => observer.next(data),
                                  error: (err) => observer.error(err),
                                  complete: () => observer.complete(),
                              });
                          },
                      );
                  });
              })
            : next.handle();
    }
}

@Injectable()
export class DebuggerHttpWriteIntoFileInterceptor implements NestInterceptor {
    private readonly writeIntoFile: boolean;
    private readonly maxSize: string;
    private readonly maxFiles: number;
    private readonly appENV: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly helperDateService: HelperDateService,
    ) {
        this.writeIntoFile = this.configService.get<boolean>(
            'debugger.http.writeIntoFile',
        );
        this.maxSize = this.configService.get<string>('debugger.http.maxSize');
        this.maxFiles = this.configService.get<number>(
            'debugger.http.maxFiles',
        );
        this.appENV = this.configService.get<ENUM_APP_ENVIRONMENT>('app.env');
    }

    private async httpLogger(): Promise<IDebuggerHttpConfig> {
        const date: string = this.helperDateService.format(
            this.helperDateService.create(),
        );

        const debuggerHttpOptions: IDebuggerHttpConfigOptions = {
            stream: createStream(`${date}.log`, {
                path: `./logs/${this.appENV}/${DEBUGGER_HTTP_NAME}/`,
                maxSize: this.maxSize,
                maxFiles: this.maxFiles,
                compress: true,
                interval: '1d',
            }),
        };

        return {
            debuggerHttpFormat: DEBUGGER_HTTP_FORMAT,
            debuggerHttpOptions,
        };
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return this.writeIntoFile
            ? new Observable((observer) => {
                  this.httpLogger().then((config) => {
                      morgan(
                          config.debuggerHttpFormat,
                          config.debuggerHttpOptions,
                      )(request, response, () => {
                          next.handle().subscribe({
                              next: (data) => observer.next(data),
                              error: (err) => observer.error(err),
                              complete: () => observer.complete(),
                          });
                      });
                  });
              })
            : next.handle();
    }
}
