import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Gauge, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F1EEE5] border-t border-[#E5E1D7] text-[#77796F] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#879783] flex items-center justify-center text-white">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-[#242923]">
                GEAR UP
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#77796F]">
              A refined automotive marketplace for verified pre-owned two-wheelers. Built on mechanical telemetry, transparent ML valuation, and certified physical hub inspections.
            </p>
          </div>

          {/* Marketplace Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-[#242923] uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/explore" className="hover:text-[#242923] transition-colors">
                  Browse Motorcycle Collection
                </Link>
              </li>
              <li>
                <Link to="/price-estimator" className="hover:text-[#242923] transition-colors">
                  AI Fair-Price Valuation
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-[#242923] transition-colors">
                  Seller Submission Concierge
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#242923] transition-colors">
                  Side-by-Side Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Intelligence Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-[#242923] uppercase tracking-wider">
              Intelligence & Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/resale-studio" className="hover:text-[#242923] transition-colors">
                  AI Resale Studio
                </Link>
              </li>
              <li>
                <Link to="/bike-doctor" className="hover:text-[#242923] transition-colors">
                  Acoustic Symptom Doctor
                </Link>
              </li>
              <li>
                <Link to="/ai-buddy" className="hover:text-[#242923] transition-colors">
                  24/7 AI Master Mechanic
                </Link>
              </li>
              <li>
                <Link to="/trust" className="hover:text-[#242923] transition-colors">
                  120-Point Inspection Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Hubs Column */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-semibold text-[#242923] uppercase tracking-wider">
              Inspection Hubs
            </h4>
            <p className="text-xs text-[#77796F] leading-relaxed">
              Certified facilities active in Chandigarh Tricity, Delhi NCR, Bengaluru, Pune, and Mumbai.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white text-[#596B59] border border-[#E5E1D7]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#879783]" />
                <span>RTO Parivahan Verified</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E1D7] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#77796F]">
          <p>© 2026 GEAR UP Automotive Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/trust" className="hover:text-[#242923] transition-colors">Privacy Policy</Link>
            <Link to="/trust" className="hover:text-[#242923] transition-colors">Terms of Service</Link>
            <Link to="/trust" className="hover:text-[#242923] transition-colors">Security & RC Protection</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
