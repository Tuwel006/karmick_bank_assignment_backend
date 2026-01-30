import { IsEnum, IsNumberString, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';
import { TransactionType } from '../entities/transactions.entity';

export class CreateTransactionsDto {
    @IsEnum(TransactionType)
    type: TransactionType;

    @ValidateIf(o => o.type === TransactionType.WITHDRAW || o.type === TransactionType.TRANSFER)
    @IsUUID()
    fromAccountId?: string;

    @ValidateIf(o => o.type === TransactionType.DEPOSIT || o.type === TransactionType.TRANSFER)
    @IsUUID()
    toAccountId?: string;

    @IsNumberString()
    amount: string;

    @IsString()
    @IsOptional()
    narration?: string;

    @IsOptional()
    metadata?: Record<string, any>;
}
