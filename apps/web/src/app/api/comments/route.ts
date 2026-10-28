import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

// Get comments for a post
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const postId = url.searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    const comments = await db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        createdAt: schema.comments.createdAt,
        authorUsername: schema.userProfiles.username,
        authorDisplayName: schema.userProfiles.displayName,
        authorAvatar: schema.userProfiles.avatarUrl,
      })
      .from(schema.comments)
      .innerJoin(schema.userProfiles, eq(schema.comments.authorId, schema.userProfiles.id))
      .where(eq(schema.comments.postId, postId))
      .orderBy(desc(schema.comments.createdAt));

    return NextResponse.json(comments);
  } catch (err) {
    console.error('[COMMENTS GET ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// Create a new comment
export async function POST(req: NextRequest) {
  try {
    const { postId, authorId, content } = await req.json();
    
    if (!postId || !authorId || !content?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const commentId = crypto.randomUUID();
    await db.insert(schema.comments).values({
      id: commentId,
      postId,
      authorId,
      content: content.trim(),
      createdAt: Math.floor(Date.now() / 1000),
    });

    // Increment comment count
    await db.update(schema.posts)
      .set({ commentCount: db.sql`${schema.posts.commentCount} + 1` })
      .where(eq(schema.posts.id, postId));

    return NextResponse.json({ id: commentId, success: true }, { status: 201 });
  } catch (err) {
    console.error('[COMMENT CREATE ERROR]', err);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
