import React from 'react';
import { useGym } from '../context/GymContext';

export default function NotFound({ onGoHome }) {
  const { setCurrentRole, setViewMode } = useGym();

  const handleNavigate = (role) => {
    setCurrentRole(role);
    if (role === 'member') {
      setViewMode('mobile');
    } else {
      setViewMode('desktop');
    }
    if (onGoHome) onGoHome();
  };

  return (
    <div className="min-h-[520px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111726] border border-slate-800 rounded-2xl p-6 md:p-8 text-center space-y-5 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">
            404 - Page Not Found
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The member route, turnstile session, or administrative screen you requested could not be located in the Karnataka Gym records.
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <button
            type="button"
            onClick={() => handleNavigate('member')}
            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
          >
            Go to Member Portal
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('owner')}
            className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors border border-slate-700"
          >
            Go to Owner Cockpit
          </button>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
          <div>Karnataka Gym Fitness Centre - Devi Nagar, Hubli - 580031</div>
          <div>
            Need assistance? Call{' '}
            <a href="tel:+919663396058" className="text-orange-400 hover:text-white font-bold underline">
              +91 96633 96058
            </a>{' '}
            or email{' '}
            <a href="mailto:info@karnatakagym.in" className="text-orange-400 hover:text-white font-bold underline">
              info@karnatakagym.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

