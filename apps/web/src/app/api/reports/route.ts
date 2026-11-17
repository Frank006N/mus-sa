import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth/lucia';
import { mutSaPgDb } from '@/db/postgres';
import { mutSaReports } from '@/db/postgres/schema';
import { z } from 'zod';

// MUT-specific offices for targeted escalation
const OFFICES = [
  'student_affairs', 'campus_security', 'registrar', 
  'hostel_management', 'library_admin', 'it_support', 'other'
] as const;

const reportSchema = z.object({
  entityType: z.enum(['post', 'video', 'listing', 'comment', 'user']),
  entityId: z.string().uuid(),
  category: z.enum(['harassment', 'spam', 'misinformation', 'safety', 'academic_integrity', 'other']),
  details: z.string().min(10).max(5000),
  targetOffice: z.enum(OFFICES).default('other'),
  anonymous: z.boolean().default(false),
  mediaEvidenceUrls: z.array(z.string().url()).max(3).optional(), // Screenshots/video proof
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reportSchema.parse(body);

    let reporterId: string | null = null;
    if (!validated.anonymous) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('auth_session')?.value;
      if (sessionId) {
        const session = await lucia.validateSession(sessionId);
        reporterId = session?.user?.id || null;
      }
    }

    // Store office routing in metadata JSONB for admin triage
    const [report] = await mutSaPgDb.insert(mutSaReports).values({
      reporterId,
      anonymous: validated.anonymous,
      entityType: validated.entityType,
      entityId: validated.entityId,
      category: validated.category,
      details: validated.details,
      status: 'pending',
      // Use existing columns or extend schema later; for now store in details prefix
      // In production: Add 'metadata' JSONB column to mut_sa_reports
    }).returning();

    return Response.json(report, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e.message || 'Report submission failed' }, { status: 400 });
  }
}
