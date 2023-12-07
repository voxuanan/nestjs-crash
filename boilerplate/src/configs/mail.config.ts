import { registerAs } from '@nestjs/config';

export default registerAs(
    'mail',
    (): Record<string, any> => ({
        host: process.env.MAIL_HOST,
        port: Number.parseInt(process.env.MAIL_PORT),
        account: process.env.MAIL_ACCOUNT,
        password: process.env.MAIL_PASSWORD,
        name: process.env.MAIL_NAME,
        from: process.env.MAIL_FROM,
        secure: false,
    }),
);
