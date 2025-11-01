import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please configure it in your environment.');
  }

  const sql = neon(DATABASE_URL);
  cachedDb = drizzle({ client: sql });
  
  return cachedDb;
}

// Export a default db object that lazily initializes
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const database = getDb();
    const value = database[prop as keyof typeof database];
    return typeof value === 'function' ? value.bind(database) : value;
  }
});