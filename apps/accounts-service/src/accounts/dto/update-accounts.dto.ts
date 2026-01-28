import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountsDto } from './create-accounts.dto';

export class UpdateAccountsDto extends PartialType(CreateAccountsDto) {}
