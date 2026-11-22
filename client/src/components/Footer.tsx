import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08100D] border-t border-[#172E26] text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#162922]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-forest-200 border border-forest-600/40">
                <span className="font-heading font-extrabold text-xl">G</span>
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-wide">
                GEAR<span className="text-forest-400">UP</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s intelligent used two-wheeler marketplace. Verified motorcycles, scooters, and electric rides with real-time GPS discovery and AI resale enhancement.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-950 text-forest-300 border border-forest-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-400" /> 120-Point Inspected
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-950 text-gold-light border border-gold/40">
                <Award className="w-3.5 h-3.5 text-gold" /> Fair-Price AI
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore" className="hover:text-forest-300 transition-colors">Explore Bikes on Map</Link></li>
              <li><Link to="/sell" className="hover:text-forest-300 transition-colors">Sell Your Two-Wheeler</Link></li>
              <li><Link to="/resale-studio" className="hover:text-gold transition-colors">AI Resale Upgrade Studio</Link></li>
              <li><Link to="/price-estimator" className="hover:text-forest-300 transition-colors">AI Price Valuation</Link></li>
              <li><Link to="/compare" className="hover:text-forest-300 transition-colors">Compare Two-Wheelers</Link></li>
            </ul>
          </div>

          {/* Hubs & Coverage */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Indian Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-300 font-medium">Tri-City:</span> Chandigarh, Mohali, Panchkula</li>
              <li><span className="text-slate-300 font-medium">Delhi NCR:</span> Delhi, Gurgaon, Noida</li>
              <li><span className="text-slate-300 font-medium">Karnataka:</span> Bengaluru Urban</li>
              <li><span className="text-slate-300 font-medium">Maharashtra:</span> Pune & Mumbai</li>
              <li><span className="text-slate-300 font-medium">Rajasthan:</span> Jaipur Pink City</li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Trust & Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/trust" className="hover:text-forest-300 transition-colors">120-Point Inspection</Link></li>
              <li><Link to="/trust" className="hover:text-forest-300 transition-colors">RC Ownership Transfer</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Phone className="w-4 h-4 text-forest-400" />
                <span className="text-slate-200 font-medium">+91 1800-432-787</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest-400" />
                <span>support@gearup.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GEAR UP Mobility Technologies India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Demo Mode: Fully interactive mock data with GPS math</span>
            <Link to="/admin" className="hover:text-slate-300">Admin Portal</Link>
            <Link to="/dashboard/dealer" className="hover:text-slate-300">Dealer Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
