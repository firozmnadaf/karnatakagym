import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  Calendar,
  Flame,
  Award,
  Clock,
  QrCode,
  Shield,
  CheckCircle,
  ShoppingBag,
  ChevronRight,
  Phone
} from 'lucide-react';

export default function MemberHome({ onNavigate }) {
  const {
    activeMember,
    activeMemberPlan,
    activeMemberStreak,
    attendance
  } = useGym();

  const today = new Date();
  const expiryDate = new Date(activeMember.membershipExpiry);
  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
  const isExpired = diffDays < 0 || activeMember.status === 'expired';
  const isPaused = activeMember.status === 'paused';

  const memberCheckIns = attendance.filter(a => a.memberId === activeMember.id);

  return (
    <div className="space-y-4 pb-6 text-slate-100">
      {/* Top Welcome Card */}
      <div className="flex items-center justify-between gap-3 bg-[#111726] border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <img
            src={activeMember.avatar}
            alt={activeMember.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
            width={48}
            height={48}
          />
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {activeMember.name}
            </h2>
            <div className="text-xs text-slate-300 mt-0.5">
              Slot: {activeMember.preferredSlot}
            </div>
            <div className="text-[11px] text-slate-400">
              Phone: <a href={`tel:${activeMember.phone}`} className="text-orange-400 hover:text-white font-mono">{activeMember.phone}</a>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isPaused ? (
            <span className="bg-amber-950 text-amber-300 border border-amber-600 px-3 py-1 rounded-full text-xs font-bold">
              Medical Pause
            </span>
          ) : isExpired ? (
            <span className="bg-rose-950 text-rose-300 border border-rose-600 px-3 py-1 rounded-full text-xs font-bold">
              Expired
            </span>
          ) : isExpiringSoon ? (
            <span className="bg-orange-950 text-orange-300 border border-orange-600 px-3 py-1 rounded-full text-xs font-bold">
              {diffDays} Days Left
            </span>
          ) : (
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
              Active Member
            </span>
          )}
        </div>
      </div>

      {/* Urgent Renewal Callout if Expiring Soon */}
      {isExpiringSoon && (
        <div className="bg-[#1c140e] border border-orange-600 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              Renewal Notice: {diffDays} {diffDays === 1 ? 'Day' : 'Days'} Remaining ({activeMember.membershipExpiry})
            </h3>
            <p className="text-xs text-slate-300">
              Renew early to lock in your Hubli member rate and maintain your fair attendance streak.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('renewal')}
            className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            Renew Now
          </button>
        </div>
      )}

      {/* Expired Callout */}
      {isExpired && (
        <div className="bg-[#1f0f13] border border-rose-600 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-200">
              Membership Expired on {activeMember.membershipExpiry}
            </h3>
            <p className="text-xs text-slate-300">
              Turnstile access is temporarily paused. Re-activate below for immediate entry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('renewal')}
            className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            Re-Activate Pass
          </button>
        </div>
      )}

      {/* Hero QR Check-In Action (No badge above headline!) */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl shadow-lg space-y-3">
        <h3 className="text-lg font-extrabold text-white">
          Turnstile QR Check-In
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          Scan the rotating session code displayed at the entrance desk of Karnataka Gym Devi Nagar. Check-ins automatically update your fair streak.
        </p>

        <button
          type="button"
          onClick={() => onNavigate('qr_scanner')}
          className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <QrCode className="w-5 h-5" />
          <span>Open Turnstile QR Scanner</span>
        </button>
      </div>

      {/* Fair Streak & Weekly Goal Grid (2 Columns, Not 3 Icon Boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Fair Streak Card */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fair Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {activeMemberStreak.currentStreakDays}
            </span>
            <span className="text-xs text-slate-300 font-semibold">Consecutive Days</span>
          </div>
          <div className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>Scheduled rest days and medical pauses protected.</span>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Weekly Attendance</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {activeMemberStreak.weeklyVisitsCompleted || 3}
            </span>
            <span className="text-xs text-slate-300 font-semibold">/ {activeMemberStreak.weeklyGoalDays || 4} Target Visits</span>
          </div>
          {/* Solid Progress Bar (No purple-to-blue gradient) */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (((activeMemberStreak.weeklyVisitsCompleted || 3) / (activeMemberStreak.weeklyGoalDays || 4)) * 100))}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Active Membership Details Card */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-white">
            Current Membership Pass
          </h4>
          <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-200">
            {activeMember.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-orange-400">
              {activeMemberPlan ? activeMemberPlan.name : 'Standard Access'}
            </div>
            <div className="text-xs text-slate-300">
              Valid until: <strong className="text-white">{activeMember.membershipExpiry}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('renewal')}
            className="text-xs text-white bg-slate-800 hover:bg-slate-700 font-bold px-3 py-2 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-1 self-start sm:self-auto"
          >
            <span>Upgrade / Renew</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Benefits Checklist */}
        <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Cardio and Heavy Weights Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Safe Women Dedicated Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Locker and Shower Access</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Weekend Steam and Sauna</span>
          </div>
        </div>
      </div>

      {/* Two Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onNavigate('attendance')}
          className="bg-[#111726] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center gap-3 text-left transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Attendance Log</div>
            <div className="text-[11px] text-slate-400">{memberCheckIns.length} recorded turnstile visits</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('addons')}
          className="bg-[#111726] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center gap-3 text-left transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-orange-400 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">PT and Supplements</div>
            <div className="text-[11px] text-slate-400">Coach Kavita & ON Gold Standard Whey</div>
          </div>
        </button>
      </div>

      {/* Women Safe Space Notice (Solid dark, no gradient or glassmorphism) */}
      <div className="bg-[#141b29] border border-slate-800 p-4 rounded-2xl space-y-1">
        <h4 className="text-xs font-bold text-white">
          Safe and Inclusive Workout Space for Women
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          Dedicated morning batch (10:30 AM - 1:00 PM) mentored by Coach Kavita Kalburgi with private lockers and full biometric turnstile access. For inquiries, call{' '}
          <a href="tel:+919663396058" className="text-orange-400 hover:text-white font-bold underline">
            +91 96633 96058
          </a>.
        </p>
      </div>
    </div>
  );
}
