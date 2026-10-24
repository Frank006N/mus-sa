'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, MessageSquare, Shield, Settings, 
  Bell, Search, Plus, LogOut, CheckCircle2, XCircle, Clock,
  Eye, Moon, Sun, User as UserIcon, Mail, Key, Volume2, Smartphone
} from 'lucide-react';
import { authService, User as UserType } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'approvals', label: 'Community Approvals', icon: Shield },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'moderation', label: 'Content Moderation', icon: MessageSquare },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

// Mock Data for Admin View
const MOCK_APPROVALS = [
  { id: 1, user: 'John Doe', regNo: 'AB123/4567/2789', group: 'B.Com Year 2', date: '2h ago', status: 'pending' },
  { id: 2, user: 'Jane Smith', regNo: 'CD456/7890/1234', group: 'Music Club - Guitar', date: '5h ago', status: 'pending' },
  { id: 3, user: 'Mike Ross', regNo: 'EF789/0123/4567', group: 'Scouts - Outdoor', date: '1d ago', status: 'approved' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<UserType | null>(null);
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);

  useEffect(() => {
    const s = authService.getSession();
    if (!s || s.role !== 'admin') { 
      // For demo purposes, allow access but warn in console
      console.warn('Admin session not found. Using demo mode.');
      setUser({ email: 'admin@mut.ac.ke', name: 'Admin User', role: 'admin' });
      return; 
    }
    setUser(s);
  }, [router]);

  const handleApproval = (id: number, action: 'approve' | 'reject') => {
    setApprovals(prev => prev.map(item => 
      item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
    ));
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><p className="animate-pulse text-emerald-600">Loading Admin Panel...</p></div>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 glass-sidebar fixed h-full hidden lg:flex flex-col z-10 border-r border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/30">MUT</div>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 dark:text-gray-100 truncate">MUT Admin</h1>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 active:scale-[0.97] ${
                activeTab===item.id 
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 scale-[1.02]' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:text-blue-700 dark:hover:text-blue-400'
              }`}>
              <item.icon size={20} className={activeTab===item.id?'text-white':'text-gray-400 dark:text-gray-500'}/>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors">
            {theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}
            <span>{theme==='dark'?'Light Mode':'Dark Mode'}</span>
          </button>
          <button onClick={()=>{authService.logout();router.push('/auth/login')}} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm transition-colors">
            <LogOut size={18}/><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 min-h-screen max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-gray-100">{activeTab}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage institutional platform settings and content</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 relative shadow-sm active:scale-95 transition-transform">
              <Bell size={20}/>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"/>
            </button>
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95">
              <Plus size={18}/> New Announcement
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Students', value: '1,247', icon: Users, color: 'emerald' },
              { label: 'Pending Approvals', value: '12', icon: Clock, color: 'amber' },
              { label: 'Active Communities', value: '24', icon: LayoutDashboard, color: 'blue' },
              { label: 'Reports Today', value: '3', icon: Shield, color: 'red' },
            ].map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20 text-${stat.color}-600 flex items-center justify-center`}>
                  <stat.icon size={24}/>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Student</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Reg No</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Requested Group</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Date</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {approvals.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{req.user}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{req.regNo}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{req.group}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{req.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                          req.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
                          req.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                          'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        }`}>{req.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApproval(req.id, 'approve')} className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors active:scale-90" title="Approve">
                              <CheckCircle2 size={18}/>
                            </button>
                            <button onClick={() => handleApproval(req.id, 'reject')} className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors active:scale-90" title="Reject">
                              <XCircle size={18}/>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PLACEHOLDER TABS */}
        {(activeTab === 'users' || activeTab === 'moderation' || activeTab === 'settings') && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Settings size={32} className="text-gray-400"/>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 capitalize">{activeTab} Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">This admin module is under active development. Full functionality will be available in the next update.</p>
          </div>
        )}
      </main>
    </div>
  );
}
