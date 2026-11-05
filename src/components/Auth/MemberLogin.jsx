import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Lock,
  User,
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Phone,
  Building2,
  KeyRound,
  PlusCircle,
  Smartphone,
  MapPin,
  CreditCard
} from 'lucide-react';

export default function MemberLogin({ initialTab = 'member', onBack }) {
  const {
    gyms,
    currentGym,
    setCurrentGym,
    loginMemberWithId,
    loginWithSupabase,
    loginDemoAccount,
    registerGym,
    authError,
    authLoading
  } = useGym();

  const [activeTab, setActiveTab] = useState(initialTab); // 'member' | 'owner' | 'register_gym'

  // Member Form State
  const [selectedGymCode, setSelectedGymCode] = useState(currentGym?.gymCode || 'KG01');
  const [memberIdInput, setMemberIdInput] = useState('');
  const [memberPinInput, setMemberPinInput] = useState('');

  // Owner Login State
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Register New Gym State
  const [newGymName, setNewGymName] = useState('');
  const [newGymCode, setNewGymCode] = useState('');
  const [newGymCity, setNewGymCity] = useState('Hubli');
  const [newGymAddress, setNewGymAddress] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerPhone, setNewOwnerPhone] = useState('+91 ');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newUpiVpa, setNewUpiVpa] = useState('feroznadaf13008@ybl');

  // Messages
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Member ID Login
  const handleMemberSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    if (!memberIdInput.trim()) {
      setLocalError('Please enter your Member ID or registered phone number.');
      return;
    }

    const res = loginMemberWithId({
      gymCode: selectedGymCode,
      memberIdOrPhone: memberIdInput,
      pin: memberPinInput
    });

    if (!res.success) {
      setLocalError(res.error || 'Failed to authenticate member pass.');
    }
  };

  // Handle Owner Sign-in
  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    if (!ownerEmail || !ownerPassword) {
      setLocalError('Please enter owner email and password.');
      return;
    }

    const res = await loginWithSupabase({
      email: ownerEmail,
      password: ownerPassword,
      isSignUp: false,
      role: 'owner'
    });

    if (!res.success) {
      setLocalError(res.error || 'Owner authentication failed.');
    }
  };

  // Handle Register New Gym
  const handleRegisterGym = (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    if (!newGymName.trim()) {
      setLocalError('Please enter gym name.');
      return;
    }
    if (!newOwnerName.trim()) {
      setLocalError('Please enter gym owner name.');
      return;
    }

    const res = registerGym({
      name: newGymName,
      gymCode: newGymCode,
      city: newGymCity,
      address: newGymAddress || `${newGymCity}`,
      ownerName: newOwnerName,
      ownerEmail: newOwnerEmail || `owner@${newGymCode.toLowerCase() || 'gym'}.in`,
      ownerPhone: newOwnerPhone,
      upiVpa: newUpiVpa || 'feroznadaf13008@ybl'
    });

    if (!res.success) {
      setLocalError(res.error || 'Failed to register gym.');
    } else {
      setSuccessMsg(`Gym "${res.gym.name}" registered successfully with Gym Code [${res.gym.gymCode}]! You are now logged in as Owner.`);
    }
  };

  // Quick Demo Autofills
  const handleDemoFill = (type) => {
    setLocalError('');
    setSuccessMsg('');
    if (type === 'member') {
      setSelectedGymCode('KG01');
      setMemberIdInput('KG-1012');
      setMemberPinInput('6058');
      loginMemberWithId({
        gymCode: 'KG01',
        memberIdOrPhone: 'KG-1012',
        pin: '6058'
      });
    } else {
      loginDemoAccount('owner');
    }
  };

  const activeGymObj = gyms.find(g => g.gymCode === selectedGymCode) || currentGym || gyms[0];

  return (
    <div className="w-full max-w-md mx-auto my-3 animate-in fade-in duration-300">
      <div className="bg-[#101625] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-100 space-y-5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Member App</span>
          </button>
        )}

        {/* Top Gym Identity */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-orange-950/60 border border-orange-500">
            {activeGymObj?.logoText || 'KG'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {activeGymObj?.name || 'Karnataka Gym Fitness Centre'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
              <span>{activeGymObj?.address || 'Devi Nagar, Hubli - 580031'}</span>
            </p>
          </div>
        </div>

        {/* 3-Way Mode Segment */}
        <div className="grid grid-cols-3 p-1 bg-[#090d15] rounded-xl border border-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('member');
              setLocalError('');
            }}
            className={`py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'member'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Member Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('owner');
              setLocalError('');
            }}
            className={`py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'owner'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Owner Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register_gym');
              setLocalError('');
            }}
            className={`py-2 px-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
              activeTab === 'register_gym'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register Gym</span>
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

        {/* TAB 1: MEMBER LOGIN WITH GYM CODE + MEMBER ID / PHONE + PIN */}
        {activeTab === 'member' && (
          <form onSubmit={handleMemberSubmit} className="space-y-4 text-xs">
            {/* Gym Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Select Your Gym
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <select
                  value={selectedGymCode}
                  onChange={(e) => {
                    setSelectedGymCode(e.target.value);
                    const matched = gyms.find(g => g.gymCode === e.target.value);
                    if (matched) setCurrentGym(matched);
                  }}
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-orange-500 text-xs"
                >
                  {gyms.map(g => (
                    <option key={g.id} value={g.gymCode}>
                      [{g.gymCode}] {g.name} - {g.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Member ID or Mobile Number */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Member ID or Registered Phone
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={memberIdInput}
                  onChange={(e) => setMemberIdInput(e.target.value)}
                  placeholder="e.g. KG-1012 or 9663396058"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Assigned by your gym owner when you joined.
              </span>
            </div>

            {/* 4-Digit Access PIN */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                4-Digit Access PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  maxLength={4}
                  value={memberPinInput}
                  onChange={(e) => setMemberPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 tracking-widest font-mono text-sm"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Default PIN is the last 4 digits of your phone (e.g. 6058).
              </span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 mt-2"
            >
              <span>{authLoading ? 'Verifying Pass...' : 'Open My Mobile Member Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: OWNER PORTAL LOGIN */}
        {activeTab === 'owner' && (
          <form onSubmit={handleOwnerSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Owner Email Address
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@karnatakagym.in"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
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
              <span>{authLoading ? 'Verifying...' : 'Unlock Owner Cockpit'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('register_gym')}
                className="text-orange-400 hover:text-orange-300 text-xs font-semibold underline underline-offset-2"
              >
                Want to run your gym here? Register a new gym
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: REGISTER NEW GYM */}
        {activeTab === 'register_gym' && (
          <form onSubmit={handleRegisterGym} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Gym Brand Name
              </label>
              <input
                type="text"
                value={newGymName}
                onChange={(e) => setNewGymName(e.target.value)}
                placeholder="e.g. Royal Fitness Centre"
                className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 px-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Gym Code (4-char)
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={newGymCode}
                  onChange={(e) => setNewGymCode(e.target.value.toUpperCase())}
                  placeholder="e.g. RF03"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 px-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 uppercase font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={newGymCity}
                  onChange={(e) => setNewGymCity(e.target.value)}
                  placeholder="Hubli"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 px-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Branch Address / Landmark
              </label>
              <input
                type="text"
                value={newGymAddress}
                onChange={(e) => setNewGymAddress(e.target.value)}
                placeholder="e.g. Vidyanagar Main Road, Hubli"
                className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 px-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  placeholder="Coach Ramesh"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 px-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Owner Mobile
                </label>
                <input
                  type="tel"
                  value={newOwnerPhone}
                  onChange={(e) => setNewOwnerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 px-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                UPI ID for Member Payments (Direct to your Bank)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={newUpiVpa}
                  onChange={(e) => setNewUpiVpa(e.target.value)}
                  placeholder="yourname@upi or mobile@ybl"
                  className="w-full bg-[#080b13] border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                All renewal and supplement fees from your members deposit directly here.
              </span>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 mt-1"
            >
              <span>{authLoading ? 'Registering Gym...' : 'Register Gym & Open Cockpit'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Testing Preset Buttons */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Instant Demo Test:</span>
            <span className="text-[10px] text-emerald-400 font-bold">1-Tap Verification</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('member')}
              className="bg-[#141b2c] hover:bg-[#1a233a] border border-slate-700 text-slate-200 p-2.5 rounded-xl text-left text-[11px] transition-colors"
            >
              <div className="font-bold text-white flex items-center gap-1">
                <span>Member Mobile Pass</span>
              </div>
              <div className="text-slate-400 text-[10px]">Ananya Kulkarni (KG-1012)</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('owner')}
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
          <span>Universal Gym Management & Multi-Tenant Security</span>
        </div>
      </div>
    </div>
  );
}
