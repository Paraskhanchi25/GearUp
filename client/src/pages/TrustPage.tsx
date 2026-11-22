import React from 'react';
import { ShieldCheck, CheckCircle2, Award, FileText, AlertCircle, Sparkles } from 'lucide-react';

export const TrustPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-24 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 text-xs font-mono font-bold text-[#35483C] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#35483C]" />
            <span>AUTHENTICITY & VERIFICATION</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-[#242622] tracking-tight">
            120-Point Inspection & Trust Framework
          </h1>
          <p className="text-[#85857E] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            How we protect Indian two-wheeler buyers and sellers from odometer fraud, hidden accidents, and paperwork delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-7 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-md space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#35483C] text-white flex items-center justify-center font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#242622]">Mechanical & Frame Diagnostics</h3>
            <p className="text-xs text-[#85857E] leading-relaxed font-sans">
              Every certified bike is lifted on hydraulic ramps at certified partner hubs. We test engine compression, chassis straightness, fork oil leakage, disc brake rotor thickness, and tyre wear.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-md space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-[#35483C] text-white flex items-center justify-center font-bold shadow-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#242622]">Parivahan RTO Document Check</h3>
            <p className="text-xs text-[#85857E] leading-relaxed font-sans">
              We cross-verify chassis number and engine number stamping with national Parivahan Sewa database records to ensure zero pending hypothecation, blacklisting, or unpaid challans.
            </p>
          </div>
        </div>

        {/* Verification Tiers Table */}
        <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-lg space-y-5">
          <div>
            <span className="text-xs font-mono font-bold text-[#35483C] uppercase tracking-wider block">INTEGRITY MATRIX</span>
            <h3 className="font-heading font-bold text-xl text-[#242622] tracking-tight">Our 4-Tier Verification Badges</h3>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#242622]">1. Seller Provided</p>
                <p className="text-[#85857E] text-[11px] mt-0.5">Uninspected listing posted directly by an individual seller.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white border border-[#242622]/10 text-[#85857E] font-mono text-[10px] font-bold shrink-0">
                Tier 1
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#242622]">2. AI Estimated</p>
                <p className="text-[#85857E] text-[11px] mt-0.5">Images analyzed for visible cosmetic condition; price estimated by algorithm.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] font-bold shrink-0">
                Tier 2
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#242622]">3. Document Verified</p>
                <p className="text-[#85857E] text-[11px] mt-0.5">RC, Insurance, and PUC validated via RTO APIs.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold shrink-0">
                Tier 3
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#161816] text-white border border-white/10 flex items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="font-bold text-white">4. Physically Inspected (120-Point)</p>
                <p className="text-[#A4AD98] text-[11px] mt-0.5">Inspected by a certified technician; full diagnostic scorecard published.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white font-mono text-[10px] font-bold shrink-0">
                Tier 4 (Gold)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
