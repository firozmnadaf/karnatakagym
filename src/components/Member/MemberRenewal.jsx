import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  Receipt,
  RotateCcw,
  Percent,
  Check,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemberRenewal({ onBack }) {
  const {
    activeMember,
    plans,
    processMembershipRenewal,
    payments
  } = useGym();

  const [selectedPlanId, setSelectedPlanId] = useState(
    plans.find(p => p.id === activeMember.planId)?.id || 'plan_3m'
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'CARD' | 'NETBANKING'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState(null); // null | 'PENDING' | 'PAID' | 'FAILED'
  const [paymentResult, setPaymentResult] = useState(null);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[1];

  // Expiry calculation
  const today = new Date();
  const expiryDate = new Date(activeMember.membershipExpiry);
  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
  const isExpired = diffDays < 0;

  // Simulate payment provider flow (Razorpay / UPI Intent)
  const handleSimulatePayment = (forcedStatus = 'PAID') => {
    setIsProcessing(true);
    setPaymentState('PENDING');

    setTimeout(() => {
      setIsProcessing(false);
      const res = processMembershipRenewal({
        memberId: activeMember.id,
        planId: selectedPlan.id,
        paymentMethod,
        simulateStatus: forcedStatus
      });

      setPaymentState(forcedStatus);
      setPaymentResult(res);

      if (forcedStatus === 'PAID' && res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 }
        });
      }
    }, 1200);
  };

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
          Membership Renewal
        </span>
        <span className="text-xs text-slate-400">
          Devi Nagar, Hubli
        </span>
      </div>

      {/* Expiry Notice Reminder Callout */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        isExpired
          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          : isExpiringSoon
          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          : 'bg-slate-900/80 border-slate-800 text-slate-300'
      }`}>
        <Clock className={`w-5 h-5 shrink-0 mt-0.5 ${isExpired ? 'text-rose-400' : 'text-amber-400'}`} />
        <div className="text-xs space-y-1">
          <div className="font-bold">
            {isExpired
              ? `Your Karnataka Gym membership expired on ${activeMember.membershipExpiry}`
              : isExpiringSoon
              ? `Renewal Window Active: ${diffDays} Days Remaining (${activeMember.membershipExpiry})`
              : `Current Pass Valid Until ${activeMember.membershipExpiry}`}
          </div>
          <div className="text-[11px] opacity-90">
            Renewing now immediately protects your fair streak history, locks in preferential Hubli rates, and preserves locker access.
          </div>
        </div>
      </div>

      {/* Plan Selection Carousel / Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Choose Renewal Plan</span>
          <span className="text-[11px] text-orange-400 font-normal">Hubli Member Savings</span>
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          {plans.map(p => {
            const isSelected = p.id === selectedPlanId;
            const savings = p.basePrice - p.discountPrice;
            const savingsPercent = Math.round((savings / p.basePrice) * 100);

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`relative p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-orange-950/30 border-orange-500 shadow-md shadow-orange-500/10 ring-1 ring-orange-500'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.isPopular && (
                  <span className="absolute -top-2 right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div className="text-xs font-extrabold text-white mb-1">
                  {p.name}
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  {p.durationDays} Days Access
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-amber-300">
                    ₹{p.discountPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    ₹{p.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <Percent className="w-2.5 h-2.5" /> Save {savingsPercent}% (₹{savings})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Plan Details & Transparent Terms */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm font-extrabold text-white">
              {selectedPlan.name} Benefits
            </h4>
            <span className="text-[11px] text-slate-400">
              Valid for {selectedPlan.durationDays} days from extension date
            </span>
          </div>
          <span className="text-base font-black text-amber-300">
            ₹{selectedPlan.discountPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Benefits list */}
        <div className="space-y-1.5 text-xs text-slate-300">
          {selectedPlan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Transparent Cancellation & Pause Policy */}
        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <div>
            <strong className="text-slate-300">Terms & Pause Policy:</strong> {selectedPlan.terms}
          </div>
          <div className="text-slate-500">
            Note: Karnataka Gym does not make false medical transformation claims. Consistent training with safe technique is prioritised.
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Select Payment Method (Simulated Gateway)
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPaymentMethod('UPI')}
            className={`py-2 px-3 rounded-xl border transition-all ${
              paymentMethod === 'UPI'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            UPI (GPay/PhonePe)
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('CARD')}
            className={`py-2 px-3 rounded-xl border transition-all ${
              paymentMethod === 'CARD'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Debit / Credit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('NETBANKING')}
            className={`py-2 px-3 rounded-xl border transition-all ${
              paymentMethod === 'NETBANKING'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            NetBanking
          </button>
        </div>
      </div>

      {/* Payment Processing States / Results */}
      {paymentState && (
        <div className="animate-in fade-in duration-200">
          {paymentState === 'PENDING' && (
            <div className="bg-blue-950/40 border border-blue-500/40 p-4 rounded-2xl flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-blue-400 animate-spin" />
              <div className="text-xs">
                <span className="font-bold text-blue-300 block">Connecting with Payment Provider...</span>
                <span className="text-slate-400">Verifying signature & idempotency tokens. Membership not extended until confirmed.</span>
              </div>
            </div>
          )}

          {paymentState === 'PAID' && paymentResult?.success && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-300">
                    Payment Verified & Membership Extended!
                  </h4>
                  <p className="text-xs text-slate-300">{paymentResult.message}</p>
                </div>
              </div>
              {paymentResult.payment && (
                <div className="bg-slate-900/80 p-2.5 rounded-xl text-[11px] font-mono text-slate-300 flex justify-between items-center mt-2">
                  <span>Receipt: {paymentResult.payment.receiptNumber}</span>
                  <span className="text-emerald-400 font-bold">₹{paymentResult.payment.amount} PAID</span>
                </div>
              )}
            </div>
          )}

          {paymentState === 'FAILED' && (
            <div className="bg-rose-950/60 border border-rose-500/50 p-4 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="text-sm font-extrabold text-rose-300">Payment Failed</h4>
                <p className="text-slate-300 mt-0.5">{paymentResult?.message}</p>
                <div className="text-[11px] text-rose-400 mt-1">
                  ✓ Safety Guarantee: Expiry date was strictly left unchanged.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Payment Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => handleSimulatePayment('PAID')}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 text-slate-950 font-black py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 transition-transform disabled:opacity-50"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Pay ₹{selectedPlan.discountPrice.toLocaleString('en-IN')} & Activate Membership</span>
        </button>

        {/* Edge Case: Test Failed Payment state */}
        <button
          onClick={() => handleSimulatePayment('FAILED')}
          disabled={isProcessing}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
        >
          ⚠️ Test Edge Case: Simulate Bank Payment Failure (Membership Not Extended)
        </button>
      </div>
    </div>
  );
}

