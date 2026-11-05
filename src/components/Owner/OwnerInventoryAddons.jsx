import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Package,
  Dumbbell,
  CheckCircle,
  Plus,
  Minus,
  Edit2,
  Trash2,
  ShoppingBag,
  X,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

export default function OwnerInventoryAddons() {
  const {
    addOns,
    setAddOns,
    addAddOn,
    updateAddOn,
    deleteAddOn,
    addOnOrders,
    punchPTSession,
    updateFulfillmentStatus,
    members,
    staff,
    logAudit
  } = useGym();

  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'SUPPLEMENT',
    price: 999,
    unit: '1 Unit',
    stockCapacity: 10,
    description: '',
    cancellationTerms: '',
    badge: 'In Stock',
    trainerId: ''
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStockChange = (addOnId, delta) => {
    setAddOns(prev => prev.map(a => {
      if (a.id === addOnId) {
        const nextStock = Math.max(0, (a.stockCapacity || 0) + delta);
        const nextBadge = nextStock <= 0 ? 'Out of Stock' : (a.badge === 'Out of Stock' ? 'In Stock' : a.badge);
        logAudit('STOCK_ADJUSTED', `Owner updated stock for "${a.title}" to ${nextStock}.`, 'staff_1', 'OWNER');
        return { ...a, stockCapacity: nextStock, badge: nextBadge };
      }
      return a;
    }));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'SUPPLEMENT',
      price: 1500,
      unit: '1 Unit / Jar',
      stockCapacity: 10,
      description: '100% authentic product sourced from certified distributors.',
      cancellationTerms: 'Unopened items returnable within 48 hours with receipt.',
      badge: 'In Stock',
      trainerId: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      price: item.price,
      unit: item.unit || '',
      stockCapacity: item.stockCapacity,
      description: item.description || '',
      cancellationTerms: item.cancellationTerms || '',
      badge: item.badge || 'In Stock',
      trainerId: item.trainerId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const assignedTrainer = staff.find(s => s.id === formData.trainerId);

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      price: Number(formData.price) || 0,
      unit: formData.unit.trim() || '1 Unit',
      stockCapacity: Number(formData.stockCapacity) || 0,
      description: formData.description.trim(),
      cancellationTerms: formData.cancellationTerms.trim(),
      badge: Number(formData.stockCapacity) <= 0 ? 'Out of Stock' : formData.badge.trim(),
      trainerId: assignedTrainer ? assignedTrainer.id : null,
      trainerName: assignedTrainer ? assignedTrainer.name : null,
      trainerBio: assignedTrainer ? assignedTrainer.specialization : null
    };

    if (editingItem) {
      updateAddOn(editingItem.id, payload);
      showToast(`Item "${formData.title}" updated.`);
    } else {
      addAddOn(payload);
      showToast(`Marketplace item "${formData.title}" created.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteAddOn(itemToDelete.id);
    showToast(`Item "${itemToDelete.title}" deleted.`);
    setItemToDelete(null);
  };

  const handlePunchPT = (orderId) => {
    const res = punchPTSession(orderId);
    if (res.success) {
      showToast(`PT Session recorded: ${res.updated.sessionsCompleted}/${res.updated.sessionsTotal} sessions done.`);
    }
  };

  // Filtered Items
  const filteredItems = addOns.filter(item => {
    const matchCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner & Action */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span>Add-On Marketplace & Inventory Control</span>
          </h3>
          <p className="text-slate-300">
            Control marketplace products, pricing, stock levels, personal training packages, and member order fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shrink-0 shadow-lg shadow-orange-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Add Marketplace Item</span>
        </button>
      </div>

      {toast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'SUPPLEMENT', label: 'Supplements' },
            { id: 'PT', label: 'Personal Training' },
            { id: 'DIET', label: 'Diet Plans' }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items or brand..."
            className="w-full bg-[#0b0f17] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Supplement & Product Stock Management Grid */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center justify-between">
          <span>Active Marketplace Catalogue ({filteredItems.length})</span>
          <span className="text-[11px] text-slate-400 font-normal">Real-time store inventory</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map(item => {
            const isOut = item.stockCapacity <= 0;
            return (
              <div
                key={item.id}
                className="bg-[#0c1017] border border-slate-800 p-3.5 rounded-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-orange-400 font-bold uppercase tracking-wider text-[10px]">
                      {item.category}
                    </span>
                    <span className="text-amber-300 font-extrabold text-sm">
                      ₹{(item.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <h5 className="font-bold text-white text-xs leading-snug">
                    {item.title}
                  </h5>

                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {item.unit}
                  </div>

                  {item.description && (
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.badge && (
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      isOut
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-[11px]">
                    <span className="text-slate-400 block font-medium">Stock:</span>
                    <strong className={isOut ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {item.stockCapacity} {item.category === 'PT' ? 'Slots' : 'Units'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleStockChange(item.id, -1)}
                      disabled={item.stockCapacity <= 0}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white flex items-center justify-center font-bold disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                      title="Decrease stock count"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStockChange(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white flex items-center justify-center font-bold transition-colors"
                      title="Increase stock count"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px h-5 bg-slate-800 mx-0.5"></div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PT Packages Session Punching & Product Orders */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
          Active Member Orders & PT Session Utilization ({addOnOrders.length})
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-300 font-semibold text-[11px]">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {addOnOrders.map(o => {
                const member = members.find(m => m.id === o.memberId);
                const addOn = addOns.find(a => a.id === o.addOnId);
                const isPT = o.sessionsTotal > 0;

                return (
                  <tr key={o.id} className="hover:bg-slate-900 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300 text-[11px]">
                      {o.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{member ? member.name : o.memberId}</div>
                      <a href={`tel:${member?.phone}`} className="text-[11px] text-orange-400 hover:text-white font-mono underline">
                        {member?.phone}
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-slate-200">
                      {addOn ? addOn.title : o.addOnId}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {isPT ? (
                        <span className="text-orange-400 font-bold">
                          {o.sessionsCompleted} / {o.sessionsTotal} Sessions
                        </span>
                      ) : (
                        <span className="text-slate-300">Qty: {o.quantity}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.fulfillmentStatus === 'DELIVERED' || o.fulfillmentStatus === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : o.fulfillmentStatus === 'ACTIVE_SESSIONS'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : o.fulfillmentStatus === 'PACKED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isPT ? (
                        <button
                          type="button"
                          onClick={() => handlePunchPT(o.id)}
                          disabled={o.sessionsCompleted >= o.sessionsTotal}
                          className="bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors"
                        >
                          <Dumbbell className="w-3 h-3" />
                          <span>Punch 1 Session</span>
                        </button>
                      ) : (
                        <div className="inline-flex gap-1">
                          {o.fulfillmentStatus !== 'DELIVERED' && (
                            <button
                              type="button"
                              onClick={() => updateFulfillmentStatus(o.id, 'DELIVERED')}
                              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-2.5 py-1 rounded text-[10px] font-bold transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Add-On Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <span>{editingItem ? 'Edit Marketplace Item' : 'Add Marketplace Item'}</span>
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
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Product / Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Optimum Nutrition Gold Standard Whey (1kg)"
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="SUPPLEMENT">Supplement</option>
                    <option value="PT">Personal Training</option>
                    <option value="DIET">Diet & Nutrition</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-amber-300 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Unit / Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 1kg Jar (30 Servings)"
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Available Stock / Slots *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stockCapacity}
                    onChange={(e) => setFormData({ ...formData, stockCapacity: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Status Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. In Stock, Best Seller"
                    className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {formData.category !== 'SUPPLEMENT' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Assigned Trainer
                    </label>
                    <select
                      value={formData.trainerId}
                      onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                      className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="">None / General</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key product highlights, ingredients, or training session details..."
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Return / Cancellation Policy
                </label>
                <textarea
                  rows={2}
                  value={formData.cancellationTerms}
                  onChange={(e) => setFormData({ ...formData, cancellationTerms: e.target.value })}
                  placeholder="e.g. Unopened items returnable within 48 hours with receipt."
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
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111726] border border-rose-600/70 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Delete Marketplace Item</span>
            </div>
            <p className="text-slate-300 text-xs">
              Are you sure you want to remove <strong className="text-white">"{itemToDelete.title}"</strong> from the Add-On Marketplace?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
