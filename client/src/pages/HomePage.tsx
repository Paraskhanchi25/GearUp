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
import { initHeroEntrance, initScrollSections } from '../utils/motion';
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
  const [heroIndex, setHeroIndex] = useState<number>(0);

  const heroRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const heroMachines = [
    {
      title: 'Royal Enfield Classic 350',
      subtitle: '2023 // 14,000 KM // DARK STEALTH BLACK',
      price: '₹1,82,000',
      displacement: '349 CC',
      power: '20.2 BHP',
      score: '4.85 / 5.0',
      image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=2200&q=85',
      id: 'bike-001'
    },
    {
      title: 'Yamaha YZF R15 V4',
      subtitle: '2023 // 12,500 KM // RACING BLUE DUAL ABS',
      price: '₹1,58,000',
      displacement: '155 CC',
      power: '18.4 BHP',
      score: '4.90 / 5.0',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=2200&q=85',
      id: 'bike-004'
    },
    {
      title: 'Ather 450X Gen 3',
      subtitle: '2023 // 9,800 KM // SPACE GREY 3.7 kWh',
      price: '₹1,18,000',
      displacement: 'EV 6.4 kW',
      power: '26 Nm',
      score: '4.78 / 5.0',
      image: 'https://images.unsplash.com/photo-1595188849767-4d0588647249?auto=format&fit=crop&w=2200&q=85',
      id: 'bike-007'
    }
  ];

  const currentHero = heroMachines[heroIndex];

  // GSAP Entrance & ScrollTrigger initialization
  useEffect(() => {
    const cleanupHero = initHeroEntrance(heroRef.current);
    const cleanupScroll = initScrollSections(pageRef.current);

    return () => {
      cleanupHero?.();
      cleanupScroll?.();
    };
  }, []);

  // Rotate hero machines smoothly with motion
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => {
        const nextIdx = (prev + 1) % heroMachines.length;
        gsap.fromTo('.hero-bg-img', { opacity: 0.65, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' });
        gsap.fromTo('.hero-spec-strip', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        return nextIdx;
      });
    }, 8000);
    return () => clearInterval(timer);
  }, [heroMachines.length]);

  const handleManualSwitchHero = (idx: number) => {
    setHeroIndex(idx);
    gsap.fromTo('.hero-bg-img', { opacity: 0.65, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' });
    gsap.fromTo('.hero-spec-strip', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  };

  const filteredInventory = SEED_LISTINGS.filter(
    (b) => selectedCategory === 'all' || b.category.toLowerCase() === selectedCategory.toLowerCase()
  ).slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div ref={pageRef} className="bg-[#F7F5EF] text-[#242622] selection:bg-[#35483C] selection:text-white overflow-hidden">
      
      {/* =========================================================================
          SECTION 1: CINEMATIC FULL-WIDTH HERO (AC MOTORSPORT MOTION)
         ========================================================================= */}
      <section ref={heroRef} className="relative min-h-[90vh] lg:min-h-[94vh] flex flex-col justify-between border-b border-[#E9E3D8] overflow-hidden bg-[#242622]">
        
        {/* Full-bleed background image with subtle parallax & scale */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={currentHero.image}
            src={currentHero.image}
            alt={currentHero.title}
            className="hero-bg-img w-full h-full object-cover object-center brightness-[0.70] contrast-[1.1] will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#242622] via-[#242622]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#242622]/80 via-transparent to-transparent" />
        </div>

        {/* Top Telemetry Header Ticker */}
        <div className="hero-ticker relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 pt-8 flex items-center justify-between text-white/70 text-[10px] font-mono tracking-[0.25em] uppercase border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A4AD98] animate-ping" />
            <span className="text-white font-bold">RTO PARIVAHAN ESCROW ACTIVE</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span>CHANDIGARH TRICITY</span>
            <span>•</span>
            <span>DELHI NCR</span>
            <span>•</span>
            <span>BENGALURU</span>
          </div>
          <div className="flex items-center gap-2">
            {heroMachines.map((_, i) => (
              <button
                key={i}
                onClick={() => handleManualSwitchHero(i)}
                className={`w-6 h-1 transition-all ${
                  heroIndex === i ? 'bg-[#A4AD98] w-8' : 'bg-white/30 hover:bg-white/60'
                }`}
                title={`Select machine 0${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Hero Core Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 py-12 flex flex-col justify-end space-y-8">
          
          <div className="space-y-4 max-w-4xl">
            {/* Tagline Pill */}
            <div className="hero-title-line inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#242622] font-mono text-[10px] uppercase tracking-[0.2em]">
              <span>INDEX CERTIFIED TWO-WHEELERS</span>
              <span>•</span>
              <span className="text-[#A4AD98]">120-PT VERIFIED</span>
            </div>

            {/* Oversized Architectural Headline */}
            <h1 className="hero-title-line font-heading font-extrabold text-4xl sm:text-7xl lg:text-8xl text-white tracking-tight uppercase leading-[0.95]">
              PRECISION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E9E3D8] to-[#A4AD98]">
                ENGINEERED.
              </span>
            </h1>

            <p className="hero-title-line text-white/80 font-sans text-sm sm:text-lg max-w-xl font-light leading-relaxed">
              India’s dedicated high-performance marketplace for verified motorcycles & scooters. Each machine inspected across 120 certified points and priced by machine learning telemetry.
            </p>
          </div>

          {/* Search HUD & Action Buttons */}
          <div className="hero-search-hud grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-2">
            
            {/* Search Input Bar */}
            <div className="lg:col-span-8 bg-white border border-[#E9E3D8] p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                <Search className="w-4 h-4 text-[#35483C] shrink-0" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Model, manufacturer, or engine displacement (e.g. Classic 350, R15, Ather 450X)..."
                  className="w-full bg-transparent text-xs font-mono text-[#242622] placeholder-[#85857E] focus:outline-none"
                />
              </div>

              <button
                onClick={handleHeroSearch}
                className="w-full sm:w-auto px-6 py-3 bg-[#35483C] hover:bg-[#242622] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shrink-0 active:scale-[0.98]"
              >
                Explore Fleet
              </button>
            </div>

            {/* Direct Action Links */}
            <div className="lg:col-span-4 flex items-center gap-3">
              <Link
                to="/price-estimator"
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-[#242622] border border-white/20 backdrop-blur-md text-xs font-mono uppercase tracking-wider text-center transition-all active:scale-[0.98]"
              >
                ML Valuation
              </Link>
              <Link
                to="/inspect/bike-001"
                className="flex-1 px-4 py-3 bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] text-xs font-mono uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3D Twin</span>
              </Link>
            </div>

          </div>

          {/* Machine Telemetry Card (Featured Highlight) */}
          <div className="hero-spec-strip border-t border-white/15 pt-6 flex flex-wrap items-center justify-between gap-4 text-white text-xs font-mono">
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#A4AD98]">FEATURED SPECIMEN</span>
              <span className="font-bold text-sm text-white">{currentHero.title}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#A4AD98]">DISPLACEMENT</span>
              <span className="font-bold text-sm text-white">{currentHero.displacement}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#A4AD98]">POWER</span>
              <span className="font-bold text-sm text-white">{currentHero.power}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#A4AD98]">VALUATION</span>
              <span className="font-bold text-sm text-[#E9E3D8]">{currentHero.price}</span>
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#A4AD98]">INSPECTION SCORE</span>
              <span className="font-bold text-sm text-[#A4AD98]">{currentHero.score}</span>
            </div>
            <div>
              <Link
                to={`/bike/${currentHero.id}`}
                className="px-4 py-2 border border-white/40 hover:bg-white hover:text-[#242622] text-[#242622] text-[11px] uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
              >
                <span>Full Telemetry</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Refined Minimalist Scroll Indicator */}
        <div className="relative z-10 w-full px-6 sm:px-12 pb-6 flex items-center justify-between text-white/50 text-[9px] font-mono tracking-[0.25em] uppercase">
          <span>GEAR UP MOBILITY LTD.</span>
          <div className="flex items-center gap-2">
            <span>SCROLL TO EXPLORE</span>
            <span className="w-4 h-[1px] bg-white/40 animate-pulse" />
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 2: EDITORIAL CURATED FLEET (ASYMMETRICAL MOTORSPORT MATRIX)
         ========================================================================= */}
      <section className="fleet-section py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12">
        
        {/* Section Header with AC Motorsport Index Counter */}
        <div className="section-heading-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E9E3D8] pb-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#85857E]">
              [ 01 // DISCOVERY ]
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#242622]">
              CURATED INVENTORY.
            </h2>
          </div>

          {/* Category Filter Switcher */}
          <div className="flex flex-wrap items-center gap-1 font-mono text-xs uppercase">
            {['all', 'motorcycle', 'scooter', 'electric'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#35483C] text-white font-bold'
                    : 'bg-white text-[#85857E] hover:text-[#242622] border border-[#E9E3D8]'
                }`}
              >
                {cat === 'all' ? 'All Machines' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Machines Grid with Stagger Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="pt-6 flex justify-center">
          <Link
            to="/explore"
            className="px-8 py-4 bg-white border border-[#E9E3D8] hover:border-[#35483C] text-[#242622] hover:text-[#35483C] font-mono text-xs uppercase tracking-[0.2em] font-bold flex items-center gap-3 transition-all shadow-sm"
          >
            <span>Explore Complete Verified Inventory ({SEED_LISTINGS.length} Vehicles)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* =========================================================================
          SECTION 3: THE 4 MOTORSPORT STANDARDS (TELEMETRY PROTOCOLS)
         ========================================================================= */}
      <section className="standards-section py-24 bg-[#E9E3D8]/30 border-y border-[#E9E3D8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 space-y-16">
          
          <div className="section-heading-reveal flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#85857E]">
                [ 02 // STANDARDS ]
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#242622]">
                CERTIFICATION PROTOCOLS.
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-[#85857E] max-w-md">
              Every two-wheeler on GEAR UP undergoes physical engineering audits before publication. Zero unverified listings.
            </p>
          </div>

          {/* 4 Pillars Grid with Hairline Borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="standard-pillar p-8 bg-white border border-[#E9E3D8] space-y-4 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">01 //</span>
              <h3 className="font-heading font-bold text-lg uppercase text-[#242622]">
                Acoustic Diagnostics
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Real engine stethoscope recording and spectral frequency analysis to detect valve tappet clearance, piston slap, and bearing rumble.
              </p>
              <div className="pt-2">
                <Link to="/bike-doctor" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1">
                  <span>Diagnose Engine</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="standard-pillar p-8 bg-white border border-[#E9E3D8] space-y-4 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">02 //</span>
              <h3 className="font-heading font-bold text-lg uppercase text-[#242622]">
                120-Point Hub Audit
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Laser chassis alignment verify, brake rotor micrometer thickness check, fork stanchion inspection, and tyre tread depth analysis.
              </p>
              <div className="pt-2">
                <Link to="/trust" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1">
                  <span>Inspection Criteria</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="standard-pillar p-8 bg-white border border-[#E9E3D8] space-y-4 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">03 //</span>
              <h3 className="font-heading font-bold text-lg uppercase text-[#242622]">
                CatBoost ML Valuation
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Authentic machine learning regression engine (R²: 0.9919) trained on 2,928 completed Indian transactions across 22 verified manufacturers.
              </p>
              <div className="pt-2">
                <Link to="/price-estimator" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1">
                  <span>Calculate Valuation</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="standard-pillar p-8 bg-white border border-[#E9E3D8] space-y-4 hover:border-[#35483C] transition-colors">
              <span className="font-mono text-xs text-[#A4AD98] font-bold">04 //</span>
              <h3 className="font-heading font-bold text-lg uppercase text-[#242622]">
                RTO Parivahan Escrow
              </h3>
              <p className="text-xs text-[#85857E] leading-relaxed font-sans">
                Direct chassis and engine number cross-verification with Indian Parivahan database. Encrypted RC transfer escrow and bank NOC clearance.
              </p>
              <div className="pt-2">
                <Link to="/trust" className="font-mono text-[10px] uppercase tracking-wider text-[#35483C] font-bold flex items-center gap-1">
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
      <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="twin-banner relative bg-[#242622] text-white border border-[#E9E3D8] p-8 sm:p-16 overflow-hidden">
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#A4AD98]">
              [ 03 // DIGITAL TWIN ]
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              INTERACTIVE 3D COMPONENT INSPECTION.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed font-light">
              Explore the motorcycle’s internal anatomy in real-time WebGL. Inspect engine compression, brake pad wear, electrical loom status, and chassis alignment before ever stepping foot in person.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/inspect/bike-001"
                className="px-6 py-3.5 bg-[#35483C] hover:bg-white hover:text-[#242622] text-[#242622] font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all border border-[#35483C]"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Launch 3D Explorer</span>
              </Link>
              <Link
                to="/compare"
                className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#242622] font-mono text-xs uppercase tracking-wider border border-white/30 transition-all"
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
      <section className="pb-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 bg-white border border-[#E9E3D8] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#85857E]">
              [ 04 // SELLER PROTOCOL ]
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase text-[#242622]">
              Sell Your Two-Wheeler With Certified Telemetry.
            </h3>
            <p className="text-xs sm:text-sm text-[#85857E] leading-relaxed">
              Achieve up to 18% higher resale value with certified 120-point verification, verified buyer escrow, and trained CatBoost valuation accuracy.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/sell"
              className="w-full sm:w-auto px-8 py-4 bg-[#35483C] hover:bg-[#242622] text-white font-mono text-xs uppercase tracking-wider font-bold text-center transition-all shadow-sm"
            >
              List Vehicle Now
            </Link>
            <Link
              to="/resale-studio"
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-[#F7F5EF] text-[#242622] border border-[#E9E3D8] font-mono text-xs uppercase tracking-wider text-center transition-all"
            >
              AI Resale Studio
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
