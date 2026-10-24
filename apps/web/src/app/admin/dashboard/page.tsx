'use client';
import { useEffect, useState } from 'react'; import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, MessageSquare, Shield, Settings, Bell, Search, Plus, LogOut } from 'lucide-react';
import { authService, User } from '@/lib/auth';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'content', label: 'Content Moderation', icon: MessageSquare },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export default function AdminDashboard() {
  const router = useRouter(); const [activeTab, setActiveTab] = useState('overview'); const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const s = authService.getSession();
    if (!s || s.role !== 'admin') { router.push('/auth/login'); return; }
    setUser(s);
  }, [router]);

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r fixed h-full hidden lg:flex flex-col z-10">
        <div className="p-6 border-b"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">MUT</div><div><h1 className="font-bold text-blue-800">MUT Admin</h1><p className="text-xs text-gray-500">Administrator</p></div></div></div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}><item.icon size={20}/>{item.label}</button>))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={() => { authService.logout(); router.push('/auth/login'); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 text-sm"><LogOut size={18}/>Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 lg:ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div><h2 className="text-2xl font-bold capitalize">{activeTab}</h2><p className="text-gray-500 text-sm">Institutional management</p></div>
          <div className="flex gap-3"><button className="p-2 hover:bg-gray-100 rounded-lg"><Search size={20}/></button><button className="p-2 hover:bg-gray-100 rounded-lg relative"><Bell size={20}/><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"/></button><button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm font-medium"><Plus size={16}/>Add New</button></div>
        </div>
        <div className="bg-white rounded-xl border p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"><NAV.find(n=>n.id===activeTab)?.icon && <NAV.find(n=>n.id===activeTab)!.icon size={32} className="text-gray-400"/></div>
          <h3 className="text-lg font-medium mb-2 capitalize">{activeTab} Coming Soon</h3>
          <p className="text-gray-500 max-w-md">Administrative features are being implemented. Full access will be available shortly.</p>
        </div>
      </main>
    </div>
  );
}
