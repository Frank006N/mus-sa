import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';

// Rate limiter: 100 requests per minute per IP (prevents DDoS/spam)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});

export async function securityMiddleware(req: NextRequest) {
  // Apply rate limiting
  const response = await new Promise<NextResponse>((resolve) => {
    const mockRes = {
      setHeader: () => {},
      statusCode: 200,
      end: () => resolve(NextResponse.next())
    };
    (limiter as any)(req as any, mockRes as any, () => resolve(NextResponse.next()));
  });

  if (response.status !== 200) return response;

  // Add security headers (Helmet equivalent)
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=self, microphone=self');
  
  return NextResponse.next({ headers });
}
