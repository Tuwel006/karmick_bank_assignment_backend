import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { config } from './config';
import { User } from './users/entities/users.entity';
import { AppDataSource } from './config/database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
