import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '../shared/database/database.module';
import { UsersModule } from '../apps/users-service/src/users/users.module';
import { AccountsModule } from '../apps/accounts-service/src/accounts/accounts.module';
import { ApiGatewayModule } from '../apps/api-gateway/api-gateway.module';
import { TransactionsModule } from '../apps/transactions-service/src/transactions/transactions.module';
import { CustomerModule } from '../apps/customer-service/src/customer/customer.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    CustomerModule,
    ApiGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
