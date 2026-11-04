import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Gym Trust & Location */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-center md:text-left">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Karnataka Gym Fitness Centre
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Devi Nagar, Hubli - 580031</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Safe & Spacious for Women</span>
          </div>
        </div>

        {/* Center / Right: Mandatory Official Creator Tag */}
        <div className="text-center md:text-right flex flex-col items-center md:items-end gap-1">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full font-medium tracking-wide flex items-center gap-2">
            <span>Website Developed by <strong className="text-white">Ayesha Tech Studio</strong></span>
            <span className="text-slate-500">|</span>
            <a 
              href="tel:+919663396058" 
              className="text-amber-400 hover:text-white transition-colors flex items-center gap-1 underline underline-offset-2"
            >
              <Phone className="w-3 h-3" />
              +91 96633 96058
            </a>
          </div>
          <span className="text-[11px] text-slate-500">
            Hubli Premium Gym Retention & Turnstile Management Engine • All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}

