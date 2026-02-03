
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { Branch } from './entities/branch.entity';
import { Address } from '../address/entities/address.entity';
import { SeedingModule } from '../seeding/seeding.module';

@Module({
    imports: [TypeOrmModule.forFeature([Branch, Address]), SeedingModule],
    controllers: [BranchController],
    providers: [BranchService],
    exports: [BranchService],
})
export class BranchModule { }
