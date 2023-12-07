import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
    'microservice',
    (): Record<string, any> => ({
        timeout: ms('5m'),

        redis: {
            host: process.env.REDIS_HOST ?? '127.0.0.1',
            port: process.env.REDIS_PORT
                ? parseInt(process.env.REDIS_PORT)
                : 6379,
        },
    }),
);
