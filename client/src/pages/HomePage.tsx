import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Gauge, 
  Calendar, 
  Layers, 
  Check, 
  Sparkles,
  Zap,
  Activity,
  Sliders,
  Maximize2
} from 'lucide-react';
import { VehicleListing, SearchCenter } from '../types';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { VehicleCard } from '../components/VehicleCard';
import { ExplodedMotorcycleHero } from '../components/ExplodedMotorcycleHero';
import { initScrollSections } from '../utils/motion';
import { gsap } from 'gsap';

interface HomePageProps {
  currentLocation: SearchCenter;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenAudio: (vehicle: VehicleListing) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentLocation,
  savedIds,
  onToggleSave,
  onOpenAudio
}) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const pageRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger initialization for fleet, valuation and content sections
  useEffect(() => {
    const cleanupScroll = initScrollSections(pageRef.current);

    return () => {
      cleanupScroll?.();
    };
  }, []);

  const filteredInventory = SEED_LISTINGS.filter(
    (b) => selectedCategory === 'all' || b.category.toLowerCase() === selectedCategory.toLowerCase()
  ).slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div ref={pageRef} className="relative w-full bg-[#F7F5EF] text-[#242622] selection:bg-[#35483C] selection:text-white">
      
      {/* =========================================================================
          SECTION 1: FULL-SCREEN SCROLL-CONTROLLED 3D EXPLODED MOTORCYCLE (100VW x 100VH)
         ========================================================================= */}
      <ExplodedMotorcycleHero />

      {/* =========================================================================
          SECTION 1.5: FLEET EXPLORATION HUD & VALUATION TELEMETRY
         ========================================================================= */}
      <section className="bg-[#242622] border-b border-[#E9E3D8] py-8 sm:py-12 px-4 sm:px-8 lg:px-20 text-white">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Telemetry Strip & Quick Action Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10">
            <div>
              <span className="font-mono text-xs text-[#A4AD98] tracking-[0.2em] uppercase block">
                [ VERIFIED HIGH-PERFORMANCE FLEET ]
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-tight mt-1">
                ENGINEERED FOR THE ROAD.
              </h2>
            </div>

            {/* Quick Action Links (Touch-friendly 44px min height with clearly defined borders) */}
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <Link
                to="/price-estimator"
                className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-center font-bold transition-all flex items-center justify-center active:scale-95"
              >
                ML Valuation
              </Link>
              <Link
                to="/inspect/bike-001"
                className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] text-xs font-mono uppercase tracking-wider text-center font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>3D Twin</span>
              </Link>
            </div>
          </div>

          {/* Search HUD */}
          <div className="bg-white border border-[#E9E3D8] p-1.5 sm:p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full min-h-[44px]">
              <Search className="w-4 h-4 text-[#35483C] shrink-0" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search model, manufacturer or engine (e.g. Classic 350, R15, Ather 450X)..."
                className="w-full bg-transparent text-xs font-mono text-[#242622] placeholder-[#85857E] focus:outline-none"
              />
            </div>

            <button
              onClick={handleHeroSearch}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] font-mono text-xs uppercase tracking-wider font-bold transition-all shrink-0 active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <span>Explore Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: EDITORIAL CURATED FLEET (ASYMMETRICAL MOTORSPORT MATRIX)
         ========================================================================= */}
      <section className="fleet-section py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto space-y-8 sm:space-y-12">
        
        {/* Section Header with Category Switcher */}
        <div className="section-heading-reveal flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-[#E9E3D8] pb-5 sm:pb-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#85857E]">
              [ 01 // DISCOVERY ]
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#242622]">
              CURATED INVENTORY.
            </h2>
          </div>

          {/* Category Filter Switcher */}
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase overflow-x-auto pb-1 sm:pb-0">
            {['all', 'motorcycle', 'scooter', 'electric'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 min-h-[42px] whitespace-nowrap transition-all border font-bold text-xs ${
                  selectedCategory === cat
                    ? 'bg-[#35483C] text-white border-[#35483C] shadow-sm'
                    : 'bg-white text-[#85857E] hover:text-[#242622] border-[#E9E3D8] hover:border-[#35483C]'
                }`}
              >
                {cat === 'all' ? 'All Machines' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Machines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredInventory.map((bike) => (
            <div key={bike.id} className="stagger-fleet-card">
              <VehicleCard
                vehicle={bike}
                isSaved={savedIds.includes(bike.id)}
                onToggleSave={onToggleSave}
                onOpenAudio={onOpenAudio}
              />
            </div>
          ))}
        </div>

        {/* View Full Fleet CTA */}
        <div className="pt-4 flex justify-center">
          <Link
            to="/explore"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] bg-white border border-[#E9E3D8] hover:border-[#35483C] text-[#242622] hover:text-[#35483C] font-mono text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-bold flex items-center justify-center gap-3 transition-all shadow-sm active:scale-95 text-center"
          >
            <span>Explore Complete Verified Inventory ({SEED_LISTINGS.length} Vehicles)</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

      </section>

      {/* =========================================================================
          SECTION 3: THE 4 MOTORSPORT STANDARDS (TELEMETRY PROTOCOLS)
         ========================================================================= */}
      <section className="standards-section py-12 sm:py-20 lg:py-24 bg-[#E9E3D8]/30 border-y border-[#E9E3D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 space-y-10 sm:space-y-16">
          
          <div className="section-heading-reveal flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#85857E]">
                [ 02 // STANDARDS ]
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#242622]">
                CERTIFICATION PROTOCOLS.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#85857E] max-w-md">
              Every two-wheeler on GEAR UP undergoes physical engineering audits before publication. Zero unverified listings.
            </p>
          </div>

          {/* 4 Pillars Grid with Hairline Borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="standard-pillar p-5 sm:p-8 bg-white border border-[#E9E3D8] space-y-3.5 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">01 //</span>
              <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-[#242622]">
                3D Digital Twin
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Interactive 360° WebGL vehicle twin allowing virtual mechanical inspection, exploded component views, and chassis scrutiny.
              </p>
              <div className="pt-2">
                <Link to="/inspect/bike-001" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1 min-h-[38px]">
                  <span>Inspect 3D Twin</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="standard-pillar p-5 sm:p-8 bg-white border border-[#E9E3D8] space-y-3.5 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">02 //</span>
              <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-[#242622]">
                120-Point Hub Audit
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Laser chassis alignment verify, brake rotor micrometer thickness check, fork stanchion inspection, and tyre tread depth analysis.
              </p>
              <div className="pt-2">
                <Link to="/trust" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1 min-h-[38px]">
                  <span>Inspection Criteria</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="standard-pillar p-5 sm:p-8 bg-white border border-[#E9E3D8] space-y-3.5 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">03 //</span>
              <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-[#242622]">
                CatBoost ML Valuation
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Authentic machine learning regression engine (R²: 0.9919) trained on 2,928 completed Indian transactions across 22 verified manufacturers.
              </p>
              <div className="pt-2">
                <Link to="/price-estimator" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1 min-h-[38px]">
                  <span>Calculate Valuation</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="standard-pillar p-5 sm:p-8 bg-white border border-[#E9E3D8] space-y-3.5 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">04 //</span>
              <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-[#242622]">
                RTO Parivahan Escrow
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Direct chassis and engine number cross-verification with Indian Parivahan database. Encrypted RC transfer escrow and bank NOC clearance.
              </p>
              <div className="pt-2">
                <Link to="/trust" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1 min-h-[38px]">
                  <span>Escrow Details</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 3D DIGITAL TWIN EXPLORATION BANNER
         ========================================================================= */}
      <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="twin-banner relative bg-[#242622] text-white border border-[#E9E3D8] p-6 sm:p-12 lg:p-16 overflow-hidden">
          
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#A4AD98]">
              [ 03 // DIGITAL TWIN ]
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
              INTERACTIVE 3D COMPONENT INSPECTION.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-white/80 leading-relaxed font-light">
              Explore the motorcycle’s internal anatomy in real-time WebGL. Inspect engine compression, brake pad wear, electrical loom status, and chassis alignment before ever stepping foot in person.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/inspect/bike-001"
                className="px-6 py-3.5 min-h-[44px] bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Launch 3D Explorer</span>
              </Link>
              <Link
                to="/compare"
                className="px-6 py-3.5 min-h-[44px] bg-transparent hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider font-bold border border-white/40 transition-all flex items-center justify-center active:scale-95"
              >
                Side-by-Side Compare
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none hidden lg:block overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
              alt="Motorcycle profile"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: SELLER CONCIERGE BANNER
         ========================================================================= */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 lg:p-14 bg-white border border-[#E9E3D8] flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:space-y-3 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#85857E]">
              [ 04 // SELLER PROTOCOL ]
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl uppercase text-[#242622]">
              Sell Your Two-Wheeler With Certified Telemetry.
            </h3>
            <p className="text-xs sm:text-sm text-[#85857E] leading-relaxed">
              Achieve up to 18% higher resale value with certified 120-point verification, verified buyer escrow, and trained CatBoost valuation accuracy.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              to="/sell"
              className="px-8 py-3.5 sm:py-4 min-h-[44px] bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] font-mono text-xs uppercase tracking-wider font-bold text-center transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              List Vehicle Now
            </Link>
            <Link
              to="/resale-studio"
              className="px-6 py-3.5 sm:py-4 min-h-[44px] bg-white hover:bg-[#F7F5EF] text-[#242622] border border-[#E9E3D8] font-mono text-xs uppercase tracking-wider font-bold text-center transition-all active:scale-95 flex items-center justify-center"
            >
              AI Resale Studio
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
