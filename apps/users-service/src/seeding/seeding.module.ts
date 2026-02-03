import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { Role } from '../roles/entities/role.entity';
import { SystemModule } from '../system-modules/entities/system-module.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Branch } from '../branch/entities/branch.entity';
import { Address } from '../address/entities/address.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, SystemModule, Permission, Branch, Address, User])
  ],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}