import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/db';
import * as schema from '@/db/schema';

export default async function CommunitiesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/auth/login');

  const communities = await db.select().from(schema.communities).all();
  
  return (
    <DashboardLayout role="student" userEmail={session.user.email}>
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <h1 className="text-2xl font-bold mb-6">Communities</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((community: any) => {
            // Use actual DB column name for ID
            const commId = community.id || community.community_id;
            if (!commId) return null;
            
            return (
              <a 
                key={commId}
                href={`/student/communities/${commId}`}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-emerald-500/50 transition-all group block"
              >
                <div 
                  className="h-32 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${community.cover_image || community.coverImage || ''})` }} 
                />
                <div className="p-5">
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {community.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{community.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                    <span>{(community.member_count || community.memberCount || 0).toLocaleString()} members</span>
                    <span className="capitalize">{community.type}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}