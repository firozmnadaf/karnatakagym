import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Percent,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemberRenewal({ onBack }) {
  const {
    activeMember,
    plans,
    processMembershipRenewal
  } = useGym();

  const [selectedPlanId, setSelectedPlanId] = useState(
    plans.find(p => p.id === activeMember.planId)?.id || 'plan_3m'
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentState, setPaymentState] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[1];

  const today = new Date();
  const expiryDate = new Date(activeMember.membershipExpiry);
  const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
  const isExpired = diffDays < 0;

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
    }, 1100);
  };

  return (
    <div className="space-y-4 pb-6 text-slate-100">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h3 className="text-sm font-extrabold text-white">
          Membership Renewal
        </h3>
        <span className="text-xs text-slate-400">Devi Nagar, Hubli</span>
      </div>

      {/* Expiry Notice Reminder Callout */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isExpired
          ? 'bg-[#261014] border-rose-600 text-rose-200'
          : isExpiringSoon
          ? 'bg-[#291b0f] border-amber-600 text-amber-200'
          : 'bg-[#111726] border-slate-800 text-slate-300'
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
          <div className="text-[11px] text-slate-300">
            Renewing now immediately safeguards your fair streak history, locks in Hubli resident pricing, and protects locker access.
          </div>
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Choose Renewal Plan
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map(p => {
            const isSelected = p.id === selectedPlanId;
            const savings = p.basePrice - p.discountPrice;
            const savingsPercent = Math.round((savings / p.basePrice) * 100);

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`relative p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#1a2336] border-orange-500 shadow-md ring-1 ring-orange-500'
                    : 'bg-[#111726] border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.isPopular && (
                  <span className="absolute -top-2 right-2 bg-orange-600 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div className="text-xs font-bold text-white mb-0.5">
                  {p.name}
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  {p.durationDays} Days Access
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-amber-300">
                    ₹{p.discountPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{p.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                  <Percent className="w-3 h-3" /> Save {savingsPercent}% (₹{savings})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Plan Details & Transparent Terms */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h4 className="text-sm font-bold text-white">
              {selectedPlan.name} Inclusions
            </h4>
            <span className="text-[11px] text-slate-400">
              Valid for {selectedPlan.durationDays} days from renewal extension
            </span>
          </div>
          <span className="text-base font-extrabold text-amber-300">
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

        {/* Terms */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div>
            <strong className="text-slate-300">Pause Policy:</strong> {selectedPlan.terms}
          </div>
          <div className="text-slate-400">
            Transparent policy: No hidden processing fees or mandatory recurring debit subscriptions.
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl space-y-2">
        <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
          Payment Method (Simulated Provider)
        </label>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          {['UPI', 'CARD', 'NETBANKING'].map(method => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`py-2 px-3 rounded-lg border transition-colors ${
                paymentMethod === method
                  ? 'bg-orange-600 text-white border-orange-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {method === 'UPI' ? 'UPI (GPay / PhonePe)' : method === 'CARD' ? 'Debit / Card' : 'NetBanking'}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Processing Feedback States */}
      {paymentState && (
        <div className="space-y-2">
          {paymentState === 'PENDING' && (
            <div className="bg-[#0f1f2e] border border-blue-500 p-4 rounded-xl flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-blue-400 animate-spin" />
              <div className="text-xs">
                <span className="font-bold text-blue-300 block">Connecting to Payment Provider...</span>
                <span className="text-slate-300">Verifying signature and idempotency token. Membership will not be extended until verified.</span>
              </div>
            </div>
          )}

          {paymentState === 'PAID' && paymentResult?.success && (
            <div className="bg-[#0e2417] border border-emerald-500 p-4 rounded-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-300">
                    Payment Verified - Membership Extended
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">{paymentResult.message}</p>
                </div>
              </div>
              {paymentResult.payment && (
                <div className="bg-slate-900 p-2.5 rounded-lg text-xs font-mono text-slate-200 flex justify-between items-center border border-slate-800 mt-2">
                  <span>Receipt: {paymentResult.payment.receiptNumber}</span>
                  <span className="text-emerald-400 font-bold">₹{paymentResult.payment.amount} PAID</span>
                </div>
              )}
            </div>
          )}

          {paymentState === 'FAILED' && (
            <div className="bg-[#241014] border border-rose-600 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="text-sm font-extrabold text-rose-300">Payment Failed</h4>
                <p className="text-slate-200 mt-0.5">{paymentResult?.message}</p>
                <div className="text-[11px] text-rose-300 font-semibold mt-1">
                  Safety Guarantee: Your membership expiry date was strictly left unchanged.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Payment Action Buttons (Solid colors, no gradient text, no hover opacity fades) */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => handleSimulatePayment('PAID')}
          disabled={isProcessing}
          className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-sm"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Pay ₹{selectedPlan.discountPrice.toLocaleString('en-IN')} and Extend Pass</span>
        </button>

        <button
          type="button"
          onClick={() => handleSimulatePayment('FAILED')}
          disabled={isProcessing}
          className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 border border-slate-800 text-slate-300 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
        >
          Test Bank Failure Scenario (Membership Not Extended)
        </button>
      </div>
    </div>
  );
}
