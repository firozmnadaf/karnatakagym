import React, { useState, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Bell,
  ArrowLeft,
  CheckCircle,
  Lock,
  Smartphone,
  Download,
  LogOut,
  Camera,
  Edit2,
  Phone,
  User,
  X,
  Upload,
  ShieldCheck
} from 'lucide-react';
import InstallAppModal from '../Common/InstallAppModal';

export default function MemberSettings({ onBack }) {
  const {
    activeMember,
    updateCommPreferences,
    updateMemberProfile,
    logout,
    currentUser
  } = useGym();

  const [savedToast, setSavedToast] = useState(false);
  const [profileToast, setProfileToast] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState(activeMember?.name || '');
  const [editPhone, setEditPhone] = useState(activeMember?.phone || '');
  const [editEmergency, setEditEmergency] = useState(activeMember?.emergencyContact || '');
  const [editAvatar, setEditAvatar] = useState(activeMember?.avatar || '');

  const fileInputRef = useRef(null);

  const openEditModal = () => {
    setEditName(activeMember?.name || '');
    setEditPhone(activeMember?.phone || '');
    setEditEmergency(activeMember?.emergencyContact || '');
    setEditAvatar(activeMember?.avatar || '');
    setIsEditModalOpen(true);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Please select an image smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editPhone.trim()) {
      alert('Please enter a valid primary phone number.');
      return;
    }

    updateMemberProfile(activeMember.id, {
      name: editName.trim() || activeMember.name,
      phone: editPhone.trim(),
      emergencyContact: editEmergency.trim(),
      avatar: editAvatar || activeMember.avatar
    });

    setIsEditModalOpen(false);
    setProfileToast('Profile photo and contact numbers updated! Synced to owner records.');
    setTimeout(() => setProfileToast(null), 3500);
  };

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
      <div className="flex items-center gap-3">
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
      </div>

      {/* Saved Toast */}
      {savedToast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">Communication preferences updated successfully.</span>
        </div>
      )}

      {/* Profile Updated Toast */}
      {profileToast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{profileToast}</span>
        </div>
      )}

      {/* Member Profile Card (Clickable phone numbers & Edit Photo/Contacts) */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={openEditModal} title="Change Profile Picture">
              <img
                src={activeMember.avatar}
                alt={activeMember.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-orange-500 shadow-md"
                width={56}
                height={56}
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 bg-orange-600 text-white p-1 rounded-full border border-[#111726] shadow"
                title="Change Photo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

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
                <a href={`tel:${(activeMember.emergencyContact || '').split(' ')[0]}`} className="text-amber-400 hover:text-white underline font-mono">
                  {activeMember.emergencyContact || 'Not recorded'}
                </a>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openEditModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-orange-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Owner Records Sync
          </span>
          <span>Tap Edit to update photo or contacts</span>
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

      {/* Mobile App Download Card */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-orange-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-white block">Download App to Mobile</span>
            <span className="text-[11px] text-slate-300">Run standalone with offline turnstile access</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInstallModal(true)}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      </div>

      {/* Member Sign Out Button */}
      <div className="bg-[#111726] border border-rose-900/40 p-4 rounded-xl flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-white block">Member Session</span>
          <span className="text-[11px] text-slate-400">
            Signed in as {currentUser?.fullName || activeMember.name}
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
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

      {/* Developer Attribution */}
      <div className="text-center pt-3 pb-1 text-[11px] text-slate-500">
        Developed by <strong className="text-slate-300 font-bold">Ayesha Tech Studio</strong> | Contact:{' '}
        <a href="tel:+919663396058" className="text-orange-400 font-bold underline">
          +91 96633 96058
        </a>
      </div>

      {/* Install App Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      {/* Edit Profile & Contacts Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-sm p-5 space-y-4 my-8 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" />
                <span>Edit Photo & Contacts</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center space-y-2.5 p-3 rounded-xl bg-[#0b0f17] border border-slate-800">
                <div className="relative">
                  <img
                    src={editAvatar}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-500 shadow-lg"
                    width={80}
                    height={80}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 bg-orange-600 hover:bg-orange-500 text-white p-1.5 rounded-full border border-slate-900 shadow"
                    title="Upload Photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-orange-400 hover:text-orange-300 underline flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload New Photo from Device</span>
                  </button>
                  <span className="text-[10px] text-slate-400">JPG, PNG or WEBP (Max 3MB)</span>
                </div>

                {/* Preset Avatars for Quick Pick */}
                <div className="space-y-1 w-full pt-2 border-t border-slate-800/80 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Or Choose Preset Avatar:</span>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'
                    ].map((presetUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(presetUrl)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                          editAvatar === presetUrl ? 'border-orange-500 ring-2 ring-orange-500/50' : 'border-slate-700'
                        }`}
                      >
                        <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Ananya Kulkarni"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Primary Phone Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Primary Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. +91 96633 12901"
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400">Used for WhatsApp streak nudges and check-in security</span>
              </div>

              {/* Emergency Contact Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Emergency Contact & Relation
                </label>
                <input
                  type="text"
                  value={editEmergency}
                  onChange={(e) => setEditEmergency(e.target.value)}
                  placeholder="e.g. +91 96633 12999 (Mother)"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                <span className="text-[10px] text-amber-300 font-semibold">Immediate contact in case of workout emergency</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors shadow-lg shadow-orange-950/40"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
