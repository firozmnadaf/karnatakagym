import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#0d121c] text-slate-300 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-400 text-[11px]">
          &copy; {currentYear} Karnataka Gym Fitness Centre. All rights reserved.
        </div>

        {/* Official Developer Attribution */}
        <div className="text-slate-300 text-xs text-center sm:text-right">
          Website Developed by <strong className="text-white font-bold">Ayesha Tech Studio</strong> | Contact:{' '}
          <a
            href="tel:+919663396058"
            className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2"
          >
            +91 96633 96058
          </a>
        </div>
      </div>
    </footer>
  );
}
