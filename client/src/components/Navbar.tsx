import React, { useState, useEffect } from 'react';
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

  // On the homepage, adapt navbar styling to dark cinematic hero while scrolled over it
  const [isDark, setIsDark] = useState(() => location.pathname === '/');

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsDark(false);
      return;
    }

    const handleScroll = () => {
      // Exploded hero section is 280vh, so until 2.2 viewport heights it sits over dark canvas
      const isOverHero = window.scrollY < window.innerHeight * 2.2;
      setIsDark(isOverHero);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      isDark 
        ? 'bg-[#161816]/75 backdrop-blur-[24px] saturate-[180%] border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.36)] text-white' 
        : 'bg-[#FAF9F5]/80 backdrop-blur-[24px] saturate-[180%] border-b border-[#242622]/[0.06] shadow-[0_4px_24px_rgba(36,38,34,0.06)] text-[#242622]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-4 h-16 sm:h-20 w-full">
          
          {/* =========================================================================
              LEFT: Brand Emblem & Regional Location Selector (Fixed / Never Shrinks)
             ========================================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#35483C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#28372e] transition-all duration-300 border border-white/10 shrink-0 group-hover:scale-105 active:scale-95">
                <span className="font-heading font-extrabold text-xs sm:text-sm tracking-wider">GU</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-heading text-lg sm:text-2xl font-extrabold tracking-tight transition-colors duration-300 leading-none sm:leading-tight ${
                  isDark ? 'text-white group-hover:text-[#A4AD98]' : 'text-[#242622] group-hover:text-[#35483C]'
                }`}>
                  GEAR UP
                </span>
                <span className={`text-[8px] sm:text-[9px] uppercase tracking-[0.22em] font-mono hidden xs:block mt-0.5 ${
                  isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'
                }`}>
                  Automotive // Telemetry
                </span>
              </div>
            </Link>

            {/* Hub Location Selector Pill */}
            <div className={`relative shrink-0 pl-2 sm:pl-3 border-l ${isDark ? 'border-white/10' : 'border-[#242622]/10'}`}>
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 min-h-[36px] sm:min-h-[38px] rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-300 active:scale-95 shrink-0 border ${
                  isDark
                    ? 'text-white bg-white/5 hover:bg-white/10 border-white/15 shadow-sm'
                    : 'text-[#242622] bg-black/[0.03] hover:bg-black/[0.06] border-[#242622]/10 shadow-sm'
                }`}
                title="Select Regional Hub"
              >
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#A4AD98]' : 'text-[#35483C]'}`} />
                <span className={`max-w-[80px] xs:max-w-[100px] sm:max-w-[120px] truncate font-semibold ${
                  isDark ? 'text-white' : 'text-[#242622]'
                }`}>
                  {currentLocation.city}
                </span>
                <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-300 ${locationDropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-white/60' : 'text-[#85857E]'}`} />
              </button>

              {/* Hub Dropdown Menu (Apple iOS Glass Card) */}
              {locationDropdownOpen && (
                <div className={`absolute left-0 mt-3 w-72 sm:w-80 rounded-2xl p-3 shadow-2xl z-50 animate-fade-in-up text-xs max-w-[calc(100vw-1.5rem)] border ${
                  isDark 
                    ? 'bg-[#1B1D1B]/95 backdrop-blur-[28px] border-white/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.6)]' 
                    : 'bg-white/95 backdrop-blur-[28px] border-[#242622]/10 text-[#242622] shadow-[0_16px_40px_rgba(36,38,34,0.12)]'
                }`}>
                  <div className={`px-2 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] border-b ${
                    isDark ? 'text-[#A4AD98] border-white/10' : 'text-[#85857E] border-[#242622]/10'
                  }`}>
                    Select Regional Hub
                  </div>

                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 border-b min-h-[42px] active:scale-[0.98] ${
                      isDark 
                        ? 'text-[#A4AD98] hover:bg-white/5 border-white/10' 
                        : 'text-[#35483C] hover:bg-[#F7F5EF] border-[#242622]/10'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#35483C] shrink-0" />
                    <span>Device GPS Telemetry</span>
                  </button>

                  <div className="max-h-56 overflow-y-auto space-y-1 pt-2 pr-1">
                    {POPULAR_INDIAN_HUBS.map((hub) => (
                      <button
                        key={hub.name}
                        onClick={() => {
                          onLocationChange(hub);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 font-mono text-[11px] min-h-[42px] active:scale-[0.98] ${
                          currentLocation.name === hub.name
                            ? 'bg-[#35483C] text-white font-bold shadow-sm'
                            : isDark ? 'text-white/80 hover:bg-white/5' : 'text-[#242622] hover:bg-[#242622]/[0.04]'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{hub.name}</p>
                          <p className={`text-[9px] ${currentLocation.name === hub.name ? 'text-white/70' : isDark ? 'text-white/50' : 'text-[#85857E]'}`}>{hub.city}</p>
                        </div>
                        {currentLocation.name === hub.name && (
                          <Check className="w-3.5 h-3.5 text-white shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              CENTER: Navigation Links (Never Wraps, Apple Glass Highlight Pills)
             ========================================================================= */}
          <nav className="hidden lg:flex items-center justify-center gap-1.5 xl:gap-2 flex-1 min-w-0 px-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path.startsWith('/inspect') && location.pathname.startsWith('/inspect'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative text-[11px] xl:text-xs font-mono uppercase tracking-[0.14em] transition-all duration-300 px-3.5 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark 
                        ? 'text-white font-bold bg-white/10 shadow-sm' 
                        : 'text-[#242622] font-bold bg-[#35483C]/10 shadow-sm'
                      : isDark 
                        ? 'text-white/70 hover:text-white hover:bg-white/5' 
                        : 'text-[#85857E] hover:text-[#242622] hover:bg-black/[0.03]'
                  }`}
                >
                  <span className={`text-[9px] mr-1 hidden 2xl:inline ${isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'}`}>{item.num} /</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* =========================================================================
              RIGHT: Primary Action Buttons (Apple Fluid Geometry)
             ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* List Machine Button */}
            <Link
              to="/sell"
              className="px-4 sm:px-5 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[40px] rounded-full text-xs font-mono uppercase tracking-[0.12em] font-semibold bg-[#35483C] hover:bg-[#28372e] text-white shadow-[0_2px_12px_rgba(53,72,60,0.3)] hover:shadow-[0_4px_16px_rgba(53,72,60,0.45)] flex items-center gap-1.5 sm:gap-2 transition-all duration-300 active:scale-95 shrink-0 group border border-[#35483C]"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
              <span className="hidden sm:inline">List Machine</span>
              <span className="sm:hidden">Sell</span>
            </Link>

            {/* Dashboard / Account Button */}
            <Link
              to="/dashboard"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shrink-0 shadow-sm border ${
                isDark
                  ? 'text-white bg-white/5 hover:bg-white/10 border-white/15'
                  : 'text-[#242622] hover:bg-[#242622]/[0.04] bg-white border-[#242622]/10'
              }`}
              title="Dashboard"
              aria-label="User Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shrink-0 shadow-sm border ${
                isDark
                  ? 'text-white border-white/15 hover:bg-white/10 bg-white/5'
                  : 'text-[#242622] border-[#242622]/10 hover:bg-[#242622]/[0.04] bg-white'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer with iOS Glassmorphism */}
        {mobileMenuOpen && (
          <div className={`lg:hidden rounded-2xl p-4 space-y-1.5 animate-fade-in-up shadow-2xl mt-2 mb-3 border ${
            isDark 
              ? 'border-white/15 bg-[#1B1D1B]/95 backdrop-blur-[28px] text-white shadow-[0_16px_40px_rgba(0,0,0,0.6)]' 
              : 'border-[#242622]/10 bg-white/95 backdrop-blur-[28px] text-[#242622] shadow-[0_16px_40px_rgba(36,38,34,0.12)]'
          }`}>
            <div className={`px-2 pb-2.5 border-b flex items-center justify-between ${
              isDark ? 'border-white/10' : 'border-[#242622]/10'
            }`}>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#85857E]">
                GEAR UP Destinations
              </span>
              <span className="text-[10px] font-mono text-[#A4AD98] font-semibold">Active Fleet</span>
            </div>

            <div className="space-y-0.5 pt-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 min-h-[42px] ${
                    isDark
                      ? 'text-white hover:bg-white/10 active:bg-white/15'
                      : 'text-[#242622] hover:bg-black/[0.04] active:bg-black/[0.08]'
                  }`}
                >
                  <span>{item.num} // {item.label}</span>
                  <span className={isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'}>→</span>
                </Link>
              ))}
            </div>

            <div className={`pt-2.5 border-t flex gap-2.5 ${isDark ? 'border-white/10' : 'border-[#242622]/10'}`}>
              <Link
                to="/ai-buddy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#35483C] text-white text-xs font-mono uppercase text-center font-bold border border-[#35483C] min-h-[42px] flex items-center justify-center active:scale-95 transition-transform"
              >
                Open AI Buddy
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono uppercase text-center font-bold border min-h-[42px] flex items-center justify-center active:scale-95 transition-transform ${
                  isDark
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                    : 'bg-white text-[#242622] border-[#242622]/15 hover:bg-[#F7F5EF]'
                }`}
              >
                My Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
