import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required for the PostgreSQL backend');

// Connect through PgBouncer in transaction-pooling mode in production.
const client = postgres(databaseUrl, {
  max: Number(process.env.DB_POOL_MAX ?? 10),
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false,
});

export const mutSaPgDb = drizzle(client, { schema });
