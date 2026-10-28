import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Shield, Users, Globe, Activity, Settings, Lock } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !session.user.email?.endsWith('@mut.ac.ke')) redirect('/auth/login');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">{session.user.email}</p>
          </div>
          <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium flex items-center gap-2">
            <Shield size={16} /> Super Administrator
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-emerald-600/20 rounded-lg"><Users size={20} className="text-emerald-400"/></div><h3 className="text-gray-400 text-sm">All Users</h3></div>
            <p className="text-3xl font-bold">--</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-600/20 rounded-lg"><Globe size={20} className="text-blue-400"/></div><h3 className="text-gray-400 text-sm">Communities</h3></div>
            <p className="text-3xl font-bold">--</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-600/20 rounded-lg"><Activity size={20} className="text-purple-400"/></div><h3 className="text-gray-400 text-sm">System Health</h3></div>
            <p className="text-3xl font-bold text-emerald-400">98%</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-yellow-600/20 rounded-lg"><Lock size={20} className="text-yellow-400"/></div><h3 className="text-gray-400 text-sm">Security</h3></div>
            <p className="text-3xl font-bold">0 Alerts</p>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Settings size={20}/> Super Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"><h4 className="font-medium text-white">Manage Users</h4><p className="text-sm text-gray-400 mt-1">Ban, verify, or edit accounts</p></button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"><h4 className="font-medium text-white">Platform Settings</h4><p className="text-sm text-gray-400 mt-1">Configure global features</p></button>
            <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors"><h4 className="font-medium text-white">Audit Logs</h4><p className="text-sm text-gray-400 mt-1">View system activity</p></button>
          </div>
        </div>
      </div>
    </div>
  );
}
