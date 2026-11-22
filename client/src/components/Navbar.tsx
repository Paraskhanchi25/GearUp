import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  ChevronDown, 
  SlidersHorizontal, 
  Bot, 
  TrendingUp, 
  Plus, 
  ShieldCheck, 
  Navigation, 
  Check, 
  User, 
  Scale, 
  Sparkles,
  Gauge
} from 'lucide-react';
import { SearchCenter } from '../types';
import { POPULAR_INDIAN_HUBS } from '../utils/geo';

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
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Valuation', path: '/price-estimator' },
    { label: 'Resale Studio', path: '/resale-studio' },
    { label: 'Bike Doctor', path: '/bike-doctor' },
    { label: 'Compare', path: '/compare' },
    { label: 'Trust & Safety', path: '/trust' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EF]/90 backdrop-blur-md border-b border-[#E5E1D7] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#879783] flex items-center justify-center text-white shadow-sm group-hover:bg-[#596B59] transition-colors">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-tight text-[#242923]">
                  GEAR UP
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#77796F] font-medium -mt-1">
                  Automotive Heritage
                </span>
              </div>
            </Link>

            {/* Hub Selector Dropdown */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#242923] bg-[#F1EEE5] hover:bg-[#E5D9C7] border border-[#E5E1D7] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#596B59]" />
                <span className="max-w-[120px] truncate">{currentLocation.city}</span>
                <ChevronDown className="w-3 h-3 text-[#77796F]" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-[#E5E1D7] p-2 shadow-elevated z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 text-[11px] font-semibold text-[#77796F] uppercase tracking-wider border-b border-[#E5E1D7]">
                    Select Marketplace Hub
                  </div>

                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#F7F5EF] text-[#596B59] font-medium transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#879783]" />
                    <span>Use Live Device GPS</span>
                  </button>

                  <div className="max-h-56 overflow-y-auto space-y-0.5 pt-1">
                    {POPULAR_INDIAN_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        onClick={() => {
                          onLocationChange(hub);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                          currentLocation.name === hub.name
                            ? 'bg-[#F1EEE5] text-[#242923] font-semibold'
                            : 'text-[#77796F] hover:bg-[#F7F5EF] hover:text-[#242923]'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-[#242923]">{hub.name}</p>
                          <p className="text-[10px] text-[#77796F]">{hub.city}</p>
                        </div>
                        {currentLocation.name === hub.name && (
                          <Check className="w-3.5 h-3.5 text-[#596B59]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'text-[#242923] font-semibold border-b-2 border-[#879783] pb-1'
                      : 'text-[#77796F] hover:text-[#242923] font-medium'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/sell"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#879783] hover:bg-[#596B59] text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Bike</span>
            </Link>

            <Link
              to="/dashboard"
              className="p-2 rounded-full text-[#77796F] hover:text-[#242923] bg-[#F1EEE5] hover:bg-[#E5D9C7] border border-[#E5E1D7] transition-colors"
              title="Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
