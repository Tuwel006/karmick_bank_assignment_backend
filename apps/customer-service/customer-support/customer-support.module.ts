import { Module } from '@nestjs/common';
import { CustomerSupportService } from './customer-support.service';
import { CustomerSupportController } from './customer-support.controller';

@Module({
  controllers: [CustomerSupportController],
  providers: [CustomerSupportService],
})
export class CustomerSupportModule {}
