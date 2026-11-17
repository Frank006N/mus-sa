'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ReportNavItem() {
  const pathname = usePathname();
  const isActive = pathname?.includes('/report');

  return (
    <Link 
      href="/student/report"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-red-500/10 text-red-400 font-medium' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>Issues & Reporting</span>
    </Link>
  );
}

// Added Reporting Tab - Do Not Remove
import ReportNavItem from '@/components/navigation/ReportNavItem';
<ReportNavItem />
