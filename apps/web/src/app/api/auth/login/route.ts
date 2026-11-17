import { verify } from '@node-rs/argon2';
import { lucia } from '@/lib/auth/lucia';
import { mutSaPgDb } from '@/db/postgres';
import { mutSaUsers } from '@/db/postgres/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const loginSchema = z.object({ email: z.string().email(), password: z.string() });

export async function POST(req: Request) {
  const { email, password } = loginSchema.parse(await req.json());
  const user = await mutSaPgDb.query.mutSaUsers.findFirst({ where: eq(mutSaUsers.email, email) });
  if (!user?.passwordHash || !(await verify(user.passwordHash, password)))
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  const session = await lucia.createSession(user.id, {});
  return new Response(null, { headers: { 'Set-Cookie': lucia.createSessionCookie(session.id).serialize() } });
}
