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
        console.log('✅ Global Environment variables loaded from:', envPath);
    }
} else {
    console.error('❌ .env file not found at:', envPath);
}

export const databaseConfig = {
    host: process.env.DB_HOST || 'aws-1-ap-south-1.pooler.supabase.com',
    port: parseInt(process.env.DB_PORT || '6543', 10),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres.fottzbbkxrwixgrqesog',
    password: process.env.DB_PASS || '',
    pool_mode: process.env.DB_POOL_MODE || 'transaction',
};

// Log confirmation (without leaking actual password)
console.log('🌍 Global Database Config:');
console.log(`   - User: ${databaseConfig.user}`);
console.log(`   - Host: ${databaseConfig.host}`);
console.log(`   - Password: ${databaseConfig.password ? '✅ Loaded' : '❌ EMPTY'}`);
