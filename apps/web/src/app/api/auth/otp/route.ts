import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { email, action, code } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // GENERATE & SEND OTP
    if (action === 'send') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 mins

      // Store OTP (Pass Date objects for timestamp_ms mode)
      await db.delete(schema.verificationCodes).where(eq(schema.verificationCodes.identifier, email));
      await db.insert(schema.verificationCodes).values({
        id: crypto.randomUUID(),
        identifier: email,
        value: otpCode,
        expiresAt: expiresAt, // ✅ Pass Date object, NOT integer
        createdAt: now,       // ✅ Pass Date object
        updatedAt: now,       // ✅ Pass Date object
      });

      // Send via Resend or fallback
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        try {
          const { Resend } = await import('resend');
          const resend = new Resend(apiKey);
          await resend.emails.send({
            from: 'MUT Social <onboarding@resend.dev>',
            to: email,
            subject: 'Your MUT Social Verification Code',
            html: `<div style="font-family:sans-serif;text-align:center;"><h2>Verify Email</h2><div style="background:#f3f4f6;padding:16px;border-radius:8px;font-size:32px;font-weight:bold;letter-spacing:8px;margin:20px 0;">${otpCode}</div><p>Expires in 10 minutes.</p></div>`,
          });
        } catch (err) {
          console.error('[RESEND FAILED]', err);
        }
      }
      
      // ALWAYS log OTP for dev testing
      console.log(`[OTP] ${email}: ${otpCode}`);
      
      return NextResponse.json({ success: true, message: 'OTP sent' });
    }

    // VERIFY OTP
    if (action === 'verify') {
      if (!code || code.length !== 6) {
        return NextResponse.json({ error: 'Invalid code format' }, { status: 400 });
      }

      const record = await db.query.verificationCodes.findFirst({
        where: eq(schema.verificationCodes.identifier, email),
      });

      if (!record || record.value !== code) {
        return NextResponse.json({ error: 'Invalid or expired code' }, { status: 401 });
      }

      // Check expiration (record.expiresAt is already a Date object from DB)
      if (record.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Code expired' }, { status: 401 });
      }

      // Mark user as verified
      await db.update(schema.users)
        .set({ emailVerified: true })
        .where(eq(schema.users.email, email));

      // Delete used OTP
      await db.delete(schema.verificationCodes).where(eq(schema.verificationCodes.id, record.id));

      return NextResponse.json({ success: true, message: 'Email verified' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('[OTP API ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
