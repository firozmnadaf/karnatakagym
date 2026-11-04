import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import InstallAppModal from './InstallAppModal';

export default function PWAInstallNotification() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showModalGuide, setShowModalGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  });

  useEffect(() => {
    if (isStandalone) {
      return;
    }

    // Check if user dismissed it during this session
    const isDismissed = sessionStorage.getItem('kg_install_notice_dismissed') === 'true';

    // Show install notification 1.2s after loading the web version
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 1200);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      sessionStorage.setItem('kg_install_notice_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        sessionStorage.setItem('kg_install_notice_dismissed', 'true');
      }
      setDeferredPrompt(null);
    } else {
      // If iOS or browser without programmatic trigger, show guided instructions modal
      setShowModalGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('kg_install_notice_dismissed', 'true');
  };

  // If already installed or closed, don't show the floating notification
  if (isStandalone || !isVisible) {
    return (
      <InstallAppModal
        isOpen={showModalGuide}
        onClose={() => setShowModalGuide(false)}
      />
    );
  }

  return (
    <>
      {/* Floating Bottom Web Visit Install Notification */}
      <div className="fixed bottom-4 left-3 right-3 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-[#121829] border border-orange-500/80 rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start justify-between gap-3 text-xs text-slate-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600 text-white shrink-0 shadow-md shadow-orange-950/50 mt-0.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-white leading-tight">
                  Install Karnataka Gym App
                </h4>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Fast
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Install on your phone for 1-tap turnstile QR access, offline sync, and workout streaks.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-orange-950/40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-white px-2.5 py-2 text-xs font-semibold transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Dismiss install notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guided Modal for iOS Safari / Unsupported Browsers */}
      <InstallAppModal
        isOpen={showModalGuide}
        onClose={() => {
          setShowModalGuide(false);
          setIsVisible(false);
          sessionStorage.setItem('kg_install_notice_dismissed', 'true');
        }}
      />
    </>
  );
}

