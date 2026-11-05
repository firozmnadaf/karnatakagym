import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import MemberHome from './MemberHome';
import MemberQRScanner from './MemberQRScanner';
import MemberRenewal from './MemberRenewal';
import MemberAddOns from './MemberAddOns';
import MemberAttendanceHistory from './MemberAttendanceHistory';
import MemberSettings from './MemberSettings';
import {
  Home,
  QrCode,
  CreditCard,
  ShoppingBag,
  Settings,
  Shield
} from 'lucide-react';

export default function MemberApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const { setCurrentRole, currentUser } = useGym();

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f17] text-slate-100 relative">
      {/* Screen Content with bottom clearance for fixed navigation */}
      <div className="flex-1 p-4 pb-24">
        {currentScreen === 'home' && (
          <MemberHome onNavigate={(screen) => setCurrentScreen(screen)} />
        )}
        {currentScreen === 'qr_scanner' && (
          <MemberQRScanner
            onBack={() => setCurrentScreen('home')}
            onNavigateRenewal={() => setCurrentScreen('renewal')}
          />
        )}
        {currentScreen === 'renewal' && (
          <MemberRenewal onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'addons' && (
          <MemberAddOns onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'attendance' && (
          <MemberAttendanceHistory onBack={() => setCurrentScreen('home')} />
        )}
        {currentScreen === 'settings' && (
          <MemberSettings onBack={() => setCurrentScreen('home')} />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar: Permanently FIXED at bottom, never hidden */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto bg-[#0e1422] border-t border-slate-800 px-2 py-2 flex items-center justify-around z-50 shadow-2xl">
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-colors ${
            currentScreen === 'home' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('qr_scanner')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-colors ${
            currentScreen === 'qr_scanner' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px]">Check-In</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('renewal')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-colors ${
            currentScreen === 'renewal' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px]">Renew</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('addons')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-colors ${
            currentScreen === 'addons' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Store</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentRole('owner');
            window.location.hash = '#owner';
          }}
          className="flex flex-col items-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-colors text-amber-400 hover:text-amber-300 group"
          title="Gym Owner Portal & Cockpit"
        >
          <Shield className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-amber-400">Owner</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 sm:px-2 rounded-xl transition-colors ${
            currentScreen === 'settings' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Settings</span>
        </button>
      </nav>
    </div>
  );
}
