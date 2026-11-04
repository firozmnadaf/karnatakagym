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
import NotFound from './components/NotFound';
import PWAInstallNotification from './components/Common/PWAInstallNotification';
import { Wifi, Battery, Signal } from 'lucide-react';

function MainAppContent() {
  const { currentRole, setCurrentRole, viewMode } = useGym();

  React.useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!rawHash) return;
      const validRoles = ['member', 'owner', 'frontdesk', 'automations', 'testing', 'database'];
      if (validRoles.includes(rawHash)) {
        setCurrentRole(rawHash);
      } else {
        // Any unknown path or route shows true 404 error page!
        setCurrentRole('notfound');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setCurrentRole]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 font-sans selection:bg-orange-600 selection:text-white overflow-x-hidden">
      {/* Global Header */}
      <Header />

      {/* Main Body */}
      <main className="flex-1 p-3 md:p-6 flex flex-col items-center justify-start w-full max-w-7xl mx-auto overflow-x-hidden">
        {/* Custom 404 Route View */}
        {currentRole === 'notfound' ? (
          <NotFound onGoHome={() => setCurrentRole('member')} />
        ) : currentRole === 'member' && viewMode === 'mobile' ? (
          /* Mobile Device Frame View */
          <div className="w-full max-w-[420px] mx-auto my-2">
            <div className="relative bg-[#0d121d] border-4 border-slate-700 rounded-[38px] shadow-2xl overflow-hidden">
              {/* Dynamic Notch */}
              <div className="w-full bg-[#080b12] pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 border-b border-slate-800">
                <span className="font-bold">9:41 AM</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-[10px] text-slate-400 font-medium">Hubli 5G</span>
                  <Signal className="w-3 h-3 text-slate-300" />
                  <Wifi className="w-3 h-3 text-slate-300" />
                  <Battery className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Member Mobile Application Viewport */}
              <div className="min-h-[640px] max-h-[760px] overflow-y-auto bg-[#0b0f17]">
                <MemberApp />
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-2">
              Viewing in Mobile Frame. Click "Wide View" in header for full desktop layout.
            </div>
          </div>
        ) : (
          /* Wide or Administrative Views */
          <div className="w-full">
            {currentRole === 'member' && (
              <div className="max-w-xl mx-auto bg-[#101624] border border-slate-800 rounded-2xl p-4 shadow-xl">
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

      {/* Dynamic PWA Mobile Install Notification for Web Visitors */}
      <PWAInstallNotification />
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
