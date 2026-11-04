import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Users,
  UserPlus,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Phone,
  Shield,
  Calendar,
  Clock
} from 'lucide-react';
import AddMemberModal from './AddMemberModal';

export default function OwnerMemberList() {
  const {
    members,
    staff,
    plans,
    removeMember,
    changeAssignedMentor
  } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [removalReason, setRemovalReason] = useState('Administrative removal');
  const [toastMessage, setToastMessage] = useState(null);

  const trainers = staff.filter(s => s.role !== 'FRONT_DESK');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleMentorChange = (memberId, newTrainerId, memberName) => {
    const res = changeAssignedMentor(memberId, newTrainerId);
    if (res.success) {
      showToast(res.message);
    }
  };

  const handleConfirmRemoval = () => {
    if (!memberToRemove) return;
    const res = removeMember(memberToRemove.id, removalReason);
    if (res.success) {
      showToast(res.message);
    }
    setMemberToRemove(null);
    setRemovalReason('Administrative removal');
  };

  // Filter members
  const filteredMembers = members.filter(m => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (mentorFilter !== 'ALL' && m.assignedTrainerId !== mentorFilter) return false;
    if (genderFilter !== 'ALL' && m.gender !== genderFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const phoneClean = m.phone.replace(/[^0-9]/g, '');
      const searchClean = searchTerm.replace(/[^0-9]/g, '');
      const phoneMatch = searchClean && phoneClean.includes(searchClean);
      return (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        phoneMatch
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 text-slate-100">
      {/* Top Banner and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111726] border border-slate-800 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white">
              Member Directory and Mentor Assignments
            </h3>
            <span className="bg-orange-950 text-orange-400 border border-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {members.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Manage Karnataka Gym members, enroll new members, assign and reassign certified fitness mentors, or remove profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-orange-950/40"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-[#111726] border border-slate-800 p-3 rounded-xl space-y-3 text-xs">
        <div className="flex flex-col md:flex-row items-center gap-2">
          {/* Search Box */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by member name, phone number, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Mentor Filter */}
          <div className="w-full md:w-auto flex items-center gap-1.5">
            <span className="text-slate-400 whitespace-nowrap font-semibold">Mentor:</span>
            <select
              value={mentorFilter}
              onChange={(e) => setMentorFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-orange-500 w-full md:w-44 truncate"
            >
              <option value="ALL">All Mentors</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>Coach {t.name}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="w-full md:w-auto flex items-center gap-1.5">
            <span className="text-slate-400 whitespace-nowrap font-semibold">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-orange-500 w-full md:w-32"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800">
          <span className="text-slate-400 text-xs font-semibold whitespace-nowrap mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'active', label: 'Active Members' },
            { id: 'paused', label: 'Paused' },
            { id: 'expired', label: 'Expired' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                statusFilter === f.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-slate-400 font-mono text-[11px] whitespace-nowrap">
            Showing {filteredMembers.length} of {members.length}
          </span>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="bg-[#111726] border border-slate-800 p-8 rounded-xl text-center text-slate-300 text-xs space-y-2">
            <p>No members found matching your search or filters.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setMentorFilter('ALL');
                setGenderFilter('ALL');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMembers.map(m => {
            const plan = plans.find(p => p.id === m.planId);
            const currentTrainer = staff.find(s => s.id === m.assignedTrainerId);

            return (
              <div
                key={m.id}
                className="bg-[#111726] border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors space-y-3"
              >
                {/* Header Row: Avatar, Member Info, Status */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-700"
                      width={48}
                      height={48}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{m.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {m.id}
                        </span>
                        {m.gender === 'Female' && (
                          <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                            Women Program
                          </span>
                        )}
                      </div>

                      {/* Clickable phone link */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-0.5">
                        <a
                          href={`tel:${m.phone}`}
                          className="text-orange-400 hover:text-white font-mono underline font-semibold flex items-center gap-1"
                          title="Call member directly"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{m.phone}</span>
                        </a>
                        <span>|</span>
                        <span>Emergency: {m.emergencyContact || 'Not recorded'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        m.status === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : m.status === 'paused'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>

                {/* Details Bar: Plan, Slot, Expiry, Last Check-in */}
                <div className="bg-[#0b0f17] p-3 rounded-lg border border-slate-800 text-xs text-slate-300 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Membership Plan</span>
                    <strong className="text-white">{plan ? plan.name : 'Standard Pass'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferred Slot</span>
                    <strong className="text-slate-200">{m.preferredSlot}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Expiry Date</span>
                    <strong className={new Date(m.membershipExpiry) < new Date() ? 'text-rose-400' : 'text-emerald-400'}>
                      {m.membershipExpiry}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Check-In</span>
                    <strong className="text-slate-200">
                      {m.lastCheckIn
                        ? new Date(m.lastCheckIn).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : 'No visits yet'}
                    </strong>
                  </div>
                </div>

                {/* Mentor Assignment & Member Removal Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                  {/* Change Mentor Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <UserCheck className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="text-slate-300 font-bold whitespace-nowrap">Assigned Mentor:</span>
                    <select
                      value={m.assignedTrainerId || 'staff_1'}
                      onChange={(e) => handleMentorChange(m.id, e.target.value, m.name)}
                      className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 max-w-[260px] truncate"
                    >
                      {trainers.map(t => (
                        <option key={t.id} value={t.id}>
                          Coach {t.name} ({t.specialization})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Member Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMemberToRemove(m)}
                      className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Remove member from gym records"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Remove Member</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Remove Member Confirmation Dialog */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-rose-800/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs text-slate-100">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="text-base font-extrabold text-white">Confirm Member Removal</h4>
            </div>

            <div className="bg-[#0b0f17] p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-white text-sm">{memberToRemove.name}</div>
              <div className="text-slate-300 font-mono">{memberToRemove.phone}</div>
              <div className="text-slate-400">Member ID: {memberToRemove.id}</div>
            </div>

            <p className="text-slate-300">
              Are you sure you want to remove this member from Karnataka Gym active records? Their access turnstile pass and profile will be removed and an audit log event will be created.
            </p>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Reason for Removal:
              </label>
              <select
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Member relocated out of Hubli">Member relocated out of Hubli</option>
                <option value="Requested membership cancellation">Requested membership cancellation</option>
                <option value="Prolonged medical unfitness">Prolonged medical unfitness</option>
                <option value="Administrative record cleanup">Administrative record cleanup</option>
                <option value="Code of conduct violation">Code of conduct violation</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoval}
                className="px-4 py-2 rounded-xl text-white bg-rose-700 hover:bg-rose-600 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
