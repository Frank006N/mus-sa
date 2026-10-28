import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default async function MarketplacePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/auth/login');

  return (
    <DashboardLayout role="student" userEmail={session.user.email}>
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Marketplace</h2>
        <p className="text-gray-400">Buy and sell items within the university. Feature coming soon.</p>
      </div>
    </DashboardLayout>
  );
}
