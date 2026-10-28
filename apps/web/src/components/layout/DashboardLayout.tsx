'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth/client';
import { 
  LayoutDashboard, Users, ShoppingBag, Calendar, BookOpen, 
  MessageSquare, LogOut, Menu, X, Shield, UserCheck 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'lecturer' | 'admin';
  userEmail: string;
}

const NAV_ITEMS = {
  student: [{ label: 'Dashboard', icon: LayoutDashboard, href: '/student/dashboard' },
    { label: 'Feed', icon: LayoutDashboard, href: '/student/feed' },
    { label: 'Communities', icon: Users, href: '/student/communities' },
    { label: 'Marketplace', icon: ShoppingBag, href: '/student/marketplace' },
    { label: 'Events', icon: Calendar, href: '/student/events' },
    { label: 'Messages', icon: MessageSquare, href: '/student/messages' },
],
  lecturer: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/lecturer/dashboard' },
    { label: 'My Courses', icon: BookOpen, href: '/lecturer/courses' },
    { label: 'Students', icon: Users, href: '/lecturer/students' },
    { label: 'Assignments', icon: Calendar, href: '/lecturer/assignments' },
    { label: 'Messages', icon: MessageSquare, href: '/lecturer/messages' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Settings', icon: Shield, href: '/admin/settings' },
    { label: 'Audit Logs', icon: UserCheck, href: '/admin/logs' },
  ]
};

export default function DashboardLayout({ children, role, userEmail }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">MUT</div>
            {sidebarOpen && <span className="ml-3 font-bold text-lg hidden lg:block">Social</span>}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-600/10 text-emerald-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} className="shrink-0" />
                  {sidebarOpen && <span className="hidden lg:block text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className={`flex items-center gap-3 mb-4 ${!sidebarOpen ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">
                {userEmail?.[0]?.toUpperCase() || 'U'}
              </div>
              {sidebarOpen && (
                <div className="hidden lg:block overflow-hidden">
                  <p className="text-sm font-medium truncate">{userEmail}</p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="hidden lg:block text-sm font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-gray-900/50 backdrop-blur border-b border-gray-800 flex items-center px-6 gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-semibold capitalize">{pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}</h1>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
