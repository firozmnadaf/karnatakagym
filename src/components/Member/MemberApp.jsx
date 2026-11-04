import React, { useState } from 'react';
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
  Settings
} from 'lucide-react';

export default function MemberApp() {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <div className="flex flex-col h-full min-h-[580px] bg-[#0b0f17] text-slate-100">
      {/* Screen Content */}
      <div className="flex-1 p-4 overflow-y-auto">
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

      {/* Mobile Bottom Navigation Bar (Solid dark, no glassmorphism or hover fades) */}
      <nav className="sticky bottom-0 bg-[#0e1422] border-t border-slate-800 px-3 py-2 flex items-center justify-around z-20">
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
            currentScreen === 'home' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('qr_scanner')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
            currentScreen === 'qr_scanner' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[10px]">QR Check-In</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('renewal')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
            currentScreen === 'renewal' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[10px]">Renew</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('addons')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
            currentScreen === 'addons' ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">PT and Supps</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('settings')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-colors ${
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
