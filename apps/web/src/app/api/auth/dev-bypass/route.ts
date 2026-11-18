import { NextRequest, NextResponse } from 'next/server';

// TEMPORARY DEVELOPMENT AUTH BYPASS
// This route allows instant login for local testing ONLY
// DELETE THIS FILE BEFORE PRODUCTION DEPLOYMENT

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    // Create a valid mock session
    const mockUser = {
      id: 'dev-user-' + Date.now(),
      email: body.email || 'developer@mut.ac.ke',
      displayName: body.displayName || 'Developer',
      role: body.role || 'student'
    };
    
    const response = NextResponse.json({
      success: true,
      user: mockUser,
      session: { id: 'dev-session-' + Date.now() }
    });
    
    // Set secure session cookie for localhost
    response.cookies.set('auth_session', 'dev-token-valid', {
      httpOnly: true,
      secure: false, // Required for localhost HTTP
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    console.log('[DEV AUTH] Login successful:', mockUser.email);
    return response;
  } catch (error) {
    console.error('[DEV AUTH ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Development auth failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get('auth_session')?.value;
  
  if (session === 'dev-token-valid') {
    return NextResponse.json({
      user: {
        id: 'dev-user',
        email: 'developer@mut.ac.ke',
        displayName: 'Developer',
        role: 'student'
      }
    });
  }
  
  return NextResponse.json({ user: null }, { status: 401 });
}
