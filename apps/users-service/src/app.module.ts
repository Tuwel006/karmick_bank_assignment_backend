import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { BranchModule } from './branch/branch.module';
import { SeedingModule } from './seeding/seeding.module';
import { DatabaseModule } from '@/shared/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    SeedingModule,
    UsersModule,
    BranchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
