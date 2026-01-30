import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TRANSACTIONS_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.TRANSACTIONS_SERVICE_PORT || '4003', 10),
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule { }
