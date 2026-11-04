import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  Calendar,
  Clock,
  QrCode,
  UserCheck,
  ShieldCheck,
  Flame,
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
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
          Attendance History
        </span>
        <span className="text-xs text-slate-400">
          {memberAttendance.length} Total Visits
        </span>
      </div>

      {/* Summary card */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block">Verified Check-Ins</span>
          <span className="text-2xl font-black text-white">{memberAttendance.length}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block">Last Check-In</span>
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
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl text-center text-slate-400 text-xs">
            No attendance recorded yet. Scan the gym entrance QR code to register your first workout!
          </div>
        ) : (
          memberAttendance.map(item => {
            const dateObj = new Date(item.checkInTime);
            const isAssisted = item.method === 'FRONT_DESK_ASSISTED';
            const verifier = staff.find(s => s.id === item.verifiedBy);

            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-2xl flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isAssisted
                      ? 'bg-purple-500/15 text-purple-400'
                      : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {isAssisted ? <UserCheck className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>{dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {isAssisted && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-semibold">
                          Assisted Entry
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>•</span>
                      <span>Verified: {verifier ? verifier.name : item.verifiedBy}</span>
                    </div>

                    {item.assistedReason && (
                      <div className="text-[11px] text-amber-300/80 mt-1 bg-amber-500/10 px-2 py-0.5 rounded">
                        Note: {item.assistedReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">
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

