import React from 'react';
import { useGym } from '../context/GymContext';
import {
  Dumbbell,
  Shield,
  Smartphone,
  Monitor,
  RotateCcw,
  Star,
  Users,
  Clock,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

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
    offlineSyncQueue
  } = useGym();

  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
      {/* Top Bar: Gym Identity, Hubli Context & Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-black tracking-tight">
            <Dumbbell className="w-6 h-6 transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">
                KARNATAKA GYM
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                FITNESS CENTRE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 (640+ Hubli Reviews)
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Devi Nagar, Hubli - 580031</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 inline" /> 6:00 AM – 9:00 PM
              </span>
              <span>•</span>
              <span className="hidden md:inline-flex text-rose-300 font-medium items-center gap-1">
                <Shield className="w-3 h-3 text-rose-400" /> Safe Women Space
              </span>
            </div>
          </div>
        </div>

        {/* Right Utility Buttons: Device Frame Toggle & Reset */}
        <div className="flex items-center gap-2">
          {offlineSyncQueue.length > 0 && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              {offlineSyncQueue.length} Offline Queued
            </span>
          )}

          {/* View Mode Toggle */}
          <div className="bg-slate-800/90 border border-slate-700 p-0.5 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'mobile'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile App Viewport Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile Frame</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'desktop'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Responsive Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wide View</span>
            </button>
          </div>

          {/* Factory Reset */}
          <button
            onClick={() => {
              if (window.confirm('Reset all members, streaks, attendances, and orders to original Hubli sample state?')) {
                resetToFactoryData();
              }
            }}
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
            title="Reset to Factory Seed Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Role Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setCurrentRole('member')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentRole === 'member'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Member App
            </button>

            <button
              onClick={() => setCurrentRole('owner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentRole === 'owner'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Owner Cockpit
            </button>

            <button
              onClick={() => setCurrentRole('frontdesk')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentRole === 'frontdesk'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Front-Desk / QR Turnstile
            </button>

            <button
              onClick={() => setCurrentRole('automations')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentRole === 'automations'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Automations (6)
            </button>

            <button
              onClick={() => setCurrentRole('testing')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentRole === 'testing'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              Test Suite (11 Scenarios)
            </button>

            <button
              onClick={() => setCurrentRole('database')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentRole === 'database'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
              Data Tables (14)
            </button>
          </nav>

          {/* Quick Member Persona Switcher (Convenient for testing member states) */}
          {currentRole === 'member' && (
            <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
              <span className="text-slate-400 whitespace-nowrap">Testing Member:</span>
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
                <optgroup label="Silent Churn / Red List (10-20d absent)">
                  <option value="mem_01">Basavaraj Patil (Absent 14 days)</option>
                  <option value="mem_02">Priyanka Joshi (Absent 18 days)</option>
                  <option value="mem_03">Raghavendra Hubballi (Absent 12 days)</option>
                  <option value="mem_06">Rekha Shettar (Absent 20 days)</option>
                </optgroup>
                <optgroup label="Edge Cases (Paused / Expired / Opted-Out)">
                  <option value="mem_13">Chetan Dharwad (Approved Medical Pause)</option>
                  <option value="mem_30">Sunil Bailhongal (Membership Expired)</option>
                  <option value="mem_16">Aishwarya Haliyal (Marketing Opted Out)</option>
                </optgroup>
              </select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

