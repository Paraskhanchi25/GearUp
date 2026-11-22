import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Gauge, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#242622] text-[#85857E] text-xs font-mono border-t border-[#35483C]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20">
        
        {/* Top 4-Column Editorial Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand & Ethos */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#35483C] flex items-center justify-center text-white border border-[#A4AD98]/30">
                <span className="font-heading font-extrabold text-xs">GU</span>
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                GEAR UP
              </span>
            </Link>
            <p className="text-[11px] leading-relaxed text-[#85857E] font-sans">
              Haute engineering and transparent telemetry for verified pre-owned two-wheelers across India. Certified via 120-point mechanical audits and trained CatBoost ML inference.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] text-[#A4AD98]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A4AD98] animate-pulse" />
              <span>REGIONAL INSPECTION HUBS ONLINE</span>
            </div>
          </div>

          {/* Column 2: Discovery */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold text-white uppercase tracking-[0.25em]">
              [ INVENTORY ]
            </span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  01 // Verified Fleet Discovery
                </Link>
              </li>
              <li>
                <Link to="/price-estimator" className="hover:text-white transition-colors">
                  02 // CatBoost ML Valuation
                </Link>
              </li>
              <li>
                <Link to="/inspect/bike-001" className="hover:text-white transition-colors">
                  03 // 3D Digital Twin Viewer
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  04 // Side-by-Side Matrix
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-white transition-colors">
                  05 // Seller Submission Protocol
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: AI Telemetry & Diagnostics */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold text-white uppercase tracking-[0.25em]">
              [ TELEMETRY ]
            </span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/bike-doctor" className="hover:text-white transition-colors">
                  01 // Acoustic Stethoscope
                </Link>
              </li>
              <li>
                <Link to="/resale-studio" className="hover:text-white transition-colors">
                  02 // AI Upgrade Studio
                </Link>
              </li>
              <li>
                <Link to="/ai-buddy" className="hover:text-white transition-colors">
                  03 // 24/7 AI Master Mechanic
                </Link>
              </li>
              <li>
                <Link to="/trust" className="hover:text-white transition-colors">
                  04 // 120-Point Standards
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  05 // Inspector Review Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Certified Hubs */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold text-white uppercase tracking-[0.25em]">
              [ REGIONAL HUBS ]
            </span>
            <p className="text-[11px] text-[#85857E] leading-relaxed font-sans">
              Physical inspection and escrow hubs active across Chandigarh Tricity, Delhi NCR, Bengaluru, Pune, and Mumbai.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A4AD98]" />
                <span>RTO Parivahan Verified</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#85857E]">
          <p>© 2026 GEAR UP MOBILITY TECHNOLOGIES LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link to="/trust" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link to="/trust" className="hover:text-white transition-colors">TERMS OF SERVICE</Link>
            <Link to="/trust" className="hover:text-white transition-colors">ESCROW PROTOCOL</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
