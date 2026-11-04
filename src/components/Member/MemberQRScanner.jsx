import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertOctagon,
  Clock,
  WifiOff,
  Wifi,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Flame,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemberQRScanner({ onBack, onNavigateRenewal }) {
  const {
    activeMember,
    gymQRToken,
    processCheckIn,
    isOfflineSimulated,
    setIsOfflineSimulated,
    offlineSyncQueue,
    replayOfflineQueue
  } = useGym();

  const [scanResult, setScanResult] = useState(null); // { success, code, message, ... }
  const [isScanning, setIsScanning] = useState(false);
  const [customTokenInput, setCustomTokenInput] = useState('');

  // Trigger check-in
  const handleScanAction = (tokenToScan) => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const result = processCheckIn({
        memberId: activeMember.id,
        scannedToken: tokenToScan,
        method: 'MEMBER_QR',
        isOffline: isOfflineSimulated
      });

      setScanResult(result);

      if (result.success && result.code === 'SUCCESS') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 700);
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
          Turnstile Scanner
        </span>
        {/* Offline Toggle Simulation */}
        <button
          onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
            isOfflineSimulated
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Network Disconnect simulation"
        >
          {isOfflineSimulated ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" /> Offline Mode
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Online Mode
            </>
          )}
        </button>
      </div>

      {/* Camera Viewfinder Simulator */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[300px]">
        {/* Camera Viewfinder Corners */}
        <div className="w-56 h-56 border-2 border-orange-500/40 rounded-2xl relative flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          {/* Laser Scanner animation */}
          <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-scan shadow-lg shadow-orange-500/50"></div>

          {/* Corner Guides */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-orange-500 rounded-tl"></div>
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-orange-500 rounded-tr"></div>
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-orange-500 rounded-bl"></div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-orange-500 rounded-br"></div>

          {isScanning ? (
            <div className="flex flex-col items-center gap-2 text-orange-400 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold tracking-wide">Validating Token...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500 text-center p-3">
              <Camera className="w-8 h-8 text-slate-400" />
              <span className="text-[11px] text-slate-400">
                Point camera at the front-desk display or tap button below
              </span>
            </div>
          )}
        </div>

        {/* Live Token info */}
        <div className="mt-4 text-center">
          <div className="text-[11px] text-slate-400">Front Desk Rotating Session Token:</div>
          <code className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 inline-block mt-1">
            {gymQRToken.token}
          </code>
        </div>
      </div>

      {/* Scan Results & Edge State Handlers */}
      {scanResult && (
        <div className="animate-in fade-in duration-300">
          {scanResult.code === 'SUCCESS' && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl flex flex-col gap-2 shadow-lg shadow-emerald-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-300">
                    Check-In Successful!
                  </h4>
                  <p className="text-xs text-slate-300">{scanResult.message}</p>
                </div>
              </div>
              <div className="mt-1 pt-2 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" /> Fair Streak Updated
                </span>
                {scanResult.autoResolvedCase && (
                  <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-[11px] text-emerald-200">
                    ✓ Open No-Show Case Resolved
                  </span>
                )}
              </div>
            </div>
          )}

          {scanResult.code === 'DUPLICATE_SCAN' && (
            <div className="bg-amber-950/50 border border-amber-500/40 p-4 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-amber-300">
                    Duplicate Scan Detected
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scanResult.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {scanResult.code === 'MEMBERSHIP_EXPIRED' && (
            <div className="bg-rose-950/60 border border-rose-500/50 p-4 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-rose-300">
                    Turnstile Blocked: Membership Expired
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {scanResult.message}
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateRenewal}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <CreditCard className="w-4 h-4" />
                <span>Renew Membership Now (Instant Unlock)</span>
              </button>
            </div>
          )}

          {scanResult.code === 'INVALID_QR' && (
            <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">Invalid QR Code</h4>
                <p className="text-xs text-slate-400">{scanResult.message}</p>
              </div>
            </div>
          )}

          {scanResult.code === 'OFFLINE_QUEUED' && (
            <div className="bg-blue-950/60 border border-blue-500/40 p-4 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <WifiOff className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-300">Offline Check-In Queued</h4>
                  <p className="text-xs text-slate-300">{scanResult.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offline Sync Controls (If queue has items) */}
      {offlineSyncQueue.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-amber-300 block">
              {offlineSyncQueue.length} Check-In(s) Stored Locally
            </span>
            <span className="text-[11px] text-slate-400">
              Turnstile buffer ready to sync with Karnataka Gym server.
            </span>
          </div>
          <button
            onClick={replayOfflineQueue}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Now
          </button>
        </div>
      )}

      {/* Action Simulation Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => handleScanAction(gymQRToken.token)}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-98 transition-transform disabled:opacity-50"
        >
          <QrCode className="w-5 h-5" />
          <span>Simulate Camera Scan (Live Valid QR)</span>
        </button>

        {/* Edge Case Quick Triggers for Testing */}
        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <button
            onClick={() => handleScanAction('INVALID_EXTERNAL_QR_CODE')}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white py-2 px-3 rounded-xl transition-colors text-left"
          >
            ❌ Test Invalid QR
          </button>

          <button
            onClick={() => handleScanAction(gymQRToken.token)}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white py-2 px-3 rounded-xl transition-colors text-left"
          >
            ⚡ Test Duplicate Scan
          </button>
        </div>
      </div>
    </div>
  );
}

