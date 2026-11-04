import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  AlertTriangle,
  Phone,
  MessageCircle,
  CheckCircle2,
  Calendar,
  User,
  Clock,
  Filter,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function OwnerRedList() {
  const {
    members,
    noShowCases,
    followUps,
    staff,
    plans,
    recordFollowUpOutcome,
    settings,
    runDailyNoShowScan
  } = useGym();

  const [selectedCase, setSelectedCase] = useState(null); // case being followed up
  const [outcomeForm, setOutcomeForm] = useState({
    channel: 'CALL',
    outcome: 'Will return',
    nextActionDate: '',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'OPEN' | 'FOLLOWED_UP' | 'RESOLVED_RETURNED'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState(null);

  // Filter cases
  const filteredCases = noShowCases.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    const member = members.find(m => m.id === c.memberId);
    if (!member) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        member.phone.includes(q) ||
        member.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Open modal to log follow-up
  const handleOpenOutcomeModal = (c) => {
    setSelectedCase(c);
    setOutcomeForm({
      channel: 'CALL',
      outcome: 'Will return',
      nextActionDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: ''
    });
  };

  // Submit follow-up outcome
  const handleSubmitOutcome = (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    recordFollowUpOutcome({
      caseId: selectedCase.id,
      memberId: selectedCase.memberId,
      staffId: 'staff_1', // Owner or assigned trainer
      channel: outcomeForm.channel,
      outcome: outcomeForm.outcome,
      nextActionDate: outcomeForm.nextActionDate || null,
      notes: outcomeForm.notes
    });

    setActionSuccessToast(`Follow-up outcome recorded: "${outcomeForm.outcome}"`);
    setSelectedCase(null);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  // Generate Hubli WhatsApp Template
  const handleOpenWhatsApp = (member, absentDays, trainer) => {
    const text = encodeURIComponent(
      `Namaskara ${member.name}! We noticed you haven't visited Karnataka Gym Devi Nagar for the last ${absentDays} days. Coach ${trainer?.name || 'Kavita'} and our team want to check if everything is okay with your workout routine? Let us know if you need slot adjustments or training support!`
    );
    window.open(`https://api.whatsapp.com/send?phone=${member.phone.replace(/[^0-9]/g, '')}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header & Scanning Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Silent Churn Intervention Board (Red-List)
            </h3>
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {noShowCases.filter(c => c.status === 'OPEN').length} Urgent Cases
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detects members absent ≥ {settings.noShowThresholdDays} days. Automatically excludes paused, frozen and expired passes.
          </p>
        </div>

        <button
          onClick={() => {
            const res = runDailyNoShowScan();
            setActionSuccessToast(res.message);
            setTimeout(() => setActionSuccessToast(null), 3000);
          }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow shrink-0 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run 6:00 AM Scan Now</span>
        </button>
      </div>

      {/* Success Toast */}
      {actionSuccessToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 p-3 rounded-2xl text-xs">
        <input
          type="text"
          placeholder="Search by member name, phone or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 flex-1 min-w-[200px]"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'OPEN', 'FOLLOWED_UP', 'RESOLVED_RETURNED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-orange-500 text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All Cases' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Red-List Cards / Rows */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs">
            No churn risk cases matching current filter. Great retention!
          </div>
        ) : (
          filteredCases.map(c => {
            const member = members.find(m => m.id === c.memberId);
            if (!member) return null;

            const plan = plans.find(p => p.id === member.planId);
            const trainer = staff.find(s => s.id === (member.assignedTrainerId || c.assignedTrainerId));
            const caseFollowUps = followUps.filter(f => f.caseId === c.id);
            const latestFollowUp = caseFollowUps[0];

            return (
              <div
                key={c.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all space-y-3 shadow-md"
              >
                {/* Top Row: Member Bio, Absent Days Pill, Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-white">{member.name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{member.phone}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400 font-semibold">{plan ? plan.name : 'Standard'}</span>
                        <span>•</span>
                        <span>Expires: {member.membershipExpiry}</span>
                        <span>•</span>
                        <span>Slot: {member.preferredSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Absent Days Badge & Case Status */}
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-xl text-center">
                      <span className="text-[10px] uppercase font-bold text-rose-400 block">Absent</span>
                      <span className="text-sm font-black text-rose-300">{c.daysAbsent} Days</span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                      c.status === 'OPEN'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : c.status === 'FOLLOWED_UP'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Last Check-In, Trainer, Past Follow-Up */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Last Check-In</span>
                    <strong className="text-white">
                      {member.lastCheckIn
                        ? new Date(member.lastCheckIn).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'Never'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Assigned Hubli Mentor</span>
                    <strong className="text-orange-400">{trainer ? trainer.name : 'General Floor'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Latest Follow-Up</span>
                    {latestFollowUp ? (
                      <span className="text-amber-300">
                        {latestFollowUp.outcome} ({new Date(latestFollowUp.loggedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No contact yet</span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Actions (Call, WhatsApp, Mark Outcome) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    {c.historyNotes}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Call Action */}
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp Action with Hubli Template */}
                    <button
                      onClick={() => handleOpenWhatsApp(member, c.daysAbsent, trainer)}
                      className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Send WhatsApp Nudge"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Nudge</span>
                    </button>

                    {/* Mark Outcome Modal Trigger */}
                    <button
                      onClick={() => handleOpenOutcomeModal(c)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95"
                    >
                      <span>Mark Outcome</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Follow-Up Outcome Recording Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-white">Record Member Follow-Up</h4>
                <p className="text-xs text-slate-400">
                  Case #{selectedCase.id} • Karnataka Gym Member Care
                </p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOutcome} className="space-y-3.5 text-xs">
              {/* Channel */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">Contact Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CALL', 'WHATSAPP', 'IN_PERSON'].map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setOutcomeForm(prev => ({ ...prev, channel: ch }))}
                      className={`py-2 rounded-xl border font-bold ${
                        outcomeForm.channel === ch
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {ch.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Outcomes as specified in prompt */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Follow-Up Outcome <span className="text-rose-400">*</span>
                </label>
                <select
                  value={outcomeForm.outcome}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, outcome: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="Will return">Will return</option>
                  <option value="Injured">Injured</option>
                  <option value="Travelling">Travelling</option>
                  <option value="Timing issue">Timing issue</option>
                  <option value="Unhappy">Unhappy</option>
                  <option value="No response">No response</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Next Action Date */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Next Action / Follow-Up Date
                </label>
                <input
                  type="date"
                  value={outcomeForm.nextActionDate}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, nextActionDate: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Conversation Notes & Member Reason
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Member had back strain, suggested recovery stretching with Coach Vijay on Saturday..."
                  value={outcomeForm.notes}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black px-5 py-2 rounded-xl shadow"
                >
                  Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

