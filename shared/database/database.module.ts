import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
