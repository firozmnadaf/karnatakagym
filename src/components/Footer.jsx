import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#0d121c] text-slate-300 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-5 text-xs">
        {/* Top Grid: Gym Identity, Location & Contact Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-5 border-b border-slate-800">
          {/* Col 1: Gym info */}
          <div className="space-y-1.5">
            <div className="font-extrabold text-sm text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Karnataka Gym Fitness Centre
            </div>
            <div className="text-slate-300">
              Community fitness, fair streak tracking, and safe, spacious workout space for women in Hubli.
            </div>
            <div className="text-slate-400">
              Hours: 6:00 AM - 9:00 PM (Monday to Saturday) | Sunday: 7:00 AM - 1:00 PM
            </div>
          </div>

          {/* Col 2: Clickable Contacts & Directions */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Location & Quick Contact
            </div>
            <div>
              Address:{' '}
              <a
                href="https://maps.google.com/?q=Devi+Nagar+Hubli+Karnataka+580031"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                title="Open location in Google Maps"
              >
                Devi Nagar, Hubli - 580031
              </a>
            </div>
            <div>
              Direct Phone:{' '}
              <a
                href="tel:+919663396058"
                className="text-orange-400 hover:text-orange-300 font-bold"
                title="Call Karnataka Gym front desk"
              >
                +91 96633 96058
              </a>
            </div>
            <div>
              Email Support:{' '}
              <a
                href="mailto:info@karnatakagym.in"
                className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                title="Email Karnataka Gym"
              >
                info@karnatakagym.in
              </a>
            </div>
          </div>

          {/* Col 3: Official Developer Badge with working tel & mailto */}
          <div className="space-y-2 md:text-right flex flex-col md:items-end justify-center">
            <div className="inline-block bg-[#162032] border border-slate-700 p-3 rounded-xl text-left md:text-right space-y-1">
              <div className="text-slate-300 font-medium">
                Website Developed by <strong className="text-white font-bold">Ayesha Tech Studio</strong>
              </div>
              <div>
                Contact:{' '}
                <a
                  href="tel:+919663396058"
                  className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2"
                >
                  +91 96633 96058
                </a>
              </div>
              <div className="text-[11px] text-slate-400">
                Email:{' '}
                <a
                  href="mailto:ayeshatechstudio@gmail.com"
                  className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
                >
                  ayeshatechstudio@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright and Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            &copy; {currentYear} Karnataka Gym Fitness Centre. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+919663396058"
              className="hover:text-slate-200 transition-colors"
            >
              Helpline: +91 96633 96058
            </a>
            <span>|</span>
            <a
              href="mailto:info@karnatakagym.in"
              className="hover:text-slate-200 transition-colors"
            >
              Support: info@karnatakagym.in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
