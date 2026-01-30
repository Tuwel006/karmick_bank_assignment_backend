import { DataSource } from 'typeorm';
import * as path from 'path';
import { databaseConfig } from './database.config';

export const MigrationDataSource = new DataSource({
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [
        path.join(__dirname, '../../apps/*/src/**/entities/*.entity.{ts,js}'),
    ],
    migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
    synchronize: false,
    logging: true,
    ssl: {
        rejectUnauthorized: false,
    },
    connectTimeoutMS: 10000,
    extra: {
        max: 10,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
    },
});

