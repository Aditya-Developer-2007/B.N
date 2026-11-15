import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../config/business';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 text-xs text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-200">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <span className="font-extrabold text-sm tracking-widest text-zinc-900 uppercase block">
              {BUSINESS_CONFIG.legalTitle}
            </span>
            <p className="text-zinc-500 leading-relaxed text-xs">
              Authorized primary wholesale distributor of cosmetics, clinical skincare, and personal care formulations.
            </p>
            <div className="font-mono text-[11px] text-zinc-500 space-y-1">
              <div>GST B2B Tax Invoicing</div>
              <div>Batch Tracked Inventory</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider block">
              Navigation
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              <li>
                <Link to="/" className="hover:text-zinc-900 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-zinc-900 transition-colors">
                  Wholesale Catalog
                </Link>
              </li>
              <li>
                <Link to="/enquiry-cart" className="hover:text-zinc-900 transition-colors">
                  Enquiry Cart & Checkout
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-zinc-900 transition-colors font-mono text-[11px] text-zinc-400">
                  Trade Desk Admin (PIN)
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] font-bold text-zinc-900 uppercase tracking-wider block">
              Cosmetic Lines
            </span>
            <ul className="space-y-1.5 text-xs text-zinc-600">
              <li>Skincare & Derma Actives</li>
              <li>Color Cosmetics & Lipsticks</li>
              <li>Salon Professional Haircare</li>
              <li>Artisanal Fragrances & Deos</li>
              <li>Daily Hygiene & FMCG</li>
            </ul>
          </div>

          {/* Contact Details & Address Placeholder Variable */}
          <div className="space-y-2 font-mono text-xs">
            <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider block">
              Central Trade Desk
            </span>
            <div className="text-zinc-800">
              Hotline:{' '}
              <a href={BUSINESS_CONFIG.phoneCall} className="font-bold hover:underline">
                {BUSINESS_CONFIG.phoneDisplay}
              </a>
            </div>
            <div className="text-zinc-500 text-[11px]">
              {BUSINESS_CONFIG.operatingHours}
            </div>
            <div className="text-zinc-600 text-[11px] font-sans pt-1 leading-relaxed">
              {BUSINESS_CONFIG.addressPlaceholder}
            </div>
          </div>

        </div>

        {/* Sub-footer copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS_CONFIG.name}. Authorized Wholesale Cosmetic Dealer.
          </div>
          <div>
            All consignments dispatched under standard B2B commercial terms.
          </div>
        </div>
      </div>
    </footer>
  );
}
