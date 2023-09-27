import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Observable, tap, catchError } from 'rxjs';
import { InjectConnection } from '@nestjs/mongoose';

export class MongoTransactionInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as any;
    const session: mongoose.ClientSession =
      await this.connection.startSession();
    request.transaction = session;
    session.startTransaction();
    return next.handle().pipe(
      tap(async () => {
        console.log('tappppppppp');
        await session.commitTransaction();
        session.endSession();
      }),
      catchError(async (err) => {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }),
    );
  }
}
