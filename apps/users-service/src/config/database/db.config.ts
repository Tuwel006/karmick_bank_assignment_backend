import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Force load env right here to be absolutely sure it happens first
const envMode = process.env.NODE_ENV || 'dev';
const envPath = path.resolve(process.cwd(), `.env.${envMode}`);

if (fs.existsSync(envPath)) {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error('❌ Error loading .env file:', result.error);
    } else {
        console.log('✅ Environment variables forced loaded from:', envPath);
    }
} else {
    console.error('❌ .env file not found at:', envPath);
}

export const databaseConfig = {
    host: process.env.USERS_DB_HOST || 'aws-1-ap-south-1.pooler.supabase.com',
    port: parseInt(process.env.USERS_DB_PORT || '6543', 10),
    database: process.env.USERS_DB_NAME || 'postgres',
    user: process.env.USERS_DB_USER || 'postgres.fottzbbkxrwixgrqesog',
    password: process.env.DB_PASS || '',
    pool_mode: process.env.USERS_DB_POOL_MODE || 'transaction',
};

// Mask password for safe logging
const maskedConfig = { ...databaseConfig, password: databaseConfig.password ? '****' : 'EMPTY' };
console.log('📦 Database Config Initialized:', maskedConfig);
