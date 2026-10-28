import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const posts = await db
      .select({
        id: schema.posts.id,
        content: schema.posts.content,
        type: schema.posts.type,
        mediaUrls: schema.posts.mediaUrls,
        linkPreview: schema.posts.linkPreview,
        createdAt: schema.posts.createdAt,
        likeCount: schema.posts.likeCount,
        commentCount: schema.posts.commentCount,
        repostCount: schema.posts.repostCount,
        authorUsername: schema.userProfiles.username,
        authorDisplayName: schema.userProfiles.displayName,
        authorAvatar: schema.userProfiles.avatarUrl,
      })
      .from(schema.posts)
      .innerJoin(schema.userProfiles, eq(schema.posts.authorId, schema.userProfiles.id))
      .orderBy(desc(schema.posts.createdAt))
      .limit(20);

    return NextResponse.json(posts);
  } catch (err) {
    console.error('[FEED API ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 });
  }
}
