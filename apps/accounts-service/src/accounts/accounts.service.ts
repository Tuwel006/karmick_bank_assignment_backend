import { Injectable } from '@nestjs/common';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';

@Injectable()
export class AccountsService {
  create(createAccountsDto: CreateAccountsDto) {
    return 'This action adds a new accounts';
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accounts`;
  }

  update(id: number, updateAccountsDto: UpdateAccountsDto) {
    return `This action updates a #${id} accounts`;
  }

  remove(id: number) {
    return `This action removes a #${id} accounts`;
  }
}
