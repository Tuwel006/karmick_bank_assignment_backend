import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envMode = process.env.NODE_ENV || 'dev';
// Try multiple possible locations for the .env file
const possiblePaths = [
    path.join(process.cwd(), `.env.${envMode}`),
    path.resolve(__dirname, `../../../.env.${envMode}`),
    path.resolve(__dirname, `../../.env.${envMode}`), // for dist
];

let loaded = false;
for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
        const result = dotenv.config({ path: envPath });
        if (!result.error) {
            console.log('✅ Environment variables successfully loaded from:', envPath);
            loaded = true;
            break;
        }
    }
}

if (!loaded) {
    console.error('❌ Failed to load environment variables from any of:', possiblePaths);
}
