'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth/client';

export default function AdminEntryPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@mut.ac.ke')) {
      setError('Admin accounts require a @mut.ac.ke email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp.email({ 
        email, 
        password, 
        name: email.split('@')[0], 
        callbackURL: '/admin/dashboard' 
      });
    } catch (err: any) {
      setError(err.message || 'Admin signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signIn.social({ provider: 'google', callbackURL: '/admin/dashboard' });
    } catch (err: any) {
      setError('Google Sign-In unavailable locally. Please use email.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Admin-Specific Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold">Administrator Portal</h1>
          <p className="text-gray-400">Create or access your admin account</p>
        </div>

        {/* Domain Requirement Notice */}
        <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-200">
            Admin accounts are restricted to <span className="font-mono font-semibold">@mut.ac.ke</span> email addresses only.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Admin Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="email" 
                placeholder="admin@mut.ac.ke" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type={showPass ? 'text' : 'password'} 
                placeholder="Min 8 characters" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={8}
                className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white" 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? 'Creating Admin Account...' : <>Create Admin Account <ArrowRight size={18}/></>}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-gray-900 text-gray-500">Or continue with</span></div>
        </div>

        <button 
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 border border-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an admin account?{' '}
          <button 
            onClick={() => router.push('/auth/login')}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
}
