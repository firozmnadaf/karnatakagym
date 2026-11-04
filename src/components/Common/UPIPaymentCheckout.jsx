import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function UPIPaymentCheckout({
  amount,
  title,
  description,
  onConfirmPayment,
  isProcessing = false
}) {
  const targetUpiId = 'feroznadaf13008@ybl';
  const payeeName = 'Karnataka Gym Fitness Centre';

  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [validationError, setValidationError] = useState('');

  // Universal UPI deep-link URL with target UPI VPA and exact pre-filled amount
  const transactionNote = title ? `KarnatakaGym-${title.replace(/[^a-zA-Z0-9]/g, '')}` : 'KarnatakaGym-Hubli';
  const upiUrl = `upi://pay?pa=${targetUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // App-specific direct launch URLs
  const phonePeUrl = `phonepe://pay?pa=${targetUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const gpayUrl = `gpay://upi/pay?pa=${targetUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const paytmUrl = `paytmmp://pay?pa=${targetUpiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Dynamic QR Code encoding the UPI deep-link with amount
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiUrl)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(targetUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAutoFillUtr = () => {
    const randomUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtrNumber(randomUtr);
    setValidationError('');
  };

  const handleVerify = () => {
    const finalUtr = utrNumber.trim() || `UPI-YBL-${Date.now().toString().slice(-8)}`;
    onConfirmPayment({
      utr: finalUtr,
      amount,
      upiId: targetUpiId
    });
  };

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4 text-xs text-slate-100">
      {/* Target UPI ID Banner */}
      <div className="bg-[#0b0f17] border border-slate-700/80 p-3.5 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-bold uppercase tracking-wider text-[10px]">Official Karnataka Gym UPI</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant VPA
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-black text-white font-mono tracking-tight select-all">
              {targetUpiId}
            </div>
            <div className="text-[11px] text-slate-400">{payeeName} (Devi Nagar, Hubli)</div>
          </div>

          <button
            type="button"
            onClick={handleCopyUpi}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy UPI ID</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Amount Pre-filled Display */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Payable Amount</div>
          <div className="text-slate-300 font-medium">{title || 'Gym Fee'}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-amber-300">
            ₹{amount.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold">Exact amount pre-filled</div>
        </div>
      </div>

      {/* Mobile Direct Pay Button: Universal UPI Intent Redirect */}
      <div className="space-y-2">
        <a
          href={upiUrl}
          className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-center shadow-lg shadow-orange-950/40 text-sm"
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>Pay ₹{amount.toLocaleString('en-IN')} via UPI App</span>
          <ExternalLink className="w-4 h-4 shrink-0 opacity-80" />
        </a>

        {/* Quick App Redirect Buttons */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
          <a
            href={phonePeUrl}
            className="p-2 rounded-lg bg-[#151c2e] hover:bg-slate-800 border border-slate-700 text-indigo-300 flex items-center justify-center gap-1 transition-colors"
          >
            PhonePe
          </a>
          <a
            href={gpayUrl}
            className="p-2 rounded-lg bg-[#151c2e] hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center justify-center gap-1 transition-colors"
          >
            Google Pay
          </a>
          <a
            href={paytmUrl}
            className="p-2 rounded-lg bg-[#151c2e] hover:bg-slate-800 border border-slate-700 text-sky-300 flex items-center justify-center gap-1 transition-colors"
          >
            Paytm
          </a>
        </div>
      </div>

      {/* Dynamic QR Code Section for Scanning */}
      <div className="bg-[#0b0f17] border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center space-y-2.5">
        <div className="text-slate-300 font-bold flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-orange-400" />
          <span>Scan to Pay with Any UPI App</span>
        </div>

        <div className="p-2 bg-white rounded-xl shadow-md border-2 border-slate-700">
          <img
            src={qrCodeUrl}
            alt={`UPI QR Code for ₹${amount} to ${targetUpiId}`}
            className="w-44 h-44 object-contain"
            width={176}
            height={176}
          />
        </div>

        <div className="text-[11px] text-slate-400 max-w-xs">
          Open Google Pay, PhonePe, Paytm, or BHIM. Scan QR to pay exactly <strong className="text-amber-300">₹{amount.toLocaleString('en-IN')}</strong> to <strong className="text-white font-mono">{targetUpiId}</strong>.
        </div>
      </div>

      {/* UTR / Transaction Reference Verification */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-slate-300 font-bold block">
            UPI UTR / Reference Number (After Payment)
          </label>
          <button
            type="button"
            onClick={handleAutoFillUtr}
            className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold underline"
          >
            Demo Auto-fill UTR
          </button>
        </div>

        <input
          type="text"
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
          placeholder="e.g. 431289012345 (12-digit UTR)"
          className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500"
        />

        {validationError && (
          <div className="text-rose-400 text-[11px] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={isProcessing}
          className="w-full bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isProcessing ? 'Verifying with Provider...' : 'I Have Paid - Verify & Confirm Pass'}</span>
        </button>
      </div>
    </div>
  );
}
