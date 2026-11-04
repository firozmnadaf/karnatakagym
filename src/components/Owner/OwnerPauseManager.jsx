import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  CheckCircle,
  Plus
} from 'lucide-react';

export default function OwnerPauseManager() {
  const {
    members,
    toggleMembershipPause
  } = useGym();

  const [selectedMemberId, setSelectedMemberId] = useState('mem_01');
  const [pauseReason, setPauseReason] = useState('Doctor advised rest for muscle strain. Medical certificate on file.');
  const [pauseDays, setPauseDays] = useState(14);
  const [toast, setToast] = useState(null);

  const pausedMembers = members.filter(m => m.status === 'paused');

  const handleApprovePause = (e) => {
    e.preventDefault();
    const res = toggleMembershipPause({
      memberId: selectedMemberId,
      reason: pauseReason,
      days: parseInt(pauseDays, 10),
      isApproved: true
    });

    setToast(res.message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleResumeMembership = (memberId) => {
    const res = toggleMembershipPause({
      memberId,
      isApproved: false
    });
    setToast(res.message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner (No badge above headline!) */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl space-y-1">
        <h3 className="text-sm font-extrabold text-white">
          Membership Pause and Medical Freeze Desk
        </h3>
        <p className="text-slate-300">
          Approved pauses safeguard the member's fair streak and automatically exclude them from silent churn scans.
        </p>
      </div>

      {toast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Approve New Pause Form */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-orange-400" /> Grant Approved Membership Pause
        </h4>

        <form onSubmit={handleApprovePause} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-slate-200 font-bold block mb-1">Select Member</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
            >
              {members.filter(m => m.status === 'active').map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-200 font-bold block mb-1">Pause Duration</label>
            <select
              value={pauseDays}
              onChange={(e) => setPauseDays(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="7">7 Days (Short Travel / Exam)</option>
              <option value="14">14 Days (Medical Rest / Sprain)</option>
              <option value="21">21 Days (Extended Tour)</option>
              <option value="30">30 Days (Maximum Freeze)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-200 font-bold block mb-1">Medical / Travel Reason</label>
            <input
              type="text"
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
            >
              Approve Freeze and Extend Expiry
            </button>
          </div>
        </form>
      </div>

      {/* Active Pauses Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
          Currently Paused Members ({pausedMembers.length})
        </h4>

        {pausedMembers.length === 0 ? (
          <div className="text-slate-400 p-4 text-center">No members currently on pause.</div>
        ) : (
          <div className="space-y-2">
            {pausedMembers.map(m => (
              <div
                key={m.id}
                className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-white text-sm">{m.name}</div>
                  <a href={`tel:${m.phone}`} className="text-orange-400 hover:text-white text-xs font-mono underline">
                    {m.phone}
                  </a>
                  <div className="text-amber-300 text-xs mt-0.5">
                    Reason: {m.pauseReason || 'Doctor rest certificate'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Freeze Window</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {m.pauseStart} to {m.pauseEnd}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResumeMembership(m.id)}
                    className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                  >
                    Resume Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
