import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import OwnerRedList from './OwnerRedList';
import OwnerRenewalPipeline from './OwnerRenewalPipeline';
import OwnerInventoryAddons from './OwnerInventoryAddons';
import OwnerPauseManager from './OwnerPauseManager';
import OwnerDailySummaryModal from './OwnerDailySummaryModal';
import OwnerDataQualityAlerts from './OwnerDataQualityAlerts';
import {
  Users,
  QrCode,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Clock,
  IndianRupee,
  ShoppingBag,
  Sliders,
  FileText,
  ShieldCheck,
  Package,
  Coffee,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function OwnerDashboard() {
  const {
    members,
    attendance,
    noShowCases,
    payments,
    settings,
    updateSettings,
    runDailyNoShowScan
  } = useGym();

  const [activeOwnerTab, setActiveOwnerTab] = useState('redlist'); // 'redlist' | 'renewals' | 'inventory' | 'pauses' | 'quality'
  const [showDailySummaryModal, setShowDailySummaryModal] = useState(false);
  const [thresholdInput, setThresholdInput] = useState(settings.noShowThresholdDays || 10);

  // Calculate the 8 Required Owner KPI Cards
  const todayStr = new Date().toISOString().split('T')[0];
  const activeMembers = members.filter(m => m.status === 'active');
  const todayCheckIns = attendance.filter(a => a.checkInTime.startsWith(todayStr));

  // 7-day active members (unique members who checked in over last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const sevenDayActiveMemberIds = new Set(
    attendance
      .filter(a => new Date(a.checkInTime) >= sevenDaysAgo)
      .map(a => a.memberId)
  );

  const openNoShowCases = noShowCases.filter(c => c.status === 'OPEN');
  const returnedMembers = noShowCases.filter(c => c.status === 'RESOLVED_RETURNED');

  // Renewals due within 7 days
  const renewalsDueList = members.filter(m => {
    if (m.status !== 'active') return false;
    const diff = Math.ceil((new Date(m.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  });

  // Financial collections
  const renewalCollection = payments
    .filter(p => p.status === 'PAID' && p.orderId.startsWith('ord_ren_'))
    .reduce((sum, p) => sum + p.amount, 0);

  const addOnRevenue = payments
    .filter(p => p.status === 'PAID' && p.orderId.startsWith('ord_add_'))
    .reduce((sum, p) => sum + p.amount, 0);

  // Handle threshold change
  const handleThresholdUpdate = (val) => {
    setThresholdInput(val);
    updateSettings({ noShowThresholdDays: parseInt(val, 10) });
  };

  return (
    <div className="space-y-5 pb-8 max-w-7xl mx-auto">
      {/* Top Cockpit Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Karnataka Gym Hubli • Management Cockpit
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">
            Owner & Retention Command Center
          </h2>
          <p className="text-xs text-slate-400">
            Actionable member retention, silent churn prevention, and revenue integrity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowDailySummaryModal(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Daily Owner Summary</span>
          </button>
        </div>
      </div>

      {/* 8 Required Dashboard Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Active Members */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px]">Active Members</span>
            <Users className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{activeMembers.length}</span>
            <span className="text-xs text-slate-400">/ {members.length} Total</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1">
            Hubli resident regulars
          </span>
        </div>

        {/* 2. Today's Check-Ins */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px]">Today's Check-Ins</span>
            <QrCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{todayCheckIns.length}</span>
            <span className="text-xs text-slate-400">Visits</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Entrance turnstile & assisted
          </span>
        </div>

        {/* 3. 7-Day Active Members */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px]">7-Day Active</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{sevenDayActiveMemberIds.size}</span>
            <span className="text-xs text-slate-400">Members</span>
          </div>
          <span className="text-[11px] text-cyan-300 font-semibold mt-1">
            {Math.round((sevenDayActiveMemberIds.size / (activeMembers.length || 1)) * 100)}% weekly retention
          </span>
        </div>

        {/* 4. Open No-Show Cases (Silent Churn) */}
        <div className="bg-slate-900/90 border border-rose-500/30 p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px] text-rose-300">Open Churn Risks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-300">{openNoShowCases.length}</span>
            <span className="text-xs text-rose-400/80">Absent ≥{settings.noShowThresholdDays}d</span>
          </div>
          <span className="text-[11px] text-rose-300 font-bold mt-1">
            Needs Coach Follow-Up
          </span>
        </div>

        {/* 5. Returned Members (Auto-Resolved) */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px]">Returned Members</span>
            <RotateCcw className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">{returnedMembers.length}</span>
            <span className="text-xs text-slate-400">Re-engaged</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1">
            Auto-saved by turnstile
          </span>
        </div>

        {/* 6. Renewals Due (Within 7 Days) */}
        <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px] text-amber-300">Renewals Due (7d)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-300">{renewalsDueList.length}</span>
            <span className="text-xs text-slate-400">Members</span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold mt-1">
            Urgent pipeline focus
          </span>
        </div>

        {/* 7. Renewal Collection */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px]">Renewal Collection</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-white">₹{renewalCollection.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Verified provider receipts
          </span>
        </div>

        {/* 8. Add-On Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase text-[10px]">Add-On Revenue</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-purple-300">₹{addOnRevenue.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[11px] text-purple-400 font-semibold mt-1">
            PT & Whey Protein Sales
          </span>
        </div>
      </div>

      {/* Configurable No-Show Threshold Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Silent Churn Absenteeism Threshold: <strong className="text-orange-400">{thresholdInput} Days</strong>
            </h4>
            <p className="text-xs text-slate-400">
              Members absent for {thresholdInput}+ days are flagged on the Red-List. Paused/medical/expired members are strictly excluded.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={thresholdInput}
            onChange={(e) => handleThresholdUpdate(e.target.value)}
            className="w-full md:w-48 accent-orange-500 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-white bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shrink-0">
            {thresholdInput} Days
          </span>
        </div>
      </div>

      {/* Owner Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveOwnerTab('redlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeOwnerTab === 'redlist'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Red-List Churn Board ({openNoShowCases.length})</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('renewals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeOwnerTab === 'renewals'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Renewal Pipeline & Receipts ({renewalsDueList.length})</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeOwnerTab === 'inventory'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-purple-400" />
          <span>Add-On Stock & PT Fulfillment</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('pauses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeOwnerTab === 'pauses'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Coffee className="w-4 h-4 text-cyan-400" />
          <span>Membership Pause Manager</span>
        </button>

        <button
          onClick={() => setActiveOwnerTab('quality')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeOwnerTab === 'quality'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Data-Quality Radar</span>
        </button>
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeOwnerTab === 'redlist' && <OwnerRedList />}
        {activeOwnerTab === 'renewals' && <OwnerRenewalPipeline />}
        {activeOwnerTab === 'inventory' && <OwnerInventoryAddons />}
        {activeOwnerTab === 'pauses' && <OwnerPauseManager />}
        {activeOwnerTab === 'quality' && <OwnerDataQualityAlerts />}
      </div>

      {/* Daily Owner Summary Modal */}
      {showDailySummaryModal && (
        <OwnerDailySummaryModal onClose={() => setShowDailySummaryModal(false)} />
      )}
    </div>
  );
}

