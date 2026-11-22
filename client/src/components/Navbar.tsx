import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  ChevronDown, 
  Plus, 
  Navigation, 
  Check, 
  User, 
  Menu,
  X,
  MoreHorizontal
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const locationRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  // Close menus on route change
  useEffect(() => {
    setLocationDropdownOpen(false);
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside listeners to close dropdowns
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (locationRef.current && !locationRef.current.contains(target)) {
        setLocationDropdownOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(target)) {
        setMoreDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLocationDropdownOpen(false);
        setMoreDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navLinks = [
    { num: '01', label: 'Explore', path: '/explore' },
    { num: '02', label: 'Valuation', path: '/price-estimator' },
    { num: '03', label: '3D Twin', path: '/inspect/bike-001' },
    { num: '04', label: 'Resale Studio', path: '/resale-studio' },
    { num: '05', label: 'Compare', path: '/compare' },
    { num: '06', label: 'Standards', path: '/trust' },
  ];

  // Primary links for medium/laptop screens (1024px to 1279px)
  const primaryLinks = navLinks.slice(0, 4);
  const secondaryLinks = navLinks.slice(4);

  const isMoreActive = secondaryLinks.some(
    item => location.pathname === item.path || (item.path.startsWith('/inspect') && location.pathname.startsWith('/inspect'))
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      isDark 
        ? 'bg-[#161816]/80 backdrop-blur-[24px] saturate-[180%] border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-white' 
        : 'bg-[#FAF9F5]/85 backdrop-blur-[24px] saturate-[180%] border-b border-[#242622]/[0.08] shadow-[0_4px_24px_rgba(36,38,34,0.06)] text-[#242622]'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-20 w-full min-w-0">
          
          {/* =========================================================================
              LEFT: Brand Emblem & Regional Location Selector (Never shrinks, flex-shrink-0)
             ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Brand Logo & Name */}
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#35483C] rounded-lg"
              aria-label="Gear Up Homepage"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#35483C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#28372e] transition-all duration-300 border border-white/10 shrink-0 group-hover:scale-105 active:scale-95">
                <span className="font-heading font-extrabold text-xs sm:text-sm tracking-wider">GU</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-heading text-base sm:text-xl xl:text-2xl font-extrabold tracking-tight transition-colors duration-300 leading-none whitespace-nowrap ${
                  isDark ? 'text-white group-hover:text-[#A4AD98]' : 'text-[#242622] group-hover:text-[#35483C]'
                }`}>
                  GEAR UP
                </span>
                <span className={`text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-mono hidden md:block mt-0.5 whitespace-nowrap ${
                  isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'
                }`}>
                  Automotive // Telemetry
                </span>
              </div>
            </Link>

            {/* Regional Hub Selector Pill */}
            <div 
              ref={locationRef} 
              className={`relative shrink-0 pl-1.5 sm:pl-3 border-l ${isDark ? 'border-white/10' : 'border-[#242622]/10'}`}
            >
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                aria-expanded={locationDropdownOpen}
                aria-haspopup="dialog"
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[34px] sm:min-h-[38px] rounded-full text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-all duration-300 active:scale-95 shrink-0 border ${
                  isDark
                    ? 'text-white bg-white/5 hover:bg-white/10 border-white/15 shadow-sm'
                    : 'text-[#242622] bg-black/[0.03] hover:bg-black/[0.06] border-[#242622]/10 shadow-sm'
                }`}
                title="Select Regional Hub"
              >
                <MapPin className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isDark ? 'text-[#A4AD98]' : 'text-[#35483C]'}`} />
                <span className="max-w-[65px] xs:max-w-[85px] sm:max-w-[110px] xl:max-w-[130px] truncate font-semibold">
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
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 font-mono text-[11px] min-h-[40px] active:scale-[0.98] ${
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
              CENTER: Navigation Links
              - Large Desktop (xl: 1280px+): Shows all 6 numbered links
              - Medium / Laptop (lg: 1024px-1279px): Shows 4 core links + "More ▾" dropdown
              - Tablet / Mobile (< 1024px): Hidden, accessed via clean mobile drawer
             ========================================================================= */}
          
          {/* 1. Large Desktop (xl: 1280px+) */}
          <nav className="hidden xl:flex items-center justify-center gap-1.5 2xl:gap-2 min-w-0 px-2 shrink-0">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path.startsWith('/inspect') && location.pathname.startsWith('/inspect'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative text-[11px] 2xl:text-xs font-mono uppercase tracking-[0.12em] transition-all duration-300 px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark 
                        ? 'text-white font-bold bg-white/10 shadow-sm' 
                        : 'text-[#242622] font-bold bg-[#35483C]/10 shadow-sm'
                      : isDark 
                        ? 'text-white/70 hover:text-white hover:bg-white/5' 
                        : 'text-[#85857E] hover:text-[#242622] hover:bg-black/[0.04]'
                  }`}
                >
                  <span className={`text-[9px] mr-1 hidden 2xl:inline ${isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'}`}>
                    {item.num} /
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 2. Medium Screens (lg: 1024px to 1279px) - Overflow safe layout */}
          <nav className="hidden lg:flex xl:hidden items-center justify-center gap-1 min-w-0 px-1 shrink-0">
            {primaryLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path.startsWith('/inspect') && location.pathname.startsWith('/inspect'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-[11px] font-mono uppercase tracking-[0.1em] transition-all duration-200 px-2.5 py-1.5 rounded-full whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark 
                        ? 'text-white font-bold bg-white/10 shadow-sm' 
                        : 'text-[#242622] font-bold bg-[#35483C]/10 shadow-sm'
                      : isDark 
                        ? 'text-white/70 hover:text-white hover:bg-white/5' 
                        : 'text-[#85857E] hover:text-[#242622] hover:bg-black/[0.04]'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* "More" Overflow Trigger */}
            <div ref={moreRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                aria-expanded={moreDropdownOpen}
                className={`flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                  isMoreActive
                    ? isDark ? 'text-white font-bold bg-white/10' : 'text-[#242622] font-bold bg-[#35483C]/10'
                    : isDark ? 'text-white/70 hover:text-white hover:bg-white/5' : 'text-[#85857E] hover:text-[#242622] hover:bg-black/[0.04]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Overflow Menu */}
              {moreDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in-up text-xs border ${
                  isDark 
                    ? 'bg-[#1B1D1B]/95 backdrop-blur-[28px] border-white/15 text-white shadow-[0_16px_40px_rgba(0,0,0,0.6)]' 
                    : 'bg-white/95 backdrop-blur-[28px] border-[#242622]/10 text-[#242622] shadow-[0_16px_40px_rgba(36,38,34,0.12)]'
                }`}>
                  {secondaryLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 min-h-[38px] ${
                          isActive
                            ? 'bg-[#35483C] text-white font-bold'
                            : isDark ? 'text-white/80 hover:bg-white/10' : 'text-[#242622] hover:bg-[#242622]/[0.05]'
                        }`}
                      >
                        <span>{item.num} / {item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* =========================================================================
              RIGHT: Action Buttons (Guaranteed Non-Colliding & Touch Optimized)
             ========================================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* List Machine / Sell Button */}
            <Link
              to="/sell"
              className="px-3 sm:px-4 xl:px-5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-[0.12em] font-semibold bg-[#35483C] hover:bg-[#28372e] text-white shadow-[0_2px_12px_rgba(53,72,60,0.3)] hover:shadow-[0_4px_16px_rgba(53,72,60,0.45)] flex items-center gap-1.5 transition-all duration-300 active:scale-95 shrink-0 group border border-[#35483C]"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">List Machine</span>
              <span className="sm:hidden whitespace-nowrap">Sell</span>
            </Link>

            {/* Dashboard / Account Button */}
            <Link
              to="/dashboard"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shrink-0 shadow-sm border ${
                isDark
                  ? 'text-white bg-white/5 hover:bg-white/10 border-white/15'
                  : 'text-[#242622] hover:bg-[#242622]/[0.04] bg-white border-[#242622]/10'
              }`}
              title="User Dashboard"
              aria-label="User Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile / Tablet Menu Trigger (Only visible on < lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shrink-0 shadow-sm border ${
                isDark
                  ? 'text-white border-white/15 hover:bg-white/10 bg-white/5'
                  : 'text-[#242622] border-[#242622]/10 hover:bg-[#242622]/[0.04] bg-white'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile & Tablet Full Navigation Drawer with iOS Liquid Glassmorphism */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className={`lg:hidden rounded-2xl p-4 space-y-2 animate-fade-in-up shadow-2xl mt-2 mb-3 border ${
              isDark 
                ? 'border-white/15 bg-[#1B1D1B]/95 backdrop-blur-[28px] text-white shadow-[0_16px_40px_rgba(0,0,0,0.6)]' 
                : 'border-[#242622]/10 bg-white/95 backdrop-blur-[28px] text-[#242622] shadow-[0_16px_40px_rgba(36,38,34,0.12)]'
            }`}
          >
            <div className={`px-2 pb-2.5 border-b flex items-center justify-between ${
              isDark ? 'border-white/10' : 'border-[#242622]/10'
            }`}>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#85857E]">
                Navigation Index
              </span>
              <span className="text-[10px] font-mono text-[#A4AD98] font-semibold">
                Hub: {currentLocation.city}
              </span>
            </div>

            <div className="space-y-1 pt-1">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 min-h-[44px] active:scale-[0.98] ${
                      isActive
                        ? 'bg-[#35483C] text-white font-bold'
                        : isDark
                          ? 'text-white hover:bg-white/10'
                          : 'text-[#242622] hover:bg-black/[0.04]'
                    }`}
                  >
                    <span>{item.num} // {item.label}</span>
                    <span className={isActive ? 'text-white' : isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'}>→</span>
                  </Link>
                );
              })}
            </div>

            <div className={`pt-3 border-t grid grid-cols-2 gap-2 ${isDark ? 'border-white/10' : 'border-[#242622]/10'}`}>
              <Link
                to="/ai-buddy"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-[#35483C] text-white text-xs font-mono uppercase text-center font-bold border border-[#35483C] min-h-[44px] flex items-center justify-center active:scale-95 transition-transform shadow-sm"
              >
                AI Buddy
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-mono uppercase text-center font-bold border min-h-[44px] flex items-center justify-center active:scale-95 transition-transform ${
                  isDark
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                    : 'bg-white text-[#242622] border-[#242622]/15 hover:bg-[#F7F5EF]'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
