import { Injectable } from '@nestjs/common';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';

@Injectable()
export class AccountsService {
  constructor() { }

  async create(createAccountsDto: CreateAccountsDto) {
    return 'This action adds a new accounts';
  }

  async findAll() {
    return `This action returns all accounts`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} accounts`;
  }

  async update(id: number, updateAccountsDto: UpdateAccountsDto) {
    return `This action updates a #${id} accounts`;
  }

  async remove(id: number) {
    return `This action removes a #${id} accounts`;
  }
}
