import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../config/business';
import { useCart, MAX_QTY_PER_ITEM } from '../context/CartContext';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Package,
  Send,
  Building2,
  Phone,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function EnquiryCartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalItems, totalUnits } = useCart();

  const [formData, setFormData] = useState({
    buyerName: '',
    businessName: '',
    phoneNumber: '',
    businessType: 'Cosmetics Retail Store',
    destinationCity: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({ type: '', message: '', waUrl: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQtyStep = (productId, currentQty, delta) => {
    const target = currentQty + delta;
    if (target >= 1 && target <= MAX_QTY_PER_ITEM) {
      updateQuantity(productId, target);
    }
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (cart.length === 0) {
      setErrorMsg('Your enquiry cart is empty. Please add wholesale products before submitting.');
      return;
    }

    if (!formData.buyerName.trim() || !formData.businessName.trim() || !formData.phoneNumber.trim()) {
      setErrorMsg('Contact Name, Business/Shop Name, and WhatsApp Number are required.');
      return;
    }

    const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit WhatsApp/Phone number.');
      return;
    }

    setSubmitting(true);
    setSubmissionStatus({ type: '', message: '', waUrl: '' });

    // Format itemized list for WhatsApp
    let itemizedLines = '';
    cart.forEach((item, index) => {
      const q = item.qty || item.quantity || 1;
      itemizedLines += `${index + 1}. [${item.sku}] ${item.name} — *${q} Unit${q > 1 ? 's' : ''}*${item.packSize ? ` (${item.packSize})` : ''}\n`;
    });

    const combinedNotes = [
      formData.destinationCity ? `Destination City: ${formData.destinationCity.trim()}` : '',
      formData.notes ? `Buyer Notes: ${formData.notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    // Fallback WhatsApp message
    const formattedWaMsg = 
`*B.N ENTERPRISES — WHOLESALE CART ENQUIRY*
──────────────────────────────
• *Contact Name:* ${formData.buyerName.trim()}
• *Business / Shop:* ${formData.businessName.trim()}
• *Phone Number:* ${cleanPhone}
• *Business Channel:* ${formData.businessType}
• *Total Lines:* ${totalItems} products (${totalUnits} total units)
──────────────────────────────
*ITEMIZED CART ORDER LIST (Max 25 units/item):*
${itemizedLines.trim()}
──────────────────────────────
• *Order Details:* ${combinedNotes || 'Please share official wholesale rate card, batch dates & dispatch timeline.'}
──────────────────────────────
_Sent via B.N Enterprises Official B2B Wholesale Portal_`;

    const directWaUrl = `https://wa.me/${BUSINESS_CONFIG.waNumber}?text=${encodeURIComponent(formattedWaMsg)}`;

    try {
      // POST to backend API (supports both /api/enquiries and /api/inquiries)
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: formData.buyerName.trim(),
          businessName: formData.businessName.trim(),
          phoneNumber: cleanPhone,
          businessType: formData.businessType,
          items: cart.map((item) => ({
            productId: item.id || item.sku,
            sku: item.sku,
            name: item.name,
            qty: item.qty || item.quantity || 1,
            category: item.category,
            packSize: item.packSize,
          })),
          notes: combinedNotes,
        }),
      });

      const data = await res.json();
      const finalWaUrl = data.whatsappUrl || directWaUrl;

      setSubmissionStatus({
        type: 'success',
        message: 'Your wholesale enquiry has been registered in our database! Opening WhatsApp with your itemized quotation...',
        waUrl: finalWaUrl,
      });

      // Clear the cart on successful submission
      clearCart();

      // Open WhatsApp in new window
      window.open(finalWaUrl, '_blank');
    } catch (err) {
      console.warn('API submission notice:', err.message);
      // Fallback directly to WhatsApp
      setSubmissionStatus({
        type: 'success',
        message: 'Opening WhatsApp to complete your wholesale trade enquiry...',
        waUrl: directWaUrl,
      });
      clearCart();
      window.open(directWaUrl, '_blank');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50/70 min-h-screen py-10 sm:py-16 relative">
      {/* Background Dot-Matrix Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header Strip with Rich Contrast */}
        <div className="pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 mb-2">
            <Link to="/" className="hover:text-zinc-950 font-medium">Home</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-zinc-950 font-medium">Catalog</Link>
            <span>/</span>
            <span className="text-zinc-950 font-bold uppercase">Enquiry Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
                Wholesale Enquiry Cart & Pro-Forma RFQ
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
                Review your selected cosmetic items (strictly 1 to 25 units per line item). No payment taken online — submits a formal quote directly to our Trade Desk.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
              <span className="px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                Max 25 Units / SKU
              </span>
            </div>
          </div>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 && !submissionStatus.message ? (
          <div className="py-20 text-center border border-zinc-300 rounded-2xl bg-white shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-stone-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-zinc-950">
              Your Wholesale Enquiry Cart is Currently Empty
            </h2>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              Explore our master carton inventory of authentic clinical skincare, color cosmetics, and salon bulk packs. Add up to 25 units per item to request an official wholesale quotation.
            </p>
            <div className="pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg hover:bg-zinc-800 transition-all shadow-md group"
              >
                <span>Browse Wholesale Catalog</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          /* Main 2-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 items-start">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 uppercase tracking-wide">
                    Cart Items ({totalItems} Line{totalItems > 1 ? 's' : ''})
                  </span>
                  <span className="text-xs font-mono font-bold bg-amber-500 text-zinc-950 px-2 py-0.5 rounded shadow-sm">
                    {totalUnits} Total Units
                  </span>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-zinc-500 hover:text-red-700 font-semibold tracking-wide flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              {/* Items Cards */}
              <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden">
                {cart.map((item) => {
                  const currentQty = item.qty || item.quantity || 1;
                  const isMax = currentQty >= MAX_QTY_PER_ITEM;

                  return (
                    <div key={item.id || item.sku} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-stone-50/70 transition-colors">
                      
                      {/* Thumbnail & Title */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 bg-stone-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-zinc-950 text-white rounded">
                            {item.sku}
                          </span>
                          <h3 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                            <span>Packaging: {item.packSize || 'Case lot'}</span>
                            <span>•</span>
                            <span>{item.categoryLabel || item.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls (Strict Max 25 Units) */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center border border-zinc-300 rounded-md bg-stone-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleQtyStep(item.id || item.sku, currentQty, -1)}
                              disabled={currentQty <= 1}
                              className="px-2.5 py-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed border-r border-zinc-300"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <input
                              type="number"
                              min="1"
                              max={MAX_QTY_PER_ITEM}
                              value={currentQty}
                              onChange={(e) => updateQuantity(item.id || item.sku, e.target.value)}
                              className="w-12 text-center text-xs font-mono font-bold text-zinc-950 py-1.5 bg-transparent focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => handleQtyStep(item.id || item.sku, currentQty, 1)}
                              disabled={isMax}
                              className="px-2.5 py-1.5 text-zinc-700 hover:text-zinc-950 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed border-l border-zinc-300"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {isMax ? (
                            <span className="font-mono text-[9px] font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded border border-amber-300">
                              Max 25 units/item
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] text-zinc-400">
                              {currentQty} of {MAX_QTY_PER_ITEM} max
                            </span>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id || item.sku)}
                          className="p-1.5 text-zinc-400 hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Cart Summary Note */}
              <div className="bg-stone-100 border border-zinc-200 p-4 rounded-xl flex items-center justify-between text-xs font-mono text-zinc-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Enquiry Cart Total:</span>
                </div>
                <div className="font-bold text-zinc-950">
                  {totalItems} Line Items ({totalUnits} Units Selected)
                </div>
              </div>

            </div>

            {/* Right Column: High-Contrast Obsidian B2B Business Credentials Form */}
            <div className="lg:col-span-5">
              <div className="border border-zinc-800 bg-zinc-950 text-white rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none" />

                <div className="relative space-y-4">
                  <div className="pb-4 border-b border-zinc-800">
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold block mb-1">
                      COMMERCIAL B2B DISPATCH
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      Business Details for Quotation
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Enter your store or salon credentials to submit this cart enquiry and receive formal pro-forma quotation directly on WhatsApp.
                    </p>
                  </div>

                  {/* Submission Alert */}
                  {submissionStatus.message && (
                    <div
                      className={`p-4 rounded-lg text-xs font-medium space-y-2 ${
                        submissionStatus.type === 'success'
                          ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                          : 'bg-red-950/80 border border-red-800 text-red-200'
                      }`}
                    >
                      <p>{submissionStatus.message}</p>
                      {submissionStatus.waUrl && (
                        <a
                          href={submissionStatus.waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 underline hover:text-amber-300 font-mono"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Click here if WhatsApp didn't open automatically →</span>
                        </a>
                      )}
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        name="buyerName"
                        required
                        value={formData.buyerName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full px-3.5 py-2.5 text-xs border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:bg-black focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 placeholder:text-zinc-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        Store / Shop / Salon Name *
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Metro Beauty Emporium"
                        className="w-full px-3.5 py-2.5 text-xs border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:bg-black focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 placeholder:text-zinc-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        10-Digit WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g. 8527606769"
                        className="w-full px-3.5 py-2.5 text-xs font-mono border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:bg-black focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 placeholder:text-zinc-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                          Business Channel
                        </label>
                        <select
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-xs border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:bg-black focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans"
                        >
                          <option value="Cosmetics Retail Store">Cosmetics Retail Store</option>
                          <option value="Beauty Salon & Spa">Beauty Salon & Spa</option>
                          <option value="Pharmacy & Derma Store">Pharmacy & Derma Store</option>
                          <option value="Departmental Supermarket">Departmental Supermarket</option>
                          <option value="Regional Stockist">Regional Stockist</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                          Destination City
                        </label>
                        <input
                          type="text"
                          name="destinationCity"
                          value={formData.destinationCity}
                          onChange={handleChange}
                          placeholder="e.g. Delhi NCR / Mumbai"
                          className="w-full px-3 py-2 text-xs border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:bg-black focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 placeholder:text-zinc-500 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        Specific Dispatch Requirements (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Mention transport LR preference, required batch dates, or store opening deadlines..."
                        className="w-full px-3 py-2 text-xs border border-zinc-700 rounded-lg bg-zinc-900 text-white focus:bg-black focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 placeholder:text-zinc-500 font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || cart.length === 0}
                      className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span>Submitting Quotation Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Cart Enquiry & Open WhatsApp</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-2 text-[10px] font-mono text-zinc-400 space-y-1">
                    <div>• Direct WhatsApp Dispatch: +91 {BUSINESS_CONFIG.phoneDisplay}</div>
                    <div>• GST Tax Invoice with original manufacturer batch codes</div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
