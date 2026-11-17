import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth/lucia';
import { mutSaPgDb } from '@/db/postgres';
import { mutSaPosts } from '@/db/postgres/schema';
import { z } from 'zod';

const postSchema = z.object({
  body: z.string().min(1).max(2000),
  communityId: z.string().uuid().optional(),
  mediaUrls: z.array(z.string().url()).max(4).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth_session')?.value;
    if (!sessionId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await lucia.validateSession(sessionId);
    if (!session?.user) return Response.json({ error: 'Invalid session' }, { status: 401 });

    const body = await req.json();
    const { body: content, communityId, mediaUrls = [] } = postSchema.parse(body);

    const [post] = await mutSaPgDb.insert(mutSaPosts).values({
      authorId: session.user.id,
      communityId,
      body: content,
      mediaType: mediaUrls.length > 0 ? 'image' : 'text',
      mediaUrls,
    }).returning();

    return Response.json(post, { status: 201 });
  } catch (e: any) {
    return Response.json({ error: e.message || 'Failed to create post' }, { status: 400 });
  }
}
