import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../config/business';
import { useCart } from '../context/CartContext';
import { Phone, ShoppingBag, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalUnits } = useCart();

  const navLinks = [
    { label: 'Home Overview', path: '/' },
    { label: 'Wholesale Catalog', path: '/catalog' },
    { label: 'Enquiry Cart', path: '/enquiry-cart' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-amber-400 font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              BN
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-widest text-zinc-950 uppercase leading-none">
                {BUSINESS_CONFIG.legalTitle}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase font-bold pt-0.5">
                Wholesale Cosmetic Supply
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-bold tracking-wider uppercase transition-colors relative py-1 ${
                    isActive
                      ? 'text-zinc-950 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-zinc-950'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions: Phone + Enquiry Cart */}
          <div className="hidden md:flex items-center gap-3.5">
            <a
              href={BUSINESS_CONFIG.phoneCall}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-900 border border-zinc-300 bg-stone-50 px-3.5 py-2 rounded-lg hover:bg-stone-100 transition-colors shadow-sm"
              title="Call Trade Desk"
            >
              <Phone className="w-3.5 h-3.5 text-zinc-700" />
              <span>{BUSINESS_CONFIG.phoneDisplay}</span>
            </a>

            <Link
              to="/enquiry-cart"
              className="inline-flex items-center gap-2 text-xs font-bold bg-zinc-950 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all relative shadow-md group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Enquiry Cart</span>
              {totalUnits > 0 ? (
                <span className="font-mono text-[11px] bg-amber-500 text-zinc-950 px-1.5 py-0.2 rounded font-black shadow-sm">
                  {totalUnits}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-zinc-400">
                  (0)
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right Icons (Cart + Hamburger) */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/enquiry-cart"
              className="p-2 border border-zinc-200 rounded-lg relative text-zinc-900 bg-stone-50"
              aria-label="Enquiry Cart"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-900" />
              {totalUnits > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalUnits}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 hover:text-zinc-950 border border-zinc-200 rounded-lg bg-stone-50"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide py-2.5 px-3 rounded-lg flex items-center justify-between ${
                    isActive
                      ? 'bg-zinc-950 text-white font-bold'
                      : 'text-zinc-700 hover:bg-stone-100'
                  }`
                }
              >
                <span>{link.label}</span>
                {link.path === '/enquiry-cart' && totalUnits > 0 && (
                  <span className="font-mono text-xs bg-amber-500 text-zinc-950 px-2 py-0.5 rounded font-black">
                    {totalUnits} units
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <a
              href={BUSINESS_CONFIG.phoneCall}
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-mono font-bold text-zinc-900 border border-zinc-300 rounded-lg bg-stone-50"
            >
              <Phone className="w-4 h-4 text-zinc-700" />
              <span>Call: {BUSINESS_CONFIG.phoneDisplay}</span>
            </a>
            <Link
              to="/enquiry-cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold bg-zinc-950 text-white rounded-lg shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Review Cart ({totalUnits} Units)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
