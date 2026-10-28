import { auth } from '@/lib/auth/config';
import { toNextJsHandler } from 'better-auth/next-js';
import { z } from 'zod';

// Password strength validator
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number');

export const { GET, POST } = toNextJsHandler(auth, {
  onError: (error) => {
    console.error('[AUTH ERROR]', error);
  },
  onRequest: async (req) => {
    // Validate password strength on signup
    if (req.url.includes('/sign-up/email')) {
      const body = await req.clone().json().catch(() => ({}));
      const result = passwordSchema.safeParse(body.password);
      if (!result.success) {
        return new Response(JSON.stringify({ 
          error: 'Weak password', 
          details: result.error.issues.map(i => i.message) 
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    }
  }
});
