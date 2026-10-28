import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();
    
    if (!postId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already liked using proper Drizzle ORM syntax
    const existingLike = await db.query.likes.findFirst({
      where: sql`${schema.likes.postId} = ${postId} AND ${schema.likes.userId} = ${userId}`
    });

    if (existingLike) {
      // Unlike: Remove record and decrement count
      await db.delete(schema.likes).where(eq(schema.likes.postId, postId)).where(eq(schema.likes.userId, userId));
      await db.update(schema.posts)
        .set({ likeCount: sql`${schema.posts.likeCount} - 1` })
        .where(eq(schema.posts.id, postId));
    } else {
      // Like: Add record and increment count
      await db.insert(schema.likes).values({ 
        postId, 
        userId,
        createdAt: Math.floor(Date.now() / 1000)
      });
      await db.update(schema.posts)
        .set({ likeCount: sql`${schema.posts.likeCount} + 1` })
        .where(eq(schema.posts.id, postId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[LIKE API ERROR]', err);
    return NextResponse.json({ error: 'Failed to process like' }, { status: 500 });
  }
}