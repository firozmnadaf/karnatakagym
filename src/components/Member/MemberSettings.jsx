import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Bell,
  ArrowLeft,
  CheckCircle,
  Lock,
  Phone
} from 'lucide-react';

export default function MemberSettings({ onBack }) {
  const {
    activeMember,
    updateCommPreferences
  } = useGym();

  const [savedToast, setSavedToast] = useState(false);

  const handleToggle = (key) => {
    const current = activeMember.commPreferences || {};
    const updated = {
      ...current,
      [key]: !current[key]
    };

    updateCommPreferences(activeMember.id, updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const prefs = activeMember.commPreferences || {
    whatsapp: true,
    sms: true,
    reminders: true,
    marketingOptOut: false
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
          Preferences and Privacy
        </h3>
        <span className="text-xs text-slate-400">Member Controls</span>
      </div>

      {/* Saved Toast */}
      {savedToast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">Communication preferences updated successfully.</span>
        </div>
      )}

      {/* Member Profile Card (Clickable phone numbers!) */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={activeMember.avatar}
            alt={activeMember.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
            width={48}
            height={48}
          />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">{activeMember.name}</h4>
            <div className="text-xs text-slate-300">
              Primary Phone:{' '}
              <a href={`tel:${activeMember.phone}`} className="text-orange-400 hover:text-white font-mono underline font-semibold">
                {activeMember.phone}
              </a>
            </div>
            <div className="text-xs text-amber-300">
              Emergency Contact:{' '}
              <a href={`tel:${activeMember.emergencyContact.split(' ')[0]}`} className="text-amber-400 hover:text-white underline font-mono">
                {activeMember.emergencyContact}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Preferences & Opt-Out Controls */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl space-y-4">
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" /> Automated Communication Preferences
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Choose which automated messages Karnataka Gym sends to your phone.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {/* WhatsApp Renewal Alerts */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">WhatsApp Attendance and Renewal Alerts</span>
              <span className="text-[11px] text-slate-300">Receive renewal reminders at 14, 7, 3 and 0 days to protect your streak.</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.whatsapp}
              onChange={() => handleToggle('whatsapp')}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* SMS Alerts */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">SMS Service Notifications</span>
              <span className="text-[11px] text-slate-300">Receive turnstile security receipts and urgent facility announcements.</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.sms}
              onChange={() => handleToggle('sms')}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Streak Nudges */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Fair Streak Milestone Alerts</span>
              <span className="text-[11px] text-slate-300">Celebratory nudges when you complete planned workout targets.</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.reminders}
              onChange={() => handleToggle('reminders')}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Marketing Opt-Out Toggle */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-amber-800 bg-[#1c1810] -mx-4 -mb-4 p-4 rounded-b-xl">
            <div>
              <span className="text-xs font-bold text-amber-300 block">
                Opt Out of Promotional Messages
              </span>
              <span className="text-[11px] text-slate-300">
                When enabled, you will only receive mandatory payment receipts. All marketing blasts will be permanently halted.
              </span>
            </div>
            <input
              type="checkbox"
              checked={prefs.marketingOptOut}
              onChange={() => handleToggle('marketingOptOut')}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer shrink-0"
            />
          </div>
        </div>
      </div>

      {/* Safety & Integrity Guarantee */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-2 text-white font-bold">
          <Lock className="w-3.5 h-3.5 text-orange-400" /> Karnataka Gym Data Security Standards
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          We never store raw credit card numbers or UPI security pins. All attendance logs, payment receipts, and membership pause requests are preserved with cryptographic timestamps in compliance with consumer standards.
        </p>
      </div>
    </div>
  );
}
