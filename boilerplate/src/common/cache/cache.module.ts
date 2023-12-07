import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
    exports: [CacheService],
    providers: [CacheService],
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (
                configService: ConfigService,
            ): Promise<CacheModuleOptions<RedisClientOptions>> => {
                const cacheEnable =
                    configService.get<boolean>('redis.cache.enable');
                const ttl = configService.get<number>('redis.cache.ttl');

                const url = `redis://${configService.get<string>(
                    'redis.host',
                )}:${configService.get<number>('redis.port')}`;
                const store = await redisStore({
                    url,
                    ttl,
                });

                if (cacheEnable) {
                    return {
                        store,
                        url,
                    };
                } else
                    return {
                        ttl: 1,
                    };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
})
export class MyCacheModule {}
