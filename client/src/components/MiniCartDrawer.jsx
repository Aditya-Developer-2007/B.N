import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart, MAX_QTY_PER_ITEM } from '../context/CartContext';
import {
  ShoppingBag,
  ArrowRight,
  X,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  Package,
} from 'lucide-react';

export default function MiniCartDrawer() {
  const { cart, totalItems, totalUnits, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide on enquiry cart page itself or if cart is empty
  if (totalItems === 0 || location.pathname === '/enquiry-cart') {
    return null;
  }

  return (
    <aside
      className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm w-full transition-all duration-300"
      aria-label="Enquiry Mini-Cart Preview"
    >
      <div className="bg-zinc-950 text-white border border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
        
        {/* Header Bar (Always visible floating pill/bar) */}
        <div className="p-3.5 px-4 flex items-center justify-between bg-zinc-900/90 border-b border-zinc-800">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-zinc-950 font-mono text-[9px] font-black px-1 rounded-full min-w-[14px] text-center">
                {totalUnits}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                <span>Enquiry Cart Active</span>
                <span className="text-[10px] font-mono text-zinc-400 font-normal">
                  ({totalItems} SKU{totalItems > 1 ? 's' : ''})
                </span>
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/enquiry-cart"
              className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-[11px] px-2.5 py-1 rounded transition-colors uppercase tracking-tight shadow-sm"
            >
              <span>Review Cart</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              aria-label={isOpen ? 'Collapse Mini Cart' : 'Expand Mini Cart'}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Item List */}
        {isOpen && (
          <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800/80 p-2 text-xs bg-zinc-950/95">
            {cart.map((item) => {
              const currentQty = item.qty || item.quantity || 1;
              const isMax = currentQty >= MAX_QTY_PER_ITEM;

              return (
                <div key={item.id || item.sku} className="p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 object-cover rounded border border-zinc-800 bg-zinc-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-mono text-[9px] font-bold text-amber-400 uppercase block">
                        {item.sku}
                      </span>
                      <h4 className="text-[11px] font-medium text-zinc-200 truncate">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* Quantity Stepper (1 to 25) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center border border-zinc-800 rounded bg-zinc-900">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id || item.sku, currentQty - 1)}
                        disabled={currentQty <= 1}
                        className="px-1.5 py-0.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border-r border-zinc-800"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>

                      <span className="w-7 text-center font-mono font-bold text-[11px] text-zinc-100">
                        {currentQty}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id || item.sku, currentQty + 1)}
                        disabled={isMax}
                        className="px-1.5 py-0.5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed border-l border-zinc-800"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id || item.sku)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remove line"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-400">Total Selected:</span>
              <span className="font-bold text-amber-400">{totalUnits} / 25 Units per SKU</span>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}

