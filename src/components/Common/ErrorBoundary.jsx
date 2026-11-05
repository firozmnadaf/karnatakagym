import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Karnataka Gym application encountered an error:', error, errorInfo);
  }

  handleHardReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.unregister());
        });
      }
    } catch {
      // Ignore cleanup failures
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#111726] border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white">
                Application Recovery
              </h2>
              <p className="text-xs text-slate-300">
                A temporary version update or cache conflict occurred in Karnataka Gym.
              </p>
            </div>

            <div className="p-3 bg-[#080b12] rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono text-left overflow-auto max-h-24">
              {this.state.error?.message || 'Unexpected application state'}
            </div>

            <button
              type="button"
              onClick={this.handleHardReset}
              className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-950/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clean Cache & Reload System</span>
            </button>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              Developed by Ayesha Tech Studio | Contact: +91 96633 96058
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

