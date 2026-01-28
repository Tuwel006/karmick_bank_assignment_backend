import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '@/utils/constants/MESSAGE_PATTERNS';
import { AccountsService } from './accounts.service';
import { CreateAccountsDto } from './dto/create-accounts.dto';
import { UpdateAccountsDto } from './dto/update-accounts.dto';

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @MessagePattern(MESSAGE_PATTERNS.accounts.CREATE)
  create(@Payload() createAccountsDto: CreateAccountsDto) {
    return this.accountsService.create(createAccountsDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.FIND_ALL)
  findAll() {
    return this.accountsService.findAll();
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.FIND_ONE)
  findOne(@Payload() data: any) {
    return this.accountsService.findOne(data.id);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.UPDATE)
  update(@Payload() data: any) {
    return this.accountsService.update(data.id, data);
  }

  @MessagePattern(MESSAGE_PATTERNS.accounts.DELETE)
  remove(@Payload() data: any) {
    return this.accountsService.remove(data.id);
  }
}
