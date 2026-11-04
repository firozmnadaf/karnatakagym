import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Clock,
  CheckCircle,
  MessageCircle,
  Receipt
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
    if (window.confirm('Process an immediate refund for this payment?')) {
      const res = processRefund(paymentId, 'Owner processed satisfaction refund within guarantee period');
      setRefundToast(res.message);
      setTimeout(() => setRefundToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner (No badge above headline!) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#111726] border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white">
            7-Day Membership Renewal Pipeline and Gateway Audit
          </h3>
          <p className="text-slate-300">
            Track members due for renewal. Provider payment is strictly verified before extending expiry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const res = runRenewalRemindersScan();
            setRefundToast(res.message);
            setTimeout(() => setRefundToast(null), 3000);
          }}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send Scheduled Reminders (14/7/3/0d)</span>
        </button>
      </div>

      {refundToast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{refundToast}</span>
        </div>
      )}

      {/* Expiring Members Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
            Members Expiring Soon ({filteredExpiring.length})
          </h4>
          <input
            type="text"
            placeholder="Search member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3">Days Left</th>
                <th className="py-2.5 px-3">Marketing Consent</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredExpiring.map(m => {
                const plan = plans.find(p => p.id === m.planId);
                const isUrgent = m.daysLeft <= 3;
                const isExpired = m.daysLeft < 0;

                return (
                  <tr key={m.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{m.name}</div>
                      <a href={`tel:${m.phone}`} className="text-[11px] text-orange-400 hover:text-white font-mono underline">
                        {m.phone}
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200">
                      {plan ? plan.name : 'Standard'}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 font-mono font-bold">
                      {m.membershipExpiry}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isExpired
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isUrgent
                          ? 'bg-orange-950 text-orange-300 border border-orange-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {isExpired ? 'Lapsed' : `${m.daysLeft}d left`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {m.commPreferences?.marketingOptOut ? (
                        <span className="text-slate-400 text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          Opted Out (Transactional Only)
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[10px] font-semibold">
                          WhatsApp Opted In
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaskara ${m.name}! Your Karnataka Gym membership is due for renewal on ${m.membershipExpiry}. Visit the desk or renew in the app!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
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

      {/* Payment Gateway Transaction Log */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-emerald-400" /> Payment Provider Audit Log ({payments.length})
          </span>
          <span className="text-[11px] text-slate-300 font-normal">
            No pass extended without verified provider signature
          </span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold text-[11px]">
                <th className="py-2 px-3">Receipt #</th>
                <th className="py-2 px-3">Member</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Method</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Gateway Ref</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.map(p => {
                const member = members.find(m => m.id === p.memberId);
                const isPaid = p.status === 'PAID';
                const isRefunded = p.status === 'REFUNDED';
                const isFailed = p.status === 'FAILED';

                return (
                  <tr key={p.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300 text-[11px]">
                      {p.receiptNumber || 'None'}
                    </td>
                    <td className="py-2.5 px-3 text-white">
                      {member ? member.name : p.memberId}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-white">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-mono">
                      {p.method}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isPaid
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isRefunded
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : isFailed
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                      {p.gatewayReference || <span className="text-rose-400">None</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isPaid && (
                        <button
                          type="button"
                          onClick={() => handleRefund(p.id)}
                          className="text-[10px] bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-300 px-2 py-1 rounded transition-colors font-bold"
                        >
                          Process Refund
                        </button>
                      )}
                      {isRefunded && (
                        <span className="text-[10px] text-purple-300 font-bold">Refunded</span>
                      )}
                      {isFailed && (
                        <span className="text-[10px] text-rose-300 font-bold">Declined</span>
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
