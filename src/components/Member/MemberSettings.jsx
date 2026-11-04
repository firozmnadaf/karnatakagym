import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Bell,
  MessageSquare,
  Shield,
  Phone,
  User,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Lock,
  Heart
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
          Preferences & Privacy
        </span>
        <span className="text-xs text-slate-400">
          Hubli Member Care
        </span>
      </div>

      {/* Saved Toast */}
      {savedToast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Communication preferences saved instantly.</span>
        </div>
      )}

      {/* Member Profile Summary */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={activeMember.avatar}
            alt={activeMember.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/40"
          />
          <div>
            <h3 className="text-sm font-extrabold text-white">{activeMember.name}</h3>
            <div className="text-xs text-slate-400">{activeMember.phone}</div>
            <div className="text-[11px] text-amber-400 mt-0.5">Emergency: {activeMember.emergencyContact}</div>
          </div>
        </div>
      </div>

      {/* Communication Preferences & Opt-Out Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" /> Communication Controls
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Control which automated messages you receive from Karnataka Gym Devi Nagar.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {/* WhatsApp Renewal & Nudge Alerts */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">WhatsApp Attendance & Renewal Alerts</span>
              <span className="text-[11px] text-slate-400">Receive renewal reminders at 14, 7, 3 and 0 days to protect streak.</span>
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
              <span className="text-[11px] text-slate-400">Receive entrance security receipts and emergency gym notices.</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.sms}
              onChange={() => handleToggle('sms')}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Streak & Milestone Alerts */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Fair Streak & Milestone Nudges</span>
              <span className="text-[11px] text-slate-400">Motivational notifications celebrating your planned workout streaks.</span>
            </div>
            <input
              type="checkbox"
              checked={prefs.reminders}
              onChange={() => handleToggle('reminders')}
              className="w-5 h-5 accent-orange-500 rounded cursor-pointer shrink-0"
            />
          </div>

          {/* Marketing Opt-Out Toggle (Crucial Requirement) */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-amber-500/30 bg-amber-500/5 -mx-4 -mb-4 p-4 rounded-b-2xl">
            <div>
              <span className="text-xs font-bold text-amber-300 block flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Opt Out of Marketing & Promotional Messages
              </span>
              <span className="text-[11px] text-slate-400">
                When enabled, you will only receive mandatory transactional receipts. All discount promos and marketing blasts will be permanently halted.
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

      {/* Safety & Medical Disclaimers */}
      <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-bold">
          <Lock className="w-3.5 h-3.5 text-orange-400" /> Karnataka Gym Data Safety & Integrity:
        </div>
        <p className="text-[11px] leading-relaxed">
          We never store raw credit card or UPI security pins. All attendance overrides, payment receipts, and membership freeze approvals are logged with timestamps in accordance with Karnataka consumer standards.
        </p>
      </div>
    </div>
  );
}

