import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    OneToMany,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { LedgerEntry } from '../../../../transactions-service/src/transactions/entities/ledger.entity';
import { Branch } from '../../../../users-service/src/branch/entities/branch.entity';

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

    @Index()
    @Column({ type: 'uuid', nullable: true })
    branchId: string; // reference users.branches.id

    // NOTE: In a shared-DB monolith, we could actually use @ManyToOne here if we import the Branch entity.
    // However, since they are in different 'app' folders, we might treat it as a loose reference
    // OR we can import it. The user wanted "link branch id, account number ifsc".
    // I will stick to branchId column + loose coupling or soft relation for now, 
    // BUT since we share the connection, I will add the import to make it a REAL relation 
    // which TypeORM supports since they are in the same connection.
    @ManyToOne(() => Branch, { nullable: true })
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;

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
