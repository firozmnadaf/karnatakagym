import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Users,
  QrCode,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Clock,
  IndianRupee,
  ShoppingBag,
  X,
  Phone,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

export default function OwnerKpiDetailModal({ initialKpi, onClose, onNavigateTab }) {
  const {
    members,
    attendance,
    noShowCases,
    followUps,
    payments,
    addOns,
    addOnOrders,
    plans,
    staff,
    settings,
    processCheckIn,
    recordFollowUpOutcome
  } = useGym();

  const [activeKpi, setActiveKpi] = useState(initialKpi || 'active_members');
  const [searchTerm, setSearchTerm] = useState('');
  const [assistedMemberId, setAssistedMemberId] = useState('');
  const [assistedReason, setAssistedReason] = useState('Member forgot phone at home');
  const [assistedSuccessToast, setAssistedSuccessToast] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const activeMembers = members.filter(m => m.status === 'active');
  const todayCheckIns = attendance.filter(a => a.checkInTime.startsWith(todayStr));

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const sevenDayActiveMembers = members.filter(m => {
    return attendance.some(a => a.memberId === m.id && new Date(a.checkInTime) >= sevenDaysAgo);
  });

  const openNoShowCases = noShowCases.filter(c => c.status === 'OPEN');
  const returnedMembers = noShowCases.filter(c => c.status === 'RESOLVED_RETURNED');

  const renewalsDueList = members.filter(m => {
    if (m.status !== 'active') return false;
    const diff = Math.ceil((new Date(m.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  });

  const renewalPayments = payments.filter(p => p.status === 'PAID' && p.orderId.startsWith('ord_ren_'));
  const renewalCollection = renewalPayments.reduce((sum, p) => sum + p.amount, 0);

  const addOnPayments = payments.filter(p => p.status === 'PAID' && p.orderId.startsWith('ord_add_'));
  const addOnRevenue = addOnPayments.reduce((sum, p) => sum + p.amount, 0);

  const kpiTabs = [
    { id: 'active_members', label: 'Active Members', count: activeMembers.length, icon: Users },
    { id: 'today_checkins', label: "Today's Check-Ins", count: todayCheckIns.length, icon: QrCode },
    { id: 'seven_day_active', label: '7-Day Active', count: sevenDayActiveMembers.length, icon: Calendar },
    { id: 'open_churn_risks', label: 'Open Churn Risks', count: openNoShowCases.length, icon: AlertTriangle },
    { id: 'returned_members', label: 'Returned Members', count: returnedMembers.length, icon: RotateCcw },
    { id: 'renewals_due', label: 'Renewals Due (7D)', count: renewalsDueList.length, icon: Clock },
    { id: 'renewal_revenue', label: 'Renewal Revenue', count: `₹${renewalCollection.toLocaleString('en-IN')}`, icon: IndianRupee },
    { id: 'addon_revenue', label: 'Add-On Revenue', count: `₹${addOnRevenue.toLocaleString('en-IN')}`, icon: ShoppingBag }
  ];

  const handleQuickAssistedCheckIn = (e) => {
    e.preventDefault();
    if (!assistedMemberId) return;

    const res = processCheckIn({
      memberId: assistedMemberId,
      method: 'ASSISTED_TURNSTILE',
      assistedReason,
      staffId: 'staff_1'
    });

    if (res.success) {
      setAssistedSuccessToast(res.message);
      setAssistedMemberId('');
      setTimeout(() => setAssistedSuccessToast(null), 3500);
    }
  };

  const handleOpenWhatsApp = (member, absentDays) => {
    const text = encodeURIComponent(
      `Namaskara ${member.name}! We noticed you haven't visited Karnataka Gym Devi Nagar for the last ${absentDays} days. Our team wants to check if everything is okay with your workout routine. Let us know if you need slot adjustments or trainer guidance!`
    );
    window.open(`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
      <div className="bg-[#101625] border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-xs text-slate-100 my-auto overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 md:px-6 bg-[#0c111c] shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-white">
              Executive KPI Intelligence Desk
            </h3>
            <p className="text-xs text-slate-300">
              Karnataka Gym Hubli - Complete breakdown and audit records
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Card Quick Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-[#0e1422] border-b border-slate-800 overflow-x-auto shrink-0">
          {kpiTabs.map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeKpi === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveKpi(tab.id);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-orange-600 text-white'
                    : 'bg-[#141b2c] text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isCurrent ? 'bg-orange-700 text-white' : 'bg-slate-900 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Scrollable Details */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Toast Notification */}
          {assistedSuccessToast && (
            <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{assistedSuccessToast}</span>
            </div>
          )}

          {/* 1. ACTIVE MEMBERS DEDICATED INFO VIEW */}
          {activeKpi === 'active_members' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active</span>
                  <span className="text-xl font-black text-white">{activeMembers.length}</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">Hubli regular residents</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Paused Members</span>
                  <span className="text-xl font-black text-amber-300">{members.filter(m => m.status === 'paused').length}</span>
                  <span className="text-[11px] text-amber-400 block mt-0.5">Medical & travel holds</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Women Enrolled</span>
                  <span className="text-xl font-black text-cyan-300">{members.filter(m => m.gender === 'Female').length}</span>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">Safe environment program</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expired Passes</span>
                  <span className="text-xl font-black text-rose-300">{members.filter(m => m.status === 'expired').length}</span>
                  <span className="text-[11px] text-rose-400 block mt-0.5">Turnstile locked out</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter active members by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Members Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f17]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141b2c] text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                      <th className="p-3">Member</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Slot</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Mentor</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {activeMembers
                      .filter(m => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm))
                      .map(m => {
                        const plan = plans.find(p => p.id === m.planId);
                        const trainer = staff.find(s => s.id === m.assignedTrainerId);
                        return (
                          <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3 font-semibold text-white flex items-center gap-2">
                              <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                              <span>{m.name}</span>
                            </td>
                            <td className="p-3 font-mono">
                              <a href={`tel:${m.phone}`} className="text-orange-400 hover:text-white underline">
                                {m.phone}
                              </a>
                            </td>
                            <td className="p-3 text-amber-300">{plan ? plan.name : 'Standard'}</td>
                            <td className="p-3 text-slate-300">{m.preferredSlot}</td>
                            <td className="p-3 font-mono text-emerald-400">{m.membershipExpiry}</td>
                            <td className="p-3 text-slate-300">{trainer ? trainer.name : 'Floor Staff'}</td>
                            <td className="p-3 text-right">
                              <a
                                href={`tel:${m.phone}`}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-orange-400" /> Call
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. TODAY'S CHECK-INS DEDICATED INFO VIEW */}
          {activeKpi === 'today_checkins' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Visits</span>
                  <span className="text-xl font-black text-white">{todayCheckIns.length}</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">Turnstile entries logged</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Turnstile QR Scans</span>
                  <span className="text-xl font-black text-cyan-300">
                    {todayCheckIns.filter(a => a.method === 'MEMBER_QR').length}
                  </span>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">Mobile self-scanned</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assisted Turnstile</span>
                  <span className="text-xl font-black text-amber-300">
                    {todayCheckIns.filter(a => a.method === 'ASSISTED_TURNSTILE').length}
                  </span>
                  <span className="text-[11px] text-amber-400 block mt-0.5">Front desk audit recorded</span>
                </div>
              </div>

              {/* Quick Assisted Check-in Bar for Owner */}
              <form onSubmit={handleQuickAssistedCheckIn} className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-orange-400" />
                  <span>Perform Assisted Check-In Right Now</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    value={assistedMemberId}
                    onChange={(e) => setAssistedMemberId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                    required
                  >
                    <option value="">Select Member to Check In...</option>
                    {activeMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={assistedReason}
                    onChange={(e) => setAssistedReason(e.target.value)}
                    placeholder="Mandatory check-in reason..."
                    className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-500"
                    required
                  />

                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Check In & Unlock Turnstile</span>
                  </button>
                </div>
              </form>

              {/* Check-ins Log */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f17]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141b2c] text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                      <th className="p-3">Member</th>
                      <th className="p-3">Check-In Time</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Streak Updated</th>
                      <th className="p-3">Terminal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {todayCheckIns.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">
                          No check-ins logged yet today. Use the assisted check-in form above or scan turnstile QR.
                        </td>
                      </tr>
                    ) : (
                      todayCheckIns.map(a => {
                        const m = members.find(mem => mem.id === a.memberId);
                        return (
                          <tr key={a.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3 font-semibold text-white">
                              {m ? m.name : a.memberId}
                            </td>
                            <td className="p-3 font-mono text-emerald-400">
                              {new Date(a.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3">
                              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                                {a.method}
                              </span>
                            </td>
                            <td className="p-3 text-orange-400 font-bold font-mono">
                              +{a.streakDays} Days
                            </td>
                            <td className="p-3 text-slate-400">{a.terminal || 'DeviNagar-HQ'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. 7-DAY ACTIVE RETENTION VIEW */}
          {activeKpi === 'seven_day_active' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">7-Day Active Members</span>
                  <span className="text-xl font-black text-cyan-300">{sevenDayActiveMembers.length}</span>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">Visited within past week</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weekly Retention Rate</span>
                  <span className="text-xl font-black text-emerald-400">
                    {Math.round((sevenDayActiveMembers.length / (activeMembers.length || 1)) * 100)}%
                  </span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">High community engagement</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Hubli Gym Rating</span>
                  <span className="text-xl font-black text-amber-300">4.9 / 5.0</span>
                  <span className="text-[11px] text-amber-400 block mt-0.5">642 verified reviews</span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f17]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141b2c] text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                      <th className="p-3">Member</th>
                      <th className="p-3">Weekly Goal</th>
                      <th className="p-3">Last Check-In</th>
                      <th className="p-3">Slot</th>
                      <th className="p-3 text-right">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {sevenDayActiveMembers.map(m => (
                      <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                          <span>{m.name}</span>
                        </td>
                        <td className="p-3 text-emerald-400 font-bold">4 / 4 visits target</td>
                        <td className="p-3 font-mono text-slate-300">
                          {m.lastCheckIn ? new Date(m.lastCheckIn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Recent'}
                        </td>
                        <td className="p-3 text-slate-300">{m.preferredSlot}</td>
                        <td className="p-3 text-right">
                          <a
                            href={`tel:${m.phone}`}
                            className="bg-slate-800 hover:bg-slate-700 text-orange-400 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono inline-block"
                          >
                            {m.phone}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. OPEN CHURN RISKS DEDICATED VIEW */}
          {activeKpi === 'open_churn_risks' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#191016] border border-rose-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-rose-300 block">Critical Churn Cases</span>
                  <span className="text-xl font-black text-rose-200">{openNoShowCases.length} Members</span>
                  <span className="text-[11px] text-rose-300 block mt-0.5">Absent 10+ days without pause</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Configured Threshold</span>
                  <span className="text-xl font-black text-orange-400">{settings?.noShowThresholdDays || 10} Days</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Automated 6:00 AM scan</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Action Target</span>
                  <span className="text-xl font-black text-emerald-400">100% Reachout</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">WhatsApp / Phone interventions</span>
                </div>
              </div>

              {/* Churn Cards */}
              <div className="space-y-2.5">
                {openNoShowCases.map(c => {
                  const m = members.find(mem => mem.id === c.memberId);
                  if (!m) return null;
                  const trainer = staff.find(s => s.id === m.assignedTrainerId);

                  return (
                    <div key={c.id} className="bg-[#0b0f17] border border-rose-900/60 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-rose-700" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{m.name}</span>
                            <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              {c.daysAbsent} Days Absent
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-orange-400">{m.phone}</span>
                            <span>|</span>
                            <span>Mentor: {trainer ? trainer.name : 'Coach Kavita'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${m.phone}`}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-orange-400" />
                          <span>Call</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(m, c.daysAbsent)}
                          className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>WhatsApp Nudge</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. RETURNED MEMBERS VIEW */}
          {activeKpi === 'returned_members' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Returned Members</span>
                  <span className="text-xl font-black text-emerald-400">{returnedMembers.length} Members</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">Auto-resolved on turnstile check-in</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Silent Churn Recovery</span>
                  <span className="text-xl font-black text-white">100% Automated</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Closes case when member returns</span>
                </div>
              </div>

              <div className="bg-[#0b0f17] border border-slate-800 p-6 rounded-xl text-center space-y-2 text-slate-300">
                <RotateCcw className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">How Returned Members Work</h4>
                <p className="max-w-md mx-auto text-xs text-slate-400 leading-relaxed">
                  When an absent member returns to Karnataka Gym and scans their turnstile QR code, the system automatically marks their red-list churn case as <strong className="text-emerald-400 font-mono">RESOLVED_RETURNED</strong> and resets their fair attendance streak without manual owner intervention.
                </p>
              </div>
            </div>
          )}

          {/* 6. RENEWALS DUE (7D) VIEW */}
          {activeKpi === 'renewals_due' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiring This Week</span>
                  <span className="text-xl font-black text-amber-300">{renewalsDueList.length} Members</span>
                  <span className="text-[11px] text-amber-400 block mt-0.5">Within 7-day renewal window</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Automated Reminders</span>
                  <span className="text-xl font-black text-white">14d, 7d, 3d, 0d</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">WhatsApp & SMS alerts</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Retention Rate</span>
                  <span className="text-xl font-black text-emerald-400">85%+ Target</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">Hubli community renewals</span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f17]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141b2c] text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                      <th className="p-3">Member</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Current Plan</th>
                      <th className="p-3">Expiry Date</th>
                      <th className="p-3">Days Remaining</th>
                      <th className="p-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {renewalsDueList.map(m => {
                      const plan = plans.find(p => p.id === m.planId);
                      const diff = Math.ceil((new Date(m.membershipExpiry) - new Date()) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3 font-semibold text-white flex items-center gap-2">
                            <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                            <span>{m.name}</span>
                          </td>
                          <td className="p-3 font-mono text-orange-400">{m.phone}</td>
                          <td className="p-3 text-slate-300">{plan ? plan.name : 'Standard'}</td>
                          <td className="p-3 font-mono text-amber-300">{m.membershipExpiry}</td>
                          <td className="p-3 font-bold text-amber-400">{diff} Days Left</td>
                          <td className="p-3 text-right">
                            <a
                              href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaskara ${m.name}! Your Karnataka Gym membership expires on ${m.membershipExpiry}. Renew early via UPI (feroznadaf13008@ybl) to maintain your workout streak!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" /> Remind
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. RENEWAL REVENUE DEDICATED VIEW */}
          {activeKpi === 'renewal_revenue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Renewal Revenue</span>
                  <span className="text-xl font-black text-emerald-400">₹{renewalCollection.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">Verified provider receipts</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Receiving UPI ID</span>
                  <span className="text-sm font-black text-white font-mono">feroznadaf13008@ybl</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Karnataka Gym Fitness Centre</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Transactions</span>
                  <span className="text-xl font-black text-cyan-300">{renewalPayments.length} Receipts</span>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">Zero unverified extensions</span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f17]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141b2c] text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                      <th className="p-3">Receipt #</th>
                      <th className="p-3">Member</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Gateway Reference</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {renewalPayments.map(p => {
                      const m = members.find(mem => mem.id === p.memberId);
                      return (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3 font-mono text-slate-300">{p.receiptNumber}</td>
                          <td className="p-3 font-semibold text-white">{m ? m.name : p.memberId}</td>
                          <td className="p-3 font-black text-emerald-400">₹{p.amount.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-slate-300">{p.method}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-400">{p.gatewayReference || 'upi_verified'}</td>
                          <td className="p-3">
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                              PAID
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. ADD-ON REVENUE DEDICATED VIEW */}
          {activeKpi === 'addon_revenue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Add-On Revenue</span>
                  <span className="text-xl font-black text-purple-300">₹{addOnRevenue.toLocaleString('en-IN')}</span>
                  <span className="text-[11px] text-purple-400 block mt-0.5">PT, Diet & Supplements</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Marketplace Orders</span>
                  <span className="text-xl font-black text-white">{addOnOrders.length} Orders</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Zero pre-selected items</span>
                </div>
                <div className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Receiving UPI</span>
                  <span className="text-sm font-black text-white font-mono">feroznadaf13008@ybl</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Pre-filled checkout</span>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0b0f17]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#141b2c] text-slate-300 font-bold border-b border-slate-800 text-[11px]">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Member</th>
                      <th className="p-3">Item Purchased</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Fulfillment Status</th>
                      <th className="p-3">Ordered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {addOnOrders.map(o => {
                      const m = members.find(mem => mem.id === o.memberId);
                      const item = addOns.find(a => a.id === o.addOnId);
                      return (
                        <tr key={o.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-3 font-mono text-slate-400">{o.id}</td>
                          <td className="p-3 font-semibold text-white">{m ? m.name : o.memberId}</td>
                          <td className="p-3 text-slate-200">{item ? item.title : o.addOnId}</td>
                          <td className="p-3 font-black text-purple-300">₹{o.amountPaid.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              {o.fulfillmentStatus}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono">
                            {new Date(o.orderedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 md:px-6 bg-[#0c111c] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Karnataka Gym Hubli - Devi Nagar - 580031</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Close Info Page
          </button>
        </div>
      </div>
    </div>
  );
}

