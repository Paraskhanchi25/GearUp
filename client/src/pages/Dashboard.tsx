import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer' | 'admin'>('dealer');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar with Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              DJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Welcome Back,</span>
                <h2 className="font-heading font-extrabold text-xl text-slate-900">David John (Tri-City Motors)</h2>
              </div>
              <p className="text-xs text-blue-700 font-medium">Verified GEAR UP Partner Dealer • Sector 17, Chandigarh</p>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setRole('dealer')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'dealer' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dealer Portal
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'seller' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Seller View
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'buyer' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Buyer View
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${role === 'admin' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Admin View
            </button>
          </div>
        </div>

        {/* STATS METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Active Marketplace Listings</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-slate-900">91</p>
            <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> +14% from last month
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Vehicles Under Inspection / Prep</span>
              <Wrench className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-amber-900">18</p>
            <p className="text-[11px] text-slate-500">In Resale Studio pipeline</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Total Revenue / Sales (MTD)</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-slate-900">₹85.7 Lakh</p>
            <p className="text-[11px] text-emerald-700 font-semibold">+35% vs target</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Telematics / Live GPS Tracking</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-blue-700">6 Active</p>
            <p className="text-[11px] text-slate-500">Customer test rides in progress</p>
          </div>
        </div>

        {/* Live Fleet / Listings Map Mini Panel & Leads Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Listings Table (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900">Inventory & Enquiries</h3>
              <Link to="/sell" className="text-xs font-bold text-blue-600 hover:text-blue-800">
                + Add Two-Wheeler
              </Link>
            </div>

            <div className="space-y-3">
              {SEED_LISTINGS.slice(0, 5).map((bike) => (
                <div
                  key={bike.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={bike.primaryImage} alt={bike.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{bike.title}</p>
                      <p className="text-slate-500">{bike.km.toLocaleString('en-IN')} km • {bike.area}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-heading font-extrabold text-slate-900 text-sm">{formatINR(bike.price)}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold">Active Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Ride Schedule (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-base text-slate-900">Today&apos;s Test Ride Appointments</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Classic 350 Dual Channel</span>
                  <span className="text-blue-700 font-semibold">11:00 AM Today</span>
                </div>
                <p className="text-slate-500">Rider: Gurpreet Singh (Sector 35 Hub)</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> License Verified
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Ather 450X Gen 3 Pro</span>
                  <span className="text-blue-700 font-semibold">03:30 PM Today</span>
                </div>
                <p className="text-slate-500">Rider: Rohit Sharma (Doorstep Test Ride)</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Doorstep Driver Assigned
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/resale-studio"
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-center font-bold text-slate-800 border border-slate-200 transition-colors"
              >
                Launch Resale Studio
              </Link>
              <Link
                to="/explore"
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-center font-bold text-white transition-colors"
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
