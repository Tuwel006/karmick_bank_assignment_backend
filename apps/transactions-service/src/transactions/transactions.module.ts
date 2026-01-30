import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transactions.entity';
import { LedgerEntry } from './entities/ledger.entity';
import { DatabaseModule } from '../../../../shared/database/database.module';
import { BankAccount } from '../../../accounts-service/src/accounts/entities/bank-account.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Transaction, LedgerEntry, BankAccount]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule { }
