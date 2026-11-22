import React from 'react';
import { ShieldCheck, CheckCircle2, Award, FileText, AlertCircle } from 'lucide-react';

export const TrustPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-24 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#242622] uppercase tracking-widest">
            AUTHENTICITY & VERIFICATION
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#242622]">
            120-Point Inspection & Trust Framework
          </h1>
          <p className="text-[#85857E] text-sm max-w-xl mx-auto">
            How we protect Indian two-wheeler buyers and sellers from odometer fraud, hidden accidents, and paperwork delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#E9E3D8]/40 text-[#35483C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#242622]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#242622]">Mechanical & Frame Dignostics</h3>
            <p className="text-xs text-[#85857E] leading-relaxed">
              Every certified bike is lifted on hydraulic ramps at certified partner hubs. We test engine compression, chassis straightness, fork oil leakage, disc brake rotor thickness, and tyre wear.
            </p>
          </div>

          <div className="p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#E9E3D8]/40 text-[#35483C] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-[#242622]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#242622]">Parivahan RTO Document Check</h3>
            <p className="text-xs text-[#85857E] leading-relaxed">
              We cross-verify chassis number and engine number stamping with national Parivahan Sewa database records to ensure zero pending hypothecation, blacklisting, or unpaid challans.
            </p>
          </div>
        </div>

        {/* Verification Tiers Table */}
        <div className="p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-4">
          <h3 className="font-heading font-bold text-base text-[#242622]">Our 4-Tier Verification Badges</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-none bg-white border border-[#E9E3D8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242622]">1. Seller Provided</p>
                <p className="text-[#85857E] text-[11px]">Uninspected listing posted directly by an individual seller.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[#85857E] font-mono text-[10px]">Tier 1</span>
            </div>

            <div className="p-3.5 rounded-none bg-white border border-[#E9E3D8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242622]">2. AI Estimated</p>
                <p className="text-[#85857E] text-[11px]">Images analyzed for visible cosmetic condition; price estimated by algorithm.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 font-mono text-[10px]">Tier 2</span>
            </div>

            <div className="p-3.5 rounded-none bg-white border border-[#E9E3D8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242622]">3. Document Verified</p>
                <p className="text-[#85857E] text-[11px]">RC, Insurance, and PUC validated via RTO APIs.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-900 text-[#35483C] font-mono text-[10px]">Tier 3</span>
            </div>

            <div className="p-3.5 rounded-none bg-white border border-[#E9E3D8] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#242622]">4. Physically Inspected (120-Point)</p>
                <p className="text-[#85857E] text-[11px]">Inspected by a certified technician; full diagnostic scorecard published.</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#35483C]/30 text-white font-mono text-[10px]">Tier 4 (Gold)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
