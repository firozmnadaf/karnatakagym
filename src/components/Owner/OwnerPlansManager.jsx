import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Star,
  Clock,
  IndianRupee,
  ShieldCheck,
  X,
  AlertTriangle,
  Users
} from 'lucide-react';

export default function OwnerPlansManager() {
  const {
    plans,
    members,
    addPlan,
    updatePlan,
    deletePlan
  } = useGym();

  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planToDelete, setPlanToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    durationDays: 30,
    basePrice: 1800,
    discountPrice: 1500,
    isPopular: false,
    featuresText: '',
    terms: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      code: '',
      durationDays: 30,
      basePrice: 2000,
      discountPrice: 1500,
      isPopular: false,
      featuresText: 'Full Gym Floor Access (Cardio & Weights)\nGeneral Trainer Floor Support\nLocker Room & Shower Access\nWeekend Steam Bath',
      terms: 'Non-transferable. 1 pause allowed up to 7 days.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      code: plan.code || '',
      durationDays: plan.durationDays,
      basePrice: plan.basePrice,
      discountPrice: plan.discountPrice,
      isPopular: !!plan.isPopular,
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      terms: plan.terms || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const features = formData.featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingPlan) {
      updatePlan(editingPlan.id, {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase() || `${formData.durationDays}D`,
        durationDays: Number(formData.durationDays) || 30,
        basePrice: Number(formData.basePrice) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        isPopular: formData.isPopular,
        features,
        terms: formData.terms.trim()
      });
      showToast(`Plan "${formData.name}" updated successfully.`);
    } else {
      addPlan({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase() || `${formData.durationDays}D`,
        durationDays: Number(formData.durationDays) || 30,
        basePrice: Number(formData.basePrice) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        isPopular: formData.isPopular,
        features,
        terms: formData.terms.trim()
      });
      showToast(`New membership plan "${formData.name}" created successfully.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!planToDelete) return;
    deletePlan(planToDelete.id);
    showToast(`Plan "${planToDelete.name}" deleted.`);
    setPlanToDelete(null);
  };

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner & Action */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-orange-400" />
            <span>Membership Plans & Pricing Control</span>
          </h3>
          <p className="text-slate-300">
            Control membership packages, live renewal pricing, feature lists, durations, and pause allowances. All changes sync in real-time to the Member App.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shrink-0 shadow-lg shadow-orange-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {toast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(plan => {
          const enrolledMembers = members.filter(m => m.planId === plan.id && m.status === 'active');
          const savings = Math.max(0, (plan.basePrice || 0) - (plan.discountPrice || 0));

          return (
            <div
              key={plan.id}
              className={`bg-[#0c1017] border rounded-2xl p-4 flex flex-col justify-between transition-colors ${
                plan.isPopular ? 'border-orange-500/70 shadow-lg shadow-orange-950/20' : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-extrabold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        [{plan.code || 'PLAN'}]
                      </span>
                      {plan.isPopular && (
                        <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Most Popular
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-black text-white mt-1">
                      {plan.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanToDelete(plan)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="flex items-baseline justify-between bg-[#111726] border border-slate-800/90 p-3 rounded-xl">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-300">
                        ₹{(plan.discountPrice || 0).toLocaleString('en-IN')}
                      </span>
                      {plan.basePrice > plan.discountPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{plan.basePrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400">
                        Save ₹{savings.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-white flex items-center justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>{plan.durationDays} Days</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {(plan.durationDays / 30).toFixed(0)} Month(s) Pass
                    </span>
                  </div>
                </div>

                {/* Active Enrolled Members Count */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-orange-400" />
                    <span>Active Enrolled:</span>
                  </span>
                  <span className="font-bold text-white">
                    {enrolledMembers.length} Members
                  </span>
                </div>

                {/* Features Checklist */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Included Features
                  </span>
                  <ul className="space-y-1">
                    {Array.isArray(plan.features) && plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Terms */}
                {plan.terms && (
                  <div className="text-[10px] text-slate-400 bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg">
                    <strong className="text-slate-300">Terms: </strong>
                    {plan.terms}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span>{editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Quarterly Momentum"
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Plan Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. 3M, 6M, ANN"
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-orange-500 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="1000"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Base Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Discount / Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="rounded border-slate-700 text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-white text-xs block">Highlight as "Most Popular"</span>
                  <span className="text-[10px] text-slate-400">Displays prominent badge in the member renewal catalogue</span>
                </div>
              </label>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Included Features (One feature per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Full Gym Floor Access&#10;Locker & Shower Facility&#10;Weekend Steam Bath"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Pause & Cancellation Terms
                </label>
                <textarea
                  rows={2}
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  placeholder="e.g. Pause allowed for up to 15 days. Non-refundable once activated."
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors shadow-lg shadow-orange-950/40"
                >
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {planToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-rose-600/70 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Delete Membership Plan</span>
            </div>
            <p className="text-slate-300 text-xs">
              Are you sure you want to delete <strong className="text-white">"{planToDelete.name}"</strong>?
              This will remove it from the renewal catalogue. Existing active members will retain their current expiry dates.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPlanToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
