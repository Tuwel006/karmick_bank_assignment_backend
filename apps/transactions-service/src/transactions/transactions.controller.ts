import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { TransactionsService } from './transactions.service';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { UpdateTransactionsDto } from './dto/update-transactions.dto';

@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @MessagePattern(MESSAGE_PATTERNS.transactions.CREATE)
  create(@Payload() createTransactionsDto: CreateTransactionsDto) {
    return this.transactionsService.create(createTransactionsDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.FIND_ALL)
  findAll() {
    return this.transactionsService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.transactionsService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.UPDATE)
  update(@Payload() data: any) {
    return this.transactionsService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.transactions.DELETE)
  remove(@Payload() data: any) {
    return this.transactionsService.remove(data.id);
  }
}
