import { auth } from '@/lib/auth/config';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { BookOpen, Users, FileText, MessageSquare } from 'lucide-react';

export default async function LecturerDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !session.user.email?.endsWith('@mut.ac.ke')) redirect('/auth/login');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lecturer Portal</h1>
            <p className="text-gray-400 mt-1">{session.user.email}</p>
          </div>
          <div className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium flex items-center gap-2">
            <BookOpen size={16} /> Faculty
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-emerald-600/20 rounded-lg"><BookOpen size={20} className="text-emerald-400"/></div><h3 className="text-gray-400 text-sm">My Courses</h3></div>
            <p className="text-3xl font-bold">--</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-600/20 rounded-lg"><Users size={20} className="text-blue-400"/></div><h3 className="text-gray-400 text-sm">Students</h3></div>
            <p className="text-3xl font-bold">--</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-600/20 rounded-lg"><FileText size={20} className="text-purple-400"/></div><h3 className="text-gray-400 text-sm">Assignments</h3></div>
            <p className="text-3xl font-bold">--</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-yellow-600/20 rounded-lg"><MessageSquare size={20} className="text-yellow-400"/></div><h3 className="text-gray-400 text-sm">Messages</h3></div>
            <p className="text-3xl font-bold">--</p>
          </div>
        </div>
      </div>
    </div>
  );
}
