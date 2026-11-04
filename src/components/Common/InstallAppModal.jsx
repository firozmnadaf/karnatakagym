import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  X,
  Share2,
  PlusSquare,
  CheckCircle2,
  QrCode,
  Shield,
  Zap,
  WifiOff
} from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already installed in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt event on Android / Chrome
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(currentUrl || window.location.href)}`;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-xs text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Download Member App
              </h3>
              <p className="text-xs text-slate-400">
                Karnataka Gym Hubli - Mobile App
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Already Installed State */}
        {isInstalled ? (
          <div className="bg-[#0e2417] border border-emerald-500 p-4 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Karnataka Gym App is Installed!</h4>
            <p className="text-slate-300">
              You are already running the full standalone app with offline check-in and streak tracking.
            </p>
          </div>
        ) : (
          <>
            {/* Value Proposition Highlights */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#0b0f17] border border-slate-800 p-2.5 rounded-xl flex items-start gap-2">
                <WifiOff className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Offline Access</div>
                  <div className="text-[10px] text-slate-400">Check in without mobile data</div>
                </div>
              </div>

              <div className="bg-[#0b0f17] border border-slate-800 p-2.5 rounded-xl flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">Instant Launch</div>
                  <div className="text-[10px] text-slate-400">Opens straight to turnstile QR</div>
                </div>
              </div>
            </div>

            {/* Android / Desktop Chrome 1-Click Install */}
            {deferredPrompt && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-950/40 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App to Home Screen</span>
                </button>
                <div className="text-[11px] text-center text-slate-400">
                  Installs official Karnataka Gym app to your phone home screen in 1 second.
                </div>
              </div>
            )}

            {/* iOS (iPhone / iPad) Step-by-Step Guide */}
            {isIOS && (
              <div className="bg-[#0b0f17] border border-slate-700 p-3.5 rounded-xl space-y-2.5">
                <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>How to Install on iPhone (Safari):</span>
                </div>

                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                    <span>Tap the <strong className="text-white">Share button</strong> (square with up-arrow) at the bottom bar of Safari.</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                    <span>Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong> with the plus icon.</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                    <span>Tap <strong className="text-white">"Add"</strong> in the top right. Karnataka Gym app icon is saved!</span>
                  </div>
                </div>
              </div>
            )}

            {/* If neither prompt nor iOS: General Android/Chrome guide & QR code */}
            {!deferredPrompt && !isIOS && (
              <div className="space-y-3">
                <div className="bg-[#0b0f17] border border-slate-800 p-3 rounded-xl space-y-1.5 text-[11px] text-slate-300">
                  <div className="font-bold text-white text-xs">Install from Chrome / Mobile Browser:</div>
                  <div>
                    1. Tap the <strong className="text-white">three dots menu (⋮)</strong> in your browser top right.
                  </div>
                  <div>
                    2. Select <strong className="text-orange-400">"Install app"</strong> or <strong className="text-orange-400">"Add to Home screen"</strong>.
                  </div>
                  <div>
                    3. Confirm to install Karnataka Gym on your phone.
                  </div>
                </div>

                {/* QR Code to Open on Member Phone */}
                <div className="bg-[#0b0f17] border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg shrink-0">
                    <img
                      src={qrCodeUrl}
                      alt="Scan to open Karnataka Gym on phone"
                      className="w-20 h-20 object-contain"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="font-bold text-white flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5 text-orange-400" />
                      <span>Scan with Phone Camera</span>
                    </div>
                    <p className="text-slate-400 leading-snug">
                      Point your mobile phone camera at this QR code to open Karnataka Gym and install it directly on your phone.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Karnataka Gym Hubli - 580031</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
