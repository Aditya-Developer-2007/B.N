import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../config/business';
import { Phone, MessageSquare, MapPin, Copy, Check, Send, AlertCircle } from 'lucide-react';

export default function InquiryForm({ initialCategory }) {
  const [formData, setFormData] = useState({
    buyerName: '',
    businessName: '',
    phoneNumber: '',
    businessType: 'Cosmetics Retail Store',
    category: initialCategory || 'Skincare & Derma',
    orderVolume: '₹25,000 – ₹50,000',
    notes: '',
  });

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '', waUrl: '' });

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(BUSINESS_CONFIG.phoneDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '', waUrl: '' });

    // Format WhatsApp message
    const formattedMsg = 
`*B.N ENTERPRISES — WHOLESALE INQUIRY*
──────────────────────────────
• *Contact Name:* ${formData.buyerName}
• *Business / Shop:* ${formData.businessName}
• *Phone:* ${formData.phoneNumber}
• *Channel:* ${formData.businessType}
• *Category:* ${formData.category}
• *Est. Volume:* ${formData.orderVolume}
• *Notes / Brands:* ${formData.notes || 'Please provide wholesale catalog and case pricing.'}
──────────────────────────────
_Sent via B.N Enterprises Web Portal_`;

    const directWaUrl = `https://wa.me/${BUSINESS_CONFIG.waNumber}?text=${encodeURIComponent(formattedMsg)}`;

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: formData.buyerName,
          businessName: formData.businessName,
          phoneNumber: formData.phoneNumber,
          businessType: formData.businessType,
          selectedCategories: [formData.category],
          estimatedOrderVolume: formData.orderVolume,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      const redirectUrl = data.whatsappUrl || directWaUrl;

      setStatus({
        type: 'success',
        message: 'Inquiry saved successfully! Click below to send directly to our WhatsApp Trade Desk.',
        waUrl: redirectUrl,
      });

      // Auto-open WhatsApp in new tab for smooth B2B workflow
      window.open(redirectUrl, '_blank');
    } catch {
      // If server is not running or unreachable, fallback directly to WhatsApp
      setStatus({
        type: 'success',
        message: 'Opening WhatsApp to complete your wholesale trade inquiry...',
        waUrl: directWaUrl,
      });
      window.open(directWaUrl, '_blank');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="bg-white py-14 sm:py-20 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Direct Trade Desk Info & Address Placeholder */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase font-semibold block mb-1">
                COMMERCIAL INQUIRY DESK
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Connect With Trade Procurement
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                We cater directly to independent shopkeepers, salon chains, beauty pharmacies, and institutional purchasers with volume margin slabs.
              </p>
            </div>

            <div className="border border-zinc-200 rounded p-6 bg-zinc-50 space-y-5 text-xs font-mono">
              
              {/* Telephone Item */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200">
                <div className="space-y-1">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider block">
                    Direct Trade Hotline
                  </span>
                  <a
                    href={BUSINESS_CONFIG.phoneCall}
                    className="text-base font-bold text-zinc-900 hover:underline block"
                  >
                    {BUSINESS_CONFIG.phoneDisplay}
                  </a>
                  <span className="text-[10px] text-zinc-500 block">Mon – Sat: 10:00 AM – 8:00 PM</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 transition-colors text-[11px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-zinc-900" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* WhatsApp Item */}
              <div className="pb-4 border-b border-zinc-200 space-y-1">
                <span className="text-zinc-500 text-[11px] uppercase tracking-wider block">
                  Official WhatsApp Desk
                </span>
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-zinc-900 hover:underline inline-flex items-center gap-1.5"
                >
                  <span>+91 {BUSINESS_CONFIG.phoneDisplay}</span>
                  <span className="text-[10px] bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-800">Quick Response</span>
                </a>
              </div>

              {/* Clean Address Placeholder Variable */}
              <div className="space-y-1.5">
                <span className="text-zinc-500 text-[11px] uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  Warehouse Dispatch & Pickup
                </span>
                <p className="text-zinc-800 font-sans text-xs font-semibold leading-relaxed">
                  {BUSINESS_CONFIG.addressPlaceholder}
                </p>
                <span className="text-[11px] text-zinc-500 block">
                  Notice: Physical visits and transport vehicle loading require prior gate pass arrangement via 8527606769.
                </span>
              </div>

            </div>

            <div className="p-4 border border-zinc-200 rounded text-xs text-zinc-600 bg-white">
              <span className="font-bold text-zinc-900 block mb-0.5">Wholesale GST Billing Compliance</span>
              Every consignment is accompanied by computerized GST invoices, E-way bill certification, and batch testing certificates.
            </div>

          </div>

          {/* Right Column: Minimal B2B Inquiry Form */}
          <div className="lg:col-span-7 bg-zinc-50/50 border border-zinc-200 rounded p-6 sm:p-8">
            <div className="mb-6">
              <h3 className="font-bold text-lg text-zinc-900 tracking-tight">
                Request Wholesale Rate Card & Quote
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Submissions automatically register on our backend and forward to WhatsApp for rapid quotation.
              </p>
            </div>

            {status.message && (
              <div
                className={`mb-6 p-4 rounded text-xs border ${
                  status.type === 'success'
                    ? 'bg-zinc-100 border-zinc-300 text-zinc-900'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-semibold">
                  <Check className="w-4 h-4 text-zinc-900" />
                  <span>{status.message}</span>
                </div>
                {status.waUrl && (
                  <a
                    href={status.waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-xs bg-zinc-900 text-white px-3.5 py-1.5 rounded hover:bg-zinc-800"
                  >
                    <span>Open WhatsApp Chat Directly</span>
                    <Send className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    required
                    value={formData.buyerName}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    Shop / Salon / Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Kumar Beauty & Salon Mart"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    Business Channel
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                  >
                    <option value="Cosmetics Retail Store">Cosmetics Retail Store</option>
                    <option value="Unisex Salon & Spa">Unisex Salon & Spa</option>
                    <option value="Pharmacy / Derma Chemist">Pharmacy / Derma Chemist</option>
                    <option value="Supermarket / Mart">Supermarket / Departmental Mart</option>
                    <option value="Regional Sub-Distributor">Regional Sub-Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    Primary Category Required
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                  >
                    <option value="Skincare & Derma">Skincare & Derma Essentials</option>
                    <option value="Color Cosmetics">Color Cosmetics & Lipsticks</option>
                    <option value="Hair & Salon">Professional Hair & Salon Care</option>
                    <option value="Fragrances">Luxury Fragrances & Mists</option>
                    <option value="Daily Personal Care">Daily Personal Care & Hygiene</option>
                    <option value="Mixed Assortment">Mixed Starter Case Assortment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    Estimated Order Volume
                  </label>
                  <select
                    name="orderVolume"
                    value={formData.orderVolume}
                    onChange={handleChange}
                    className="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                  >
                    <option value="₹10,000 – ₹25,000">₹10,000 – ₹25,000 (Starter Lot)</option>
                    <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000 (Case Lots)</option>
                    <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000 (Store Slab)</option>
                    <option value="₹1,00,000+">₹1,00,000+ (Master Distributor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                  Specific Brands or Requirements (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Specify brand lines, case quantities, or delivery destination details..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-300 rounded focus:outline-none focus:border-zinc-900 transition-colors"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-zinc-900 text-white font-semibold text-xs tracking-wider uppercase rounded hover:bg-zinc-800 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{submitting ? 'Registering Inquiry...' : 'Submit Wholesale Inquiry via WhatsApp'}</span>
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 text-center pt-1 font-mono">
                🔒 Direct B2B Portal. Data connects to Trade Desk at 8527606769.
              </p>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}

