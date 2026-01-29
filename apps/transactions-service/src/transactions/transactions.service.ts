import { Injectable } from '@nestjs/common';
import { CreateTransactionsDto } from './dto/create-transactions.dto';
import { UpdateTransactionsDto } from './dto/update-transactions.dto';

@Injectable()
export class TransactionsService {
  create(createTransactionsDto: CreateTransactionsDto) {
    return 'This action adds a new transactions';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactions`;
  }

  update(id: number, updateTransactionsDto: UpdateTransactionsDto) {
    return `This action updates a #${id} transactions`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactions`;
  }
}
