import { Module, Global, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import { DataSource } from 'typeorm';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule implements OnModuleInit {
    private readonly logger = new Logger('DatabaseModule');

    constructor(private dataSource: DataSource) { }

    async onModuleInit() {
        if (this.dataSource.isInitialized) {
            console.log('\n---------------------------------------------------------');
            console.log('🔗 DATABASE STATUS: CONNECTED');
            console.log(`📡 Host: ${(this.dataSource.options as any).host}`);
            console.log(`🗃️  Database: ${(this.dataSource.options as any).database}`);
            console.log('✅ Single Connection Pool Established Successfully');
            console.log('---------------------------------------------------------\n');
        } else {
            this.logger.error('❌ Database connection failed to initialize.');
        }
    }
}
