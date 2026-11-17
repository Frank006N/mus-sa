import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function GET() {
  // Generate a valid UUID for our pitch user
  const userId = crypto.randomUUID();
  
  // Create HMAC signature matching your auth secret
  const secret = process.env.AUTH_SECRET || 'mut-sa-dev-secret-key-2026';
  const sig = createHmac('sha256', secret).update(userId).digest('hex').substring(0, 16);
  
  // Set valid session cookie
  const response = NextResponse.redirect(new URL('/student/feed', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  response.cookies.set('auth_session', `${userId}.${sig}`, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  
  return response;
}
