import React from 'react';
import { useGym, GymProvider } from './context/GymContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MemberApp from './components/Member/MemberApp';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import FrontDeskApp from './components/FrontDesk/FrontDeskApp';
import AutomationsCenter from './components/Automations/AutomationsCenter';
import TestSuiteModal from './components/Testing/TestSuiteModal';
import DatabaseExplorer from './components/Database/DatabaseExplorer';
import { Wifi, Battery, Signal } from 'lucide-react';

function MainAppContent() {
  const { currentRole, viewMode } = useGym();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-slate-950">
      {/* Global Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 p-3 md:p-6 flex flex-col items-center justify-start">
        {/* If Member Role & Mobile View: Render Mobile Device Frame */}
        {currentRole === 'member' && viewMode === 'mobile' ? (
          <div className="w-full max-w-[410px] mx-auto my-2">
            {/* Phone Bezel Frame */}
            <div className="relative bg-slate-900 border-[7px] border-slate-800 rounded-[44px] shadow-2xl shadow-orange-950/20 overflow-hidden ring-1 ring-slate-700/50">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
              </div>

              {/* Mobile Phone Status Bar */}
              <div className="pt-2 px-6 pb-1 bg-slate-950 flex items-center justify-between text-[11px] font-semibold text-slate-400 z-20 select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-[10px] text-slate-500 font-bold">Airtel Hubli</span>
                  <Signal className="w-3 h-3 text-slate-300" />
                  <Wifi className="w-3 h-3 text-slate-300" />
                  <Battery className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Member Mobile Application Viewport */}
              <div className="min-h-[640px] max-h-[760px] overflow-y-auto">
                <MemberApp />
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500 mt-2">
              Viewing in Mobile Frame. Toggle "Wide View" in header for full desktop width.
            </div>
          </div>
        ) : (
          /* Wide or Non-Member Views */
          <div className="w-full">
            {currentRole === 'member' && (
              <div className="max-w-xl mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl p-4 shadow-xl">
                <MemberApp />
              </div>
            )}
            {currentRole === 'owner' && <OwnerDashboard />}
            {currentRole === 'frontdesk' && <FrontDeskApp />}
            {currentRole === 'automations' && <AutomationsCenter />}
            {currentRole === 'testing' && <TestSuiteModal />}
            {currentRole === 'database' && <DatabaseExplorer />}
          </div>
        )}
      </main>

      {/* Official Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <MainAppContent />
    </GymProvider>
  );
}
