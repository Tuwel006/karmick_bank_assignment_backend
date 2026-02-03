import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BRANCH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.BRANCH_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.BRANCH_SERVICE_PORT || '4007', 10),
        },
      },
    ]),
  ],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}