import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProfitSimulator from '../components/ProfitSimulator';
import Process from '../components/Process';
import { BUSINESS_CONFIG } from '../config/business';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Phone,
  MessageSquare,
  Building2,
  Clock,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

const FEATURED_PREVIEWS = [
  {
    sku: 'BN-SKN-001',
    name: 'Clinical Hyaluronic & Niacinamide Serums',
    category: 'Skincare',
    moq: '24 Units / Case',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    highlight: 'High Re-order Active',
    margin: '38% – 48%',
  },
  {
    sku: 'BN-MKP-101',
    name: 'Soft-Matte Velvet Lip Pigments (18 Shades)',
    category: 'Color Cosmetics',
    moq: '36 Pcs Display Tray',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    highlight: 'Counter Tester Included',
    margin: '42% – 52%',
  },
  {
    sku: 'BN-HAR-201',
    name: 'Professional Salon Keratin Smoothing Complex',
    category: 'Hair & Salon',
    moq: '6 Sets (Backbar)',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    highlight: 'Salon Grade 1 Litre',
    margin: '35% – 48%',
  },
  {
    sku: 'BN-FRG-301',
    name: 'Artisanal Eau de Parfum & Long-Wear Mists',
    category: 'Fragrances',
    moq: '12 Bottles Master Pack',
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    highlight: 'French Essence 18%',
    margin: '45% – 58%',
  },
];

export default function HomePage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* 1. Dark Luxury Hero Section + Infinite Scrolling Marquee */}
      <Hero />

      {/* 2. Interactive Feature: Retailer Profit & Volume Tier Simulator */}
      <ProfitSimulator />

      {/* 3. Ordering Process Section */}
      <Process />

      {/* 4. Featured Wholesale Lines with Rich Cards */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 bg-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-mono text-[10px] uppercase font-bold tracking-wider mb-2 border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>FAST-MOVING INVENTORY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Featured High-Margin Wholesale Lines
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-xl">
                Ready master cartons curated for beauty stores, dermatologists, and salons. Direct batch traceability and GST tax invoices.
              </p>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-zinc-950 text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-lg hover:bg-zinc-800 transition-all shadow-md self-start md:self-auto group"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4-Item Featured Cards Grid with Lift Micro-Interactions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {FEATURED_PREVIEWS.map((item) => (
              <div
                key={item.sku}
                className="border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-zinc-800 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group bg-stone-50/60 shadow-sm"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border-b border-zinc-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-950/90 text-white uppercase backdrop-blur-sm">
                        {item.sku}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {item.margin}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm text-zinc-900 leading-snug">
                      {item.name}
                    </h3>
                    <div className="font-mono text-[11px] text-zinc-600 pt-1 flex justify-between items-center">
                      <span>MOQ: {item.moq}</span>
                      <span className="text-emerald-700 font-bold">{item.highlight}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    to="/catalog"
                    className="w-full py-2.5 px-3 border border-zinc-300 rounded-lg text-center text-xs font-bold text-zinc-800 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors block uppercase tracking-wider shadow-sm"
                  >
                    View in Catalog →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner to Full Catalog */}
          <div className="mt-12 p-6 sm:p-8 border border-zinc-800 rounded-xl bg-zinc-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                COMMERCIAL WHOLESALE DESK
              </span>
              <h4 className="font-extrabold text-base sm:text-lg text-zinc-100">
                Looking to order case lots for your store or salon chain?
              </h4>
              <p className="text-xs text-zinc-400 max-w-xl">
                Add up to 25 units per item directly to your Enquiry Cart, review business details, and receive immediate WhatsApp quotations with verified batch codes.
              </p>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-lg transition-colors shadow-md whitespace-nowrap"
            >
              <span>Go to Wholesale Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Rich Contrast Matte Obsidian Enterprise Trust Strip */}
      <section className="py-14 bg-zinc-950 text-white border-b border-zinc-800 relative">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="border border-zinc-800 bg-zinc-900/80 p-6 rounded-xl space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400">
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                  Registered Dispatch Hub
                </span>
              </div>
              <p className="text-xs text-zinc-400 italic leading-relaxed">
                {BUSINESS_CONFIG.addressPlaceholder}
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/80 p-6 rounded-xl space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400">
                <Phone className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                  Trade Desk Contact
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-mono font-bold">
                Direct Call / WhatsApp:{' '}
                <a href={BUSINESS_CONFIG.phoneCall} className="text-amber-400 underline hover:text-amber-300">
                  {BUSINESS_CONFIG.phoneDisplay}
                </a>
              </p>
            </div>

            <div className="border border-zinc-800 bg-zinc-900/80 p-6 rounded-xl space-y-2 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400">
                <FileCheck className="w-5 h-5" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                  GST Billing Compliance
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                100% Tax Invoiced (GST ITC Input Credit) & Original Batch Codes for seamless audit compliance.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
