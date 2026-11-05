import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Lock,
  User,
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  Sparkles
} from 'lucide-react';

export default function MemberLogin() {
  const { loginWithSupabase, loginDemoAccount, authError, authLoading } = useGym();

  const [activeTab, setActiveTab] = useState('member'); // 'member' | 'owner'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    if (!email || !password) {
      setLocalError('Please enter both email/phone and password.');
      return;
    }

    if (isSignUp && !fullName) {
      setLocalError('Please enter your full name.');
      return;
    }

    const result = await loginWithSupabase({
      email,
      password,
      isSignUp,
      fullName: isSignUp ? fullName : undefined,
      phone: isSignUp ? phone : undefined,
      role: activeTab === 'owner' ? 'owner' : 'member'
    });

    if (!result.success) {
      setLocalError(result.error || 'Authentication failed. Please verify your credentials.');
    } else if (isSignUp) {
      setSuccessMsg('Account created successfully! You are now logged in.');
    }
  };

  const handleQuickDemo = (type) => {
    setLocalError('');
    setSuccessMsg('');
    loginDemoAccount(type);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 animate-in fade-in duration-300">
      <div className="bg-[#101625] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-orange-950/60 border border-orange-500">
            KG
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Karnataka Gym Fitness Centre
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Devi Nagar, Hubli - 580031
            </p>
          </div>
        </div>

        {/* Role Segment: Member Sign-in vs Owner Portal */}
        <div className="grid grid-cols-2 p-1 bg-[#090d15] rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('member');
              setLocalError('');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'member'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Member Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('owner');
              setLocalError('');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'owner'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {(localError || authError) && (
          <div className="bg-rose-950/70 border border-rose-800 text-rose-300 p-3 rounded-xl text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div>{localError || authError}</div>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/70 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                    required={isSignUp}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mobile Number (Hubli)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@karnatakagym.in"
                className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 mt-2"
          >
            <span>
              {authLoading
                ? 'Verifying...'
                : isSignUp
                ? 'Create Member Account'
                : activeTab === 'owner'
                ? 'Unlock Owner Cockpit'
                : 'Sign In to Member Portal'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        {activeTab === 'member' && (
          <div className="text-center pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLocalError('');
                setSuccessMsg('');
              }}
              className="text-slate-400 hover:text-orange-400 font-semibold text-xs transition-colors"
            >
              {isSignUp
                ? 'Already a registered member? Sign In'
                : 'New to Karnataka Gym? Register New Membership'}
            </button>
          </div>
        )}

        {/* Quick Demo Login Presets */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Instant Demo Accounts:</span>
            <span className="text-[10px] text-emerald-400">1-Tap Testing</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('member')}
              className="bg-[#141b2c] hover:bg-[#1a233a] border border-slate-700 text-slate-200 p-2.5 rounded-xl text-left text-[11px] transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1">
                <span>Member Pass</span>
              </div>
              <div className="text-slate-400 text-[10px]">Ananya Kulkarni</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="bg-[#141b2c] hover:bg-[#1a233a] border border-slate-700 text-slate-200 p-2.5 rounded-xl text-left text-[11px] transition-colors"
            >
              <div className="font-bold text-orange-400 flex items-center gap-1">
                <span>Owner Cockpit</span>
              </div>
              <div className="text-slate-400 text-[10px]">Coach Anand Bellad</div>
            </button>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
          <Shield className="w-3.5 h-3.5 text-orange-400" />
          <span>Protected by Supabase Row-Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
}
