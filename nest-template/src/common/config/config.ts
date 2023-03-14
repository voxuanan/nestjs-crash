import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Nest-tempate',
    description: 'NestJS APIs Documentation',
    version: '1.0',
    path: 'swagger',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  sentry: {
    enabled: true,
    dns: '',
  },
};

export default (): Config => config;
