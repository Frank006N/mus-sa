import bcrypt from 'bcryptjs';
import { createHmac } from 'crypto';
import { mutSaPgDb } from '@/db/postgres';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
});

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { email, password, displayName } = parsed.data;

    // SAFE EMAIL CHECK: Wrap in try/catch to prevent crash on unexpected DB response
    let userExists = false;
    try {
      const result = await mutSaPgDb.execute(sql`SELECT id FROM mut_sa_users WHERE email = ${email}`);
      const rows = result?.rows ?? [];
      userExists = Array.isArray(rows) && rows.length > 0;
    } catch (e) {
      console.warn('[EMAIL CHECK ERROR]', e);
      // If check fails, proceed to insert; unique constraint will catch duplicates
    }

    if (userExists) {
      return Response.json({ error: 'Email already registered' }, { status: 409 });
    }

    const userId = generateUUID();
    const hash = await bcrypt.hash(password, 12);

    await mutSaPgDb.execute(sql`
      INSERT INTO mut_sa_users (id, email, display_name, role, password_hash, created_at, updated_at)
      VALUES (${userId}, ${email}, ${displayName}, 'student', ${hash}, NOW(), NOW())
    `);

    // Create session cookie WITHOUT Lucia
    const secret = process.env.AUTH_SECRET || 'mut-sa-dev-secret-key-2026';
    const sig = createHmac('sha256', secret).update(userId).digest('hex').substring(0, 16);
    const cookie = `auth_session=${userId}.${sig}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;

    return new Response(null, {
      headers: { 'Set-Cookie': cookie },
      status: 201,
    });
  } catch (e: any) {
    console.error('[REGISTER ERROR]', e.message);
    return Response.json({ error: 'Registration failed' }, { status: 500 });
  }
}
