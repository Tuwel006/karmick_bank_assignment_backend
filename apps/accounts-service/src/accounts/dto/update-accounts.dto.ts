import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-accounts.dto';

export class UpdateAccountsDto extends PartialType(CreateAccountDto) { }
