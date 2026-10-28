import { auth } from '@/lib/auth/config';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // Tag admin sessions with visible metadata
  if (session?.user?.email?.endsWith('@mut.ac.ke')) {
    const response = NextResponse.next();
    response.headers.set('x-user-role', 'admin');
    response.headers.set('x-admin-visible', 'true');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*', '/auth/:path*'],
};
