import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function CommunityDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/auth/login');

  const community = await db.query.communities.findFirst({
    where: eq(schema.communities.id, params.id)
  });
  
  if (!community) notFound();

  const groups = await db.select().from(schema.groups).where(eq(schema.groups.community_id || schema.groups.communityId, params.id)).all();
  
  let announcements: any[] = [];
  try {
    if (schema.announcements) {
      announcements = await db.select().from(schema.announcements).where(eq(schema.announcements.target_id || schema.announcements.targetId, params.id)).all();
    }
  } catch (e) {
    console.log('Announcements not available');
  }

  return (
    <DashboardLayout role="student" userEmail={session.user.email}>
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="relative h-48 rounded-t-xl bg-cover bg-center" style={{ backgroundImage: `url(${community.cover_image || community.coverImage || ''})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h1 className="text-3xl font-bold text-white">{community.name}</h1>
            <p className="text-gray-300 mt-1 max-w-2xl">{community.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Groups & Clubs ({groups.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group: any) => {
                const grpId = group.id || '';
                if (!grpId) return null;
                
                return (
                  <a 
                    key={grpId}
                    href={`/student/groups/${grpId}`}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-emerald-500/50 transition-all group block"
                  >
                    <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${group.cover_image || group.coverImage || ''})` }} />
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{group.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 bg-gray-800 rounded-full text-gray-400 capitalize">{group.type}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2">{group.description}</p>
                      <p className="text-gray-500 text-xs mt-3">{(group.member_count || group.memberCount || 0).toLocaleString()} members</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Announcements ({announcements.length})</h2>
            <div className="space-y-4">
              {announcements.map((announcement: any) => (
                <div key={announcement.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${announcement.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {announcement.priority.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{announcement.title}</h3>
                  <p className="text-gray-400 text-xs mt-2 line-clamp-3">{announcement.content}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No announcements yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}