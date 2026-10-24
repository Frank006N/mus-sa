'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const session = JSON.parse(sessionStorage.getItem('mut_session') || '{}');
        if (session.role === 'admin') router.replace('/admin/dashboard');
        else if (session.role === 'student') router.replace('/student/dashboard');
        else router.replace('/auth/login');
      } catch {
        router.replace('/auth/login');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-3xl shadow-lg shadow-emerald-600/30">MUT</div>
        <h1 className="text-xl font-bold text-white">MUT Social Community</h1>
        <p className="text-gray-400">Loading your experience...</p>
      </div>
    </div>
  );
}
