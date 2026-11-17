import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth/lucia';

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('auth_session')?.value;
  
  if (!sessionId) {
    return Response.json({ user: null }, { status: 401 });
  }
  
  const session = await lucia.validateSession(sessionId);
  if (!session?.user) {
    return Response.json({ user: null }, { status: 401 });
  }
  
  return Response.json({ 
    user: { 
      id: session.user.id, 
      displayName: session.user.displayName,
      role: session.user.role 
    } 
  });
}
