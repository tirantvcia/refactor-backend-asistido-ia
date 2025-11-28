import dotenv from 'dotenv';
import { createServer } from './app';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
export const DB_URL = process.env.MONGODB_URI;
export const PORT = process.env.port;
if (!DB_URL || !process.env.port || Number.isNaN(PORT)) {
    console.error('Missing or invalid environment variables');
    process.exit(1);
}
console.log('Environment Variables: ' + DB_URL + ',' + process.env.PORT);
createServer(DB_URL, Number(PORT));
