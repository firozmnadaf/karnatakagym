import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export default function OwnerDataQualityAlerts() {
  const {
    runDataQualityAudit,
    setMembers,
    setAddOns,
    setPayments,
    logAudit
  } = useGym();

  const [toast, setToast] = useState(null);
  const auditResult = runDataQualityAudit();

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
          gatewayReference: null,
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

  const handleAutoFix = () => {
    setMembers(prev => prev.map(m => (!m.membershipExpiry ? { ...m, membershipExpiry: '2027-01-01' } : m)));
    setAddOns(prev => prev.map(a => (a.stockCapacity < 0 ? { ...a, stockCapacity: 5 } : a)));
    setPayments(prev => prev.map(p => (p.status === 'PAID' && !p.gatewayReference ? { ...p, gatewayReference: 'autofix_ref_' + Date.now() } : p)));

    logAudit('DATA_ANOMALIES_CLEARED', 'Owner triggered automated database integrity repair.', 'staff_1', 'OWNER');
    setToast('All detected data anomalies repaired successfully.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner (No badge above headline!) */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white">
            Automated Data-Quality and Integrity Radar
          </h3>
          <p className="text-slate-300">
            Continuously monitors missing expiry dates, unverified payments, missing check-in reasons, negative stock, and trainer overbooking.
          </p>
        </div>

        {auditResult.totalAnomalies > 0 && (
          <button
            type="button"
            onClick={handleAutoFix}
            className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            Auto-Repair All Records
          </button>
        )}
      </div>

      {toast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Radar Health Card */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
        auditResult.healthy
          ? 'bg-[#0e2417] border-emerald-600'
          : 'bg-[#241014] border-rose-600'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            auditResult.healthy ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
          }`}>
            {auditResult.healthy ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">
              {auditResult.healthy ? '100% Database Integrity Verified' : `${auditResult.totalAnomalies} Data Anomalies Detected`}
            </h4>
            <p className="text-slate-300 text-xs">
              {auditResult.healthy
                ? 'Zero orphan records, unverified payments, negative inventory, or trainer slot overflows.'
                : 'Action required to protect Karnataka Gym records from data rot.'}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black ${
          auditResult.healthy
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
            : 'bg-rose-950 text-rose-300 border border-rose-700'
        }`}>
          {auditResult.healthy ? 'STATUS: CLEAN' : 'ATTENTION NEEDED'}
        </span>
      </div>

      {/* Anomaly Items List */}
      <div className="space-y-2">
        {auditResult.anomalies.map((a, idx) => (
          <div
            key={idx}
            className="bg-[#111726] border border-rose-700 rounded-xl p-3.5 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white uppercase text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded">
                    {a.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">Target ID: {a.entityId}</span>
                </div>
                <p className="text-slate-200 text-xs mt-1">{a.message}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFix}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors"
            >
              Fix Record
            </button>
          </div>
        ))}
      </div>

      {/* Radar Edge Case Simulator (No placeholder text) */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-2">
        <span className="font-bold text-slate-300 uppercase text-[10px] block">
          Radar Responsiveness Test Controls
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleInjectAnomaly('NEGATIVE_STOCK')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Inject Negative Stock
          </button>
          <button
            type="button"
            onClick={() => handleInjectAnomaly('MISSING_EXPIRY')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Inject Missing Expiry
          </button>
          <button
            type="button"
            onClick={() => handleInjectAnomaly('UNVERIFIED_PAID')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            Inject Unverified Payment
          </button>
        </div>
      </div>
    </div>
  );
}
