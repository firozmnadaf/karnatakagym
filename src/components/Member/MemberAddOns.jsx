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
  Star,
  Check,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MemberAddOns({ onBack }) {
  const {
    activeMember,
    addOns,
    purchaseAddOn,
    addOnOrders
  } = useGym();

  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'PT' | 'DIET' | 'SUPPLEMENT'
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
    }, 700);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
          Add-On Marketplace
        </span>
        <span className="text-xs text-slate-400">
          Zero Pre-Selection
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'All Add-Ons', icon: ShoppingBag },
          { id: 'PT', label: 'Personal Training', icon: Dumbbell },
          { id: 'DIET', label: 'Diet & Nutrition', icon: Apple },
          { id: 'SUPPLEMENT', label: 'Proteins & Supps', icon: Package }
        ].map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Policy Guarantee Banner */}
      <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex items-center gap-2.5 text-slate-400 text-xs">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>Transparent Pricing:</strong> No hidden registration charges, no automatic renewals. All supplement inventory is 100% authentic with tamper seals.
        </span>
      </div>

      {/* Purchase Result Toast */}
      {purchaseResult && (
        <div className={`p-3.5 rounded-2xl border flex items-center gap-3 animate-in fade-in ${
          purchaseResult.success
            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
            : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
        }`}>
          {purchaseResult.success ? (
            <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertOctagon className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <div className="text-xs">
            <span className="font-bold block">
              {purchaseResult.success ? 'Order Confirmed!' : 'Purchase Blocked'}
            </span>
            <span>{purchaseResult.message}</span>
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
              className={`bg-slate-900/90 border rounded-2xl p-4 space-y-3 transition-all ${
                isOutOfStock ? 'border-slate-800 opacity-75' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.badge === 'Out of Stock'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
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
                  <div className="text-[10px] text-slate-400">
                    {item.unit}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>

              {/* Trainer / Stock Meta Row */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                {item.trainerName ? (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-slate-500">Mentor:</span>
                    <strong className="text-orange-400">{item.trainerName}</strong>
                    <span className="text-[11px] text-slate-400">({item.trainerBio})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Live Inventory:</span>
                    {isOutOfStock ? (
                      <span className="text-rose-400 font-bold">0 units (Sold Out)</span>
                    ) : isLowStock ? (
                      <span className="text-amber-400 font-bold">Only {item.stockCapacity} left in Hubli store</span>
                    ) : (
                      <span className="text-emerald-400 font-medium">{item.stockCapacity} units available</span>
                    )}
                  </div>
                )}

                {/* Buy Button (Never Pre-Selected) */}
                <button
                  type="button"
                  onClick={() => handlePurchase(item)}
                  disabled={isOutOfStock || isBuying}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-slate-950 shadow-md shadow-orange-500/20 active:scale-95'
                  }`}
                >
                  {isOutOfStock ? 'Sold Out' : isBuying ? 'Processing...' : `Get for ₹${item.price.toLocaleString('en-IN')}`}
                </button>
              </div>

              {/* Cancellation terms */}
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Policy: {item.cancellationTerms}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

