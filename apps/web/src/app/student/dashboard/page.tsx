import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { db } from '@/db';
import * as schema from '@/db/schema';

export default async function StudentDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/auth/login');

  // Safe data fetching with fallbacks
  let communityCount = 0;
  let postCount = 0;
  let eventCount = 0;
  let courseCount = 0;

  try {
    if (schema.communities) {
      const res = await db.select({ count: db.fn.count() }).from(schema.communities);
      communityCount = Number(res[0]?.count ?? 0);
    }
  } catch (e) { console.log('Communities table not ready'); }

  try {
    if (schema.posts) {
      const res = await db.select({ count: db.fn.count() }).from(schema.posts);
      postCount = Number(res[0]?.count ?? 0);
    }
  } catch (e) { console.log('Posts table not ready'); }

  // Use placeholder counts for tables that don't exist yet
  eventCount = 0;
  courseCount = 0;

  return (
    <DashboardLayout role="student" userEmail={session.user.email}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Communities" value={communityCount} color="emerald" />
        <StatCard title="Posts" value={postCount} color="blue" />
        <StatCard title="Events" value={eventCount} color="purple" />
        <StatCard title="Courses" value={courseCount} color="yellow" />
      </div>
      
      <div className="mt-8 bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-400 text-sm">No recent activity to display.</p>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-600/20 text-emerald-400',
    blue: 'bg-blue-600/20 text-blue-400',
    purple: 'bg-purple-600/20 text-purple-400',
    yellow: 'bg-yellow-600/20 text-yellow-400',
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`w-2 h-2 rounded-full ${colors[color]?.split(' ')[0]}`} />
      </div>
      <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
    </div>
  );
}
