import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  Clock,
  QrCode,
  UserCheck,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function MemberAttendanceHistory({ onBack }) {
  const {
    activeMember,
    attendance,
    staff
  } = useGym();

  const memberAttendance = attendance.filter(a => a.memberId === activeMember.id);

  return (
    <div className="space-y-4 pb-6 text-slate-100">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h3 className="text-sm font-extrabold text-white">
          Attendance History
        </h3>
        <span className="text-xs text-slate-400">
          {memberAttendance.length} Total Visits
        </span>
      </div>

      {/* Summary Card (Solid dark, no glassmorphism) */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-300 block font-medium">Verified Turnstile Entries</span>
          <span className="text-2xl font-black text-white">{memberAttendance.length}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-300 block font-medium">Last Visit</span>
          <span className="text-xs font-mono font-bold text-amber-300">
            {activeMember.lastCheckIn
              ? new Date(activeMember.lastCheckIn).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'None'}
          </span>
        </div>
      </div>

      {/* Attendance List */}
      <div className="space-y-2.5">
        {memberAttendance.length === 0 ? (
          <div className="bg-[#111726] border border-slate-800 p-6 rounded-xl text-center text-slate-300 text-xs">
            No attendance recorded yet. Scan the entrance QR code at Karnataka Gym Devi Nagar to log your first workout!
          </div>
        ) : (
          memberAttendance.map(item => {
            const dateObj = new Date(item.checkInTime);
            const isAssisted = item.method === 'FRONT_DESK_ASSISTED';
            const verifier = staff.find(s => s.id === item.verifiedBy);

            return (
              <div
                key={item.id}
                className="bg-[#111726] border border-slate-800 p-3.5 rounded-xl flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isAssisted
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {isAssisted ? <UserCheck className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {isAssisted && (
                        <span className="text-[10px] bg-purple-900/60 text-purple-200 px-1.5 py-0.2 rounded font-semibold border border-purple-700">
                          Assisted Check-In
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>|</span>
                      <span>Verifier: {verifier ? verifier.name : item.verifiedBy}</span>
                    </div>

                    {item.assistedReason && (
                      <div className="text-[11px] text-amber-200 mt-1 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                        Reason: {item.assistedReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950 border border-emerald-800 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Logged
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
