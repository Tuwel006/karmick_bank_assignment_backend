import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Transaction } from './transactions.entity';
import { BankAccount } from '../../../../accounts-service/src/accounts/entities/bank-account.entity';

export enum LedgerEntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

@Entity({ name: 'ledger_entries' })
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' })
  transactionId: string;

  @ManyToOne(() => Transaction, (t) => t.ledgerEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @Index()
  @Column({ type: 'uuid' })
  accountId: string;

  @ManyToOne(() => BankAccount, (a) => a.ledgerEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: BankAccount;

  @Column({ type: 'enum', enum: LedgerEntryType })
  entryType: LedgerEntryType;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  balanceBefore: string;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  balanceAfter: string;

  @CreateDateColumn()
  createdAt: Date;
}
