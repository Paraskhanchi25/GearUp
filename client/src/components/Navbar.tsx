import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  PlusCircle, 
  Bot, 
  Wrench, 
  MapPin, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  ShieldCheck,
  Crosshair
} from 'lucide-react';
import { POPULAR_INDIAN_HUBS } from '../utils/geo';
import { SearchCenter } from '../types';

interface NavbarProps {
  currentLocation: SearchCenter;
  onLocationChange: (loc: SearchCenter) => void;
  onRequestGPS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onLocationChange,
  onRequestGPS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" strokeDasharray="4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900">
                  GEAR<span className="text-blue-600">UP</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Buy Smarter. Sell Better.</p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <Link
              to="/explore"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/explore')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-600" />
              Explore Bikes
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </Link>

            <Link
              to="/sell"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/sell')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              Sell Your Bike
            </Link>

            <Link
              to="/price-estimator"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/price-estimator')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Valuation</span>
              <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1 py-0.2 rounded font-semibold">
                ML
              </span>
            </Link>

            <Link
              to="/bike-doctor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/bike-doctor')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Bike Doctor</span>
            </Link>

            <Link
              to="/resale-studio"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/resale-studio')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Resale Studio</span>
            </Link>

            <Link
              to="/ai-buddy"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/ai-buddy')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bot className="w-4 h-4 text-blue-600" />
              <span>AI Buddy</span>
            </Link>

            <Link
              to="/compare"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/compare')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Compare
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive('/how-it-works')
                  ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </Link>
          </nav>

          {/* Right Action Bar: Location & Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Location Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[120px] truncate">{currentLocation.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Search Hub</p>
                    <p className="text-xs text-slate-500">Discover bikes within radius</p>
                  </div>

                  {/* GPS Permission Button */}
                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-medium text-left transition-colors border border-blue-200/60"
                  >
                    <Crosshair className="w-4 h-4 text-blue-600 animate-pulse" />
                    <div>
                      <p className="font-semibold text-blue-900">Use Exact Device GPS</p>
                      <p className="text-[10px] text-blue-700">Request browser location</p>
                    </div>
                  </button>

                  <div className="mt-2 max-h-56 overflow-y-auto space-y-1">
                    {POPULAR_INDIAN_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        onClick={() => {
                          onLocationChange(hub);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                          currentLocation.name === hub.name
                            ? 'bg-slate-100 text-slate-900 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{hub.name}</span>
                        {currentLocation.name === hub.name && (
                          <span className="text-[10px] text-blue-600 font-bold">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Dashboard</span>
            </Link>

            {/* Primary Action Button */}
            <Link
              to="/sell"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
            >
              <span>Post Free Ad</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{currentLocation.name}</span>
            </div>
            <button
              onClick={onRequestGPS}
              className="text-xs text-blue-600 font-semibold underline flex items-center gap-1"
            >
              <Crosshair className="w-3.5 h-3.5" />
              Use GPS
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100"
            >
              <Compass className="w-5 h-5 text-blue-600" />
              <span>Explore Map</span>
            </Link>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100"
            >
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <span>Sell Your Bike</span>
            </Link>
            <Link
              to="/resale-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100"
            >
              <Wrench className="w-5 h-5 text-amber-600" />
              <span>Resale Studio</span>
            </Link>
            <Link
              to="/ai-buddy"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-100"
            >
              <Bot className="w-5 h-5 text-blue-600" />
              <span>AI Bike Buddy</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-slate-700 py-1.5 hover:text-slate-900"
            >
              Compare Vehicles
            </Link>
            <Link
              to="/price-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-slate-700 py-1.5 hover:text-slate-900"
            >
              AI Price Estimator
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-slate-700 py-1.5 hover:text-slate-900"
            >
              My Dashboard
            </Link>
            <Link
              to="/trust"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-slate-700 py-1.5 flex items-center gap-1.5 hover:text-slate-900"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              120-Point Inspection & Trust
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
