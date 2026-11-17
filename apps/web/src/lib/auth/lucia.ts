import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { mutSaPgDb } from '@/db/postgres';
import * as schema from '@/db/postgres/schema';

const adapter = new DrizzlePostgreSQLAdapter(
  mutSaPgDb,
  schema.mutSaSessions,
  schema.mutSaUsers
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: { secure: process.env.NODE_ENV === 'production' },
  },
  getUserAttributes: (attributes) => ({
    displayName: attributes.displayName,
    role: attributes.role,
    email: attributes.email,
  }),
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      displayName: string;
      role: string;
      email: string;
    };
  }
}
