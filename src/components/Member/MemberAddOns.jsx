import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  ShoppingBag,
  Dumbbell,
  Apple,
  Package,
  CheckCircle,
  AlertOctagon,
  ArrowLeft,
  Shield,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemberAddOns({ onBack }) {
  const {
    activeMember,
    addOns,
    purchaseAddOn
  } = useGym();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [buyingId, setBuyingId] = useState(null);

  const filteredItems = addOns.filter(item => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  const handlePurchase = (item) => {
    setBuyingId(item.id);
    setPurchaseResult(null);

    setTimeout(() => {
      setBuyingId(null);
      const res = purchaseAddOn({
        memberId: activeMember.id,
        addOnId: item.id,
        quantity: 1
      });

      setPurchaseResult(res);

      if (res.success) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 600);
  };

  return (
    <div className="space-y-4 pb-6 text-slate-100">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h3 className="text-sm font-extrabold text-white">
          Add-On Marketplace
        </h3>
        <span className="text-xs text-slate-400">Hubli Gym Store</span>
      </div>

      {/* Category Pills (Solid colors, no gradient text) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Items' },
          { id: 'PT', label: 'Personal Training' },
          { id: 'DIET', label: 'Diet Plans' },
          { id: 'SUPPLEMENT', label: 'Supplements' }
        ].map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-orange-600 text-white'
                  : 'bg-[#111726] text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Guarantee Banner (Solid dark, high contrast) */}
      <div className="bg-[#111726] border border-slate-800 p-3.5 rounded-xl flex items-center gap-2.5 text-slate-300 text-xs">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-white">Zero Pre-Selection Guarantee:</strong> Add-ons are never automatically added to your cart. All supplements feature authentic manufacturer tamper seals.
        </span>
      </div>

      {/* Purchase Result Toast */}
      {purchaseResult && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          purchaseResult.success
            ? 'bg-[#0e2417] border-emerald-500 text-emerald-300'
            : 'bg-[#241014] border-rose-600 text-rose-300'
        }`}>
          {purchaseResult.success ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertOctagon className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="text-xs space-y-0.5">
            <strong className="block font-bold">
              {purchaseResult.success ? 'Order Confirmed' : 'Purchase Blocked'}
            </strong>
            <span className="text-slate-200">{purchaseResult.message}</span>
          </div>
        </div>
      )}

      {/* Add-On Products List */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const isOutOfStock = item.stockCapacity !== undefined && item.stockCapacity <= 0;
          const isLowStock = item.stockCapacity !== undefined && item.stockCapacity > 0 && item.stockCapacity <= 3;
          const isBuying = buyingId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-[#111726] border rounded-xl p-4 space-y-3 transition-colors ${
                isOutOfStock ? 'border-slate-800 opacity-80' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.badge === 'Out of Stock'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-orange-950 text-orange-300 border border-orange-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-extrabold text-white leading-tight">
                    {item.title}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-base font-black text-amber-300">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.unit}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Trainer / Stock Meta Row */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                {item.trainerName ? (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-slate-400">Trainer:</span>
                    <strong className="text-orange-400">{item.trainerName}</strong>
                    <span className="text-[11px] text-slate-400">({item.trainerBio})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Hubli Inventory:</span>
                    {isOutOfStock ? (
                      <span className="text-rose-400 font-bold">0 units (Sold Out)</span>
                    ) : isLowStock ? (
                      <span className="text-amber-300 font-bold">Only {item.stockCapacity} units left</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">{item.stockCapacity} units in stock</span>
                    )}
                  </div>
                )}

                {/* Buy Button (Solid colors, no gradient text, no hover opacity fades) */}
                <button
                  type="button"
                  onClick={() => handlePurchase(item)}
                  disabled={isOutOfStock || isBuying}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white'
                  }`}
                >
                  {isOutOfStock ? 'Sold Out' : isBuying ? 'Processing...' : `Purchase for ₹${item.price.toLocaleString('en-IN')}`}
                </button>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Terms: {item.cancellationTerms}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
