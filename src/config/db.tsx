import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set. Please configure it in your environment.');
}

const sql = neon(DATABASE_URL);
export const db = drizzle({ client: sql });
