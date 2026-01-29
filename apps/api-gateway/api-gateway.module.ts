import { Module } from '@nestjs/common';
import { MigrationModule } from './migration/migration.module';
import { AuthModule } from './auth/auth.module';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayController } from './api-gateway.controller';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
  imports: [AccountsModule, UsersModule, AuthModule, MigrationModule]
})
export class ApiGatewayModule { }
