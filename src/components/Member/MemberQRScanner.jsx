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
  ArrowLeft,
  Flame,
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

  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

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
    <div className="space-y-4 pb-6 text-slate-100">
      {/* Top Header Row (No floating badge above headline!) */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <h3 className="text-sm font-extrabold text-white">
          Turnstile QR Scanner
        </h3>

        {/* Offline Toggle Simulation */}
        <button
          type="button"
          onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
          className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
            isOfflineSimulated
              ? 'bg-rose-950 text-rose-300 border-rose-600'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
          }`}
          title="Toggle Network Offline Simulation"
        >
          {isOfflineSimulated ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-rose-400" /> Offline Sim
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-400" /> Online
            </>
          )}
        </button>
      </div>

      {/* Camera Viewfinder Simulator (Solid dark, no glassmorphism or colored left borders) */}
      <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl min-h-[300px]">
        {/* Camera Box Outline */}
        <div className="w-56 h-56 border-2 border-orange-500 rounded-xl relative flex items-center justify-center bg-[#0d121e]">
          {/* Scanning Line */}
          <div className="absolute left-2 right-2 h-0.5 bg-orange-500 animate-scan"></div>

          {isScanning ? (
            <div className="flex flex-col items-center gap-2 text-orange-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold tracking-wide">Validating Token...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 text-center p-3">
              <Camera className="w-8 h-8 text-slate-400" />
              <span className="text-xs text-slate-300 font-medium">
                Align with the front-desk display at entrance
              </span>
            </div>
          )}
        </div>

        {/* Live Token info */}
        <div className="mt-4 text-center space-y-1">
          <div className="text-xs text-slate-300">Entrance Rotating Session Token:</div>
          <code className="text-xs font-mono font-bold text-amber-300 bg-slate-900 px-3 py-1 rounded-md border border-slate-700 inline-block">
            {gymQRToken.token}
          </code>
          <div className="text-[11px] text-slate-400">Rotates every 15s to block card sharing</div>
        </div>
      </div>

      {/* Scan Results & High-Contrast Feedback */}
      {scanResult && (
        <div className="space-y-2">
          {scanResult.code === 'SUCCESS' && (
            <div className="bg-[#0e2417] border border-emerald-500 p-4 rounded-xl space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-300">
                    Check-In Successful
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">{scanResult.message}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-400" /> Fair Streak Updated
                </span>
                {scanResult.autoResolvedCase && (
                  <span className="bg-emerald-950 px-2 py-0.5 rounded text-[11px] text-emerald-200 border border-emerald-700">
                    Silent Churn Case Auto-Resolved
                  </span>
                )}
              </div>
            </div>
          )}

          {scanResult.code === 'DUPLICATE_SCAN' && (
            <div className="bg-[#261c0c] border border-amber-600 p-4 rounded-xl flex items-start gap-3">
              <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-amber-300">
                  Duplicate Scan Prevented
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {scanResult.message}
                </p>
              </div>
            </div>
          )}

          {scanResult.code === 'MEMBERSHIP_EXPIRED' && (
            <div className="bg-[#241014] border border-rose-600 p-4 rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-rose-300">
                    Turnstile Blocked: Pass Expired
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {scanResult.message}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onNavigateRenewal}
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                <span>Renew Membership Now (Instant Unlock)</span>
              </button>
            </div>
          )}

          {scanResult.code === 'INVALID_QR' && (
            <div className="bg-[#241014] border border-rose-600 p-4 rounded-xl flex items-start gap-3">
              <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">Invalid QR Code</h4>
                <p className="text-xs text-slate-200 mt-0.5">{scanResult.message}</p>
              </div>
            </div>
          )}

          {scanResult.code === 'OFFLINE_QUEUED' && (
            <div className="bg-[#0f1f2e] border border-blue-600 p-4 rounded-xl flex items-start gap-3">
              <WifiOff className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-300">Offline Check-In Queued</h4>
                <p className="text-xs text-slate-200 mt-0.5">{scanResult.message}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offline Queue Sync Bar */}
      {offlineSyncQueue.length > 0 && (
        <div className="bg-[#111726] border border-amber-600 p-4 rounded-xl flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-amber-300 block">
              {offlineSyncQueue.length} Check-In(s) Stored Locally
            </span>
            <span className="text-[11px] text-slate-300">
              Offline buffer ready to replay to Karnataka Gym servers.
            </span>
          </div>
          <button
            type="button"
            onClick={replayOfflineQueue}
            className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Now
          </button>
        </div>
      )}

      {/* Action Buttons (Solid colors, no gradient text, no hover opacity fades) */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => handleScanAction(gymQRToken.token)}
          disabled={isScanning}
          className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <QrCode className="w-5 h-5" />
          <span>Scan Live Entrance QR Code</span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
          <button
            type="button"
            onClick={() => handleScanAction('INVALID_EXTERNAL_CODE')}
            className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition-colors font-semibold"
          >
            Test Invalid QR Code
          </button>

          <button
            type="button"
            onClick={() => handleScanAction(gymQRToken.token)}
            className="bg-slate-900 hover:bg-slate-800 active:bg-slate-950 border border-slate-800 text-slate-300 py-2.5 px-3 rounded-xl transition-colors font-semibold"
          >
            Test Duplicate Check-In
          </button>
        </div>
      </div>
    </div>
  );
}
