import React from 'react';
import { useGym, GymProvider } from './context/GymContext';
import MemberApp from './components/Member/MemberApp';
import MemberLogin from './components/Auth/MemberLogin';
import OwnerDashboard from './components/Owner/OwnerDashboard';
import FrontDeskApp from './components/FrontDesk/FrontDeskApp';
import AutomationsCenter from './components/Automations/AutomationsCenter';
import TestSuiteModal from './components/Testing/TestSuiteModal';
import DatabaseExplorer from './components/Database/DatabaseExplorer';
import NotFound from './components/NotFound';
import PWAInstallNotification from './components/Common/PWAInstallNotification';
import OwnerSecurityGate from './components/Owner/OwnerSecurityGate';
import { Wifi, Battery, Signal } from 'lucide-react';

function MainAppContent() {
  const { currentRole, setCurrentRole, currentUser } = useGym();

  React.useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (!rawHash) return;

      const validRoles = [
        'member',
        'owner',
        'frontdesk',
        'automations',
        'testing',
        'database',
        'login',
        'auth',
        'register-gym',
        'owner-login'
      ];
      if (validRoles.includes(rawHash)) {
        setCurrentRole(rawHash);
      } else {
        setCurrentRole('notfound');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setCurrentRole]);

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 font-sans selection:bg-orange-600 selection:text-white flex justify-center items-start">
      {/* Pure Mobile-Only Application Viewport */}
      <div className="w-full max-w-[440px] min-h-screen bg-[#0b0f17] flex flex-col shadow-2xl relative border-x border-slate-800/40">
        
        {/* Dynamic Mobile Status Bar (9:41 AM Hubli 5G) */}
        <header className="sticky top-0 z-30 w-full bg-[#080b12] pt-2 px-5 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 border-b border-slate-800 select-none">
          <span className="font-bold text-white tracking-tight">9:41 AM</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] text-slate-400 font-medium">Hubli 5G</span>
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </header>

        {/* Mobile Viewport Body */}
        <main className="flex-1 flex flex-col w-full">
          {currentRole === 'notfound' ? (
            <div className="p-4 flex-1 flex items-center justify-center">
              <NotFound onGoHome={() => setCurrentRole(currentUser?.role === 'owner' ? 'owner' : 'member')} />
            </div>
          ) : ['login', 'auth', 'register-gym', 'owner-login'].includes(currentRole) ? (
            /* Universal Gym Portals: Member Login, Owner Portal & Gym Registration */
            <div className="p-3 flex-1 flex flex-col justify-center">
              <MemberLogin
                initialTab={
                  currentRole === 'register-gym'
                    ? 'register_gym'
                    : currentRole === 'owner-login'
                    ? 'owner'
                    : 'member'
                }
                onBack={() => {
                  setCurrentRole('member');
                  window.location.hash = '#member';
                }}
              />
            </div>
          ) : currentRole === 'member' ? (
            /* Member Mobile Application: 100% Mobile Edge-to-Edge */
            <div className="flex-1 flex flex-col">
              <MemberApp />
            </div>
          ) : currentUser?.role === 'owner' ? (
            /* Owner Management Controls within Mobile Frame */
            <div className="p-3 w-full space-y-3">
              <div className="bg-[#111726] border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-2 overflow-x-auto text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  {[
                    { id: 'owner', label: 'Owner Cockpit' },
                    { id: 'frontdesk', label: 'Front-Desk' },
                    { id: 'automations', label: 'Automations' },
                    { id: 'testing', label: '11 Tests' },
                    { id: 'database', label: '14 Tables' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCurrentRole(tab.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                        currentRole === tab.id
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-900 text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentRole('member');
                    window.location.hash = '#member';
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-orange-400 font-bold whitespace-nowrap hover:bg-slate-700 transition-colors"
                >
                  Member App
                </button>
              </div>

              {currentRole === 'owner' && <OwnerDashboard />}
              {currentRole === 'frontdesk' && <FrontDeskApp />}
              {currentRole === 'automations' && <AutomationsCenter />}
              {currentRole === 'testing' && <TestSuiteModal />}
              {currentRole === 'database' && <DatabaseExplorer />}
            </div>
          ) : (
            /* Owner Security PIN Gate */
            <div className="p-4 flex-1 flex items-center justify-center">
              <OwnerSecurityGate
                onCancel={() => {
                  setCurrentRole('member');
                  window.location.hash = '#member';
                }}
              />
            </div>
          )}
        </main>
      </div>

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
