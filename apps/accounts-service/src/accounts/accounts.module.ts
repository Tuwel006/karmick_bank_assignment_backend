import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { BankAccount } from './entities/bank-account.entity';
import { DatabaseModule } from '../../../../shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([BankAccount]),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule { }
