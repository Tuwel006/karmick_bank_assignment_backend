import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { BankAccount } from './entities/bank-account.entity';
import { AccountProduct } from './entities/account-product.entity';
import { DatabaseModule } from '../../../../shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([BankAccount, AccountProduct]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
