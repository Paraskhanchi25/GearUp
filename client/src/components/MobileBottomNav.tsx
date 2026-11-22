import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Plus,
  Bot,
  Layers,
  MoreHorizontal,
  X,
  Gauge,
  Wrench,
  Sparkles,
  Columns3,
  ShieldCheck,
  User,
  Heart,
  ChevronRight
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const moreLinks = [
    { label: 'CatBoost Valuation', path: '/price-estimator', icon: Gauge, desc: 'ML fair market appraisal' },
    { label: '3D Digital Twin', path: '/inspect/bike-001', icon: Layers, desc: '360° vehicle component viewer' },
    { label: 'Resale Upgrade Studio', path: '/resale-studio', icon: Sparkles, desc: 'Resale value enhancement' },
    { label: 'Side-by-Side Compare', path: '/compare', icon: Columns3, desc: 'Detailed specs comparison' },
    { label: 'Inspection Standards', path: '/trust', icon: ShieldCheck, desc: '120-point verification checklist' },
    { label: 'Buyer & Seller Dashboard', path: '/dashboard', icon: User, desc: 'Manage your listings & rides' },
  ];

  return (
    <>
      {/* Floating Glassmorphism Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-auto sm:w-[440px] sm:left-1/2 sm:-translate-x-1/2 z-40 lg:hidden pointer-events-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="bg-[#FAF9F5]/85 backdrop-blur-[24px] saturate-[180%] border border-white/60 shadow-[0_16px_40px_rgba(36,38,34,0.16)] rounded-full px-2.5 py-1.5 flex items-center justify-around transition-all">
          {/* 1. Explore Fleet */}
          <Link
            to="/explore"
            onClick={() => setMoreOpen(false)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-full transition-all duration-300 ${
              isCurrent('/explore')
                ? 'text-[#35483C] font-bold bg-[#35483C]/10 shadow-sm'
                : 'text-[#85857E] hover:text-[#242622] active:scale-95'
            }`}
          >
            <Compass className={`w-5 h-5 mb-0.5 transition-transform duration-300 ${isCurrent('/explore') ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-mono tracking-tight leading-none">Explore</span>
            {isCurrent('/explore') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#35483C] mt-0.5" />
            )}
          </Link>

          {/* 2. Valuation / 3D */}
          <Link
            to="/price-estimator"
            onClick={() => setMoreOpen(false)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-full transition-all duration-300 ${
              isCurrent('/price-estimator')
                ? 'text-[#35483C] font-bold bg-[#35483C]/10 shadow-sm'
                : 'text-[#85857E] hover:text-[#242622] active:scale-95'
            }`}
          >
            <Gauge className={`w-5 h-5 mb-0.5 transition-transform duration-300 ${isCurrent('/price-estimator') ? 'scale-110 stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-mono tracking-tight leading-none">Value</span>
            {isCurrent('/price-estimator') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#35483C] mt-0.5" />
            )}
          </Link>

          {/* 3. Sell Machine (Prominent Center Action) */}
          <Link
            to="/sell"
            onClick={() => setMoreOpen(false)}
            className="flex flex-col items-center justify-center min-w-[58px] min-h-[48px] -my-1 group"
          >
            <div className="w-11 h-11 rounded-full bg-[#35483C] group-hover:bg-[#28372e] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(53,72,60,0.4)] border-2 border-white transition-all duration-300 active:scale-90 group-hover:scale-105">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-tight text-[#35483C] mt-0.5">Sell</span>
          </Link>

          {/* 4. AI Buddy */}
          <Link
            to="/ai-buddy"
            onClick={() => setMoreOpen(false)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-full transition-all duration-300 relative ${
              isCurrent('/ai-buddy')
                ? 'text-[#35483C] font-bold bg-[#35483C]/10 shadow-sm'
                : 'text-[#85857E] hover:text-[#242622] active:scale-95'
            }`}
          >
            <div className="relative">
              <Bot className={`w-5 h-5 mb-0.5 transition-transform duration-300 ${isCurrent('/ai-buddy') ? 'scale-110 stroke-[2.5]' : ''}`} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white animate-pulse" />
            </div>
            <span className="text-[10px] font-mono tracking-tight leading-none">AI Buddy</span>
            {isCurrent('/ai-buddy') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#35483C] mt-0.5" />
            )}
          </Link>

          {/* 5. More Menu Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-1.5 rounded-full transition-all duration-300 ${
              moreOpen
                ? 'text-[#35483C] font-bold bg-[#35483C]/10 shadow-sm'
                : 'text-[#85857E] hover:text-[#242622] active:scale-95'
            }`}
          >
            {moreOpen ? (
              <X className="w-5 h-5 mb-0.5 text-[#35483C]" />
            ) : (
              <MoreHorizontal className="w-5 h-5 mb-0.5" />
            )}
            <span className="text-[10px] font-mono tracking-tight leading-none">More</span>
          </button>
        </div>
      </nav>

      {/* Accessible Glassmorphism "More" Drawer / Bottom Sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Sheet Surface */}
          <div
            className="relative bg-white/95 backdrop-blur-[28px] border-t border-x border-[#242622]/10 rounded-t-[32px] p-5 shadow-[0_24px_50px_rgba(0,0,0,0.3)] space-y-4 max-h-[80vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-[#85857E]/30 rounded-full mx-auto -mt-1" />

            <div className="flex items-center justify-between border-b border-[#242622]/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#85857E] block">
                  GEAR UP Navigation
                </span>
                <h4 className="font-heading font-bold text-lg text-[#242622]">All Features & Telemetry</h4>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-[#85857E] hover:text-[#242622] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links List */}
            <div className="space-y-1.5">
              {moreLinks.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 min-h-[50px] ${
                      active
                        ? 'bg-[#35483C]/10 border-[#35483C]/30 text-[#242622]'
                        : 'bg-white border-[#242622]/10 text-[#242622] hover:bg-[#F7F5EF] active:bg-black/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F7F5EF] border border-[#242622]/10 flex items-center justify-center text-[#35483C] shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold">{item.label}</p>
                        <p className="text-[10px] text-[#85857E]">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#85857E] shrink-0" />
                  </Link>
                );
              })}
            </div>

            {/* Quick Home / Support Links */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#242622]/10">
              <Link
                to="/"
                onClick={() => setMoreOpen(false)}
                className="p-2.5 rounded-xl bg-white border border-[#E9E3D8] text-center text-xs font-mono font-semibold text-[#242622] hover:bg-[#F7F5EF]"
              >
                Home Fleet
              </Link>
              <Link
                to="/admin"
                onClick={() => setMoreOpen(false)}
                className="p-2.5 rounded-xl bg-white border border-[#E9E3D8] text-center text-xs font-mono font-semibold text-[#85857E] hover:text-[#242622]"
              >
                Inspector Desk
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
