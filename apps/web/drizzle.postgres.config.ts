import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/postgres/schema.ts',
  out: './drizzle/postgres/generated',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? 'postgres://mut_sa:mut_sa_dev@localhost:5432/mut_sa' },
});
