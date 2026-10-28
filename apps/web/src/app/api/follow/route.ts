import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { followerId, followingId } = await req.json();
    
    if (!followerId || !followingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if already following
    const existingFollow = await db.query.follows.findFirst({
      where: sql`${schema.follows.followerId} = ${followerId} AND ${schema.follows.followingId} = ${followingId}`
    });

    if (existingFollow) {
      // Unfollow
      await db.delete(schema.follows)
        .where(eq(schema.follows.followerId, followerId))
        .where(eq(schema.follows.followingId, followingId));
      
      await db.update(schema.userProfiles)
        .set({ followersCount: sql`${schema.userProfiles.followersCount} - 1` })
        .where(eq(schema.userProfiles.id, followingId));
        
      await db.update(schema.userProfiles)
        .set({ followingCount: sql`${schema.userProfiles.followingCount} - 1` })
        .where(eq(schema.userProfiles.id, followerId));
    } else {
      // Follow
      await db.insert(schema.follows).values({
        followerId,
        followingId,
        createdAt: Math.floor(Date.now() / 1000)
      });
      
      await db.update(schema.userProfiles)
        .set({ followersCount: sql`${schema.userProfiles.followersCount} + 1` })
        .where(eq(schema.userProfiles.id, followingId));
        
      await db.update(schema.userProfiles)
        .set({ followingCount: sql`${schema.userProfiles.followingCount} + 1` })
        .where(eq(schema.userProfiles.id, followerId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[FOLLOW API ERROR]', err);
    return NextResponse.json({ error: 'Failed to process follow action' }, { status: 500 });
  }
}

// Check follow status
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetId = url.searchParams.get('targetId');
    const currentUserId = url.searchParams.get('currentUserId') || 'demo-user'; // Replace with real session ID
    
    if (!targetId) {
      return NextResponse.json({ error: 'Missing targetId' }, { status: 400 });
    }

    const follow = await db.query.follows.findFirst({
      where: sql`${schema.follows.followerId} = ${currentUserId} AND ${schema.follows.followingId} = ${targetId}`
    });

    return NextResponse.json({ 
      isFollowing: !!follow,
      currentUserId
    });
  } catch (err) {
    console.error('[FOLLOW CHECK API ERROR]', err);
    return NextResponse.json({ error: 'Failed to check follow status' }, { status: 500 });
  }
}
