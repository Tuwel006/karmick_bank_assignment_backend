import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { LedgerEntry } from '../../../../transactions-service/src/transactions/entities/ledger.entity';

export enum AccountType {
    SAVINGS = 'SAVINGS',
    CURRENT = 'CURRENT',
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    FROZEN = 'FROZEN',
    CLOSED = 'CLOSED',
}

@Entity({ name: 'bank_accounts' })
export class BankAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid' })
    userId: string; // reference users.users.id (from users-service)

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 20 })
    accountNumber: string; // unique account no

    @Column({ type: 'varchar', length: 11, default: 'KRMK0000123' })
    ifscCode: string;

    @Column({ type: 'enum', enum: AccountType, default: AccountType.SAVINGS })
    accountType: AccountType;

    @Column({ type: 'varchar', length: 3, default: 'INR' })
    currency: string;

    /**
     * Balance stored here for fast access
     * But must always be updated through transaction logic only.
     */
    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
    balance: string;

    @Index()
    @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
    status: AccountStatus;

    @OneToMany(() => LedgerEntry, (l) => l.account)
    ledgerEntries: LedgerEntry[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
