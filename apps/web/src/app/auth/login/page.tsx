'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, GraduationCap, Shield, Chrome, Apple, ChevronDown, CheckCircle, KeyRound, AlertCircle, UserCheck } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth/client';

type Role = 'student' | 'lecturer' | 'admin';

const ROLES: Record<Role, { label: string; icon: typeof GraduationCap; color: string; placeholder: string }> = {
  student: { label: 'Student', icon: GraduationCap, color: 'emerald', placeholder: 'you@gmail.com' },
  lecturer: { label: 'Lecturer', icon: UserCheck, color: 'blue', placeholder: 'name@mut.ac.ke' },
  admin: { label: 'Super Admin', icon: Shield, color: 'purple', placeholder: 'admin@mut.ac.ke' },
};

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardRoute = () => {
    switch (selectedRole) {
      case 'admin': return '/admin/dashboard';
      case 'lecturer': return '/lecturer/dashboard';
      default: return '/student/dashboard';
    }
  };

  const validateEmail = () => {
    if ((selectedRole === 'admin' || selectedRole === 'lecturer') && !email.endsWith('@mut.ac.ke')) {
      setError(`${ROLES[selectedRole].label}s must use @mut.ac.ke email.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!validateEmail()) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isSignUp) {
        await signUp.email({ email, password, name: email.split('@')[0], callbackURL: '/auth/login', data: { role: selectedRole } });
        const res = await fetch('/api/auth/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action: 'send' }) });
        if (res.ok) {
          setAwaitingVerification(true);
          setSuccessMessage(`Account created! Enter code sent to ${email}.`);
        } else {
          setError('Failed to send verification code.');
        }
      } else {
        await signIn.email({ email, password, callbackURL: getDashboardRoute() });
      }
    } catch (err: any) {
      setError(err.message || (isSignUp ? 'Signup failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) { setError('Please enter a valid 6-digit code.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action: 'verify', code: otpCode }) });
      const data = await res.json();
      if (res.ok) {
        await signIn.email({ email, password, callbackURL: getDashboardRoute() });
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, action: 'send' }) });
      if (res.ok) setSuccessMessage('New code sent!');
      else setError('Failed to resend.');
    } catch (err) { setError('Failed to resend.'); }
    finally { setLoading(false); }
  };

  const handleSSO = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError('');
    try {
      await signIn.social({ provider, callbackURL: getDashboardRoute() });
    } catch (err: any) {
      if (err.message?.includes('ETIMEDOUT')) {
        setError('Network timeout. Your VPN may be blocking Google. Try email/password or disable VPN.');
      } else {
        setError(`${provider} Sign-In unavailable. Use email.`);
      }
      setLoading(false);
    }
  };

  const currentRole = ROLES[selectedRole];
  const RoleIcon = currentRole.icon;

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
            <h2 className="text-3xl font-bold">{awaitingVerification ? 'Verify Email' : (isSignUp ? 'Create Account' : 'Welcome Back')}</h2>
            <p className="text-gray-400 mt-2">
              {awaitingVerification ? `Enter the 6-digit code sent to ${email}` : 'Sign in to access your campus community'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl flex items-start gap-3 text-red-200 text-sm">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p>{error}</p>
                {awaitingVerification && (
                  <button onClick={handleResendCode} disabled={loading} className="mt-2 text-red-300 hover:text-red-200 underline text-xs">
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-700 rounded-xl flex items-center gap-3 text-emerald-200 text-sm">
              <CheckCircle size={18} className="shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          {awaitingVerification ? (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Verification Code</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3 top-3.5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="000000" 
                    value={otpCode} 
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-white text-center tracking-[0.5em] text-xl font-mono placeholder:text-gray-500" 
                  />
                </div>
              </div>
              <button 
                onClick={handleVerifyOTP} 
                disabled={loading || otpCode.length !== 6} 
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
              >
                {loading ? 'Verifying...' : <>Verify & Continue <ArrowRight size={18}/></>}
              </button>
            </div>
          ) : (
            <>
              {/* Role Dropdown - Only shown during signup, uses existing Tailwind classes */}
              {isSignUp && (
                <div className="space-y-1.5" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-300">I am a...</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 bg-gray-800 border rounded-xl text-left transition-all focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none ${
                        dropdownOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RoleIcon size={18} className="text-emerald-400" />
                        <span className="font-medium text-white">{currentRole.label}</span>
                      </div>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                        {(Object.keys(ROLES) as Role[]).map((role) => {
                          const config = ROLES[role];
                          const Icon = config.icon;
                          const isSelected = selectedRole === role;
                          return (
                            <button
                              key={role}
                              type="button"
                              onClick={() => { setSelectedRole(role); setDropdownOpen(false); setError(''); }}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                                isSelected ? 'bg-emerald-600/20 text-emerald-300' : 'hover:bg-gray-700 text-gray-300'
                              }`}
                            >
                              <Icon size={18} className={isSelected ? 'text-emerald-400' : 'text-gray-500'} />
                              <span className="font-medium">{config.label}</span>
                              {isSelected && <CheckCircle size={16} className="ml-auto text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                    <input 
                      type="email" 
                      placeholder={isSignUp ? currentRole.placeholder : 'you@example.com'} 
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
                      placeholder={isSignUp ? 'Min 8 characters' : 'Enter your password'} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      minLength={8}
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
                  {loading ? 'Processing...' : <>{isSignUp ? `Create ${currentRole.label} Account` : 'Sign In'} <ArrowRight size={18}/></>}
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

              <p className="text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button 
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMessage(''); setAwaitingVerification(false); setDropdownOpen(false); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

{/* Mock Google Auth Override */}
<script dangerouslySetInnerHTML={{__html: `
  document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = Array.from(document.querySelectorAll('button')).find(b => 
      b.textContent.includes('Google') || b.querySelector('svg[viewBox="0 0 24 24"]')
    );
    if (googleBtn) {
      googleBtn.onclick = (e) => {
        e.preventDefault();
        window.location.href = '/api/auth/mock-google';
      };
    }
  });
`}} />

