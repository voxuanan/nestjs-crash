import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { CACHE_EACH_USER_CONFIG_META_KEY } from '../constants/cache.constant';
import { CacheHttpInterceptor } from '../interceptors/cache.http.interceptor';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '@nestjs/cache-manager';

export function ApplyCache(
    cacheKey: string | undefined,
    cacheTTL: number | undefined, // miliseconds
    cacheForEachUser: boolean | undefined,
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(CacheHttpInterceptor),
        SetMetadata(CACHE_KEY_METADATA, cacheKey),
        SetMetadata(CACHE_TTL_METADATA, cacheTTL),
        SetMetadata(CACHE_EACH_USER_CONFIG_META_KEY, cacheForEachUser),
    );
}
