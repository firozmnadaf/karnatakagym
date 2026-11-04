import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  FileText,
  CheckCircle,
  Copy,
  Printer,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Users,
  AlertTriangle,
  QrCode
} from 'lucide-react';

export default function OwnerDailySummaryModal({ onClose }) {
  const {
    generateDailyOwnerSummary
  } = useGym();

  const [copied, setCopied] = useState(false);
  const summary = generateDailyOwnerSummary();

  const handleCopy = () => {
    const text = `
========================================
KARNATAKA GYM FITNESS CENTRE
Devi Nagar, Hubli - 580031
DAILY OWNER END-OF-DAY SUMMARY REPORT
Date: ${summary.date}
========================================

1. ATTENDANCE & ACTIVITY:
- Total Active Members: ${summary.metrics.totalActiveMembers}
- Today's Verified Check-Ins: ${summary.metrics.todayCheckInsCount}

2. SILENT CHURN & RETENTION INTERVENTIONS:
- Open Silent Churn Risk Cases: ${summary.metrics.openChurnRiskCases}
- Members Returned & Re-engaged: ${summary.metrics.returnedMembersCount}
- Members Expiring in 7 Days: ${summary.metrics.membersExpiringThisWeek}

3. FINANCIAL PERFORMANCE:
- Renewal Collections: ₹${summary.metrics.renewalCollectionINR.toLocaleString('en-IN')}
- Add-On / Supplement Revenue: ₹${summary.metrics.addOnCollectionINR.toLocaleString('en-IN')}
- Total Daily Collection: ₹${summary.metrics.totalDailyRevenue.toLocaleString('en-IN')}

4. DATA QUALITY & INTEGRITY:
- Anomaly Count: ${summary.auditChecks.length}
${summary.auditChecks.length === 0 ? '- System Status: All records clean & verified.' : summary.auditChecks.map(a => `- [${a.type}] ${a.message}`).join('\n')}

Website Developed by Ayesha Tech Studio | Contact: +91 96633 96058
========================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Daily Owner Summary Digest
              </h3>
              <p className="text-slate-400 text-[11px]">
                Karnataka Gym Fitness Centre • Devi Nagar, Hubli - 580031
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Report Overview Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-4 font-sans">
          {/* Top Date & Rating Banner */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-mono text-amber-300 font-bold">
              Report Date: {summary.date}
            </span>
            <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-semibold">
              Operating Hours: 6:00 AM – 9:00 PM
            </span>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Today's Visits</span>
              <span className="text-lg font-black text-white">{summary.metrics.todayCheckInsCount}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Churn Risks</span>
              <span className="text-lg font-black text-rose-400">{summary.metrics.openChurnRiskCases}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Returned Members</span>
              <span className="text-lg font-black text-emerald-400">{summary.metrics.returnedMembersCount}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Renewals (7d)</span>
              <span className="text-lg font-black text-amber-300">{summary.metrics.membersExpiringThisWeek}</span>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Financial Collections</span>
              <span className="text-emerald-400 text-sm font-black">
                Total: ₹{summary.metrics.totalDailyRevenue.toLocaleString('en-IN')}
              </span>
            </h5>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Membership Renewals:</span>
              <span className="font-mono font-bold">₹{summary.metrics.renewalCollectionINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>PT & Supplements:</span>
              <span className="font-mono font-bold">₹{summary.metrics.addOnCollectionINR.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Data Quality Radar Status */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
            <span className="font-bold text-white block mb-1">
              Data Integrity & Anomaly Scanner:
            </span>
            {summary.auditChecks.length === 0 ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> 0 anomalies detected. All memberships, payments and stocks verified clean.
              </span>
            ) : (
              <div className="space-y-1 text-rose-300">
                {summary.auditChecks.map((a, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>[{a.type}] {a.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Official EOD Summary for Karnataka Gym Owner
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

