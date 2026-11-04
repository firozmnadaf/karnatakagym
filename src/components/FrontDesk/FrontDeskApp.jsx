import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  QrCode,
  UserCheck,
  Search,
  CheckCircle,
  AlertOctagon,
  Clock,
  Shield,
  RefreshCw,
  Phone,
  User,
  Sparkles,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FrontDeskApp() {
  const {
    gymQRToken,
    members,
    staff,
    processCheckIn,
    attendance,
    logAudit
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [assistedReason, setAssistedReason] = useState('Forgot mobile phone at home');
  const [deskStaffId, setDeskStaffId] = useState('staff_4'); // Sunita Byahatti
  const [checkInResult, setCheckInResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter members for fast front-desk lookup
  const searchResults = searchTerm.trim().length > 1
    ? members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAssistedCheckIn = (e) => {
    e.preventDefault();
    if (!selectedMember) return;

    setIsProcessing(true);
    setCheckInResult(null);

    setTimeout(() => {
      setIsProcessing(false);
      const res = processCheckIn({
        memberId: selectedMember.id,
        method: 'FRONT_DESK_ASSISTED',
        assistedReason,
        staffId: deskStaffId
      });

      setCheckInResult(res);

      if (res.success && res.code === 'SUCCESS') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-6 pb-8 max-w-7xl mx-auto">
      {/* Front-Desk Welcome Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Sunita Byahatti"
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                Front-Desk Reception
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Logged In: Sunita Byahatti
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">
              Entrance Turnstile & Assisted Check-In Terminal
            </h2>
            <p className="text-xs text-slate-400">
              Devi Nagar, Hubli • Operating 6:00 AM – 9:00 PM • Safe Women Space Monitor
            </p>
          </div>
        </div>

        {/* Quick Reception Stats */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Today's Total Entries</span>
            <span className="text-lg font-black text-white">
              {attendance.filter(a => a.checkInTime.startsWith(new Date().toISOString().split('T')[0])).length}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Assisted Entries</span>
            <span className="text-lg font-black text-purple-400">
              {attendance.filter(a => a.method === 'FRONT_DESK_ASSISTED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Entrance Big-Screen Turnstile Display vs Fast Assisted Check-In */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Entrance Rotating QR Display (Tablet / TV view for gym gate) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xl">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4" /> Turnstile Scanner Display
            </span>
            <span className="text-[11px] font-mono bg-orange-500/10 text-orange-300 px-2.5 py-1 rounded-lg border border-orange-500/20 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin text-orange-400" />
              Rotates every 15s
            </span>
          </div>

          <div className="my-6 flex flex-col items-center">
            {/* Visual QR Simulator */}
            <div className="w-56 h-56 bg-white p-4 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-orange-500/30 relative">
              {/* Fake QR Matrix Graphic */}
              <div className="w-full h-full bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 opacity-90">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i % 2 === 0 || i % 5 === 0) ? 'bg-white' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                {/* Center Hubli Gym Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-xs shadow-lg border-2 border-white">
                    KG
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400">Current Session Bound Token:</span>
              <div className="font-mono text-sm font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 mt-1">
                {gymQRToken.token}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Prevents screenshot sharing & unauthorized entry pass sharing.
              </span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Gate 01 • Main Hall</span>
            <span className="text-emerald-400 font-semibold">Active & Armed</span>
          </div>
        </div>

        {/* Right: Fast Member Lookup & Assisted Check-In */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              Assisted Front-Desk Check-In
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mandatory reason required for audit logging whenever staff bypasses turnstile QR.
            </p>
          </div>

          {/* Member Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search member by Name, Mobile (+91...) or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-3 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-orange-500 shadow-inner"
            />
          </div>

          {/* Quick Member Selection Results */}
          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1.5 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
              {searchResults.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMember(m);
                    setSearchTerm('');
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <strong className="text-white block">{m.name}</strong>
                      <span className="text-slate-400 text-[11px]">{m.phone}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    m.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Selected Member Form */}
          {selectedMember ? (
            <form onSubmit={handleAssistedCheckIn} className="space-y-3.5 pt-2 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-10 h-10 rounded-full object-cover border border-orange-500"
                  />
                  <div>
                    <strong className="text-white text-sm block">{selectedMember.name}</strong>
                    <div className="text-slate-400 text-[11px]">{selectedMember.phone}</div>
                    <div className="text-amber-400 text-[11px]">Expires: {selectedMember.membershipExpiry}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="text-slate-500 hover:text-white text-xs underline"
                >
                  Change
                </button>
              </div>

              {/* Mandatory Reason Dropdown */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Mandatory Assisted Check-In Reason <span className="text-rose-400">*</span>
                </label>
                <select
                  value={assistedReason}
                  onChange={(e) => setAssistedReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="Forgot mobile phone at home">Forgot mobile phone at home</option>
                  <option value="Phone battery drained / device dead">Phone battery drained / device dead</option>
                  <option value="Camera cracked / hardware scan error">Camera cracked / hardware scan error</option>
                  <option value="Senior citizen / assisted onboarding">Senior citizen / assisted onboarding</option>
                  <option value="New member badge pending issue">New member badge pending issue</option>
                  <option value="Network / SIM outage on member carrier">Network / SIM outage on member carrier</option>
                </select>
              </div>

              {/* Staff Verifier */}
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  Authorizing Staff Member
                </label>
                <select
                  value={deskStaffId}
                  onChange={(e) => setDeskStaffId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow text-xs uppercase tracking-wider disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify & Log Assisted Check-In</span>
              </button>
            </form>
          ) : (
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
              Type member's name or mobile number above to initiate assisted turnstile entry.
            </div>
          )}

          {/* Check-In Response Card */}
          {checkInResult && (
            <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in ${
              checkInResult.success
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
            }`}>
              {checkInResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-bold">
                  {checkInResult.success ? 'Assisted Entry Verified!' : 'Entry Blocked'}
                </strong>
                <span>{checkInResult.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

