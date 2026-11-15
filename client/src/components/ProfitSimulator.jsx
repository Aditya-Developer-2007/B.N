import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Percent,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building,
  Check,
} from 'lucide-react';

export default function ProfitSimulator() {
  const [cartons, setCartons] = useState(24);

  // Dynamic Tier Computations
  let tierName = 'Starter Wholesale Lot';
  let marginSlab = '28% – 34%';
  let dispatchSpeed = 'Standard Surface Freight (48 hrs)';
  let estMonthlyProfit = '₹24,000 – ₹38,000';
  let tierBadgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';

  if (cartons >= 16 && cartons <= 45) {
    tierName = 'Pro Salon & Retailer Tier';
    marginSlab = '38% – 44%';
    dispatchSpeed = 'Priority Express Dispatch (24 hrs)';
    estMonthlyProfit = '₹55,000 – ₹95,000';
    tierBadgeColor = 'bg-amber-950/80 text-amber-300 border-amber-800';
  } else if (cartons > 45) {
    tierName = 'Super-Stockist & Chain Slab';
    marginSlab = '48% – 55%+';
    dispatchSpeed = 'Same-Day Air Cargo / Dedicated Logistics Desk';
    estMonthlyProfit = '₹1,20,000 – ₹2,40,000+';
    tierBadgeColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
  }

  return (
    <section className="py-14 sm:py-20 bg-stone-100 border-b border-zinc-200 relative overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Interactive B2B Margin Tool</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Retailer Profit & Volume Tier Simulator
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
            Drag the slider to test your store's monthly cosmetic carton turnover and preview unlocked trade pricing discounts, dealer margins, and transit priorities.
          </p>
        </div>

        {/* Interactive Simulator Card */}
        <div className="bg-white border border-zinc-300/80 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Slider & Controls */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Slider Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600">
                  Monthly Procurement Cartons:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-zinc-950 bg-stone-100 px-3.5 py-1 rounded-md border border-zinc-300">
                  {cartons} <span className="text-xs font-semibold text-zinc-500 font-sans">Cartons/mo</span>
                </span>
              </div>

              {/* Range Slider */}
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={cartons}
                  onChange={(e) => setCartons(Number(e.target.value))}
                  className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 focus:outline-none"
                />
                
                <div className="flex justify-between text-[11px] font-mono text-zinc-500 font-semibold">
                  <span>1 Carton (Starter)</span>
                  <span>50 Cartons (Volume)</span>
                  <span>100+ Cartons (Enterprise)</span>
                </div>
              </div>

              {/* Quick Select Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-mono text-zinc-400 self-center mr-1">Presets:</span>
                {[6, 18, 36, 60, 96].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCartons(num)}
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded border transition-all ${
                      cartons === num
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-stone-50 text-zinc-700 border-zinc-200 hover:bg-stone-200'
                    }`}
                  >
                    {num} Cartons
                  </button>
                ))}
              </div>

              {/* Benefits checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-4 border-t border-zinc-100 text-xs text-zinc-600 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified 100% Original Batch Formulations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>GST ITC Invoice Included on Every Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct WhatsApp Quotation Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Capped at 25 Master Units / SKU in Cart</span>
                </div>
              </div>

            </div>

            <div className="pt-4">
              <Link
                to="/catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-md transition-colors shadow-md group"
              >
                <span>Lock This Tier — Start Adding Items</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Panel: Obsidian Live Tier Output */}
          <div className="lg:col-span-5 bg-zinc-950 text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-800 relative">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
                  UNLOCKED PRICING SLAB
                </span>
                <span className={`text-[10px] font-mono uppercase font-extrabold px-2 py-0.5 rounded border ${tierBadgeColor}`}>
                  {tierName}
                </span>
              </div>

              {/* Major Metric: Retail Margin */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-400 block">
                  Estimated Store Profit Margin:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tracking-tight">
                    {marginSlab}
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">over wholesale invoice</span>
                </div>
              </div>

              {/* Secondary Metric: Projected Monthly Earnings */}
              <div className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Projected Monthly Retail Spread:
                </span>
                <div className="font-mono text-xl font-bold text-emerald-400">
                  {estMonthlyProfit}
                </div>
                <span className="text-[10px] text-zinc-500 block">
                  *Calculated at standard FMCG & salon retail MRP realization.
                </span>
              </div>

              {/* Dispatch Priority */}
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Logistics Priority:</span>
                </div>
                <div className="text-zinc-400 text-[11px] pl-6 leading-relaxed">
                  {dispatchSpeed}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Helpline: 8527606769</span>
              <span className="text-amber-400 font-bold">B2B Trade Desk Verified</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

