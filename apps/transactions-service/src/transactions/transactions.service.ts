import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { Transaction, TransactionStatus, TransactionType } from './entities/transactions.entity';
import { LedgerEntry, LedgerEntryType } from './entities/ledger.entity';
import { BankAccount } from '../../../accounts-service/src/accounts/entities/bank-account.entity';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) { }

  async create(createTransactionsDto: CreateTransactionsDto) {
    const { type, fromAccountId, toAccountId, amount, narration, metadata } = createTransactionsDto;
    const amountVal = parseFloat(amount);

    if (isNaN(amountVal) || amountVal <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let transaction = new Transaction();
      transaction.type = type;
      transaction.amount = amountVal.toFixed(2);
      transaction.status = TransactionStatus.PENDING;
      transaction.txnRef = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      transaction.narration = narration;
      transaction.metadata = metadata;
      transaction.fromAccountId = fromAccountId;
      transaction.toAccountId = toAccountId;
      transaction.ledgerEntries = [];

      // Save initial pending transaction
      transaction = await queryRunner.manager.save(Transaction, transaction);

      if (type === TransactionType.DEPOSIT) {
        if (!toAccountId) throw new BadRequestException('Target account ID required for deposit');
        const account = await queryRunner.manager.findOne(BankAccount, { where: { id: toAccountId } });
        if (!account) throw new NotFoundException('Target account not found');

        const balanceBefore = parseFloat(account.balance);
        const balanceAfter = balanceBefore + amountVal;

        account.balance = balanceAfter.toFixed(2);
        await queryRunner.manager.save(BankAccount, account);

        const ledger = new LedgerEntry();
        ledger.transaction = transaction;
        ledger.account = account;
        ledger.entryType = LedgerEntryType.CREDIT;
        ledger.amount = amountVal.toFixed(2);
        ledger.balanceBefore = balanceBefore.toFixed(2);
        ledger.balanceAfter = balanceAfter.toFixed(2);
        await queryRunner.manager.save(LedgerEntry, ledger);

      } else if (type === TransactionType.WITHDRAW) {
        if (!fromAccountId) throw new BadRequestException('Source account ID required for withdrawal');
        const account = await queryRunner.manager.findOne(BankAccount, { where: { id: fromAccountId } });
        if (!account) throw new NotFoundException('Source account not found');

        const balanceBefore = parseFloat(account.balance);
        if (balanceBefore < amountVal) {
          throw new BadRequestException('Insufficient funds');
        }
        const balanceAfter = balanceBefore - amountVal;

        account.balance = balanceAfter.toFixed(2);
        await queryRunner.manager.save(BankAccount, account);

        const ledger = new LedgerEntry();
        ledger.transaction = transaction;
        ledger.account = account;
        ledger.entryType = LedgerEntryType.DEBIT;
        ledger.amount = amountVal.toFixed(2);
        ledger.balanceBefore = balanceBefore.toFixed(2);
        ledger.balanceAfter = balanceAfter.toFixed(2);
        await queryRunner.manager.save(LedgerEntry, ledger);

      } else if (type === TransactionType.TRANSFER) {
        if (!fromAccountId || !toAccountId) throw new BadRequestException('Both source and target account IDs required for transfer');
        if (fromAccountId === toAccountId) throw new BadRequestException('Cannot transfer to self');

        const fromAccount = await queryRunner.manager.findOne(BankAccount, { where: { id: fromAccountId } });
        const toAccount = await queryRunner.manager.findOne(BankAccount, { where: { id: toAccountId } });

        if (!fromAccount) throw new NotFoundException('Source account not found');
        if (!toAccount) throw new NotFoundException('Target account not found');

        // Debit Sender
        const fromBalanceBefore = parseFloat(fromAccount.balance);
        if (fromBalanceBefore < amountVal) {
          throw new BadRequestException('Insufficient funds');
        }
        const fromBalanceAfter = fromBalanceBefore - amountVal;
        fromAccount.balance = fromBalanceAfter.toFixed(2);
        await queryRunner.manager.save(BankAccount, fromAccount);

        const debitLedger = new LedgerEntry();
        debitLedger.transaction = transaction;
        debitLedger.account = fromAccount;
        debitLedger.entryType = LedgerEntryType.DEBIT;
        debitLedger.amount = amountVal.toFixed(2);
        debitLedger.balanceBefore = fromBalanceBefore.toFixed(2);
        debitLedger.balanceAfter = fromBalanceAfter.toFixed(2);
        await queryRunner.manager.save(LedgerEntry, debitLedger);

        // Credit Receiver
        const toBalanceBefore = parseFloat(toAccount.balance);
        const toBalanceAfter = toBalanceBefore + amountVal;
        toAccount.balance = toBalanceAfter.toFixed(2);
        await queryRunner.manager.save(BankAccount, toAccount);

        const creditLedger = new LedgerEntry();
        creditLedger.transaction = transaction;
        creditLedger.account = toAccount;
        creditLedger.entryType = LedgerEntryType.CREDIT;
        creditLedger.amount = amountVal.toFixed(2);
        creditLedger.balanceBefore = toBalanceBefore.toFixed(2);
        creditLedger.balanceAfter = toBalanceAfter.toFixed(2);
        await queryRunner.manager.save(LedgerEntry, creditLedger);
      }

      transaction.status = TransactionStatus.SUCCESS;
      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();
      return transaction;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Transaction failed: ${err.message}`, err.stack);
      throw err instanceof BadRequestException || err instanceof NotFoundException
        ? err
        : new InternalServerErrorException('Transaction processing failed');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.transactionRepository.find({ relations: ['ledgerEntries'] });
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['ledgerEntries']
    });
    if (!transaction) throw new NotFoundException(`Transaction ${id} not found`);
    return transaction;
  }
}

