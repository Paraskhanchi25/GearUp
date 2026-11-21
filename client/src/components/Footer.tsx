import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-heading font-extrabold text-lg shadow-sm">
                G
              </div>
              <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">
                GEAR<span className="text-blue-600">UP</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              India&apos;s intelligent used two-wheeler marketplace. Verified motorcycles, scooters, and electric rides with real-time GPS discovery and AI resale enhancement.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 120-Point Inspected
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                <Award className="w-3.5 h-3.5 text-blue-600" /> Fair-Price AI
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore" className="text-slate-600 hover:text-slate-900 transition-colors">Explore Bikes on Map</Link></li>
              <li><Link to="/sell" className="text-slate-600 hover:text-slate-900 transition-colors">Sell Your Two-Wheeler</Link></li>
              <li><Link to="/resale-studio" className="text-slate-600 hover:text-slate-900 transition-colors">AI Resale Upgrade Studio</Link></li>
              <li><Link to="/price-estimator" className="text-slate-600 hover:text-slate-900 transition-colors">AI Price Valuation</Link></li>
              <li><Link to="/compare" className="text-slate-600 hover:text-slate-900 transition-colors">Compare Two-Wheelers</Link></li>
            </ul>
          </div>

          {/* Hubs & Coverage */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Indian Hubs</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><span className="font-semibold text-slate-800">Tri-City:</span> Chandigarh, Mohali, Panchkula</li>
              <li><span className="font-semibold text-slate-800">Delhi NCR:</span> Delhi, Gurgaon, Noida</li>
              <li><span className="font-semibold text-slate-800">Karnataka:</span> Bengaluru Urban</li>
              <li><span className="font-semibold text-slate-800">Maharashtra:</span> Pune & Mumbai</li>
              <li><span className="font-semibold text-slate-800">Rajasthan:</span> Jaipur Pink City</li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Trust & Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/trust" className="text-slate-600 hover:text-slate-900 transition-colors">120-Point Inspection</Link></li>
              <li><Link to="/how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">RC Ownership Transfer</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-800 font-medium">+91 1800-432-787</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">support@gearup.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 GEAR UP Mobility Technologies India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Demo Mode: Fully interactive mock data with GPS math</span>
            <Link to="/admin" className="text-slate-500 hover:text-slate-800">Admin Portal</Link>
            <Link to="/dashboard" className="text-slate-500 hover:text-slate-800">Dealer Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
