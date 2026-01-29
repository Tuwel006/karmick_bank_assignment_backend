import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { LedgerEntry } from './ledger.entity';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REVERSED = 'REVERSED',
}

@Entity({ name: 'transactions' })
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 40 })
    txnRef: string; // e.g. TXN-2026-0000001

    @Index()
    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    /**
     * DEPOSIT: fromAccountId = null, toAccountId = receiver
     * WITHDRAW: fromAccountId = sender, toAccountId = null
     * TRANSFER: both exist
     */
    @Index()
    @Column({ type: 'uuid', nullable: true })
    fromAccountId?: string;

    @Index()
    @Column({ type: 'uuid', nullable: true })
    toAccountId?: string;

    @Column({ type: 'numeric', precision: 18, scale: 2 })
    amount: string;

    @Index()
    @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
    status: TransactionStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    narration?: string; // "Deposit", "Transfer to XXXX"

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>; // future-proof (gateway, UPI, ip, device)

    @OneToMany(() => LedgerEntry, (l) => l.transaction)
    ledgerEntries: LedgerEntry[];

    @CreateDateColumn()
    createdAt: Date;
}
