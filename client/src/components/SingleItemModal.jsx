import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../config/business';
import {
  X,
  MessageSquare,
  Plus,
  Minus,
  Check,
  Package,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ShoppingBag,
  Clock,
  FileCheck,
} from 'lucide-react';

export default function SingleItemModal({ product, isOpen, onClose, onAddToCartAndClose }) {
  const [qty, setQty] = useState(1);
  const [activeModalTab, setActiveModalTab] = useState('specs'); // 'specs' | 'enquire'
  const [buyerName, setBuyerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product) return null;

  const maxQty = BUSINESS_CONFIG.maxQtyPerItem || 25;

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    setQty(Math.min(Math.max(val, 1), maxQty));
  };

  const handleStep = (delta) => {
    setQty((prev) => Math.min(Math.max(prev + delta, 1), maxQty));
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!buyerName.trim() || !businessName.trim() || !phoneNumber.trim()) {
      setErrorMsg('Please provide your Contact Name, Business/Shop Name, and Phone Number.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit contact number.');
      return;
    }

    setSubmitting(true);

    const singleItem = {
      productId: product.id || product.sku,
      sku: product.sku,
      name: product.name,
      qty,
      category: product.category,
      packSize: product.packSize,
    };

    // Format WhatsApp Message
    const formattedWa = 
`*B.N ENTERPRISES — SINGLE ITEM WHOLESALE ENQUIRY*
──────────────────────────────
• *Contact Name:* ${buyerName.trim()}
• *Business / Shop:* ${businessName.trim()}
• *Phone Number:* ${cleanPhone}
──────────────────────────────
*REQUESTED WHOLESALE SPECIFICATION:*
• *Item:* ${product.name}
• *SKU:* ${product.sku}
• *Enquired Quantity:* ${qty} Unit${qty > 1 ? 's' : ''} (Strict Max 25 Policy)
• *Packaging:* ${product.packSize || 'Standard Case'}
• *MOQ Benchmark:* ${product.moq || 'Case Lot'}
──────────────────────────────
• *Notes:* ${notes.trim() || 'Please share formal wholesale rate card, batch dates & dispatch timeline.'}
──────────────────────────────
_Sent via B.N Enterprises Official Wholesale Portal_`;

    const waLink = `https://wa.me/${BUSINESS_CONFIG.waNumber}?text=${encodeURIComponent(formattedWa)}`;

    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: buyerName.trim(),
          businessName: businessName.trim(),
          phoneNumber: cleanPhone,
          items: [singleItem],
          notes: notes.trim(),
        }),
      });
    } catch (err) {
      console.warn('API notice:', err.message);
    } finally {
      setSubmitting(false);
      window.open(waLink, '_blank');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-zinc-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-zinc-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-zinc-950">
              {product.sku}
            </span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Trade Specification & Live Quotation
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-zinc-200 bg-stone-50 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => setActiveModalTab('specs')}
            className={`flex-1 py-3 text-center transition-colors uppercase tracking-wider ${
              activeModalTab === 'specs'
                ? 'bg-white text-zinc-950 border-b-2 border-zinc-950'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            1. Trade Specs & Shelf-Life
          </button>
          <button
            type="button"
            onClick={() => setActiveModalTab('enquire')}
            className={`flex-1 py-3 text-center transition-colors uppercase tracking-wider ${
              activeModalTab === 'enquire'
                ? 'bg-white text-zinc-950 border-b-2 border-zinc-950'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            2. Direct Single RFQ
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Product Header Strip */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-semibold block">
                {product.categoryLabel || product.category}
              </span>
              <h2 className="text-lg font-bold text-zinc-900 leading-snug">
                {product.name}
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Interactive Quantity Slider Widget */}
          <div className="bg-stone-50 border border-zinc-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 block">
                  Select Order Quantity:
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Strictly 1 to 25 units per line item
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={qty <= 1}
                  className="w-7 h-7 rounded bg-white border border-zinc-300 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-xl font-black text-zinc-950 min-w-[32px] text-center">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  disabled={qty >= maxQty}
                  className="w-7 h-7 rounded bg-white border border-zinc-300 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max={maxQty}
              value={qty}
              onChange={handleSliderChange}
              className="w-full h-2.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-950 focus:outline-none"
            />

            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>1 Unit (Min Sample)</span>
              <span className="text-amber-800 font-bold">Current: {qty} / 25 Units Max</span>
              <span>25 Units (Max Limit)</span>
            </div>
          </div>

          {/* Tab 1: Detailed Specifications & Authenticity */}
          {activeModalTab === 'specs' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="border border-zinc-200 p-3.5 rounded-lg bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-bold">
                    <Package className="w-3.5 h-3.5 text-zinc-800" />
                    <span>Carton & Pack Breakdown</span>
                  </div>
                  <div className="font-bold text-zinc-900">{product.packSize || 'Standard Box Lot'}</div>
                  <div className="text-[11px] text-zinc-500">MOQ Standard: {product.moq || '1 Case Lot'}</div>
                </div>

                <div className="border border-zinc-200 p-3.5 rounded-lg bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-bold">
                    <Clock className="w-3.5 h-3.5 text-zinc-800" />
                    <span>Freshness & Shelf Life</span>
                  </div>
                  <div className="font-bold text-emerald-700">24 – 36 Months Active Shelf Life</div>
                  <div className="text-[11px] text-zinc-500">Climate-controlled dispatch storage</div>
                </div>

                <div className="border border-zinc-200 p-3.5 rounded-lg bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
                    <span>Authenticity & Traceability</span>
                  </div>
                  <div className="font-bold text-zinc-900">Original Batch QR / Barcode</div>
                  <div className="text-[11px] text-zinc-500">Tamper-evident holographic outer seals</div>
                </div>

                <div className="border border-zinc-200 p-3.5 rounded-lg bg-white space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase font-bold">
                    <FileCheck className="w-3.5 h-3.5 text-zinc-800" />
                    <span>Billing & Input Credit</span>
                  </div>
                  <div className="font-bold text-zinc-900">GST ITC Input Credit Included</div>
                  <div className="text-[11px] text-zinc-500">HSN coded wholesale invoice</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCartAndClose(product, qty)}
                  className="flex-1 py-3 px-4 bg-zinc-950 text-white rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Add {qty} Units to Enquiry Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModalTab('enquire')}
                  className="py-3 px-4 border border-zinc-300 text-zinc-800 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Enquire Only This Item</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Single Item Direct RFQ Form */
            <form onSubmit={handleSubmitSingle} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                    Shop / Salon Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Elegance Beauty Studio"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                  10-Digit WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 8527606769"
                  className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase text-zinc-700 mb-1">
                  Specific Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention delivery location, required date, or transport LR preference..."
                  className="w-full px-3 py-2 text-xs border border-zinc-300 rounded bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send WhatsApp Quotation ({qty} Units)</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
