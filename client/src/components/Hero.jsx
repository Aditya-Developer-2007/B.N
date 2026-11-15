import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../config/business';
import {
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  TrendingUp,
  Truck,
  Sparkles,
} from 'lucide-react';

export default function Hero() {
  const marqueeItems = [
    '100% ORIGINAL BATCH CODES',
    'UP TO 48% RETAILER MARGINS',
    'DIRECT SALON & PHARMACY SUPPLY',
    'MAX 25 MASTER UNITS PER SKU ENQUIRY',
    `TRADE HELPLINE: ${BUSINESS_CONFIG.phoneDisplay}`,
    'GST TAX INVOICING & ITC INPUT',
    '24–48 HR WAREHOUSE DISPATCH',
  ];

  return (
    <div className="relative bg-white border-b border-zinc-200">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Main Hero Container */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Propositions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-300/80 bg-amber-50/80 text-[11px] font-mono tracking-wider text-amber-900 font-bold uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Direct Primary Wholesale Distributor</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
              Quiet Luxury & Clinical Formulations. <br className="hidden sm:inline" />
              <span className="text-zinc-500 font-bold">Wholesale Simplified.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl">
              Authentic batch-coded wholesale cosmetic distribution for retail stores, dermatology counters, beauty boutiques, and professional salons. Curated master cartons with transparent margins.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md hover:bg-zinc-800 transition-all shadow-md group"
              >
                <span>Browse Wholesale Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${BUSINESS_CONFIG.waNumber}?text=Hello%20B.N%20Enterprises,%20please%20send%20your%20latest%20wholesale%20cosmetic%20price%20list%20and%20MOQ%20catalog.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 border border-zinc-300 font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-md hover:bg-stone-100 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Trade WhatsApp: {BUSINESS_CONFIG.phoneDisplay}</span>
              </a>
            </div>

            {/* B2B Assurance Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Tax Invoiced (GST ITC)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Original Batch Verifiable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24–48 Hr Dispatch Hub</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Contrast Matte Obsidian Luxury Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 text-white p-6 sm:p-7 shadow-2xl overflow-hidden group">
              {/* Subtle Dark Grid Glow */}
              <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none" />
              
              {/* Ambient Amber Glow in corner */}
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono tracking-wider text-amber-400 uppercase font-bold">
                      B.N TRADE DESK ACTIVE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 text-zinc-300 border border-zinc-700 rounded font-semibold uppercase">
                    Wholesale Slab
                  </span>
                </div>

                {/* Specs Matrix */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Distribution Tier:</span>
                    <span className="text-zinc-100 font-bold">Primary Authorized Dealer</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Enquiry Policy:</span>
                    <span className="text-amber-300 font-bold">Strictly 1–25 Units / SKU</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Retail Margin Spread:</span>
                    <span className="text-emerald-400 font-bold">35% – 52% Margins</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Trade Helpline:</span>
                    <a href={BUSINESS_CONFIG.phoneCall} className="text-amber-400 font-bold hover:underline">
                      {BUSINESS_CONFIG.phoneDisplay}
                    </a>
                  </div>

                  <div className="flex flex-col py-1.5 border-b border-zinc-800/60 gap-1">
                    <span className="text-zinc-400">Registered Warehouse:</span>
                    <span className="text-zinc-400 text-[11px] italic font-sans leading-tight">
                      {BUSINESS_CONFIG.addressPlaceholder}
                    </span>
                  </div>
                </div>

                {/* Bottom Interactive Trigger */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                    <PackageCheck className="w-4 h-4 text-amber-400" />
                    <span>No Advance Payment</span>
                  </div>

                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 font-mono transition-colors"
                  >
                    <span>View Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Infinite Scrolling Marquee Ticker */}
      <div className="bg-zinc-950 border-t border-b border-zinc-800 text-zinc-300 py-3 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-mono tracking-wider font-semibold">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="inline-flex items-center gap-3">
              <span className="text-amber-400">◆</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
