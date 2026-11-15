import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../config/business';
import { useCart } from '../context/CartContext';
import { Phone, MessageSquare, ShoppingBag } from 'lucide-react';

export default function MobileActionBar() {
  const { totalUnits } = useCart();

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-3 py-2 md:hidden shadow-lg">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        
        {/* 1. Cart Trigger */}
        <Link
          to="/enquiry-cart"
          className="flex flex-col items-center justify-center py-2 px-1 rounded border border-zinc-200 bg-zinc-50 text-zinc-900 active:scale-95 transition-all relative"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-zinc-800" />
            {totalUnits > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-zinc-900 text-white font-mono text-[9px] font-extrabold px-1 rounded-full min-w-[14px] text-center">
                {totalUnits}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Enquiry Cart</span>
        </Link>

        {/* 2. Call Action */}
        <a
          href={BUSINESS_CONFIG.phoneCall}
          className="flex flex-col items-center justify-center py-2 px-1 rounded border border-zinc-200 bg-zinc-50 text-zinc-900 active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 text-zinc-700" />
          <span className="font-mono text-[10px] font-bold tracking-tight mt-0.5">Call {BUSINESS_CONFIG.phoneDisplay}</span>
        </a>

        {/* 3. WhatsApp Action */}
        <a
          href={`https://wa.me/${BUSINESS_CONFIG.waNumber}?text=Hello%20B.N%20Enterprises,%20I%20am%20contacting%20you%20regarding%20wholesale%20cosmetics%20enquiry.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded bg-zinc-900 text-white active:scale-95 transition-all shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">WhatsApp</span>
        </a>

      </div>
    </aside>
  );
}
