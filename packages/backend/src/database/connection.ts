import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import type { Database } from './types.js';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/logward';
console.log('[Database Connection] Using DATABASE_URL:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  }),
});

export const db = new Kysely<Database>({
  dialect,
  log(event) {
    if (event.level === 'query') {
      console.log('Query:', event.query.sql);
      console.log('Duration:', event.queryDurationMillis, 'ms');
    }
  },
});

export async function closeDatabase() {
  await db.destroy();
}
