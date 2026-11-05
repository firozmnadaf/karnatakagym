import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Phone,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export default function OwnerRedList() {
  const {
    members,
    noShowCases,
    followUps,
    staff,
    plans,
    recordFollowUpOutcome,
    removeMember,
    settings,
    runDailyNoShowScan
  } = useGym();

  const [selectedCase, setSelectedCase] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removalReason, setRemovalReason] = useState('Prolonged churn / Member request');
  const [outcomeForm, setOutcomeForm] = useState({
    channel: 'CALL',
    outcome: 'Will return',
    nextActionDate: '',
    notes: ''
  });
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState(null);

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

  const handleOpenOutcomeModal = (c) => {
    setSelectedCase(c);
    setOutcomeForm({
      channel: 'CALL',
      outcome: 'Will return',
      nextActionDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSubmitOutcome = (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    recordFollowUpOutcome({
      caseId: selectedCase.id,
      memberId: selectedCase.memberId,
      staffId: 'staff_1',
      channel: outcomeForm.channel,
      outcome: outcomeForm.outcome,
      nextActionDate: outcomeForm.nextActionDate || null,
      notes: outcomeForm.notes
    });

    setActionSuccessToast(`Follow-up outcome recorded: "${outcomeForm.outcome}"`);
    setSelectedCase(null);
    setTimeout(() => setActionSuccessToast(null), 3000);
  };

  const handleOpenWhatsApp = (member, absentDays, trainer) => {
    const text = encodeURIComponent(
      `Namaskara ${member.name}! We noticed you haven't visited Karnataka Gym Devi Nagar for the last ${absentDays} days. Coach ${trainer?.name || 'Kavita'} and our team want to check if everything is okay with your workout schedule. Let us know if you need slot adjustments or routine support!`
    );
    window.open(`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-4 text-slate-100">
      {/* Top Header & Scan Trigger (No badge above headline!) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111726] border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white">
              Silent Churn Intervention Board (Red-List)
            </h3>
            <span className="bg-rose-950 text-rose-300 border border-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {noShowCases.filter(c => c.status === 'OPEN').length} Urgent
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Flags members absent {settings?.noShowThresholdDays || 10} or more days. Automatically excludes paused, medical freeze, and expired passes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const res = runDailyNoShowScan();
            setActionSuccessToast(res.message);
            setTimeout(() => setActionSuccessToast(null), 3000);
          }}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run 6:00 AM Scan Now</span>
        </button>
      </div>

      {/* Success Notification */}
      {actionSuccessToast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{actionSuccessToast}</span>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111726] border border-slate-800 p-3 rounded-xl text-xs">
        <input
          type="text"
          placeholder="Search by member name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 flex-1 min-w-[200px]"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'OPEN', 'FOLLOWED_UP', 'RESOLVED_RETURNED'].map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All Cases' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Red-List Cards */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className="bg-[#111726] border border-slate-800 p-8 rounded-xl text-center text-slate-300 text-xs">
            No churn risk cases matching current filter. Great attendance!
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
                className={`bg-[#0e1422] border rounded-xl p-3 transition-all space-y-2.5 ${
                  c.status === 'OPEN'
                    ? 'border-l-4 border-l-rose-500 border-slate-800 hover:border-slate-700'
                    : c.status === 'FOLLOWED_UP'
                    ? 'border-l-4 border-l-amber-500 border-slate-800 hover:border-slate-700'
                    : 'border-l-4 border-l-emerald-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Compact Header: Avatar + Identity + Threat Pill */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                        width={36}
                        height={36}
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0e1422] ${
                          c.status === 'OPEN'
                            ? 'bg-rose-500 animate-pulse'
                            : c.status === 'FOLLOWED_UP'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white truncate">{member.name}</h4>
                        <a
                          href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                          className="text-[11px] text-orange-400 hover:text-orange-300 font-mono underline font-medium"
                          title="Call member directly"
                        >
                          {member.phone}
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                        <span className="text-amber-400 font-semibold">{plan ? plan.name : 'Standard'}</span>
                        <span>&bull;</span>
                        <span>{member.preferredSlot}</span>
                        <span>&bull;</span>
                        <span>Exp: {member.membershipExpiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Threat Pill: Days Absent & Status */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                      {c.daysAbsent}d Absent
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        c.status === 'OPEN'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : c.status === 'FOLLOWED_UP'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Inline Telemetry Strip */}
                <div className="bg-[#080c14] border border-slate-800/80 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>Last visit: <strong className="text-white font-mono">{member.lastCheckIn ? new Date(member.lastCheckIn).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Never'}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Follow-up:</span>
                    {latestFollowUp ? (
                      <span className="text-amber-300 font-medium">
                        {latestFollowUp.outcome} ({new Date(latestFollowUp.loggedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No contact yet</span>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-500 hidden sm:inline">
                    {c.historyNotes}
                  </div>
                </div>

                {/* Compact Tactical Action Bar */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="text-[10px] text-slate-500 truncate hidden xs:block">
                    {c.historyNotes}
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Call */}
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-3 h-3 text-orange-400" />
                      <span>Call</span>
                    </a>

                    {/* WhatsApp */}
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(member, c.daysAbsent, trainer)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Send WhatsApp Nudge"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp Nudge</span>
                    </button>

                    {/* Mark Outcome */}
                    <button
                      type="button"
                      onClick={() => handleOpenOutcomeModal(c)}
                      className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <span>Mark Outcome</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {/* Remove Member */}
                    <button
                      type="button"
                      onClick={() => setMemberToRemove(member)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900 transition-colors"
                      title="Remove member profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Follow-Up Outcome Recording Modal (Solid dark, no glassmorphism) */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-white">Record Member Follow-Up</h4>
                <p className="text-xs text-slate-300">
                  Case #{selectedCase.id} - Karnataka Gym Member Care
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOutcome} className="space-y-3.5">
              {/* Channel */}
              <div>
                <label className="text-slate-200 font-bold block mb-1">Contact Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CALL', 'WHATSAPP', 'IN_PERSON'].map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setOutcomeForm(prev => ({ ...prev, channel: ch }))}
                      className={`py-2 rounded-xl border font-bold transition-colors ${
                        outcomeForm.channel === ch
                          ? 'bg-orange-600 text-white border-orange-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800'
                      }`}
                    >
                      {ch.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mandatory Outcomes as specified in prompt */}
              <div>
                <label className="text-slate-200 font-bold block mb-1">
                  Follow-Up Outcome <span className="text-rose-400">*</span>
                </label>
                <select
                  value={outcomeForm.outcome}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, outcome: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
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
                <label className="text-slate-200 font-bold block mb-1">
                  Next Action / Follow-Up Date
                </label>
                <input
                  type="date"
                  value={outcomeForm.nextActionDate}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, nextActionDate: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Notes (No placeholder text) */}
              <div>
                <label className="text-slate-200 font-bold block mb-1">
                  Conversation Notes and Resolution Plan
                </label>
                <textarea
                  rows={3}
                  value={outcomeForm.notes}
                  onChange={(e) => setOutcomeForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                  required
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-5 py-2 rounded-xl transition-colors"
                >
                  Save Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-rose-800/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs text-slate-100">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-base font-extrabold text-white">Remove Member Profile</h4>
            </div>

            <div className="bg-[#0b0f17] p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-white text-sm">{memberToRemove.name}</div>
              <div className="text-slate-300 font-mono">{memberToRemove.phone}</div>
              <div className="text-slate-400">Member ID: {memberToRemove.id}</div>
            </div>

            <p className="text-slate-300">
              Are you sure you want to remove this member from Karnataka Gym records? This will delete their profile and close any open churn cases.
            </p>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Reason for Removal:</label>
              <select
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Prolonged churn / Discontinued">Prolonged churn / Discontinued</option>
                <option value="Relocated away from Hubli">Relocated away from Hubli</option>
                <option value="Requested profile removal">Requested profile removal</option>
                <option value="Medical condition / Inactive">Medical condition / Inactive</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = removeMember(memberToRemove.id, removalReason);
                  if (res.success) {
                    setActionSuccessToast(res.message);
                    setTimeout(() => setActionSuccessToast(null), 3000);
                  }
                  setMemberToRemove(null);
                }}
                className="px-4 py-2 rounded-xl text-white bg-rose-700 hover:bg-rose-600 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
