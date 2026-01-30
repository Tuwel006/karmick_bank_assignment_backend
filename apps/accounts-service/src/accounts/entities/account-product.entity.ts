import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BankAccount } from './bank-account.entity';

export enum ProductType {
    SAVINGS = 'SAVINGS',
    CURRENT = 'CURRENT',
    CHILDS_SAVINGS = 'CHILDS_SAVINGS',
    BUSINESS_STARTUP = 'BUSINESS_STARTUP',
}

@Entity({ name: 'account_products' })
export class AccountProduct {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string; // e.g. "Silver Savings Account", "Platinum Current Account"

    @Column({ type: 'varchar', length: 20, unique: true })
    code: string; // e.g. "SAV-SILVER", "CUR-PLAT"

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: ProductType, default: ProductType.SAVINGS })
    productType: ProductType;

    // --- Balance Rules ---

    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
    minDailyBalance: string; // Minimum balance to maintain at end of day

    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
    minMonthlyAverageBalance: string; // MAB Requirement

    // --- Transaction Limits ---

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
    dailyTransactionLimit: string; // Max total outbound amount per day

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
    monthlyTransactionLimit: string; // Max total outbound amount per month

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
    minTransactionAmount: string; // Min amount per single transaction

    @Column({ type: 'numeric', precision: 18, scale: 2, nullable: true })
    maxTransactionAmount: string; // Max amount per single transaction

    // --- Fees & Overdraft ---

    @Column({ type: 'numeric', precision: 5, scale: 2, default: 0 })
    interestRate: string; // Annual Interest Rate (%)

    @Column({ type: 'boolean', default: false })
    allowsOverdraft: boolean;

    @Column({ type: 'numeric', precision: 18, scale: 2, default: 0 })
    overdraftLimit: string;

    // --- Relations ---

    @OneToMany(() => BankAccount, (account) => account.product)
    accounts: BankAccount[];

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
