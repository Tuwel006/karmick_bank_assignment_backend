import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';
import { User } from '../../apps/users-service/src/users/entities/users.entity';
import { BankAccount } from '../../apps/accounts-service/src/accounts/entities/bank-account.entity';
import { Transaction } from '../../apps/transactions-service/src/transactions/entities/transactions.entity';
import { LedgerEntry } from '../../apps/transactions-service/src/transactions/entities/ledger.entity';
import { Customer } from '../../apps/customer-service/src/customer/entities/customer.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.user,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [User, BankAccount, Transaction, LedgerEntry, Customer],
    synchronize: true, // Only for dev
    logging: false,
    ssl: {
        rejectUnauthorized: false,
    },
    connectTimeoutMS: 10000,
    extra: {
        max: 10, // Increased for shared use
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000,
    },
});
