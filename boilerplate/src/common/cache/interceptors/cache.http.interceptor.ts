import {
    CacheInterceptor,
    CACHE_KEY_METADATA,
    CACHE_TTL_METADATA,
} from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { CACHE_EACH_USER_CONFIG_META_KEY } from '../constants/cache.constant';

@Injectable()
export class CacheHttpInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();

        const cacheKey = this.reflector.get(
            CACHE_KEY_METADATA,
            context.getHandler(),
        );

        const cacheForEachUser = this.reflector.get(
            CACHE_EACH_USER_CONFIG_META_KEY,
            context.getHandler(),
        );

        if (cacheKey) {
            if (cacheForEachUser) {
                return `${cacheKey}-user:${request?.user?.id}-query:${request._parsedUrl.path}`;
            } else {
                return `${cacheKey}-query:${request._parsedUrl.path}`;
            }
        }

        if (cacheForEachUser) {
            return `user:${request?.user?.id}-${super.trackBy(context)}`;
        } else {
            return super.trackBy(context);
        }
    }
}
