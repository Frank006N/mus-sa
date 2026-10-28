import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default async function CoursesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/auth/login');
  return (
    <DashboardLayout role="student" userEmail={session.user.email}>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Courses</h2>
        <p className="text-gray-400">Feature under development.</p>
      </div>
    </DashboardLayout>
  );
}
