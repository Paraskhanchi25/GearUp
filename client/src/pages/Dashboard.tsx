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
    <div className="min-h-screen bg-[#F7F5EF] text-[#242923] pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar with Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center font-bold text-lg border border-[#E5D9C7] shadow-sm">
              DJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#77796F]">Welcome Back,</span>
                <h2 className="font-heading font-medium text-xl text-[#242923]">David John (Tri-City Motors)</h2>
              </div>
              <p className="text-xs text-[#596B59] font-medium">Verified GEAR UP Partner Dealer • Sector 17, Chandigarh</p>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center gap-1 bg-[#F1EEE5] p-1.5 rounded-2xl border border-[#E5D9C7] text-xs font-medium">
            <button
              onClick={() => setRole('dealer')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${role === 'dealer' ? 'bg-[#879783] text-white shadow-sm font-semibold' : 'text-[#77796F] hover:text-[#242923]'}`}
            >
              Dealer Portal
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${role === 'seller' ? 'bg-[#879783] text-white shadow-sm font-semibold' : 'text-[#77796F] hover:text-[#242923]'}`}
            >
              Seller View
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${role === 'buyer' ? 'bg-[#879783] text-white shadow-sm font-semibold' : 'text-[#77796F] hover:text-[#242923]'}`}
            >
              Buyer View
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${role === 'admin' ? 'bg-[#879783] text-white shadow-sm font-semibold' : 'text-[#77796F] hover:text-[#242923]'}`}
            >
              Admin View
            </button>
          </div>
        </div>

        {/* BUYER VIEW: UNLOCKED MEETUP LOCATIONS & PURCHASES */}
        {role === 'buyer' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#879783] space-y-4 shadow-elevated">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#879783]" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-lg text-[#242923]">My Unlocked Meetup Locations</h3>
                  <p className="text-xs text-[#77796F]">Paid seller locations and test-ride authorizations active for your account</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#F1EEE5] text-[#596B59] text-xs font-semibold border border-[#E5D9C7]">
                {buyerPurchases.length} Active Pass(es)
              </span>
            </div>

            {buyerPurchases.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] text-center space-y-2">
                <Compass className="w-8 h-8 text-[#879783] mx-auto opacity-70" />
                <p className="text-xs font-medium text-[#242923]">No active location passes unlocked yet.</p>
                <p className="text-xs text-[#77796F] max-w-sm mx-auto">
                  When you unlock a seller&apos;s exact meetup spot from any vehicle details page, it will be saved here for quick navigation.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs mt-2 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Explore Marketplace</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyerPurchases.map((p, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-2.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-[#596B59]">Listing: {p.listing_id}</span>
                        <p className="font-medium text-[#242923] text-sm mt-0.5">{p.location_details?.address}</p>
                        <p className="text-[#77796F] text-[11px]">{p.location_details?.locality}, {p.location_details?.city}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-[#596B59] text-[10px] font-semibold border border-[#E5E1D7] flex-shrink-0">
                        {p.days_remaining} Days Left
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D7]">
                      <span className="text-[11px] text-[#77796F]">
                        {p.location_details?.test_ride_available ? '✓ Test Ride Authorized' : 'Inspection Only'}
                      </span>
                      <a
                        href={p.location_details?.directions_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-[11px] flex items-center gap-1 transition-colors shadow-sm"
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

        {/* STATS METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-[#77796F]">
              <span>Active Marketplace Listings</span>
              <Activity className="w-4 h-4 text-[#879783]" />
            </div>
            <p className="font-heading font-medium text-3xl text-[#242923]">91</p>
            <p className="text-xs text-[#596B59] flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +14% from last month
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-[#77796F]">
              <span>Vehicles Under Inspection</span>
              <Wrench className="w-4 h-4 text-[#879783]" />
            </div>
            <p className="font-heading font-medium text-3xl text-[#242923]">18</p>
            <p className="text-xs text-[#77796F]">In Resale Studio pipeline</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-[#77796F]">
              <span>Total Revenue / Sales (MTD)</span>
              <DollarSign className="w-4 h-4 text-[#879783]" />
            </div>
            <p className="font-heading font-medium text-3xl text-[#242923]">₹85.7 Lakh</p>
            <p className="text-xs text-[#596B59] font-medium">+35% vs target</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-2">
            <div className="flex items-center justify-between text-xs text-[#77796F]">
              <span>Telematics / Live GPS Tracking</span>
              <span className="w-2 h-2 rounded-full bg-[#879783] animate-pulse"></span>
            </div>
            <p className="font-heading font-medium text-3xl text-[#596B59]">6 Active</p>
            <p className="text-xs text-[#77796F]">Customer test rides in progress</p>
          </div>
        </div>

        {/* Inventory & Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Listings Table (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-medium text-lg text-[#242923]">Inventory & Enquiries</h3>
            </div>

            <div className="space-y-3">
              {SEED_LISTINGS.slice(0, 5).map((bike) => (
                <div
                  key={bike.id}
                  className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] hover:border-[#879783] flex items-center justify-between gap-4 text-xs transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={bike.primaryImage} alt={bike.title} className="w-12 h-12 rounded-xl object-cover bg-[#F1EEE5]" />
                    <div className="min-w-0">
                      <p className="font-medium text-[#242923] truncate">{bike.title}</p>
                      <p className="text-[#77796F] text-[11px]">{bike.km.toLocaleString('en-IN')} km • {bike.area}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-heading font-medium text-[#242923] text-sm">{formatINR(bike.price)}</p>
                    <span className="text-[10px] text-[#596B59] font-semibold">Active Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Ride Schedule & Alerts (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-5">
            <h3 className="font-heading font-medium text-lg text-[#242923]">Today&apos;s Test Ride Appointments</h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#242923]">Classic 350 Dual Channel</span>
                  <span className="text-[#596B59] font-semibold">11:00 AM Today</span>
                </div>
                <p className="text-[#77796F]">Rider: Gurpreet Singh (Sector 35 Hub)</p>
                <div className="flex items-center gap-1.5 pt-1 text-xs text-[#596B59]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Licence Verified
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#242923]">Ather 450X Gen 3 Pro</span>
                  <span className="text-[#596B59] font-semibold">03:30 PM Today</span>
                </div>
                <p className="text-[#77796F]">Rider: Rohit Sharma (Doorstep Test Ride)</p>
                <div className="flex items-center gap-1.5 pt-1 text-xs text-[#77796F]">
                  <Clock className="w-3.5 h-3.5 text-[#879783]" /> Doorstep Driver Assigned
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-[#E5E1D7] grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/resale-studio"
                className="p-3 rounded-xl bg-[#F1EEE5] hover:bg-[#E5D9C7] text-center font-medium text-[#242923] border border-[#E5D9C7] transition-colors"
              >
                Resale Studio
              </Link>
              <Link
                to="/explore"
                className="p-3 rounded-xl bg-[#879783] hover:bg-[#596B59] text-center font-medium text-white transition-colors shadow-sm"
              >
                View Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
