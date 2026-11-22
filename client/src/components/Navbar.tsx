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
  Crosshair,
  Gauge
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
    <header className="sticky top-0 z-50 bg-deepBlack/90 backdrop-blur-md border-b border-darkSage transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-charcoal border border-darkSage flex items-center justify-center text-sand-warm shadow-sm group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-sand-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" strokeDasharray="4 2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl tracking-wider text-sand-offWhite">
                  GEAR<span className="text-sage-muted">UP</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-charcoal text-sand-warm border border-darkSage uppercase tracking-widest">
                  India
                </span>
              </div>
              <p className="text-[10px] font-mono text-sage-muted tracking-tight">AUTOMOTIVE PLATFORM</p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/explore"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-semibold transition-colors ${
                isActive('/explore')
                  ? 'bg-charcoal text-sand-warm border border-darkSage'
                  : 'text-sand-light/80 hover:text-sand-warm hover:bg-charcoal/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-sage-muted" />
              Explore Bikes
            </Link>

            <Link
              to="/sell"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-heading font-semibold transition-colors ${
                isActive('/sell')
                  ? 'bg-charcoal text-sand-warm border border-darkSage'
                  : 'text-sand-light/80 hover:text-sand-warm hover:bg-charcoal/50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-sage-muted" />
              Sell Your Bike
            </Link>

            <Link
              to="/price-estimator"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold transition-colors ${
                isActive('/price-estimator')
                  ? 'bg-charcoal text-sand-warm border border-darkSage'
                  : 'text-sand-light/80 hover:text-sand-warm hover:bg-charcoal/50'
              }`}
            >
              <span>Valuation</span>
              <span className="text-[9px] bg-darkSage text-sand-warm border border-sage/40 px-1 py-0.2 rounded font-mono font-bold">
                ML
              </span>
            </Link>

            <Link
              to="/bike-doctor"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold transition-colors ${
                isActive('/bike-doctor')
                  ? 'bg-charcoal text-sand-warm border border-darkSage'
                  : 'text-sand-light/80 hover:text-sand-warm hover:bg-charcoal/50'
              }`}
            >
              <span>Bike Doctor</span>
            </Link>

            <Link
              to="/resale-studio"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold transition-colors ${
                isActive('/resale-studio')
                  ? 'bg-charcoal text-sand-warm border border-darkSage'
                  : 'text-sand-light/80 hover:text-sand-warm hover:bg-charcoal/50'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-sand-warm" />
              <span>Resale Studio</span>
            </Link>

            <Link
              to="/ai-buddy"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading font-semibold transition-colors ${
                isActive('/ai-buddy')
                  ? 'bg-charcoal text-sand-warm border border-darkSage'
                  : 'text-sand-light/80 hover:text-sand-warm hover:bg-charcoal/50'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-sage-muted" />
              <span>AI Buddy</span>
            </Link>

            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-lg text-xs font-heading font-medium transition-colors ${
                isActive('/how-it-works') ? 'text-sand-warm' : 'text-sand-light/80 hover:text-sand-warm'
              }`}
            >
              How It Works
            </Link>

            <Link
              to="/trust"
              className={`px-3 py-2 rounded-lg text-xs font-heading font-medium transition-colors ${
                isActive('/trust') ? 'text-sand-warm' : 'text-sand-light/80 hover:text-sand-warm'
              }`}
            >
              Trust
            </Link>
          </nav>

          {/* Right Action Bar: Location & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Location Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-charcoal border border-darkSage text-xs font-semibold text-sand-light hover:border-sage-muted transition-colors shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-sand-warm" />
                <span className="max-w-[120px] truncate">{currentLocation.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-sage-muted" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-charcoal border border-darkSage rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-darkSage">
                    <p className="text-[11px] font-bold text-sand-warm uppercase tracking-wider font-mono">Search Hub</p>
                    <p className="text-xs text-sand-light/70">Discover bikes within radius</p>
                  </div>

                  {/* GPS Permission Button */}
                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-darkSage text-sand-light hover:bg-sage-dark text-xs font-medium text-left transition-colors border border-sage/40"
                  >
                    <Crosshair className="w-4 h-4 text-sand-warm animate-pulse" />
                    <div>
                      <p className="font-semibold text-sand-offWhite">Use Exact Device GPS</p>
                      <p className="text-[10px] text-sage-muted">Request browser coordinates</p>
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
                            ? 'bg-darkSage text-sand-warm font-semibold'
                            : 'text-sand-light hover:bg-darkSage/50 hover:text-white'
                        }`}
                      >
                        <span>{hub.name}</span>
                        {currentLocation.name === hub.name && (
                          <span className="text-[10px] text-sand-warm font-bold font-mono">Active</span>
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sand-light hover:text-white bg-charcoal border border-darkSage hover:border-sage-muted transition-colors"
            >
              <User className="w-3.5 h-3.5 text-sage-muted" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/sell"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold bg-sand-warm hover:bg-sand-light text-deepBlack shadow-sm transition-all"
            >
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-charcoal border border-darkSage text-sand-light hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-charcoal border-b border-darkSage px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-darkSage">
            <div className="flex items-center gap-2 text-xs text-sand-light">
              <MapPin className="w-4 h-4 text-sand-warm" />
              <span>{currentLocation.name}</span>
            </div>
            <button
              onClick={onRequestGPS}
              className="text-xs text-sand-warm font-semibold underline flex items-center gap-1 font-mono"
            >
              <Crosshair className="w-3.5 h-3.5" />
              Use GPS
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-deepBlack border border-darkSage text-xs font-heading font-semibold text-sand-offWhite flex flex-col items-center justify-center gap-1.5"
            >
              <Compass className="w-5 h-5 text-sage-muted" />
              <span>Explore Bikes</span>
            </Link>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-deepBlack border border-darkSage text-xs font-heading font-semibold text-sand-offWhite flex flex-col items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-5 h-5 text-sage-muted" />
              <span>Sell Your Bike</span>
            </Link>
            <Link
              to="/price-estimator"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-deepBlack border border-darkSage text-xs font-heading font-semibold text-sand-warm flex flex-col items-center justify-center gap-1.5"
            >
              <Gauge className="w-5 h-5 text-sand-warm" />
              <span>ML Valuation</span>
            </Link>
            <Link
              to="/bike-doctor"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-deepBlack border border-darkSage text-xs font-heading font-semibold text-sand-offWhite flex flex-col items-center justify-center gap-1.5"
            >
              <Wrench className="w-5 h-5 text-sage-muted" />
              <span>Bike Doctor</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-darkSage flex flex-col gap-2 font-heading text-xs">
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sand-light/80 hover:text-sand-warm py-1.5"
            >
              Compare Vehicles
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sand-light/80 hover:text-sand-warm py-1.5"
            >
              My Dashboard
            </Link>
            <Link
              to="/trust"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sand-light/80 hover:text-sand-warm py-1.5 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-sage-muted" />
              120-Point Inspection & Trust
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
