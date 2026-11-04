import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { X, UserPlus, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

export default function AddMemberModal({ isOpen, onClose }) {
  const { plans, staff, addMember } = useGym();

  const [formData, setFormData] = useState({
    name: '',
    phone: '+91 ',
    gender: 'Male',
    planId: 'plan_3m',
    preferredSlot: 'Morning 6-8 AM',
    assignedTrainerId: 'staff_1',
    membershipExpiry: '',
    emergencyContact: '',
    notes: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-calculate expiry based on chosen plan
  useEffect(() => {
    const selectedPlan = plans.find(p => p.id === formData.planId) || plans[0];
    if (selectedPlan) {
      const d = new Date();
      d.setDate(d.getDate() + (selectedPlan.durationDays || 30));
      setFormData(prev => ({ ...prev, membershipExpiry: d.toISOString().split('T')[0] }));
    }
  }, [formData.planId, plans]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter member full name.');
      return;
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || cleanPhone === '+91' || cleanPhone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number with +91 prefix.');
      return;
    }

    try {
      const res = addMember(formData);
      if (res.success) {
        setSuccessMsg(`Member ${formData.name} added successfully!`);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to add member.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error creating member profile.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-[#111726] border border-slate-700 rounded-2xl max-w-xl w-full p-5 md:p-6 space-y-4 shadow-2xl text-xs text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Register New Member
              </h3>
              <p className="text-xs text-slate-300">
                Karnataka Gym Fitness Centre - Devi Nagar, Hubli
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-700 text-rose-200 p-3 rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-600 text-emerald-200 p-3 rounded-xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Member Full Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Basavaraj Patil"
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Hubli Mobile Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 94801 88301"
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Gender <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => {
                  const g = e.target.value;
                  // If female, default to women specialist Kavita Kalburgi for safety & inclusion
                  const suggestedTrainer = g === 'Female' ? 'staff_2' : formData.assignedTrainerId;
                  const suggestedSlot = g === 'Female' ? 'Women Special 11 AM - 1 PM' : formData.preferredSlot;
                  setFormData({ ...formData, gender: g, assignedTrainerId: suggestedTrainer, preferredSlot: suggestedSlot });
                }}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female (Safe environment dedicated program)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Preferred Workout Slot */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Preferred Slot <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.preferredSlot}
                onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Morning 6-8 AM">Morning 6:00 AM - 8:00 AM</option>
                <option value="Morning 8-10 AM">Morning 8:00 AM - 10:00 AM</option>
                <option value="Women Special 11 AM - 1 PM">Women Special 11:00 AM - 1:00 PM</option>
                <option value="Evening 4-6 PM">Evening 4:00 PM - 6:00 PM</option>
                <option value="Evening 6-8 PM">Evening 6:00 PM - 8:00 PM</option>
                <option value="Night 8-9 PM">Night 8:00 PM - 9:00 PM</option>
              </select>
            </div>

            {/* Membership Plan */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Membership Plan <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ₹{p.discountPrice.toLocaleString('en-IN')} ({p.durationDays} days)
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Mentor (Trainer) */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Assigned Mentor / Trainer <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.assignedTrainerId}
                onChange={(e) => setFormData({ ...formData, assignedTrainerId: e.target.value })}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-semibold"
              >
                {staff.filter(s => s.role !== 'FRONT_DESK').map(t => (
                  <option key={t.id} value={t.id}>
                    Coach {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Membership Expiry Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.membershipExpiry}
                onChange={(e) => setFormData({ ...formData, membershipExpiry: e.target.value })}
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="+91 94801 88399 (Spouse/Family)"
                className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Member Intake Notes / Fitness Goals
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Weight loss goal, previously trained at Hubli Gym, lives in Devi Nagar."
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Women Safe Highlight */}
          {formData.gender === 'Female' && (
            <div className="bg-[#101b2a] border border-cyan-800 p-2.5 rounded-xl flex items-center gap-2 text-cyan-200 text-[11px]">
              <Shield className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Safe environment protocol enabled: Female mentor Coach Kavita Kalburgi assigned. Dedicated morning slot 11:00 AM - 1:00 PM recommended.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 font-bold flex items-center gap-2 transition-colors shadow-lg shadow-orange-950/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
