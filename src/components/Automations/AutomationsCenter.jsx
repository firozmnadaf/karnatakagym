import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Bell,
  CreditCard,
  FileText,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function AutomationsCenter() {
  const {
    runDailyNoShowScan,
    runRenewalRemindersScan,
    generateDailyOwnerSummary,
    runDataQualityAudit,
    settings,
    auditLogs
  } = useGym();

  const [runningId, setRunningId] = useState(null);
  const [lastActionResult, setLastActionResult] = useState(null);

  const handleRunAutomation = (id) => {
    setRunningId(id);
    setLastActionResult(null);

    setTimeout(() => {
      setRunningId(null);
      let res = null;

      if (id === 'auto_1') {
        res = runDailyNoShowScan();
      } else if (id === 'auto_3') {
        res = runRenewalRemindersScan();
      } else if (id === 'auto_5') {
        const sum = generateDailyOwnerSummary();
        res = {
          success: true,
          message: `Daily Owner Summary generated successfully for ${sum.date}. Total Collections: ₹${sum.metrics.totalDailyRevenue}.`
        };
      } else if (id === 'auto_6') {
        const audit = runDataQualityAudit();
        res = {
          success: audit.healthy,
          message: audit.healthy
            ? 'Data-quality radar completed: 0 anomalies found. All tables clean.'
            : `Radar alert: ${audit.totalAnomalies} data discrepancies detected.`
        };
      }

      setLastActionResult(res);
    }, 800);
  };

  const automationsList = [
    {
      id: 'auto_1',
      title: '1. Daily Silent Churn No-Show Scan',
      schedule: 'Daily at 06:00 AM IST (Before Morning Slot)',
      description: 'Scans all eligible active members. If last check-in date exceeds threshold (default 10 days), automatically opens exactly 1 case on the Owner Red-List.',
      idempotencyRule: 'Strictly skips members who already have an OPEN or FOLLOWED_UP case. Excludes paused, frozen, expired, or cancelled passes.',
      icon: Clock,
      color: 'rose'
    },
    {
      id: 'auto_2',
      title: '2. QR Check-In & Auto-Resolution Engine',
      schedule: 'Event-Driven (Turnstile QR Trigger)',
      description: 'Validates rotating session token, checks duplicate lockout window (120 mins), logs attendance, increments fair streak, and auto-resolves any open silent churn case for that member.',
      idempotencyRule: 'Marks case status as "RESOLVED_RETURNED" exactly once with turnstile timestamp.',
      icon: RefreshCw,
      color: 'emerald'
    },
    {
      id: 'auto_3',
      title: '3. Renewal Reminders Engine',
      schedule: 'Configurable Windows (14, 7, 3, 0 Days Before Expiry)',
      description: 'Scans upcoming expirations and issues personalized Hubli WhatsApp / SMS notices with direct 1-tap renewal links.',
      idempotencyRule: 'Immediately stops once member pays, pauses, or cancels. Strictly respects member marketing opt-out preferences.',
      icon: Bell,
      color: 'amber'
    },
    {
      id: 'auto_4',
      title: '4. Verified Payment & Membership Extension',
      schedule: 'Webhook Event-Driven (Razorpay / UPI Provider)',
      description: 'Extends membership duration by plan days only after cryptographic signature and transaction reference are verified.',
      idempotencyRule: 'Checks idempotency key (orderId + gatewayReference). Returns HTTP 200 without duplicate duration extensions if retried.',
      icon: CreditCard,
      color: 'cyan'
    },
    {
      id: 'auto_5',
      title: '5. Daily Owner EOD Summary Digest',
      schedule: 'Daily at 09:15 PM IST (Closing Time)',
      description: 'Aggregates day check-ins, new risk cases, follow-up logs, renewal revenue, add-on sales, and data quality check into a 1-page digest for the owner.',
      idempotencyRule: 'Immutable daily snapshot tagged with Hubli calendar date.',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 'auto_6',
      title: '6. Automated Data-Quality & Integrity Radar',
      schedule: 'Continuous Background Daemon',
      description: 'Scans for missing expiry dates, unverified paid states, assisted entries without mandatory reason, negative stock, and trainer double-booking.',
      idempotencyRule: 'Detects anomalies in real-time and logs alerts with unique entity references.',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">
              Karnataka Gym Hubli • Autonomous Retention Engine
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-0.5">
            6 Required System Automations & Idempotency Rules
          </h2>
          <p className="text-slate-400 text-xs">
            Guarantees zero duplicate cases, zero double-charges, and strict compliance with member marketing consent.
          </p>
        </div>
      </div>

      {lastActionResult && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in ${
          lastActionResult.success
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
            : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <strong className="block font-bold">Automation Executed</strong>
            <span>{lastActionResult.message}</span>
          </div>
        </div>
      )}

      {/* Automations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {automationsList.map(a => {
          const Icon = a.icon;
          const isRunning = runningId === a.id;
          const isTriggerable = a.id === 'auto_1' || a.id === 'auto_3' || a.id === 'auto_5' || a.id === 'auto_6';

          return (
            <div
              key={a.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-extrabold text-sm text-white">{a.title}</h4>
                  </div>

                  <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono">
                    {a.schedule}
                  </span>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  {a.description}
                </p>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-[11px] space-y-1">
                  <strong className="text-amber-400 block font-semibold">
                    🛡️ Idempotency & Safety Rule:
                  </strong>
                  <span className="text-slate-400">{a.idempotencyRule}</span>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Engine Armed
                </span>

                {isTriggerable ? (
                  <button
                    onClick={() => handleRunAutomation(a.id)}
                    disabled={isRunning}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    )}
                    <span>{isRunning ? 'Running...' : 'Trigger Now'}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">
                    Runs on event trigger (Scan/Webhook)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Audit Logs for Automations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Recent Automation Audit Trail
        </h4>

        <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
          {auditLogs.slice(0, 8).map(log => (
            <div key={log.id} className="bg-slate-950 p-2 rounded-lg border border-slate-800/60 flex items-start justify-between gap-3 text-slate-300">
              <div>
                <span className="text-amber-400 font-bold">[{log.actionType}]</span> {log.details}
              </div>
              <span className="text-slate-500 shrink-0 text-[10px]">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

