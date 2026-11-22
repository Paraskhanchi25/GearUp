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
    <header className="sticky top-0 z-50 bg-[#0B1512]/95 backdrop-blur-md border-b border-[#1A332B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 border border-forest-500/30 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-forest-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" strokeDasharray="4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                  GEAR<span className="text-forest-400">UP</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-forest-900/80 text-forest-300 border border-forest-700/50 uppercase tracking-widest">
                  India
                </span>
              </div>
              <p className="text-[11px] text-charcoal-400 font-medium tracking-tight">Buy Smarter. Sell Better.</p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/explore"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/explore')
                  ? 'bg-forest-900/60 text-forest-200 border border-forest-600/50'
                  : 'text-slate-300 hover:text-white hover:bg-forest-950/40'
              }`}
            >
              <Compass className="w-4 h-4 text-forest-400" />
              Explore Bikes
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500"></span>
              </span>
            </Link>

            <Link
              to="/sell"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/sell')
                  ? 'bg-forest-900/60 text-forest-200 border border-forest-600/50'
                  : 'text-slate-300 hover:text-white hover:bg-forest-950/40'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-forest-400" />
              Sell Your Bike
            </Link>

            <Link
              to="/price-estimator"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/price-estimator')
                  ? 'bg-forest-900/60 text-forest-200 border border-forest-600/50'
                  : 'text-slate-300 hover:text-white hover:bg-forest-950/40'
              }`}
            >
              <span>Valuation</span>
              <span className="text-[10px] bg-forest-900 text-forest-300 border border-forest-700 px-1 py-0.2 rounded font-bold">
                ML
              </span>
            </Link>

            <Link
              to="/bike-doctor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/bike-doctor')
                  ? 'bg-forest-900/60 text-forest-200 border border-forest-600/50'
                  : 'text-slate-300 hover:text-white hover:bg-forest-950/40'
              }`}
            >
              <span>Bike Doctor</span>
            </Link>

            <Link
              to="/resale-studio"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/resale-studio')
                  ? 'bg-forest-900/60 text-forest-200 border border-forest-600/50'
                  : 'text-slate-300 hover:text-white hover:bg-forest-950/40'
              }`}
            >
              <Wrench className="w-4 h-4 text-gold" />
              <span>Resale Studio</span>
            </Link>

            <Link
              to="/ai-buddy"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/ai-buddy')
                  ? 'bg-forest-900/60 text-forest-200 border border-forest-600/50'
                  : 'text-slate-300 hover:text-white hover:bg-forest-950/40'
              }`}
            >
              <Bot className="w-4 h-4 text-forest-400" />
              AI Bike Buddy
            </Link>

            <Link
              to="/compare"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/compare') ? 'text-forest-300' : 'text-slate-300 hover:text-white'
              }`}
            >
              Compare
            </Link>


          </nav>

          {/* Right Action Bar: Location & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Location Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-forest-950/60 border border-[#214339] text-xs font-semibold text-slate-200 hover:border-forest-500/60 transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-forest-400" />
                <span className="max-w-[130px] truncate">{currentLocation.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#12221D] border border-forest-800 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-forest-900/80">
                    <p className="text-[11px] font-bold text-forest-300 uppercase tracking-wider">Search Hub</p>
                    <p className="text-xs text-slate-400">Discover bikes within radius</p>
                  </div>

                  {/* GPS Permission Button */}
                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-forest-800/60 text-forest-100 hover:bg-forest-700/60 text-xs font-medium text-left transition-colors border border-forest-600/40"
                  >
                    <Crosshair className="w-4 h-4 text-forest-300 animate-pulse" />
                    <div>
                      <p className="font-semibold text-white">Use Exact Device GPS</p>
                      <p className="text-[10px] text-forest-200">Request browser location</p>
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
                            ? 'bg-forest-900 text-forest-200 font-semibold'
                            : 'text-slate-300 hover:bg-forest-900/50 hover:text-white'
                        }`}
                      >
                        <span>{hub.name}</span>
                        {currentLocation.name === hub.name && (
                          <span className="text-[10px] text-forest-400 font-bold">Active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard / Account Links */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-forest-950/40 border border-[#1A332B] hover:border-forest-600/40 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/sell"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-forest-600 to-forest-500 hover:from-forest-500 hover:to-forest-400 text-white shadow-elevated hover:shadow-glow transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-forest-200" />
              <span>Sell Your Bike</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-forest-950 border border-forest-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1E19] border-b border-forest-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-forest-900">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-forest-400" />
              <span>{currentLocation.name}</span>
            </div>
            <button
              onClick={onRequestGPS}
              className="text-xs text-forest-300 font-semibold underline flex items-center gap-1"
            >
              <Crosshair className="w-3.5 h-3.5" />
              Use GPS
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/60 text-sm font-semibold text-white flex flex-col items-center justify-center gap-1.5"
            >
              <Compass className="w-5 h-5 text-forest-400" />
              <span>Explore Map</span>
            </Link>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/60 text-sm font-semibold text-white flex flex-col items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-5 h-5 text-forest-400" />
              <span>Sell Your Bike</span>
            </Link>
            <Link
              to="/resale-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-forest-900/60 border border-gold/40 text-sm font-semibold text-gold-light flex flex-col items-center justify-center gap-1.5"
            >
              <Wrench className="w-5 h-5 text-gold" />
              <span>Resale Studio</span>
            </Link>
            <Link
              to="/ai-buddy"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-forest-900/60 border border-forest-700/60 text-sm font-semibold text-white flex flex-col items-center justify-center gap-1.5"
            >
              <Bot className="w-5 h-5 text-forest-400" />
              <span>AI Bike Buddy</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-forest-900 flex flex-col gap-2">
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 py-1.5"
            >
              Compare Vehicles
            </Link>
            <Link
              to="/price-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 py-1.5"
            >
              AI Price Estimator
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 py-1.5"
            >
              My Dashboard
            </Link>
            <Link
              to="/trust"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 py-1.5 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-forest-400" />
              120-Point Inspection & Trust
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
