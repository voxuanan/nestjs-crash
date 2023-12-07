import { registerAs } from '@nestjs/config';

export default registerAs(
    'database',
    (): Record<string, any> => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST ?? '127.0.0.1',
        port: process.env.DATABASE_PORT ?? 3306,
        name: process.env.DATABASE_NAME ?? 'test',
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        logging: process.env.DATABASE_LOGGING === 'true' ? true : false,
    }),
);
