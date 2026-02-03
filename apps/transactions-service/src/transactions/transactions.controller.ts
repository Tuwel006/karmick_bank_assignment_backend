import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService, DepositDto, WithdrawDto, TransferDto } from './transactions.service';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @MessagePattern(MESSAGE_PATTERNS.transactions.DEPOSIT)
  async deposit(@Payload() depositDto: DepositDto) {
    return this.transactionsService.deposit(depositDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.WITHDRAW)
  async withdraw(@Payload() withdrawDto: WithdrawDto) {
    return this.transactionsService.withdraw(withdrawDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.TRANSFER)
  async transfer(@Payload() transferDto: TransferDto) {
    return this.transactionsService.transfer(transferDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.FIND_ALL)
  async findAll(@Payload() payload: any) {
    const { branchId, accountId, customerId, ...pagination } = payload;
    return this.transactionsService.findAll(branchId, accountId, customerId, pagination);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.FIND_ONE)
  async findOne(@Payload() data: { id: string }) {
    return this.transactionsService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.GET_STATS)
  async getStats() {
    return this.transactionsService.getStats();
  }
}