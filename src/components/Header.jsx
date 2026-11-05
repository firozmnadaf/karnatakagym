import React, { useState, useEffect } from 'react';
import { useGym } from '../context/GymContext';
import {
  Menu,
  X,
  Smartphone,
  Monitor,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  Check,
  Download,
  LogOut,
  Shield,
  User
} from 'lucide-react';
import InstallAppModal from './Common/InstallAppModal';

export default function Header() {
  const {
    currentRole,
    setCurrentRole,
    viewMode,
    setViewMode,
    activeMemberId,
    setActiveMemberId,
    members,
    resetToFactoryData,
    offlineSyncQueue,
    currentUser,
    logout,
    currentGym
  } = useGym();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  // Dynamic Page Titles for every role & view
  useEffect(() => {
    const titles = {
      member: 'Member Portal - Karnataka Gym Fitness Centre, Hubli',
      owner: 'Owner Cockpit - Karnataka Gym Retention System',
      frontdesk: 'Front-Desk Turnstile Terminal - Karnataka Gym Hubli',
      automations: 'Automations Engine - Karnataka Gym Hubli',
      testing: '11-Point Verification Test Suite - Karnataka Gym',
      database: '14 Database Tables & State Explorer - Karnataka Gym',
      notfound: '404 Page Not Found - Karnataka Gym Hubli'
    };
    document.title = titles[currentRole] || 'Karnataka Gym Fitness Centre | Devi Nagar, Hubli';
  }, [currentRole]);

  const handleLogoClick = () => {
    setCurrentRole('member');
    setViewMode('mobile');
    setMobileMenuOpen(false);
  };

  const handleNavSelect = (role) => {
    setCurrentRole(role);
    setMobileMenuOpen(false);
  };

  const handleReset = () => {
    if (window.confirm('Reset all members, streaks, attendances, and orders to original Hubli sample data?')) {
      resetToFactoryData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <header className="bg-[#0f1422] border-b border-slate-800 sticky top-0 z-50">
      {/* Top Bar: Clickable Logo, Location, Contact & Utility Controls */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
        {/* Left: Clickable Logo & Gym Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3 text-left focus:outline-none rounded-xl"
            title="Return to Karnataka Gym Home"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm border border-orange-500">
              {currentGym?.logoText || 'KG'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wide text-white hover:text-orange-400 transition-colors uppercase">
                  {currentGym?.name || 'KARNATAKA GYM'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 uppercase">
                  {currentGym?.city || 'DEVI NAGAR'}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <a
                  href="https://maps.google.com/?q=Devi+Nagar+Hubli+Karnataka+580031"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white underline underline-offset-2 flex items-center gap-1"
                  title="View on Google Maps"
                >
                  <MapPin className="w-3 h-3 text-orange-400" />
                  <span>Hubli - 580031</span>
                </a>
                <span>|</span>
                <span className="text-emerald-400 font-semibold">
                  6:00 AM - 9:00 PM
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Controls: Phone, View Mode, Reset & Mobile Menu Button */}
        <div className="flex items-center gap-2">
          {/* Clickable Phone Number */}
          <a
            href="tel:+919663396058"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162032] border border-slate-700 text-orange-400 hover:text-orange-300 text-xs font-bold transition-colors"
            title="Call Front Desk Reception"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>+91 96633 96058</span>
          </a>

          {/* Clickable Email */}
          <a
            href="mailto:info@karnatakagym.in"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#162032] border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            title="Email Karnataka Gym"
          >
            <Mail className="w-3.5 h-3.5 text-orange-400" />
            <span>info@karnatakagym.in</span>
          </a>

          {/* Offline Sync Badge if queued */}
          {offlineSyncQueue.length > 0 && (
            <span className="bg-amber-950 text-amber-300 border border-amber-600 px-2.5 py-1 rounded-lg text-xs font-bold">
              {offlineSyncQueue.length} Queued Offline
            </span>
          )}

          {/* View Mode Toggle: Mobile vs Wide Desktop (For Owner only) */}
          {currentUser?.role === 'owner' && (
            <div className="hidden sm:flex bg-slate-950 border border-slate-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Mobile App Viewport Frame"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Frame</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Responsive Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Wide View</span>
              </button>
            </div>
          )}

          {/* Download Mobile App Button */}
          <button
            type="button"
            onClick={() => setInstallModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/40 text-xs font-bold transition-colors"
            title="Download Karnataka Gym Mobile App"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install App</span>
          </button>

          {/* Factory Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg bg-[#162032] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-orange-400 transition-colors"
            title="Reset to Factory Sample State"
            aria-label="Reset database to initial state"
          >
            {resetSuccess ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
          </button>

          {/* User Sign Out or Status */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-700">
              <div className="hidden xl:flex flex-col text-right text-[11px] leading-tight">
                <span className="font-bold text-white truncate max-w-[130px]">{currentUser.fullName}</span>
                <span className="text-[10px] text-orange-400 capitalize">{currentUser.role === 'owner' ? 'Gym Owner' : 'Member'}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 hover:text-white text-xs font-bold transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : null}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#162032] hover:bg-slate-800 border border-slate-700 text-white"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation Bar: Gated by Authentication Role */}
      {currentUser && (
        <div className="hidden md:block border-t border-slate-800 bg-[#0c1018] px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {currentUser.role === 'owner' ? (
              <>
                <nav className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                  <button
                    type="button"
                    onClick={() => handleNavSelect('owner')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      currentRole === 'owner'
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#111726] text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Owner Cockpit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavSelect('frontdesk')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      currentRole === 'frontdesk'
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#111726] text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Front-Desk Terminal
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavSelect('automations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      currentRole === 'automations'
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#111726] text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Automations Engine
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavSelect('testing')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      currentRole === 'testing'
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#111726] text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    11-Point Test Suite
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavSelect('database')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      currentRole === 'database'
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#111726] text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    14 Data Tables
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavSelect('member')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      currentRole === 'member'
                        ? 'bg-orange-600 text-white'
                        : 'bg-[#111726] text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    Preview Member App
                  </button>
                </nav>

                {/* Owner Persona Testing Switcher */}
                {currentRole === 'member' && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-300 font-semibold whitespace-nowrap">Testing Persona:</span>
                    <select
                      value={activeMemberId}
                      onChange={(e) => setActiveMemberId(e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 max-w-[240px] truncate"
                    >
                      <optgroup label="Active Regulars">
                        <option value="mem_12">Ananya Kulkarni (Streak 18d, Active)</option>
                        <option value="mem_08">Praveen Deshpande (Streak 14d, Expiring in 3d)</option>
                        <option value="mem_15">Ganesh Navalgund (Active)</option>
                      </optgroup>
                      <optgroup label="Expiring Soon (Within 7d)">
                        <option value="mem_07">Soumya Belagavi (Expires in 2 days)</option>
                        <option value="mem_10">Deepa Savanur (Expires Tomorrow)</option>
                        <option value="mem_09">Kiran Kalghatgi (Expires in 5 days)</option>
                      </optgroup>
                      <optgroup label="Silent Churn / Red List">
                        <option value="mem_01">Basavaraj Patil (Absent 14 days)</option>
                        <option value="mem_02">Priyanka Joshi (Absent 18 days)</option>
                      </optgroup>
                    </select>
                  </div>
                )}
              </>
            ) : (
              /* Strictly Member Only View: ZERO Owner Cockpit access or links */
              <div className="w-full flex items-center justify-between text-xs py-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-orange-400">Hubli Member App</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300 font-medium">
                    Logged in as <strong className="text-white">{currentUser.fullName}</strong>
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active Pass
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>Turnstile QR Access & Streaks Protected</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer / Sheet Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0d121c] p-4 space-y-4">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {!currentUser || currentUser.role === 'member' ? (
            <div className="space-y-3">
              <div className="bg-[#111726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{currentUser?.fullName || 'Ananya Kulkarni'}</span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Active Pass
                  </span>
                </div>
                <div className="text-[11px] text-orange-400">Annual Champion Pass (mem_12)</div>
                <div className="text-[11px] text-slate-400">Hubli Turnstile QR Check-in & Fair Streak Active</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentRole('member');
                  setMobileMenuOpen(false);
                }}
                className="w-full p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Karnataka Gym Member App</span>
              </button>
              <div className="pt-2 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => handleNavSelect('owner')}
                  className="text-[11px] text-slate-400 hover:text-orange-400 transition-colors underline"
                >
                  Owner Cockpit Access
                </button>
              </div>
            </div>
          ) : currentUser.role === 'owner' ? (
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'owner', label: 'Owner Cockpit' },
                { id: 'frontdesk', label: 'Front-Desk Terminal' },
                { id: 'automations', label: 'Automations Engine' },
                { id: 'testing', label: '11-Point Tests' },
                { id: 'database', label: '14 Database Tables' },
                { id: 'member', label: 'Preview Member App' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavSelect(item.id)}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-colors ${
                    currentRole === item.id
                      ? 'bg-orange-600 text-white'
                      : 'bg-[#141b2b] text-slate-200 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            /* Member only drawer */
            <div className="bg-[#111726] p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="font-bold text-white">{currentUser.fullName}</div>
              <div className="text-[11px] text-orange-400">{currentUser.planName || 'Annual Champion Pass'}</div>
              <div className="text-[11px] text-slate-400">Turnstile QR Check-in & Fair Streak enabled</div>
            </div>
          )}

          {/* User Sign Out in mobile menu */}
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 font-bold flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({currentUser.fullName})</span>
            </button>
          )}

          {/* Direct Contact Links inside Mobile Menu */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <a
              href="tel:+919663396058"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-orange-400 font-bold flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Call Gym
            </a>
            <a
              href="mailto:info@karnatakagym.in"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" /> Email
            </a>
          </div>

          {/* Download App Action in Mobile Menu */}
          <button
            type="button"
            onClick={() => {
              setInstallModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold flex items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-orange-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Install / Download App to Phone</span>
          </button>
        </div>
      )}

      {/* PWA / Mobile Install Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </header>
  );
}
