import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';
import { BankAccount } from './entities/bank-account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly accountRepository: Repository<BankAccount>,
  ) { }

  async create(createAccountsDto: CreateAccountsDto) {
    const account = this.accountRepository.create(createAccountsDto);
    return await this.accountRepository.save(account);
  }

  async findAll() {
    return await this.accountRepository.find();
  }

  async findOne(id: number) {
    return await this.accountRepository.findOneBy({ id } as any);
  }

  async update(id: number, updateAccountsDto: UpdateAccountsDto) {
    await this.accountRepository.update(id, updateAccountsDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.accountRepository.delete(id);
  }
}
