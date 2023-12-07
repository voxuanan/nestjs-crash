import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// import { UserSubscriber } from './src/entity-subscribers/user-subscriber';
import { UpperSnakeNamingStrategy } from './src/upper-snake-naming.strategy';

dotenv.config();

export const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    namingStrategy: new UpperSnakeNamingStrategy(),
    // subscribers: [UserSubscriber],
    entities: [
        'src/modules/**/entities/*.entity{.ts,.js}',
        'src/modules/**/entities/*.view-entity{.ts,.js}',
    ],
    migrations: ['src/migration/migrations/*{.ts,.js}'],
});
