import { DataSource } from 'typeorm';
import { User } from '../../users/entities/users.entity';
import { databaseConfig } from './db.config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [__dirname + '/../../**/*.entity.{ts,js}'],
    synchronize: true,
    logging: false,
    ssl: {
        rejectUnauthorized: false, // Fixes the self-signed certificate error
    },
    connectTimeoutMS: 10000,
    extra: {
        max: 5,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
    },
});
