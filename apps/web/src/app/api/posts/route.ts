import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const authorId = url.searchParams.get('authorId');
    
    if (!authorId) {
      return NextResponse.json({ error: 'Missing authorId' }, { status: 400 });
    }

    const posts = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.authorId, authorId))
      .orderBy(desc(schema.posts.createdAt))
      .limit(20);

    return NextResponse.json(posts);
  } catch (err) {
    console.error('[POSTS API ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
