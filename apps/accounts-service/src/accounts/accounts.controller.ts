import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-accounts.dto';
import { AccountStatus } from './entities/bank-account.entity';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @MessagePattern(MESSAGE_PATTERNS.accounts.CREATE_WITH_CUSTOMER)
  async createAccountWithCustomer(@Payload() createDto: any) {
    return this.accountsService.createAccountWithCustomer(createDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.FIND_WITH_CUSTOMERS)
  async findAccountsWithCustomers(@Payload() payload: any) {
    const { branchId, ...pagination } = payload;
    return this.accountsService.findAccountsWithCustomers(branchId, pagination);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.CREATE)
  async create(@Payload() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.FIND_ALL)
  async findAll(@Payload() payload: any) {
    const { branchId, customerId, ...pagination } = payload;
    // Note: findAll signature in service might need adjustment if params differ, 
    // but here we just route payload.
    // The previous controller called findAccountsWithCustomers for findAll too!
    // Let's verify: line 53 called findAccountsWithCustomers.
    return this.accountsService.findAccountsWithCustomers(branchId, pagination);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.FIND_ONE)
  async findOne(@Payload() data: { id: string }) {
    return this.accountsService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.GET_BALANCE)
  async getBalance(@Payload() data: { id: string }) {
    return this.accountsService.getBalance(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.UPDATE_STATUS)
  async updateStatus(@Payload() data: { id: string, status: AccountStatus }) {
    return this.accountsService.updateStatus(data.id, data.status);
  }
}