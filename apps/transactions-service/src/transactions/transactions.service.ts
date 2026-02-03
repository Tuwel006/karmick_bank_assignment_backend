import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from './entities/transactions.entity';
import { LedgerEntry, LedgerEntryType } from './entities/ledger.entity';
import { BankAccount } from '../../../accounts-service/src/accounts/entities/bank-account.entity';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';
import { ResponseHelper } from '../../../../shared/helpers/response.helper';

export interface DepositDto {
  accountId: string;
  amount: number;
  narration?: string;
}

export interface WithdrawDto {
  accountId: string;
  amount: number;
  narration?: string;
}

export interface TransferDto {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  narration?: string;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(LedgerEntry)
    private ledgerRepository: Repository<LedgerEntry>,
    @InjectRepository(BankAccount)
    private accountRepository: Repository<BankAccount>,
    private dataSource: DataSource,
  ) { }

  async deposit(depositDto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { accountId, amount, narration } = depositDto;

      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      const account = await queryRunner.manager.findOne(BankAccount, { where: { id: accountId } });
      if (!account) {
        throw new NotFoundException('Account not found');
      }

      // Create transaction
      const transaction = queryRunner.manager.create(Transaction, {
        txnRef: await this.generateTxnRef(),
        type: TransactionType.DEPOSIT,
        toAccountId: accountId,
        amount: amount.toString(),
        status: TransactionStatus.SUCCESS,
        narration: narration || 'Cash Deposit'
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Update account balance
      const currentBalance = parseFloat(account.balance);
      const newBalance = currentBalance + amount;
      account.balance = newBalance.toString();
      await queryRunner.manager.save(account);

      // Create ledger entry
      const ledgerEntry = queryRunner.manager.create(LedgerEntry, {
        transactionId: savedTransaction.id,
        accountId,
        entryType: LedgerEntryType.CREDIT,
        amount: amount.toString(),
        balanceBefore: currentBalance.toString(),
        balanceAfter: newBalance.toString()
      });

      await queryRunner.manager.save(ledgerEntry);
      await queryRunner.commitTransaction();

      return ResponseHelper.success(savedTransaction, 'Deposit processed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Deposit failed', error.message));
    } finally {
      await queryRunner.release();
    }
  }

  async withdraw(withdrawDto: WithdrawDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { accountId, amount, narration } = withdrawDto;

      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      const account = await queryRunner.manager.findOne(BankAccount, { where: { id: accountId } });
      if (!account) {
        throw new NotFoundException('Account not found');
      }

      const currentBalance = parseFloat(account.balance);
      if (currentBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Create transaction
      const transaction = queryRunner.manager.create(Transaction, {
        txnRef: await this.generateTxnRef(),
        type: TransactionType.WITHDRAW,
        fromAccountId: accountId,
        amount: amount.toString(),
        status: TransactionStatus.SUCCESS,
        narration: narration || 'Cash Withdrawal'
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Update account balance
      const newBalance = currentBalance - amount;
      account.balance = newBalance.toString();
      await queryRunner.manager.save(account);

      // Create ledger entry
      const ledgerEntry = queryRunner.manager.create(LedgerEntry, {
        transactionId: savedTransaction.id,
        accountId,
        entryType: LedgerEntryType.DEBIT,
        amount: amount.toString(),
        balanceBefore: currentBalance.toString(),
        balanceAfter: newBalance.toString()
      });

      await queryRunner.manager.save(ledgerEntry);
      await queryRunner.commitTransaction();

      return ResponseHelper.success(savedTransaction, 'Withdrawal processed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Withdrawal failed', error.message));
    } finally {
      await queryRunner.release();
    }
  }

  async transfer(transferDto: TransferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { fromAccountId, toAccountId, amount, narration } = transferDto;

      if (amount <= 0) {
        throw new BadRequestException('Amount must be greater than 0');
      }

      if (fromAccountId === toAccountId) {
        throw new BadRequestException('Cannot transfer to same account');
      }

      const [fromAccount, toAccount] = await Promise.all([
        queryRunner.manager.findOne(BankAccount, { where: { id: fromAccountId } }),
        queryRunner.manager.findOne(BankAccount, { where: { id: toAccountId } })
      ]);

      if (!fromAccount) throw new NotFoundException('Source account not found');
      if (!toAccount) throw new NotFoundException('Destination account not found');

      const fromBalance = parseFloat(fromAccount.balance);
      if (fromBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Create transaction
      const transaction = queryRunner.manager.create(Transaction, {
        txnRef: await this.generateTxnRef(),
        type: TransactionType.TRANSFER,
        fromAccountId,
        toAccountId,
        amount: amount.toString(),
        status: TransactionStatus.SUCCESS,
        narration: narration || `Transfer to ${toAccount.accountNumber}`
      });

      const savedTransaction = await queryRunner.manager.save(transaction);

      // Update balances
      const newFromBalance = fromBalance - amount;
      const toBalance = parseFloat(toAccount.balance);
      const newToBalance = toBalance + amount;

      fromAccount.balance = newFromBalance.toString();
      toAccount.balance = newToBalance.toString();

      await Promise.all([
        queryRunner.manager.save(fromAccount),
        queryRunner.manager.save(toAccount)
      ]);

      // Create ledger entries
      const ledgerEntries = [
        queryRunner.manager.create(LedgerEntry, {
          transactionId: savedTransaction.id,
          accountId: fromAccountId,
          entryType: LedgerEntryType.DEBIT,
          amount: amount.toString(),
          balanceBefore: fromBalance.toString(),
          balanceAfter: newFromBalance.toString()
        }),
        queryRunner.manager.create(LedgerEntry, {
          transactionId: savedTransaction.id,
          accountId: toAccountId,
          entryType: LedgerEntryType.CREDIT,
          amount: amount.toString(),
          balanceBefore: toBalance.toString(),
          balanceAfter: newToBalance.toString()
        })
      ];

      await queryRunner.manager.save(ledgerEntries);
      await queryRunner.commitTransaction();

      return ResponseHelper.success(savedTransaction, 'Transfer completed successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Transfer failed', error.message));
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(branchId?: string, accountId?: string, customerId?: string, pagination?: PaginationDto) {
    try {
      const query = this.transactionRepository.createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.ledgerEntries', 'ledger')
        .leftJoin('ledger.account', 'account')
        .orderBy('transaction.createdAt', 'DESC');

      if (branchId) {
        query.andWhere('account.branchId = :branchId', { branchId });
      }

      if (accountId) {
        query.andWhere('(transaction.fromAccountId = :accountId OR transaction.toAccountId = :accountId)', { accountId });
      }

      if (customerId) {
        query.andWhere('account.customerId = :customerId', { customerId });
      }

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        query.skip((page - 1) * limit).take(limit);
      }

      const [transactions, total] = await query.getManyAndCount();

      return ResponseHelper.paginated(transactions, total, pagination?.page || 1, pagination?.limit || 10);
    } catch (error) {
      throw new BadRequestException(ResponseHelper.error('Failed to fetch transactions', error.message));
    }
  }

  async findOne(id: string) {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: ['ledgerEntries', 'ledgerEntries.account']
      });

      if (!transaction) {
        throw new NotFoundException(ResponseHelper.error('Transaction not found'));
      }

      return ResponseHelper.success(transaction, 'Transaction retrieved successfully');
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to fetch transaction', error.message));
    }
  }

  async getStats() {
    try {
      const total = await this.transactionRepository.count();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await this.transactionRepository.count({
        where: { createdAt: MoreThanOrEqual(today) }
      });

      return ResponseHelper.success({ total, today: todayCount }, 'Transaction stats retrieved successfully');
    } catch (error) {
      throw new BadRequestException(ResponseHelper.error('Failed to fetch transaction stats', error.message));
    }
  }

  private async generateTxnRef(): Promise<string> {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN-${year}-${timestamp.slice(-6)}${random}`;
  }
}