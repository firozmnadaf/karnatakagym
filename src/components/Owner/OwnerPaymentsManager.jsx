import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IndianRupee,
  CheckCircle,
  Search,
  Filter,
  RotateCcw,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Calendar,
  X
} from 'lucide-react';

export default function OwnerPaymentsManager() {
  const {
    payments,
    members,
    plans,
    addOns,
    processRefund,
    currentGym
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'REFUNDED' | 'RENEWAL' | 'ADDON'
  const [copiedId, setCopiedId] = useState(null);
  const [refundModalPayment, setRefundModalPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('Medical cancellation requested within 3 days');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopyReceipt = (p, member) => {
    const text = `Karnataka Gym Receipt\nReceipt #: ${p.receiptNumber}\nMember: ${member?.name || p.memberId}\nAmount: ₹${p.amount}\nStatus: ${p.status}\nGateway Ref: ${p.gatewayReference || 'UPI-VERIFIED'}\nVPA: ${currentGym?.upiVpa || 'feroznadaf13008@ybl'}\nDate: ${new Date(p.date || Date.now()).toLocaleDateString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmRefund = () => {
    if (!refundModalPayment) return;
    const res = processRefund(refundModalPayment.id, refundReason);
    if (res.success) {
      showToast(res.message);
    }
    setRefundModalPayment(null);
  };

  const targetVpa = currentGym?.upiVpa || 'feroznadaf13008@ybl';

  // Metrics
  const paidPayments = payments.filter(p => p.status === 'PAID');
  const totalRevenue = paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const refundedPayments = payments.filter(p => p.status === 'REFUNDED');
  const totalRefunded = refundedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const renewalRevenue = paidPayments
    .filter(p => (p.orderId || '').startsWith('ord_ren_') || p.planId)
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const addonRevenue = paidPayments
    .filter(p => (p.orderId || '').startsWith('ord_add_') || !p.planId)
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Filtered List
  const filteredPayments = payments.filter(p => {
    const m = members.find(mem => mem.id === p.memberId);
    const memberName = m ? m.name.toLowerCase() : '';
    const receipt = (p.receiptNumber || '').toLowerCase();
    const gateway = (p.gatewayReference || '').toLowerCase();
    const matchSearch = memberName.includes(searchTerm.toLowerCase()) ||
      receipt.includes(searchTerm.toLowerCase()) ||
      gateway.includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === 'PAID') return p.status === 'PAID';
    if (statusFilter === 'REFUNDED') return p.status === 'REFUNDED';
    if (statusFilter === 'RENEWAL') return (p.orderId || '').startsWith('ord_ren_') || p.planId;
    if (statusFilter === 'ADDON') return (p.orderId || '').startsWith('ord_add_') || !p.planId;

    return true;
  });

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>Payments, Receipts & Financial Decisions</span>
          </h3>
          <p className="text-slate-300">
            Audit all verified UPI receipts, renewal collections, marketplace orders, and manage refunds or payment adjustments.
          </p>
        </div>

        <div className="bg-[#0b0f17] border border-slate-700 p-3 rounded-xl flex items-center gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Official UPI VPA</span>
            <span className="font-mono text-white font-bold">{targetVpa}</span>
          </div>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
            Live Merchant
          </span>
        </div>
      </div>

      {toast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Collections</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">
            {paidPayments.length} Verified Receipts
          </span>
        </div>

        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Membership Renewals</span>
          <span className="text-2xl font-black text-amber-300 mt-1 block">
            ₹{renewalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Pass Extensions</span>
        </div>

        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Add-On Store Sales</span>
          <span className="text-2xl font-black text-purple-300 mt-1 block">
            ₹{addonRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-purple-400 block mt-0.5">PT, Diet & Supplements</span>
        </div>

        <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Refunded</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">
            ₹{totalRefunded.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-rose-300 block mt-0.5">
            {refundedPayments.length} Processed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: `All (${payments.length})` },
            { id: 'PAID', label: `Paid (${paidPayments.length})` },
            { id: 'RENEWAL', label: 'Renewals' },
            { id: 'ADDON', label: 'Add-Ons' },
            { id: 'REFUNDED', label: `Refunded (${refundedPayments.length})` }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                statusFilter === f.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member, receipt or UTR..."
            className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0f17] border-b border-slate-800 text-slate-300 font-semibold text-[11px]">
                <th className="py-3 px-3">Receipt #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Member</th>
                <th className="py-3 px-3">Item / Plan</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Gateway Ref (UTR)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredPayments.map(p => {
                const member = members.find(m => m.id === p.memberId);
                const plan = plans.find(pl => pl.id === p.planId);
                const isPaid = p.status === 'PAID';
                const isRefunded = p.status === 'REFUNDED';

                return (
                  <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-300">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {p.date ? new Date(p.date).toLocaleDateString('en-IN') : '2026-11-05'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{member ? member.name : p.memberId}</div>
                      <a href={`tel:${member?.phone}`} className="text-[11px] text-orange-400 hover:text-white font-mono underline">
                        {member?.phone}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {plan ? plan.name : (p.orderId ? 'Add-On Purchase' : 'Membership Pass')}
                    </td>
                    <td className="py-3 px-3 font-black text-sm text-emerald-400">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {p.gatewayReference || 'UPI-VERIFIED'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPaid
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : isRefunded
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyReceipt(p, member)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Copy Receipt"
                        >
                          {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {isPaid && (
                          <button
                            type="button"
                            onClick={() => setRefundModalPayment(p)}
                            className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white text-[10px] font-bold transition-colors"
                            title="Issue Refund Decision"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Decision Modal */}
      {refundModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-rose-600/70 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-extrabold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Process Payment Refund</span>
              </h4>
              <button
                type="button"
                onClick={() => setRefundModalPayment(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#0b0f17] border border-slate-800 p-3 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Receipt:</span>
                <span className="font-mono font-bold text-amber-300">{refundModalPayment.receiptNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Refund Amount:</span>
                <span className="font-black text-rose-400 text-sm">₹{refundModalPayment.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                Refund Reason / Audit Note *
              </label>
              <textarea
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRefundModalPayment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRefund}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
