import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Activity, 
  FileText, 
  User, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  DollarSign,
  Navigation,
  ExternalLink,
  Compass
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { Link } from 'react-router-dom';
import { getBuyerPurchases } from '../services/aiApi';

export const DashboardPage: React.FC = () => {
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer' | 'admin'>('dealer');
  const [buyerPurchases, setBuyerPurchases] = useState<any[]>([]);

  useEffect(() => {
    const buyerId = localStorage.getItem('gearup_buyer_id') || 'buyer-101';
    getBuyerPurchases(buyerId).then(res => {
      if (res && res.purchases) {
        setBuyerPurchases(res.purchases);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1411] text-slate-100 pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar with Role Switcher matching visual references */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101D19] border border-forest-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center font-bold text-lg border border-forest-500/50">
              DJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Welcome Back,</span>
                <h2 className="font-heading font-extrabold text-xl text-white">David John (Tri-City Motors)</h2>
              </div>
              <p className="text-xs text-forest-300 font-medium">Verified GEAR UP Partner Dealer • Sector 17, Chandigarh</p>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center gap-1 bg-forest-950 p-1 rounded-2xl border border-forest-800 text-xs font-semibold">
            <button
              onClick={() => setRole('dealer')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'dealer' ? 'bg-forest-600 text-white' : 'text-slate-400'}`}
            >
              Dealer Portal
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'seller' ? 'bg-forest-600 text-white' : 'text-slate-400'}`}
            >
              Seller View
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'buyer' ? 'bg-forest-600 text-white' : 'text-slate-400'}`}
            >
              Buyer View
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'admin' ? 'bg-forest-600 text-white' : 'text-slate-400'}`}
            >
              Admin View
            </button>
          </div>
        </div>

        {/* BUYER VIEW: UNLOCKED MEETUP LOCATIONS & PURCHASES */}
        {role === 'buyer' && (
          <div className="p-6 rounded-3xl bg-[#101D19] border border-emerald-500/50 space-y-4 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">My Unlocked Meetup Locations</h3>
                  <p className="text-xs text-slate-400">Paid seller locations and test-ride authorizations active for your account</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                {buyerPurchases.length} Active Pass(es)
              </span>
            </div>

            {buyerPurchases.length === 0 ? (
              <div className="p-6 rounded-2xl bg-forest-950/60 border border-forest-900 text-center space-y-2">
                <Compass className="w-8 h-8 text-forest-700 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No active location passes unlocked yet.</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  When you unlock a seller&apos;s exact meetup spot from any vehicle details page, it will be saved here for quick navigation.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs mt-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Explore Marketplace</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyerPurchases.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-forest-950/80 border border-forest-800 space-y-2.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Listing: {p.listing_id}</span>
                        <p className="font-bold text-white text-sm mt-0.5">{p.location_details?.address}</p>
                        <p className="text-slate-400 text-[11px]">{p.location_details?.locality}, {p.location_details?.city}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600/50 flex-shrink-0">
                        {p.days_remaining} Days Left
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-forest-900">
                      <span className="text-[11px] text-slate-400">
                        {p.location_details?.test_ride_available ? '✓ Test Ride Authorized' : 'Inspection Only'}
                      </span>
                      <a
                        href={p.location_details?.directions_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-forest-700 hover:bg-forest-600 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATS METRICS (Inspired by Bolt / Telematics visual reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-3xl bg-[#101D19] border border-forest-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Marketplace Listings</span>
              <Activity className="w-4 h-4 text-forest-400" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-white">91</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> +14% from last month
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#101D19] border border-forest-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Vehicles Under Inspection / Prep</span>
              <Wrench className="w-4 h-4 text-gold" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-gold-light">18</p>
            <p className="text-[11px] text-slate-400">In Resale Studio pipeline</p>
          </div>

          <div className="p-5 rounded-3xl bg-[#101D19] border border-forest-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Revenue / Sales (MTD)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-white">₹85.7 Lakh</p>
            <p className="text-[11px] text-emerald-400 font-semibold">+35% vs target</p>
          </div>

          <div className="p-5 rounded-3xl bg-[#101D19] border border-forest-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Telematics / Live GPS Tracking</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-forest-300">6 Active</p>
            <p className="text-[11px] text-slate-400">Customer test rides in progress</p>
          </div>
        </div>

        {/* Live Fleet / Listings Map Mini Panel & Leads Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Listings Table (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">Inventory & Enquiries</h3>
              <Link to="/sell" className="text-xs font-bold text-forest-300 hover:underline">
                + Add Two-Wheeler
              </Link>
            </div>

            <div className="space-y-3">
              {SEED_LISTINGS.slice(0, 5).map((bike) => (
                <div
                  key={bike.id}
                  className="p-3.5 rounded-2xl bg-forest-950/70 border border-forest-900 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={bike.primaryImage} alt={bike.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{bike.title}</p>
                      <p className="text-slate-400">{bike.km.toLocaleString('en-IN')} km • {bike.area}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-heading font-extrabold text-white text-sm">{formatINR(bike.price)}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">Active Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Ride Schedule & Telematics Alerts (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-5">
            <h3 className="font-heading font-bold text-base text-white">Today&apos;s Test Ride Appointments</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-forest-950 border border-forest-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Classic 350 Dual Channel</span>
                  <span className="text-forest-300 font-semibold">11:00 AM Today</span>
                </div>
                <p className="text-slate-400">Rider: Gurpreet Singh (Sector 35 Hub)</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> License Verified
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-950 border border-forest-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Ather 450X Gen 3 Pro</span>
                  <span className="text-forest-300 font-semibold">03:30 PM Today</span>
                </div>
                <p className="text-slate-400">Rider: Rohit Sharma (Doorstep Test Ride)</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" /> Doorstep Driver Assigned
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-forest-900 grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/resale-studio"
                className="p-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-center font-bold text-gold-light border border-gold/30 transition-colors"
              >
                Launch Resale Studio
              </Link>
              <Link
                to="/explore"
                className="p-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-center font-bold text-forest-200 border border-forest-700 transition-colors"
              >
                View Map Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
