import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Package,
  Dumbbell,
  CheckCircle,
  Plus,
  Minus,
  Sparkles,
  UserCheck,
  AlertOctagon,
  Clock,
  Truck
} from 'lucide-react';

export default function OwnerInventoryAddons() {
  const {
    addOns,
    setAddOns,
    addOnOrders,
    punchPTSession,
    updateFulfillmentStatus,
    members,
    staff,
    logAudit
  } = useGym();

  const [toast, setToast] = useState(null);

  // Stock adjustment helper
  const handleStockChange = (addOnId, delta) => {
    setAddOns(prev => prev.map(a => {
      if (a.id === addOnId) {
        const nextStock = Math.max(0, (a.stockCapacity || 0) + delta);
        logAudit('STOCK_ADJUSTED', `Owner manually changed stock for "${a.title}" to ${nextStock}.`, 'staff_1', 'OWNER');
        return { ...a, stockCapacity: nextStock };
      }
      return a;
    }));
  };

  const handlePunchPT = (orderId) => {
    const res = punchPTSession(orderId);
    if (res.success) {
      setToast(`PT Session recorded: ${res.updated.sessionsCompleted}/${res.updated.sessionsTotal} sessions done!`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            Add-On Inventory, PT Session Usage & Fulfillment
          </h3>
          <p className="text-slate-400 mt-0.5">
            Manage live supplement stock, punch completed PT workout sessions, and fulfill member orders.
          </p>
        </div>
      </div>

      {toast && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-3 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Supplement Stock Management Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center justify-between">
          <span>Live Supplement & PT Slot Inventory</span>
          <span className="text-[11px] text-slate-400 font-normal">Real-time capacity tracking</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {addOns.map(item => {
            const isOut = item.stockCapacity <= 0;
            return (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-500 font-semibold">{item.category}</span>
                    <span className="text-amber-300 font-bold">₹{item.price}</span>
                  </div>
                  <h5 className="font-bold text-white text-xs leading-snug">{item.title}</h5>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.unit}</div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px]">
                    <span className="text-slate-500 block">Available:</span>
                    <strong className={isOut ? 'text-rose-400' : 'text-emerald-400'}>
                      {item.stockCapacity} {item.category === 'PT' ? 'Slots' : 'Units'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStockChange(item.id, -1)}
                      disabled={item.stockCapacity <= 0}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center font-bold"
                      title="Decrease stock"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStockChange(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                      title="Add stock"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PT Packages Session Punching & Product Orders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
          Active Member Orders & PT Session Utilization ({addOnOrders.length})
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="py-2 px-3">Order #</th>
                <th className="py-2 px-3">Member</th>
                <th className="py-2 px-3">Add-On Item</th>
                <th className="py-2 px-3">Sessions / Qty</th>
                <th className="py-2 px-3">Fulfillment Status</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {addOnOrders.map(o => {
                const member = members.find(m => m.id === o.memberId);
                const addOn = addOns.find(a => a.id === o.addOnId);
                const isPT = o.sessionsTotal > 0;

                return (
                  <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300 text-[11px]">
                      {o.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{member ? member.name : o.memberId}</div>
                      <div className="text-[11px] text-slate-500">{member?.phone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {addOn ? addOn.title : o.addOnId}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {isPT ? (
                        <span className="text-orange-400 font-bold">
                          {o.sessionsCompleted} / {o.sessionsTotal} Sessions
                        </span>
                      ) : (
                        <span>Qty: {o.quantity}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        o.fulfillmentStatus === 'DELIVERED' || o.fulfillmentStatus === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : o.fulfillmentStatus === 'ACTIVE_SESSIONS'
                          ? 'bg-purple-500/20 text-purple-300'
                          : o.fulfillmentStatus === 'PACKED'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {isPT ? (
                        <button
                          onClick={() => handlePunchPT(o.id)}
                          disabled={o.sessionsCompleted >= o.sessionsTotal}
                          className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 px-2.5 py-1 rounded-lg text-[11px] font-bold disabled:opacity-30 inline-flex items-center gap-1"
                        >
                          <Dumbbell className="w-3 h-3" />
                          <span>Punch 1 Session</span>
                        </button>
                      ) : (
                        <div className="inline-flex gap-1">
                          {o.fulfillmentStatus !== 'DELIVERED' && (
                            <button
                              onClick={() => updateFulfillmentStatus(o.id, 'DELIVERED')}
                              className="bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold"
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
    </div>
  );
}

