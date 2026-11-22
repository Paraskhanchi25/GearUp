import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-deepBlack border-t border-darkSage text-sand-light/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-darkSage/60">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-charcoal flex items-center justify-center text-sand-warm border border-darkSage">
                <span className="font-heading font-extrabold text-xl">G</span>
              </div>
              <span className="font-heading font-bold text-2xl text-sand-offWhite tracking-wide">
                GEAR<span className="text-sage-muted">UP</span>
              </span>
            </div>
            <p className="text-sm text-sand-light/70 max-w-sm leading-relaxed">
              India&apos;s intelligent automotive two-wheeler platform. Verified motorcycles, scooters, and electric mobility with real-time GPS discovery, 120-point mechanical inspection, and ML valuation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-charcoal text-sand-warm border border-darkSage">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-muted" /> 120-Point Inspected
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-charcoal text-sand-warm border border-darkSage">
                <Award className="w-3.5 h-3.5 text-sand-warm" /> ML Fair-Price
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold text-sand-warm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/explore" className="text-sand-light/70 hover:text-sand-warm transition-colors">Explore Bikes on Map</Link></li>
              <li><Link to="/sell" className="text-sand-light/70 hover:text-sand-warm transition-colors">Sell Your Two-Wheeler</Link></li>
              <li><Link to="/price-estimator" className="text-sand-light/70 hover:text-sand-warm transition-colors">ML Price Valuation</Link></li>
              <li><Link to="/bike-doctor" className="text-sand-light/70 hover:text-sand-warm transition-colors">AI Bike Doctor</Link></li>
              <li><Link to="/resale-studio" className="text-sand-light/70 hover:text-sand-warm transition-colors">AI Resale Studio</Link></li>
              <li><Link to="/compare" className="text-sand-light/70 hover:text-sand-warm transition-colors">Compare Two-Wheelers</Link></li>
            </ul>
          </div>

          {/* Hubs & Coverage */}
          <div>
            <h4 className="text-xs font-mono font-bold text-sand-warm uppercase tracking-wider mb-4">Indian Hubs</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-sand-offWhite font-medium">Tri-City:</span> Chandigarh, Mohali, Panchkula</li>
              <li><span className="text-sand-offWhite font-medium">Delhi NCR:</span> Delhi, Gurgaon, Noida</li>
              <li><span className="text-sand-offWhite font-medium">Karnataka:</span> Bengaluru Urban</li>
              <li><span className="text-sand-offWhite font-medium">Maharashtra:</span> Pune & Mumbai</li>
              <li><span className="text-sand-offWhite font-medium">Rajasthan:</span> Jaipur Pink City</li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-xs font-mono font-bold text-sand-warm uppercase tracking-wider mb-4">Trust & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/trust" className="text-sand-light/70 hover:text-sand-warm transition-colors">120-Point Inspection</Link></li>
              <li><Link to="/how-it-works" className="text-sand-light/70 hover:text-sand-warm transition-colors">RC Ownership Transfer</Link></li>
              <li className="flex items-center gap-2 pt-2">
                <Phone className="w-3.5 h-3.5 text-sage-muted" />
                <span className="text-sand-offWhite font-mono">+91 1800-432-787</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sage-muted" />
                <span>support@gearup.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-sand-light/50 gap-4 font-mono">
          <p>© 2026 GEAR UP Mobility Technologies India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin" className="hover:text-sand-warm transition-colors">Admin Portal</Link>
            <Link to="/dashboard/dealer" className="hover:text-sand-warm transition-colors">Dealer Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
