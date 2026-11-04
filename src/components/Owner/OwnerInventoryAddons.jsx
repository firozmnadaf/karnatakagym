import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  Package,
  Dumbbell,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';

export default function OwnerInventoryAddons() {
  const {
    addOns,
    setAddOns,
    addOnOrders,
    punchPTSession,
    updateFulfillmentStatus,
    members,
    logAudit
  } = useGym();

  const [toast, setToast] = useState(null);

  const handleStockChange = (addOnId, delta) => {
    setAddOns(prev => prev.map(a => {
      if (a.id === addOnId) {
        const nextStock = Math.max(0, (a.stockCapacity || 0) + delta);
        logAudit('STOCK_ADJUSTED', `Owner manually updated stock for "${a.title}" to ${nextStock}.`, 'staff_1', 'OWNER');
        return { ...a, stockCapacity: nextStock };
      }
      return a;
    }));
  };

  const handlePunchPT = (orderId) => {
    const res = punchPTSession(orderId);
    if (res.success) {
      setToast(`PT Session recorded: ${res.updated.sessionsCompleted}/${res.updated.sessionsTotal} sessions done.`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4 text-xs text-slate-100">
      {/* Top Banner (No badge above headline!) */}
      <div className="bg-[#111726] border border-slate-800 p-5 rounded-2xl space-y-1">
        <h3 className="text-sm font-extrabold text-white">
          Add-On Inventory and Personal Training Session Tracking
        </h3>
        <p className="text-slate-300">
          Manage live supplement stock, punch completed workout sessions, and record product fulfillment.
        </p>
      </div>

      {toast && (
        <div className="bg-[#0e2417] border border-emerald-500 text-emerald-300 p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Supplement Stock Management Grid */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-3">
        <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center justify-between">
          <span>Live Supplement & PT Slot Inventory</span>
          <span className="text-[11px] text-slate-300 font-normal">Hubli Store Count</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {addOns.map(item => {
            const isOut = item.stockCapacity <= 0;
            return (
              <div
                key={item.id}
                className="bg-[#0c1017] border border-slate-800 p-3.5 rounded-xl space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-bold">{item.category}</span>
                    <span className="text-amber-300 font-extrabold">₹{item.price}</span>
                  </div>
                  <h5 className="font-bold text-white text-xs leading-snug">{item.title}</h5>
                  <div className="text-[11px] text-slate-300 mt-0.5">{item.unit}</div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px]">
                    <span className="text-slate-400 block font-medium">Available:</span>
                    <strong className={isOut ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {item.stockCapacity} {item.category === 'PT' ? 'Slots' : 'Units'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5">
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
    </div>
  );
}
