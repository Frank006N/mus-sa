'use client';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { n: 'Dashboard', h: '/student/dashboard', i: '📊' },
  { n: 'Feed', h: '/student/feed', i: '📰' },
  { n: 'Communities', h: '/student/communities', i: '👥' },
  { n: 'Marketplace', h: '/student/marketplace', i: '🛒' },
  { n: 'Events', h: '/student/events', i: '📅' },
  { n: 'Messages', h: '/student/messages', i: '💬' },
  { n: 'Issues & Reporting', h: '/student/report', i: '🚨' },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mutsa-theme');
    if (saved === 'dark') setDark(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('mutsa-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${dark ? 'dark bg-[#0f172a]' : 'bg-gray-50'}`}>
      <aside className={`w-64 fixed h-full overflow-y-auto shadow-xl z-50 transition-colors duration-300 ${dark ? 'bg-[#1e293b] text-white border-r border-white/5' : 'bg-[#0f172a] text-white'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">MUT Social</h1>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Toggle Theme">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map((item) => (
            <Link key={item.h} href={item.h} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${path === item.h ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
              <span>{item.i}</span>{item.n}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10 bg-inherit">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold ring-2 ring-white/20">F</div>
            <div><p className="text-sm font-semibold truncate">Francis Mugo</p><p className="text-xs text-gray-400 truncate">francismugo023@gmail.com</p></div>
          </div>
        </div>
      </aside>
      <main className="ml-64 flex-1 min-h-screen p-8">{children}</main>
    </div>
  );
}
