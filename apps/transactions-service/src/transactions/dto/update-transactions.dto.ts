import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionsDto } from './create-transactions.dto';

export class UpdateTransactionsDto extends PartialType(CreateTransactionsDto) {}
