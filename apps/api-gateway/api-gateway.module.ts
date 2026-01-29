import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { MigrationModule } from './migration/migration.module';
import { AuthModule } from './auth/auth.module';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayController } from './api-gateway.controller';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';
import { NotificationModule } from './notification/notification.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
  imports: [
    AccountsModule,
    UsersModule,
    AuthModule,
    MigrationModule,
    CustomerModule,
    NotificationModule,
    TransactionsModule
  ]
})
export class ApiGatewayModule { }
