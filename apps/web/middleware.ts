import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Bypass ALL auth in development for showcase
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }
  
  // Production: redirect unauthenticated users to login
  const session = request.cookies.get('auth_session');
  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
