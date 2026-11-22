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
    <header className={`fixed top-0 inset-x-0 z-40 backdrop-blur-md transition-colors duration-300 ${
      isDark 
        ? 'bg-[#1E201E]/90 border-b border-white/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.6)]' 
        : 'bg-white/95 border-b border-[#E9E3D8] shadow-[0_4px_25px_-5px_rgba(36,38,34,0.08)]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20 w-full">
          
          {/* =========================================================================
              LEFT: Brand Emblem & Regional Location Selector (Fixed / Never Shrinks)
             ========================================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Brand Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#35483C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#242622] transition-colors border border-[#35483C] shrink-0">
                <span className="font-heading font-extrabold text-xs sm:text-sm tracking-wider">GU</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-heading text-lg sm:text-2xl font-extrabold tracking-tight transition-colors leading-none sm:leading-tight ${
                  isDark ? 'text-white group-hover:text-[#A4AD98]' : 'text-[#242622] group-hover:text-[#35483C]'
                }`}>
                  GEAR UP
                </span>
                <span className={`text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-mono hidden xs:block ${
                  isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'
                }`}>
                  Automotive // Telemetry
                </span>
              </div>
            </Link>

            {/* Hub Location Selector Pill */}
            <div className={`relative shrink-0 pl-1 sm:pl-2 border-l ${isDark ? 'border-white/10' : 'border-[#E9E3D8]'}`}>
              <button
                type="button"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[38px] sm:min-h-[40px] text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-colors active:scale-95 shrink-0 border ${
                  isDark
                    ? 'text-white bg-white/10 hover:bg-white/20 border-white/20'
                    : 'text-[#242622] bg-white hover:bg-[#F7F5EF] border-[#E9E3D8]'
                }`}
                title="Select Regional Hub"
              >
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#A4AD98]' : 'text-[#35483C]'}`} />
                <span className={`max-w-[80px] xs:max-w-[100px] sm:max-w-[120px] truncate font-bold ${
                  isDark ? 'text-white' : 'text-[#242622]'
                }`}>
                  {currentLocation.city}
                </span>
                <ChevronDown className={`w-3 h-3 shrink-0 ${isDark ? 'text-white/60' : 'text-[#85857E]'}`} />
              </button>

              {/* Hub Dropdown Menu */}
              {locationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-white border border-[#E9E3D8] p-3 shadow-2xl z-50 animate-fade-in text-xs max-w-[calc(100vw-1.5rem)] text-[#242622]">
                  <div className="px-2 py-1.5 text-[10px] font-mono font-bold text-[#85857E] uppercase tracking-[0.2em] border-b border-[#E9E3D8]">
                    Select Regional Hub
                  </div>

                  <button
                    onClick={() => {
                      onRequestGPS();
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2 py-2.5 mt-2 hover:bg-[#F7F5EF] text-[#35483C] font-mono text-[11px] font-medium transition-colors border-b border-[#E9E3D8]/50 min-h-[44px]"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#35483C] shrink-0" />
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
                        className={`w-full flex items-center justify-between px-2.5 py-2 text-left transition-colors font-mono text-[11px] min-h-[44px] ${
                          currentLocation.name === hub.name
                            ? 'bg-[#35483C] text-white font-bold'
                            : 'text-[#242622] hover:bg-[#E9E3D8]/40'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{hub.name}</p>
                          <p className={`text-[9px] ${currentLocation.name === hub.name ? 'text-white/70' : 'text-[#85857E]'}`}>{hub.city}</p>
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
              CENTER: Navigation Links (Never Wraps, Spaced Evenly)
             ========================================================================= */}
          <nav className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5 2xl:gap-6 flex-1 min-w-0 px-2">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path || (item.path.startsWith('/inspect') && location.pathname.startsWith('/inspect'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative text-[11px] 2xl:text-xs font-mono uppercase tracking-[0.12em] 2xl:tracking-[0.16em] transition-all py-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? isDark ? 'text-white font-bold' : 'text-[#242622] font-bold'
                      : isDark ? 'text-white/70 hover:text-white' : 'text-[#85857E] hover:text-[#242622]'
                  }`}
                >
                  <span className="text-[9px] text-[#A4AD98] mr-1 hidden 2xl:inline">{item.num} /</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] ${isDark ? 'bg-[#A4AD98]' : 'bg-[#35483C]'}`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* =========================================================================
              RIGHT: Primary Action Buttons (Fixed / Never Shrinks)
             ========================================================================= */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* List Machine Button */}
            <Link
              to="/sell"
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 min-h-[40px] sm:min-h-[42px] text-xs font-mono uppercase tracking-[0.12em] font-bold bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] shadow-sm flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0 group"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300 shrink-0" />
              <span className="hidden sm:inline">List Machine</span>
              <span className="sm:hidden">Sell</span>
            </Link>

            {/* Dashboard / Account Button */}
            <Link
              to="/dashboard"
              className={`w-10 h-10 sm:w-10 sm:h-10 flex items-center justify-center transition-colors active:scale-95 shrink-0 shadow-sm border ${
                isDark
                  ? 'text-white bg-white/10 hover:bg-white/20 border-white/20'
                  : 'text-[#242622] hover:bg-[#F7F5EF] bg-white border-[#E9E3D8]'
              }`}
              title="Dashboard"
              aria-label="User Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile / Tablet Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-10 h-10 flex items-center justify-center transition-colors active:scale-95 shrink-0 shadow-sm border ${
                isDark
                  ? 'text-white border-white/20 hover:bg-white/20 bg-white/10'
                  : 'text-[#242622] border-[#E9E3D8] hover:bg-[#F7F5EF] bg-white'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer with Glassmorphism */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t py-4 space-y-1.5 animate-fade-in shadow-xl -mx-4 px-4 sm:-mx-6 sm:px-6 ${
            isDark ? 'border-white/10 bg-[#1E201E]/95 backdrop-blur-xl text-white' : 'border-[#E9E3D8] bg-white/95 backdrop-blur-xl text-[#242622]'
          }`}>
            <div className={`px-1 pb-2 border-b flex items-center justify-between ${
              isDark ? 'border-white/10' : 'border-[#E9E3D8]'
            }`}>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#85857E]">
                GEAR UP Destinations
              </span>
              <span className="text-[10px] font-mono text-[#A4AD98] font-semibold">Active Fleet</span>
            </div>

            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-3 text-xs font-mono uppercase tracking-wider border border-transparent transition-all min-h-[44px] ${
                  isDark
                    ? 'text-white hover:bg-white/10 hover:border-white/10 active:bg-white/20'
                    : 'text-[#242622] hover:bg-[#F7F5EF] hover:border-[#E9E3D8] active:bg-[#E9E3D8]/40'
                }`}
              >
                <span>{item.num} // {item.label}</span>
                <span className={isDark ? 'text-[#A4AD98]' : 'text-[#85857E]'}>→</span>
              </Link>
            ))}

            <div className={`pt-2 border-t flex gap-2 ${isDark ? 'border-white/10' : 'border-[#E9E3D8]'}`}>
              <Link
                to="/ai-buddy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 bg-[#35483C] text-white text-xs font-mono uppercase text-center font-bold border border-[#35483C] min-h-[44px] flex items-center justify-center"
              >
                Open AI Buddy
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 py-2.5 px-3 text-xs font-mono uppercase text-center font-bold border min-h-[44px] flex items-center justify-center ${
                  isDark
                    ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    : 'bg-white text-[#242622] border-[#E9E3D8] hover:bg-[#F7F5EF]'
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
