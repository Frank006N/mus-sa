'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to MUT Social</h1>
          <p className="text-gray-400 text-lg">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Card */}
          <button
            onClick={() => router.push('/auth/student-signup')}
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-emerald-500 transition-all active:scale-[0.98]"
          >
            <div className="w-16 h-16 rounded-xl bg-emerald-600/20 flex items-center justify-center mb-6 group-hover:bg-emerald-600/30 transition-colors">
              <GraduationCap size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Student</h2>
            <p className="text-gray-400 mb-6">Access campus communities, marketplace, and social features.</p>
            <div className="flex items-center text-emerald-400 font-medium">
              Continue as Student <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => router.push('/auth/admin-signup')}
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-500 transition-all active:scale-[0.98]"
          >
            <div className="w-16 h-16 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
              <Shield size={32} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Administrator</h2>
            <p className="text-gray-400 mb-6">Manage users, communities, and platform settings.</p>
            <div className="flex items-center text-blue-400 font-medium">
              Continue as Admin <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => router.push('/auth/login')}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
