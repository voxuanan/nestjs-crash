import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
    'redis',
    (): Record<string, any> => ({
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        cache: {
            ttl: ms(process.env.CACHE_TTL),
            enable: process.env.CACHE_ENABLE === 'true',
        },
    }),
);
