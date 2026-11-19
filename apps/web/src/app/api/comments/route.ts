import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { comments, posts, userProfiles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    const fetchedComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        authorUsername: userProfiles.username,
        authorDisplayName: userProfiles.displayName,
        authorAvatar: userProfiles.avatarUrl,
      })
      .from(comments)
      .innerJoin(
        userProfiles,
        eq(comments.authorId, userProfiles.id)
      )
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(fetchedComments);
  } catch (err) {
    console.error('[COMMENTS GET ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { postId, authorId, content } = await req.json();

    if (!postId || !authorId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate UUID for text primary key as defined in schema
    const commentId = crypto.randomUUID();

    // Use explicit typing to satisfy Drizzle SQLite adapter
    await db.insert(comments).values({
      id: commentId,
      postId: postId as string,
      authorId: authorId as string,
      content: content.trim(),
      createdAt: Date.now() as any, // Matches integer('created_at', { mode: 'timestamp_ms' })
    });

    // Increment post comment count
    await db
      .update(posts)
      .set({
        commentCount: db.sql`${posts.commentCount} + 1`,
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({ success: true, id: commentId }, { status: 201 });
  } catch (err) {
    console.error('[COMMENT CREATE ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} catch (err) {
    console.error('[COMMENT CREATE ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
