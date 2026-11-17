import { lucia } from '@/lib/auth/lucia';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('auth_session')?.value;
  if (sessionId) await lucia.invalidateSession(sessionId);
  return new Response(null, { headers: { 'Set-Cookie': lucia.createBlankSessionCookie().serialize() } });
}
