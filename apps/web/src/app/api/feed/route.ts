import { NextRequest } from 'next/server';
import { mutSaPgDb } from '@/db/postgres';
import { mutSaPosts, mutSaUsers, mutSaCommunities } from '@/db/postgres/schema';
import { desc, lt, isNull, inArray, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

  // CORRECT: Use and() helper, NOT .and() chaining
  const whereCondition = cursor 
    ? and(lt(mutSaPosts.id, cursor), isNull(mutSaPosts.deletedAt))
    : isNull(mutSaPosts.deletedAt);

  const posts = await mutSaPgDb.select()
    .from(mutSaPosts)
    .where(whereCondition)
    .orderBy(desc(mutSaPosts.createdAt))
    .limit(limit);

  if (posts.length === 0) return Response.json({ data: [], nextCursor: null });

  const authorIds = [...new Set(posts.map(p => p.authorId))];
  const communityIds = [...new Set(posts.map(p => p.communityId).filter(Boolean))];

  const [authors, communities] = await Promise.all([
    mutSaPgDb.select({
      id: mutSaUsers.id,
      email: mutSaUsers.email,
      displayName: mutSaUsers.displayName,
      role: mutSaUsers.role,
      createdAt: mutSaUsers.createdAt,
      updatedAt: mutSaUsers.updatedAt,
    }).from(mutSaUsers).where(inArray(mutSaUsers.id, authorIds)),
    
    communityIds.length > 0 
      ? mutSaPgDb.select().from(mutSaCommunities).where(inArray(mutSaCommunities.id, communityIds))
      : Promise.resolve([])
  ]);

  const authorMap = new Map(authors.map(a => [a.id, a]));
  const communityMap = new Map(communities.map(c => [c.id, c]));

  const enrichedPosts = posts.map(post => ({
    ...post,
    author: authorMap.get(post.authorId) || null,
    community: post.communityId ? communityMap.get(post.communityId) || null : null,
  }));

  return Response.json({
    data: enrichedPosts,
    nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
  });
}
