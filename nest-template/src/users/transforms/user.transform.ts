import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import User from '../entity/user.entity';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UserTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data) => {
        if (data.data && Array.isArray(data.data)) {
          data.data = data.data.map((item) => {
            return this.transform(item);
          });
          return data;
        }
        return this.transform(data);
      }),
    );
  }

  transform(user: User | any): User {
    if (user instanceof User || user instanceof Object) {
      if (user?.currentHashedRefreshToken) {
        (user as User).currentHashedRefreshToken = '';
      }
      if (user?.password) {
        (user as User).password = '';
      }
      return user;
    }
  }
}
