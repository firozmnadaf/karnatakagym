import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  QrCode,
  UserCheck,
  Search,
  CheckCircle,
  AlertOctagon,
  RefreshCw,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FrontDeskApp() {
  const {
    gymQRToken,
    members,
    staff,
    processCheckIn,
    attendance
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [assistedReason, setAssistedReason] = useState('Forgot mobile phone at home');
  const [deskStaffId, setDeskStaffId] = useState('staff_4');
  const [checkInResult, setCheckInResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    <div className="space-y-6 pb-8 max-w-7xl mx-auto text-slate-100">
      {/* Front-Desk Welcome Bar (No badge above headline!) */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&auto=format&fit=crop&q=75"
            alt="Sunita Byahatti"
            className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
            width={48}
            height={48}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                Entrance Turnstile and Assisted Check-In Terminal
              </h2>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Staff: Sunita Byahatti
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Devi Nagar, Hubli - Operating Hours: 6:00 AM - 9:00 PM | Helpline:{' '}
              <a href="tel:+919663396058" className="text-orange-400 hover:text-white font-bold underline">
                +91 96633 96058
              </a>
            </p>
          </div>
        </div>

        {/* Reception Stats */}
        <div className="flex items-center gap-4 bg-[#0b0f17] p-3 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Today's Entries</span>
            <span className="text-lg font-black text-white">
              {attendance.filter(a => a.checkInTime.startsWith(new Date().toISOString().split('T')[0])).length}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assisted Log</span>
            <span className="text-lg font-black text-purple-300">
              {attendance.filter(a => a.method === 'FRONT_DESK_ASSISTED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Turnstile QR Display vs Fast Assisted Check-In */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Entrance Big-Screen Turnstile Display */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between text-center relative shadow-xl">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-orange-400" /> Turnstile Scanner Display
            </h3>
            <span className="text-[11px] font-mono bg-[#162032] text-orange-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 font-semibold">
              <RefreshCw className="w-3 h-3 animate-spin text-orange-400" />
              Rotates every 15s
            </span>
          </div>

          <div className="my-6 flex flex-col items-center">
            {/* Visual QR Simulator */}
            <div className="w-56 h-56 bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 border-slate-300 relative">
              <div className="w-full h-full bg-[#0b0f17] rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-6 gap-1 w-full h-full p-2 opacity-95">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        (i % 2 === 0 || i % 5 === 0) ? 'bg-white' : 'bg-transparent'
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-lg border-2 border-white">
                    KG
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <div className="text-xs text-slate-300 font-medium">Session Token:</div>
              <div className="font-mono text-sm font-black text-amber-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 inline-block">
                {gymQRToken.token}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Session bound token eliminates pass sharing and screenshot reuse.
              </span>
            </div>
          </div>

          <div className="w-full pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Gate 01 - Main Entrance</span>
            <span className="text-emerald-400 font-bold">Turnstile Armed</span>
          </div>
        </div>

        {/* Right: Fast Member Lookup & Assisted Check-In */}
        <div className="bg-[#111726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-orange-400" />
              Assisted Front-Desk Check-In
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Mandatory reason required for audit logging whenever staff bypasses turnstile scanner.
            </p>
          </div>

          {/* Member Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search member by Name or Mobile (+91...)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-orange-500 shadow-inner"
            />
          </div>

          {/* Quick Member Selection Results */}
          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto space-y-1.5 bg-slate-900 p-2 rounded-xl border border-slate-700 text-xs">
              {searchResults.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMember(m);
                    setSearchTerm('');
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full object-cover"
                      width={28}
                      height={28}
                    />
                    <div>
                      <strong className="text-white block">{m.name}</strong>
                      <span className="text-slate-300 text-[11px] font-mono">{m.phone}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    m.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Selected Member Form */}
          {selectedMember ? (
            <form onSubmit={handleAssistedCheckIn} className="space-y-3.5 pt-1 text-xs">
              <div className="bg-[#0b0f17] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-10 h-10 rounded-full object-cover border border-orange-500"
                    width={40}
                    height={40}
                  />
                  <div>
                    <strong className="text-white text-sm block">{selectedMember.name}</strong>
                    <a href={`tel:${selectedMember.phone}`} className="text-orange-400 hover:text-white text-xs font-mono underline">
                      {selectedMember.phone}
                    </a>
                    <div className="text-amber-400 text-xs mt-0.5">Expires: {selectedMember.membershipExpiry}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="text-slate-400 hover:text-white text-xs underline font-semibold"
                >
                  Change
                </button>
              </div>

              {/* Mandatory Reason Dropdown */}
              <div>
                <label className="text-slate-200 font-bold block mb-1">
                  Mandatory Assisted Check-In Reason <span className="text-rose-400">*</span>
                </label>
                <select
                  value={assistedReason}
                  onChange={(e) => setAssistedReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
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
                <label className="text-slate-200 font-bold block mb-1">
                  Authorizing Staff Member
                </label>
                <select
                  value={deskStaffId}
                  onChange={(e) => setDeskStaffId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-orange-500"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button (Solid colors, no hover fades) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify and Log Assisted Check-In</span>
              </button>
            </form>
          ) : (
            <div className="bg-[#0b0f17] p-6 rounded-xl border border-slate-800 text-center text-slate-300 text-xs">
              Search member by name or mobile number above to initiate assisted turnstile check-in.
            </div>
          )}

          {/* Check-In Response Card */}
          {checkInResult && (
            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              checkInResult.success
                ? 'bg-[#0e2417] border-emerald-500 text-emerald-300'
                : 'bg-[#241014] border-rose-600 text-rose-300'
            }`}>
              {checkInResult.success ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <strong className="block font-bold">
                  {checkInResult.success ? 'Assisted Entry Verified' : 'Entry Blocked'}
                </strong>
                <span className="text-slate-200">{checkInResult.message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
