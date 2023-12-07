import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
    'debugger',
    (): Record<string, any> => ({
        http: {
            writeIntoFile: process.env.DEBUGGER_HTTP_WRITE_INTO_FILE === 'true',
            writeIntoConsole:
                process.env.DEBUGGER_HTTP_WRITE_INTO_CONSOLE === 'true',
            maxFiles: 5,
            maxSize: '2M',
        },
        system: {
            writeIntoFile:
                process.env.DEBUGGER_SYSTEM_WRITE_INTO_FILE === 'true',
            writeIntoConsole:
                process.env.DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE === 'true',
            maxFiles: '7d',
            maxSize: '2m',
        },

        sentry: {
            enable: process.env.SENTRY_ENABLE === 'true',
            dsn: process.env.SENTRY_DSN,
            timeout: ms('10s'),
            logLevels: ['fatal'],
        },
    }),
);
