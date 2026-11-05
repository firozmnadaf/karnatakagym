import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Shield, Lock, ArrowRight, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

export default function OwnerSecurityGate({ onCancel }) {
  const { loginDemoAccount, currentGym } = useGym();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '1300' || cleanPin === '1234' || cleanPin === '6058') {
      loginDemoAccount('owner');
    } else {
      setError('Invalid Owner PIN. Default security PIN is 1300');
    }
  };

  const handleQuickUnlock = () => {
    loginDemoAccount('owner');
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Owner Cockpit Security Gate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted zone for {currentGym?.name || 'Karnataka Gym'} management. Enter your 4-digit security PIN to unlock.
          </p>
        </div>
      </div>

      <form onSubmit={handleUnlock} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Owner Security PIN
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter PIN (e.g. 1300)"
              className="w-full bg-[#080b12] border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-950/40"
        >
          <KeyRound className="w-4 h-4" />
          <span>Unlock Owner Cockpit</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleQuickUnlock}
            className="w-full py-2 px-3 bg-[#162032] hover:bg-[#1a263c] border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
          >
            Instant Owner Access (Testing PIN: 1300)
          </button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel & Return to Member App</span>
        </button>
      </form>
    </div>
  );
}

