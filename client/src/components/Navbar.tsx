import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  ChevronDown, 
  Plus, 
  Navigation, 
  Check, 
  User, 
  Layers,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { num: '01', label: 'Explore', path: '/explore' },
    { num: '02', label: 'Valuation', path: '/price-estimator' },
    { num: '03', label: '3D Twin', path: '/inspect/bike-001' },
    { num: '04', label: 'Resale Studio', path: '/resale-studio' },
    { num: '05', label: 'Bike Doctor', path: '/bike-doctor' },
    { num: '06', label: 'Compare', path: '/compare' },
    { num: '07', label: 'Standards', path: '/trust' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#E9E3D8] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Emblem & Location Selector */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-none bg-[#35483C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#242622] transition-colors border border-[#35483C]">
                <span className="font-heading font-extrabold text-sm tracking-wider">GU</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-[#242622] group-hover:text-[#35483C] transition-colors">
                  GEAR UP
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#85857E] font-mono -mt-1">
                  Automotive // Telemetry
                </span>
              </div>
            </Link>

            {/* Hub Selector Dropdown */}
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-mono uppercase tracking-wider text-[#242622] bg-[#FFFFFF] hover:bg-[#E9E3D8]/50 border border-[#E9E3D8] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#35483C]" />
                <span className="max-w-[120px] truncate">{currentLocation.city}</span>
                <ChevronDown className="w-3 h-3 text-[#85857E]" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-[#E9E3D8] p-3 shadow-2xl z-50 animate-fade-in text-xs">
                  <div className="px-2 py-1.5 text-[10px] font-mono font-bold text-[#85857E] uppercase tracking-[0.2em] border-b border-[#E9E3D8]">
                    Select Regional Hub
                  </div>

                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2 py-2 mt-2 hover:bg-[#F7F5EF] text-[#35483C] font-mono text-[11px] font-medium transition-colors border-b border-[#E9E3D8]/40"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#35483C]" />
                    <span>Device GPS Telemetry</span>
                  </button>

                  <div className="max-h-56 overflow-y-auto space-y-0.5 pt-2">
                    {POPULAR_INDIAN_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        onClick={() => {
                          onLocationChange(hub);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-colors font-mono text-[11px] ${
                          currentLocation.name === hub.name
                            ? 'bg-[#35483C] text-white'
                            : 'text-[#242622] hover:bg-[#E9E3D8]/40'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{hub.name}</p>
                          <p className={`text-[9px] ${currentLocation.name === hub.name ? 'text-white/70' : 'text-[#85857E]'}`}>{hub.city}</p>
                        </div>
                        {currentLocation.name === hub.name && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links (AC Motorsport Inspired Minimal Header) */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path.startsWith('/inspect') && location.pathname.startsWith('/inspect'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative text-[11px] font-mono uppercase tracking-[0.18em] transition-all py-1 ${
                    isActive
                      ? 'text-[#242622] font-bold'
                      : 'text-[#85857E] hover:text-[#242622]'
                  }`}
                >
                  <span className="text-[9px] text-[#A4AD98] mr-1">{item.num} /</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#35483C]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/sell"
              className="px-5 py-2.5 rounded-none text-xs font-mono uppercase tracking-[0.15em] font-bold bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] shadow-sm flex items-center gap-2 transition-all group"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
              <span>List Machine</span>
            </Link>

            <Link
              to="/dashboard"
              className="p-2.5 rounded-none text-[#242622] hover:bg-white bg-[#F7F5EF] border border-[#E9E3D8] transition-colors"
              title="Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-none text-[#242622] border border-[#E9E3D8] hover:bg-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-[#E9E3D8] py-4 space-y-2 bg-[#F7F5EF] animate-fade-in">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-[#242622] hover:bg-white border border-transparent hover:border-[#E9E3D8]"
              >
                <span>{item.num} // {item.label}</span>
                <span className="text-[#85857E]">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
