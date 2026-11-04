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
  FileText
} from 'lucide-react';

export default function OwnerDashboard() {
  const {
    members,
    attendance,
    noShowCases,
    payments,
    settings,
    updateSettings
  } = useGym();

  const [activeOwnerTab, setActiveOwnerTab] = useState('redlist');
  const [showDailySummaryModal, setShowDailySummaryModal] = useState(false);
  const [thresholdInput, setThresholdInput] = useState(settings.noShowThresholdDays || 10);

  const todayStr = new Date().toISOString().split('T')[0];
  const activeMembers = members.filter(m => m.status === 'active');
  const todayCheckIns = attendance.filter(a => a.checkInTime.startsWith(todayStr));

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const sevenDayActiveMemberIds = new Set(
    attendance
      .filter(a => new Date(a.checkInTime) >= sevenDaysAgo)
      .map(a => a.memberId)
  );

  const openNoShowCases = noShowCases.filter(c => c.status === 'OPEN');
  const returnedMembers = noShowCases.filter(c => c.status === 'RESOLVED_RETURNED');

  const renewalsDueList = members.filter(m => {
    if (m.status !== 'active') return false;
    const diff = Math.ceil((new Date(m.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  });

  const renewalCollection = payments
    .filter(p => p.status === 'PAID' && p.orderId.startsWith('ord_ren_'))
    .reduce((sum, p) => sum + p.amount, 0);

  const addOnRevenue = payments
    .filter(p => p.status === 'PAID' && p.orderId.startsWith('ord_add_'))
    .reduce((sum, p) => sum + p.amount, 0);

  const handleThresholdUpdate = (val) => {
    setThresholdInput(val);
    updateSettings({ noShowThresholdDays: parseInt(val, 10) });
  };

  return (
    <div className="space-y-5 pb-8 max-w-7xl mx-auto text-slate-100">
      {/* Top Header Row (No floating badge above headline!) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111726] border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white">
            Owner and Retention Command Center
          </h2>
          <p className="text-xs text-slate-300">
            Karnataka Gym Hubli - Devi Nagar. Monitor member retention, silent churn intervention, and revenue verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDailySummaryModal(true)}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Daily EOD Summary</span>
        </button>
      </div>

      {/* 8 KPI Cards Grid: 2 or 4 Columns (No 3 icon boxes in a row! No colored left borders!) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Active Members */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
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
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span className="font-bold uppercase text-[10px]">Today's Check-Ins</span>
            <QrCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{todayCheckIns.length}</span>
            <span className="text-xs text-slate-400">Visits</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Turnstile and assisted
          </span>
        </div>

        {/* 3. 7-Day Active Members */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
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

        {/* 4. Open No-Show Cases (Uniform 1px border, no colored left bar!) */}
        <div className="bg-[#19141f] border border-rose-700 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-300 text-xs">
            <span className="font-bold uppercase text-[10px]">Open Churn Risks</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-300">{openNoShowCases.length}</span>
            <span className="text-xs text-rose-400">Absent {settings.noShowThresholdDays}+ days</span>
          </div>
          <span className="text-[11px] text-rose-300 font-semibold mt-1">
            Action required on Red-List
          </span>
        </div>

        {/* 5. Returned Members */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span className="font-bold uppercase text-[10px]">Returned Members</span>
            <RotateCcw className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">{returnedMembers.length}</span>
            <span className="text-xs text-slate-400">Re-engaged</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1">
            Auto-resolved by turnstile
          </span>
        </div>

        {/* 6. Renewals Due */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span className="font-bold uppercase text-[10px]">Renewals Due (7d)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-300">{renewalsDueList.length}</span>
            <span className="text-xs text-slate-400">Members</span>
          </div>
          <span className="text-[11px] text-amber-400 font-semibold mt-1">
            Expiring this week
          </span>
        </div>

        {/* 7. Renewal Collection */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span className="font-bold uppercase text-[10px]">Renewal Revenue</span>
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
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span className="font-bold uppercase text-[10px]">Add-On Revenue</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-purple-300">₹{addOnRevenue.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[11px] text-purple-400 font-semibold mt-1">
            PT & Whey Protein sales
          </span>
        </div>
      </div>

      {/* Configurable No-Show Threshold Control Bar */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-white">
            Silent Churn Threshold: <strong className="text-orange-400">{thresholdInput} Days Absent</strong>
          </h4>
          <p className="text-xs text-slate-300">
            Members absent for {thresholdInput} or more days are automatically flagged on the Red-List. Paused and expired members are excluded.
          </p>
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
          <span className="text-xs font-mono font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            {thresholdInput} Days
          </span>
        </div>
      </div>

      {/* Owner Module Tabs (Solid colors, no gradient text, no hover opacity fades) */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveOwnerTab('redlist')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeOwnerTab === 'redlist'
              ? 'bg-orange-600 text-white'
              : 'bg-[#111726] text-slate-200 hover:text-white border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Red-List Churn Board ({openNoShowCases.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveOwnerTab('renewals')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeOwnerTab === 'renewals'
              ? 'bg-orange-600 text-white'
              : 'bg-[#111726] text-slate-200 hover:text-white border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Renewal Pipeline ({renewalsDueList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveOwnerTab('inventory')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeOwnerTab === 'inventory'
              ? 'bg-orange-600 text-white'
              : 'bg-[#111726] text-slate-200 hover:text-white border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Add-On Stock and PT Sessions
        </button>

        <button
          type="button"
          onClick={() => setActiveOwnerTab('pauses')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeOwnerTab === 'pauses'
              ? 'bg-orange-600 text-white'
              : 'bg-[#111726] text-slate-200 hover:text-white border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Membership Pause Desk
        </button>

        <button
          type="button"
          onClick={() => setActiveOwnerTab('quality')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            activeOwnerTab === 'quality'
              ? 'bg-orange-600 text-white'
              : 'bg-[#111726] text-slate-200 hover:text-white border border-slate-800 hover:bg-slate-800'
          }`}
        >
          Data-Quality Radar
        </button>
      </div>

      {/* Active Tab View */}
      <div className="pt-1">
        {activeOwnerTab === 'redlist' && <OwnerRedList />}
        {activeOwnerTab === 'renewals' && <OwnerRenewalPipeline />}
        {activeOwnerTab === 'inventory' && <OwnerInventoryAddons />}
        {activeOwnerTab === 'pauses' && <OwnerPauseManager />}
        {activeOwnerTab === 'quality' && <OwnerDataQualityAlerts />}
      </div>

      {/* Daily Summary Modal */}
      {showDailySummaryModal && (
        <OwnerDailySummaryModal onClose={() => setShowDailySummaryModal(false)} />
      )}
    </div>
  );
}
