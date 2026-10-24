'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Shield, Chrome, Apple } from 'lucide-react';
import { authService } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 800)); // Simulate network
    
    try {
      authService.login(email, password);
      const role = authService.getSession()?.role;
      router.push(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = (provider: 'google' | 'apple') => {
    setLoading(true);
    setTimeout(() => {
      // Mock SSO: Google = Student, Apple = Admin for demo purposes
      const mockEmail = provider === 'google' ? 'student@gmail.com' : 'admin@mut.ac.ke';
      authService.login(mockEmail, 'sso-token');
      router.push(provider === 'google' ? '/student/dashboard' : '/admin/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      {/* Left Panel - Real Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80" 
          alt="MUT Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-gray-900/80 to-black/90"/>
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-2xl mb-8 shadow-lg shadow-emerald-600/30">MUT</div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">University Social<br/>Platform</h1>
            <p className="text-gray-300 text-lg max-w-md leading-relaxed">Connect with peers, access services, and stay updated with official announcements.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-300"><GraduationCap size={20} className="text-emerald-400"/><span>Students use Gmail accounts</span></div>
            <div className="flex items-center gap-3 text-gray-300"><Shield size={20} className="text-blue-400"/><span>Admins use @mut.ac.ke emails</span></div>
            <div className="flex items-center gap-3 text-gray-300"><Chrome size={20} className="text-red-400"/><span>Secure Google & Apple Authentication</span></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-600/30">MUT</div>
          </div>
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Sign in to access your campus community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder:text-gray-500" 
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white placeholder:text-gray-500" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18}/></>}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-gray-900 text-gray-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSSO('google')}
              disabled={loading}
              className="py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Chrome size={20} className="text-red-500" /> Google
            </button>
            <button 
              onClick={() => handleSSO('apple')}
              disabled={loading}
              className="py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Apple size={20} /> Apple
            </button>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-emerald-900/20 rounded-lg border border-emerald-800/30">
                <GraduationCap size={20} className="mx-auto text-emerald-400 mb-1" />
                <p className="text-xs font-medium text-emerald-300">Student Access</p>
                <p className="text-[10px] text-emerald-500/70">Gmail Account</p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <Shield size={20} className="mx-auto text-blue-400 mb-1" />
                <p className="text-xs font-medium text-blue-300">Admin Access</p>
                <p className="text-[10px] text-blue-500/70">@mut.ac.ke Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
