'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth/client';

export default function AdminSignupPage() {
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
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6">
      <div className="w-full max-w-md space-y-8">
        <button onClick={() => router.back()} className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft size={18} className="mr-2" /> Back to role selection
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold">Create Admin Account</h2>
          <p className="text-gray-400 mt-2">Requires @mut.ac.ke email verification</p>
        </div>

        {error && <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-200 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Admin Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input type="email" placeholder="admin@mut.ac.ke" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white" />
            </div>
            <p className="text-xs text-gray-500">Must end with @mut.ac.ke</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300">{showPass ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            {loading ? 'Creating Admin Account...' : <>Create Admin Account <ArrowRight size={18}/></>}
          </button>
        </form>
      </div>
    </div>
  );
}
