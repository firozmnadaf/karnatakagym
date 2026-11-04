import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  IndianRupee,
  MessageCircle,
  Receipt,
  FileCheck,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function OwnerRenewalPipeline() {
  const {
    members,
    plans,
    payments,
    processRefund,
    runRenewalRemindersScan
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [refundToast, setRefundToast] = useState(null);

  // Expiring memberships (<= 7 days or already expired)
  const today = new Date();
  const expiringMembers = members
    .map(m => {
      const expiry = new Date(m.membershipExpiry);
      const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      return { ...m, daysLeft };
    })
    .filter(m => m.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const filteredExpiring = expiringMembers.filter(m => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.phone.includes(q);
  });

  const handleRefund = (paymentId) => {
    if (window.confirm('Are you sure you want to process a refund for this payment?')) {
      const res = processRefund(paymentId, 'Owner processed satisfaction refund within guarantee period');
      setRefundToast(res.message);
      setTimeout(() => setRefundToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner & Automated Reminder Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            7-Day Membership Renewal Pipeline & Payment Audit
          </h3>
          <p className="text-slate-400 mt-0.5">
            Track members due for renewal. Provider payment must be strictly verified before extending expiry.
          </p>
        </div>

        <button
          onClick={() => {
            const res = runRenewalRemindersScan();
            setRefundToast(res.message);
            setTimeout(() => setRefundToast(null), 3000);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send Scheduled Reminders (14/7/3/0d)</span>
        </button>
      </div>

      {refundToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{refundToast}</span>
        </div>
      )}

      {/* Expiring Members Table / Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
            Members Expiring Soon ({filteredExpiring.length})
          </h4>
          <input
            type="text"
            placeholder="Search member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-white text-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="py-2 px-3">Member</th>
                <th className="py-2 px-3">Plan</th>
                <th className="py-2 px-3">Expiry Date</th>
                <th className="py-2 px-3">Days Left</th>
                <th className="py-2 px-3">Marketing Consent</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExpiring.map(m => {
                const plan = plans.find(p => p.id === m.planId);
                const isUrgent = m.daysLeft <= 3;
                const isExpired = m.daysLeft < 0;

                return (
                  <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{m.phone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {plan ? plan.name : 'Standard'}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 font-mono font-bold">
                      {m.membershipExpiry}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isExpired
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isUrgent
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isExpired ? 'Lapsed' : `${m.daysLeft}d remaining`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {m.commPreferences?.marketingOptOut ? (
                        <span className="text-slate-500 text-[10px] bg-slate-800 px-2 py-0.5 rounded">
                          Opted Out (Transactional Only)
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[10px]">
                          ✓ WhatsApp Opted In
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <a
                        href={`https://api.whatsapp.com/send?phone=${m.phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(`Namaskara ${m.name}! Your Karnataka Gym membership expires on ${m.membershipExpiry}. We have a special Hubli renewal offer reserved for you!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Nudge</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Transaction Log & Audit Verification */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-emerald-400" /> Payment Provider Audit Log ({payments.length})
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            No membership extended without verified status
          </span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="py-2 px-3">Receipt #</th>
                <th className="py-2 px-3">Member</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Method</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Gateway Ref</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map(p => {
                const member = members.find(m => m.id === p.memberId);
                const isPaid = p.status === 'PAID';
                const isRefunded = p.status === 'REFUNDED';
                const isFailed = p.status === 'FAILED';

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                      {p.receiptNumber || 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 text-white">
                      {member ? member.name : p.memberId}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-white">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      {p.method}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isPaid
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isRefunded
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : isFailed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                      {p.gatewayReference || <span className="text-rose-400 italic">None</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isPaid && (
                        <button
                          onClick={() => handleRefund(p.id)}
                          className="text-[10px] bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 px-2 py-0.5 rounded"
                        >
                          Process Refund
                        </button>
                      )}
                      {isRefunded && (
                        <span className="text-[10px] text-purple-400 font-semibold">Refunded</span>
                      )}
                      {isFailed && (
                        <span className="text-[10px] text-rose-400">Declined</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

