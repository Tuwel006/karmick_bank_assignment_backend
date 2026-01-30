import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createAccountsDto: CreateAccountsDto): Promise<BankAccount> {
    const account = this.accountRepository.create(createAccountsDto);
    return await this.accountRepository.save(account);
  }

  async findAll(): Promise<BankAccount[]> {
    return await this.accountRepository.find();
  }

  async findOne(id: string): Promise<BankAccount> {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(id: string, updateAccountsDto: UpdateAccountsDto): Promise<BankAccount> {
    const account = await this.findOne(id);
    Object.assign(account, updateAccountsDto);
    return await this.accountRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const account = await this.findOne(id);
    await this.accountRepository.remove(account);
  }
}
