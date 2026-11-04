import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  Calendar,
  Flame,
  Award,
  Clock,
  QrCode,
  Sparkles,
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle,
  Coffee,
  Heart,
  ChevronRight,
  Zap,
  ShoppingBag
} from 'lucide-react';

export default function MemberHome({ onNavigate }) {
  const {
    activeMember,
    activeMemberPlan,
    activeMemberStreak,
    settings,
    attendance
  } = useGym();

  // Expiry calculation
  const today = new Date();
  const expiryDate = new Date(activeMember.membershipExpiry);
  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
  const isExpired = diffDays < 0 || activeMember.status === 'expired';
  const isPaused = activeMember.status === 'paused';

  // Member's check-ins count this month
  const memberCheckIns = attendance.filter(a => a.memberId === activeMember.id);

  return (
    <div className="space-y-4 pb-6">
      {/* Top Welcome Banner */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <img
            src={activeMember.avatar}
            alt={activeMember.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/50"
          />
          <div>
            <div className="text-xs text-slate-400">Welcome Back,</div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              {activeMember.name}
            </h2>
            <div className="text-[11px] text-slate-400">
              {activeMember.preferredSlot}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isPaused ? (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Coffee className="w-3 h-3" /> Medical Pause
            </span>
          ) : isExpired ? (
            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Expired
            </span>
          ) : isExpiringSoon ? (
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
              <Clock className="w-3 h-3" /> {diffDays} Days Left
            </span>
          ) : (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Active Member
            </span>
          )}
        </div>
      </div>

      {/* Expiring Soon / Expired Callout Banner */}
      {isExpiringSoon && (
        <div className="bg-gradient-to-r from-orange-600/25 via-amber-600/20 to-orange-600/25 border border-orange-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-lg shadow-orange-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Renewal Due in {diffDays} {diffDays === 1 ? 'Day' : 'Days'} ({activeMember.membershipExpiry})
              </div>
              <div className="text-[11px] text-orange-200/80">
                Lock in your member discount & safeguard your fair streak.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('renewal')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition-transform active:scale-95 shadow"
          >
            Renew Now
          </button>
        </div>
      )}

      {isExpired && (
        <div className="bg-rose-950/40 border border-rose-500/50 p-3.5 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-200">
                Membership Expired on {activeMember.membershipExpiry}
              </div>
              <div className="text-[11px] text-slate-300">
                Turnstile QR scanner will be blocked until renewal.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('renewal')}
            className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0"
          >
            Re-Activate
          </button>
        </div>
      )}

      {/* Hero QR Scan Action Button */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-4 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[11px] font-bold text-orange-400 tracking-wider uppercase">
              Gym Turnstile Entry
            </span>
            <h3 className="text-lg font-extrabold text-white">Daily QR Check-In</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Scan the rotating session QR code displayed at the entrance desk of Karnataka Gym Devi Nagar.
        </p>

        <button
          onClick={() => onNavigate('qr_scanner')}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-transform active:scale-98 shadow-lg shadow-orange-500/25"
        >
          <QrCode className="w-5 h-5" />
          <span>Open Turnstile QR Scanner</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Fair Streak & Weekly Goal Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Fair Streak Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Fair Streak</span>
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {activeMemberStreak.currentStreakDays}
            </span>
            <span className="text-xs text-slate-400 font-semibold">Days</span>
          </div>
          <div className="mt-2 text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-1.5 flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Rest days & medical pauses protected!</span>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Weekly Goal</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {activeMemberStreak.weeklyVisitsCompleted || 3}
            </span>
            <span className="text-xs text-slate-400">/ {activeMemberStreak.weeklyGoalDays || 4} days</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (((activeMemberStreak.weeklyVisitsCompleted || 3) / (activeMemberStreak.weeklyGoalDays || 4)) * 100))}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Fair Streak Philosophy Explainer Modal / Card */}
      <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-300">
            <strong className="text-white block mb-0.5">Karnataka Gym "Fair Streak" Guarantee:</strong>
            We understand recovery is vital. Your streak is calculated on your <em>planned workout days</em> ({activeMemberStreak.plannedDays ? activeMemberStreak.plannedDays.join(', ') : 'Mon, Tue, Thu, Sat'}). Rest days and approved medical pauses do NOT break your streak.
          </div>
        </div>
      </div>

      {/* Active Membership Details Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Membership Plan
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            ID: {activeMember.id}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-white">
              {activeMemberPlan ? activeMemberPlan.name : 'Standard Access'}
            </div>
            <div className="text-xs text-slate-400">
              Valid until: <strong className="text-amber-300">{activeMember.membershipExpiry}</strong>
            </div>
          </div>
          <button
            onClick={() => onNavigate('renewal')}
            className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 border border-orange-500/30 px-3 py-1.5 rounded-xl hover:bg-orange-500/10 transition-colors"
          >
            Upgrade / Renew <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Benefits bullets */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cardio & Heavy Weights</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safe Women Hours Slot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Locker Room & Shower</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Weekend Steam Bath</span>
          </div>
        </div>
      </div>

      {/* Quick Nav Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl flex flex-col items-start gap-2 text-left transition-all active:scale-98"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Attendance History</div>
            <div className="text-[11px] text-slate-400">{memberCheckIns.length} recorded entries</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('addons')}
          className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-3.5 rounded-2xl flex flex-col items-start gap-2 text-left transition-all active:scale-98"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">PT & Supplements</div>
            <div className="text-[11px] text-slate-400">Coach Kavita & ON Whey</div>
          </div>
        </button>
      </div>

      {/* Women's Safe Environment Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-rose-950/40 border border-rose-500/30 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <strong className="text-rose-200 block font-semibold">
              Safe & Inclusive Space for Women
            </strong>
            <span className="text-slate-300 text-[11px]">
              Special morning hours (10:30 AM – 1:00 PM) mentored by certified Coach Kavita Kalburgi with private changing facilities & full biometric security.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

