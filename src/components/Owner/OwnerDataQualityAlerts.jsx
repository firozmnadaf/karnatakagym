import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Bug,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function OwnerDataQualityAlerts() {
  const {
    runDataQualityAudit,
    members,
    setMembers,
    addOns,
    setAddOns,
    staff,
    setStaff,
    payments,
    setPayments,
    logAudit
  } = useGym();

  const [toast, setToast] = useState(null);
  const auditResult = runDataQualityAudit();

  // Test helper: Inject a deliberate anomaly to test the radar
  const handleInjectAnomaly = (type) => {
    if (type === 'NEGATIVE_STOCK') {
      setAddOns(prev => prev.map((a, i) => i === 0 ? { ...a, stockCapacity: -2 } : a));
      setToast('Injected negative stock on Whey Protein to test radar.');
    } else if (type === 'MISSING_EXPIRY') {
      setMembers(prev => prev.map((m, i) => i === 0 ? { ...m, membershipExpiry: '' } : m));
      setToast('Cleared expiry date for Basavaraj Patil to test radar.');
    } else if (type === 'UNVERIFIED_PAID') {
      setPayments(prev => [
        {
          id: 'pay_bad_' + Date.now(),
          orderId: 'bad_order',
          memberId: 'mem_01',
          amount: 2500,
          currency: 'INR',
          method: 'CASH',
          gatewayReference: null, // missing!
          status: 'PAID',
          verifiedAt: null,
          receiptNumber: 'BAD-01'
        },
        ...prev
      ]);
      setToast('Injected unverified paid payment record.');
    }
    setTimeout(() => setToast(null), 3000);
  };

  // Fix anomalies helper
  const handleAutoFix = () => {
    // 1. Fix missing expiries
    setMembers(prev => prev.map(m => (!m.membershipExpiry ? { ...m, membershipExpiry: '2027-01-01' } : m)));
    // 2. Fix negative stock
    setAddOns(prev => prev.map(a => (a.stockCapacity < 0 ? { ...a, stockCapacity: 5 } : a)));
    // 3. Fix unverified payments
    setPayments(prev => prev.map(p => (p.status === 'PAID' && !p.gatewayReference ? { ...p, gatewayReference: 'autofix_ref_' + Date.now() } : p)));

    logAudit('DATA_ANOMALIES_CLEARED', 'Owner triggered automated database integrity repair.', 'staff_1', 'OWNER');
    setToast('All detected data anomalies repaired automatically!');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            Automated Data-Quality & Integrity Radar
          </h3>
          <p className="text-slate-400 mt-0.5">
            Continuously monitors: missing expiry, unverified paid status, missing assisted check-in reasons, negative stock, and trainer double-booking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {auditResult.totalAnomalies > 0 && (
            <button
              onClick={handleAutoFix}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-3.5 py-1.5 rounded-xl shadow"
            >
              Auto-Repair All
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Radar Health Card */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
        auditResult.healthy
          ? 'bg-emerald-950/30 border-emerald-500/40'
          : 'bg-rose-950/40 border-rose-500/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            auditResult.healthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {auditResult.healthy ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">
              {auditResult.healthy ? '100% Database Integrity Verified' : `${auditResult.totalAnomalies} Data Anomalies Detected`}
            </h4>
            <p className="text-slate-400 text-[11px]">
              {auditResult.healthy
                ? 'No corrupt records, orphan payments, negative inventory, or trainer slot overlaps.'
                : 'Action required to protect Karnataka Gym records from silent data rot.'}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black ${
          auditResult.healthy
            ? 'bg-emerald-500/20 text-emerald-300'
            : 'bg-rose-500/20 text-rose-300 animate-pulse'
        }`}>
          {auditResult.healthy ? 'STATUS: CLEAN' : 'ATTENTION NEEDED'}
        </span>
      </div>

      {/* Anomaly Items List */}
      <div className="space-y-2">
        {auditResult.anomalies.map((a, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 border border-rose-500/40 rounded-xl p-3.5 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                    {a.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Target ID: {a.entityId}</span>
                </div>
                <p className="text-slate-300 text-xs mt-1">{a.message}</p>
              </div>
            </div>

            <button
              onClick={handleAutoFix}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg text-xs font-semibold shrink-0"
            >
              Fix Record
            </button>
          </div>
        ))}
      </div>

      {/* Edge Testing Radar Box */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
        <span className="font-bold text-slate-400 uppercase text-[10px] block">
          Radar Edge Case Simulator (Test Radar Responsiveness)
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleInjectAnomaly('NEGATIVE_STOCK')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs"
          >
            Inject Negative Stock
          </button>
          <button
            onClick={() => handleInjectAnomaly('MISSING_EXPIRY')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs"
          >
            Inject Missing Expiry
          </button>
          <button
            onClick={() => handleInjectAnomaly('UNVERIFIED_PAID')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-xl text-xs"
          >
            Inject Unverified Payment
          </button>
        </div>
      </div>
    </div>
  );
}

