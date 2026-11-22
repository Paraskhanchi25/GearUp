import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Bot, 
  Wrench, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Award,
  SlidersHorizontal,
  Compass,
  FileCheck2,
  Gauge,
  Calendar,
  Layers,
  Check,
  Star
} from 'lucide-react';
import { VehicleListing, SearchCenter } from '../types';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { VehicleCard } from '../components/VehicleCard';

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

  // Category filter for inventory showcase
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const filteredInventory = SEED_LISTINGS.filter(
    (b) => selectedCategory === 'all' || b.category.toLowerCase() === selectedCategory.toLowerCase()
  ).slice(0, 6);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div className="bg-[#F7F5EF] text-[#242923] selection:bg-[#879783] selection:text-white">
      
      {/* =========================================================================
          SECTION 1: EDITORIAL LUXURY HERO (Inspired by The Vineyard Hotel on Awwwards)
         ========================================================================= */}
      <section className="relative pt-12 pb-24 px-6 sm:px-12 lg:px-20 border-b border-[#E5E1D7] overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Eyebrow & Main Editorial Headline */}
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1EEE5] border border-[#E5D9C7] text-xs font-medium text-[#596B59] uppercase tracking-widest">
              <span>Verified Automotive Marketplace</span>
              <span>•</span>
              <span>Hub Certified</span>
            </div>

            <h1 className="font-heading font-medium text-4xl sm:text-6xl lg:text-7xl text-[#242923] tracking-tight leading-[1.08]">
              The Art of the Two-Wheeled Machine.
            </h1>

            <p className="text-[#77796F] text-base sm:text-xl font-normal max-w-2xl leading-relaxed">
              Curated, certified pre-owned motorcycles and scooters in India. Each vehicle verified through 120 physical inspection points and trained CatBoost valuation telemetry.
            </p>
          </div>

          {/* Quick Search Concierge Bar */}
          <div className="p-3 sm:p-4 rounded-3xl bg-white border border-[#E5E1D7] shadow-elevated max-w-3xl">
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
                <Search className="w-5 h-5 text-[#879783] shrink-0" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search by model, brand, or displacement (e.g. Classic 350, Ather 450X)..."
                  className="w-full bg-transparent text-sm text-[#242923] placeholder-[#77796F]/60 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#879783] hover:bg-[#596B59] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
                >
                  Explore Collection
                </button>
              </div>
            </form>
          </div>

          {/* Hero Showcase Image */}
          <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-3xl overflow-hidden bg-[#F1EEE5] border border-[#E5E1D7] shadow-luxury">
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=2000&q=85"
              alt="Classic Indian motorcycle in warm morning light"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#242923]/70 via-transparent to-transparent flex items-end p-8 sm:p-12">
              <div className="text-white space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#E5D9C7] font-semibold">
                  Featured Machine // 2023 Royal Enfield Classic 350
                </span>
                <p className="font-heading font-medium text-2xl sm:text-3xl">
                  Engineered Integrity. Documented Provenance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: BRAND PHILOSOPHY PILLARS
         ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 border-b border-[#E5E1D7] bg-[#F1EEE5]/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#596B59]">
                01 // The GearUp Standard
              </span>
              <h2 className="font-heading font-medium text-3xl sm:text-5xl text-[#242923] tracking-tight">
                Curated Heritage, Certified Precision.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-[#77796F] text-sm leading-relaxed">
                We believe trust is an engineered certainty. By marrying advanced machine learning with rigorous physical hub inspections, we transform second-hand two-wheelers into certified assets.
              </p>
            </div>
          </div>

          {/* 4 Architectural Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-heading font-medium text-xl text-[#242923]">
                Transparent Telemetry
              </h3>
              <p className="text-xs text-[#77796F] leading-relaxed">
                No masked defects or misleading cosmetic polish. Every motorcycle displays authentic hub compression data, rotor wear, and tyre tread depth.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-heading font-medium text-xl text-[#242923]">
                Data-Driven Valuation
              </h3>
              <p className="text-xs text-[#77796F] leading-relaxed">
                Trained on 45,000+ real Indian market sales. Our gradient-boosted ML engine evaluates true residual value based on mechanical health, not guesswork.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-heading font-medium text-xl text-[#242923]">
                Verified RTO Titles
              </h3>
              <p className="text-xs text-[#77796F] leading-relaxed">
                3-level document verification ensures chassis and engine number consistency, active insurance validation, PUC compliance, and zero active loan encumbrances.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-heading font-medium text-xl text-[#242923]">
                Doorstep Coordination
              </h3>
              <p className="text-xs text-[#77796F] leading-relaxed">
                Experience hassle-free physical test rides at safe public hubs or delivered straight to your doorstep with full escrow and paperwork security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: CURATED COLLECTION SHOWCASE
         ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 border-b border-[#E5E1D7]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header & Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#596B59]">
                02 // The Marketplace
              </span>
              <h2 className="font-heading font-medium text-3xl sm:text-5xl text-[#242923] tracking-tight">
                Curated Two-Wheelers
              </h2>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-[#F1EEE5] border border-[#E5E1D7]">
              {[
                { id: 'all', label: 'All Machines' },
                { id: 'motorcycle', label: 'Motorcycles' },
                { id: 'scooter', label: 'Scooters' },
                { id: 'electric', label: 'Electric (EV)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#879783] text-white shadow-sm font-semibold'
                      : 'text-[#77796F] hover:text-[#242923]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInventory.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isSaved={savedIds.includes(vehicle.id)}
                onToggleSave={onToggleSave}
                onOpenAudio={onOpenAudio}
              />
            ))}
          </div>

          {/* View Full Collection Button */}
          <div className="text-center pt-8">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#879783] hover:bg-[#596B59] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Explore Complete Collection ({SEED_LISTINGS.length} Vehicles)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SELLER CONCIERGE & RESALE STUDIO
         ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 lg:px-20 bg-[#F1EEE5] border-b border-[#E5E1D7]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#596B59]">
                03 // Private Seller Concierge
              </span>
              <h2 className="font-heading font-medium text-3xl sm:text-5xl text-[#242923] tracking-tight leading-[1.1]">
                Entrust Your Machine to Discerning Buyers.
              </h2>
              <p className="text-[#77796F] text-sm sm:text-base leading-relaxed">
                Avoid aggressive lowball offers and tire-kickers. GearUp pairs certified 120-point digital inspection reports with AI Resale Studio detailing recommendations to maximize your vehicle&apos;s resale value.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-[#242923] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#879783]" />
                  <span>Free doorstep physical inspection & AI cosmetic analysis</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#242923] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#879783]" />
                  <span>Boost sale price by up to ₹12,000 with targeted detailing</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#242923] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#879783]" />
                  <span>Verified RTO ownership transfer with complete Form 29/30 filing</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/sell"
                  className="px-8 py-3.5 rounded-full bg-[#879783] hover:bg-[#596B59] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
                >
                  List Your Bike
                </Link>
                <Link
                  to="/resale-studio"
                  className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F7F5EF] text-[#242923] border border-[#E5E1D7] text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Try Resale Studio
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden bg-white border border-[#E5E1D7] shadow-luxury p-4 sm:p-6 space-y-5">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F1EEE5]">
                  <img
                    src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80"
                    alt="Motorcycle inspection in workshop"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#596B59] text-xs font-semibold border border-[#E5E1D7] shadow-sm">
                    AI Detail Studio Preview
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-2">
                  <div className="flex justify-between text-xs text-[#77796F]">
                    <span>Current Estimated Value:</span>
                    <strong className="text-[#242923]">₹1,65,000</strong>
                  </div>
                  <div className="flex justify-between text-xs text-[#77796F]">
                    <span>Optimized Resale Potential:</span>
                    <strong className="text-[#596B59]">₹1,77,000 (+₹12,000 ROI)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: EDITORIAL TESTIMONIALS & TRUST
         ========================================================================= */}
      <section className="py-24 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#596B59]">
              04 // Provenance & Trust
            </span>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-[#242923] tracking-tight">
              Loved by Riders Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex text-[#879783] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#879783]" />
                ))}
              </div>
              <p className="text-xs text-[#77796F] italic leading-relaxed">
                &ldquo;Bought a 2022 Interceptor 650. The hub inspection report correctly diagnosed slight front rotor wear, and the price was automatically adjusted. Complete transparency.&rdquo;
              </p>
              <div>
                <p className="font-medium text-sm text-[#242923]">Kabir Bedi</p>
                <p className="text-[11px] text-[#77796F]">Verified Buyer • Chandigarh</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex text-[#879783] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#879783]" />
                ))}
              </div>
              <p className="text-xs text-[#77796F] italic leading-relaxed">
                &ldquo;Sold my Ather 450X in 4 days. The battery health diagnostic badge immediately convinced the buyer to pay asking price without endless negotiations.&rdquo;
              </p>
              <div>
                <p className="font-medium text-sm text-[#242923]">Rohan Kulkarni</p>
                <p className="text-[11px] text-[#77796F]">Verified Seller • Bengaluru</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex text-[#879783] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#879783]" />
                ))}
              </div>
              <p className="text-xs text-[#77796F] italic leading-relaxed">
                &ldquo;The RTO Parivahan verification saved me from purchasing a bike with active hypothecation. GearUp is the only marketplace I trust for two-wheelers.&rdquo;
              </p>
              <div>
                <p className="font-medium text-sm text-[#242923]">Dr. Priya Sharma</p>
                <p className="text-[11px] text-[#77796F]">Verified Buyer • Delhi NCR</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
