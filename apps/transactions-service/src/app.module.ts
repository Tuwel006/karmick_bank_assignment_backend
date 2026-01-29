import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
