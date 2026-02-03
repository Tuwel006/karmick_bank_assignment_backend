import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Customer, CustomerStatus, KYCStatus } from '@/apps/customer-service/src/customer/entities/customer.entity';
import { BankAccount, AccountStatus } from './entities/bank-account.entity';
import { ResponseHelper } from '../../../../shared/helpers/response.helper';

export interface CreateAccountWithCustomerDto {
  customerData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    branchId: string;
  };
  accountData: {
    accountType: string;
    initialDeposit: number;
  };
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private accountRepository: Repository<BankAccount>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private dataSource: DataSource,
  ) { }

  async createAccountWithCustomer(createDto: CreateAccountWithCustomerDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { customerData, accountData } = createDto;

      // Check if customer already exists
      const existingCustomer = await queryRunner.manager.findOne(Customer, {
        where: [
          { email: customerData.email },
          { phone: customerData.phone }
        ]
      });

      if (existingCustomer) {
        throw new BadRequestException('Customer already exists with provided details');
      }

      // Generate unique customer number
      const customerNumber = await this.generateCustomerNumber();

      // Create customer
      const customer = queryRunner.manager.create(Customer, {
        customerNumber,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        phone: customerData.phone,
        branchId: customerData.branchId,
        status: CustomerStatus.ACTIVE,
        kycStatus: KYCStatus.NOT_STARTED
      });

      const savedCustomer = await queryRunner.manager.save(customer) as Customer;

      // Generate unique account number
      const accountNumber = await this.generateAccountNumber();

      // Create bank account
      const account = queryRunner.manager.create(BankAccount, {
        customerId: savedCustomer.id,
        branchId: customerData.branchId,
        accountNumber,
        accountType: accountData.accountType as any,
        balance: accountData.initialDeposit.toString(),
        currency: 'INR',
        status: AccountStatus.ACTIVE
      });

      const savedAccount = await queryRunner.manager.save(account) as BankAccount;

      await queryRunner.commitTransaction();

      // Return success response with account details
      const result = {
        customer: {
          id: savedCustomer.id,
          customerNumber: savedCustomer.customerNumber,
          firstName: savedCustomer.firstName,
          lastName: savedCustomer.lastName,
          email: savedCustomer.email,
          phone: savedCustomer.phone,
          kycStatus: savedCustomer.kycStatus
        },
        account: {
          id: savedAccount.id,
          accountNumber: savedAccount.accountNumber,
          accountType: savedAccount.accountType,
          balance: savedAccount.balance,
          status: savedAccount.status
        }
      };

      return ResponseHelper.success(result, 'Account created successfully with customer details');

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(ResponseHelper.error('Failed to create account with customer', error.message));
    } finally {
      await queryRunner.release();
    }
  }

  async findAccountsWithCustomers(branchId?: string, pagination?: any) {
    try {
      const query = this.accountRepository.createQueryBuilder('account')
        .leftJoinAndSelect('account.customer', 'customer')
        .orderBy('account.createdAt', 'DESC');

      if (branchId) {
        query.andWhere('account.branchId = :branchId', { branchId });
      }

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        query.skip((page - 1) * limit).take(limit);
      }

      const [accounts, total] = await query.getManyAndCount();

      return ResponseHelper.paginated(accounts, total, pagination?.page || 1, pagination?.limit || 10);
    } catch (error) {
      throw new BadRequestException(ResponseHelper.error('Failed to fetch accounts with customers', error.message));
    }
  }

  async create(createAccountDto: any) {
    try {
      const accountNumber = await this.generateAccountNumber();
      const account = this.accountRepository.create({
        ...createAccountDto,
        accountNumber,
        status: AccountStatus.ACTIVE,
        currency: 'INR',
        balance: createAccountDto.initialDeposit?.toString() || '0'
      });
      const savedAccount = await this.accountRepository.save(account);
      return ResponseHelper.success(savedAccount, 'Account created successfully');
    } catch (error) {
      throw new BadRequestException(ResponseHelper.error('Failed to create account', error.message));
    }
  }

  async findOne(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['customer']
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return ResponseHelper.success(account, 'Account retrieved successfully');
  }

  async getBalance(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
      select: ['id', 'accountNumber', 'balance', 'currency']
    });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return ResponseHelper.success({
      balance: account.balance,
      currency: account.currency,
      accountNumber: account.accountNumber
    }, 'Balance retrieved successfully');
  }

  async updateStatus(id: string, status: AccountStatus) {
    const account = await this.accountRepository.findOneBy({ id });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    account.status = status;
    await this.accountRepository.save(account);
    return ResponseHelper.success(account, `Account status updated to ${status}`);
  }

  private async generateCustomerNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CU${year}${timestamp.slice(-6)}${random}`;
  }

  private async generateAccountNumber(): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `KB${timestamp.slice(-8)}${random}`;
  }
}