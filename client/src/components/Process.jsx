import React from 'react';
import { BUSINESS_CONFIG } from '../config/business';
import { ArrowRight } from 'lucide-react';

export default function Process() {
  const steps = [
    {
      num: '01',
      title: 'Select Inventory & Volume',
      desc: 'Browse categories or submit your monthly store/salon requirement sheet via our trade desk or WhatsApp form.',
      meta: 'MOQ from 12–24 units / case lots',
    },
    {
      num: '02',
      title: 'Receive Wholesale Quote',
      desc: 'Our commercial managers calculate tiered landing rates, verify warehouse batch codes, and generate formal pro-forma estimates.',
      meta: 'Direct response via 8527606769',
    },
    {
      num: '03',
      title: 'GST Billing & Dispatch',
      desc: 'Orders are packed in heavy-duty tamper-sealed corrugated cartons and dispatched with full GST ITC invoice and transport LR tracking.',
      meta: '24–48hr turnaround nationwide',
    },
  ];

  return (
    <section id="process" className="bg-zinc-50/60 py-14 sm:py-20 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase font-semibold block mb-1">
            B2B PROCUREMENT WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            How Wholesale Ordering Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2">
            A transparent 3-step procurement cycle designed for beauty retail stores, salon procurement managers, and pharmacies.
          </p>
        </div>

        {/* 3-Step Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="bg-white border border-zinc-200 p-6 sm:p-7 rounded flex flex-col justify-between space-y-5 relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-zinc-400">
                  {step.num}
                </span>
                <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-semibold uppercase">
                  Step {idx + 1}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-base text-zinc-900 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>{step.meta}</span>
                {idx < 2 && <ArrowRight className="w-3.5 h-3.5 text-zinc-400 hidden md:block" />}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
