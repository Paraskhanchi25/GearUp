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
  Compass
} from 'lucide-react';
import { VehicleListing, SearchCenter } from '../types';
import { SEED_LISTINGS } from '../data/seedListings';
import { VehicleCard } from '../components/VehicleCard';
import { formatINR } from '../utils/geo';

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

  // Hero Search Fields
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchBudget, setSearchBudget] = useState<string>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?category=${searchCategory}&q=${searchQuery}&budget=${searchBudget}`);
  };

  const featuredBikes = SEED_LISTINGS.slice(0, 6);

  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-slate-50 text-slate-800">
      {/* 1. HERO SECTION (Light, Clean, Editorial Automotive Styling) */}
      <section className="relative min-h-[82vh] flex items-center justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200/80 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="font-semibold tracking-wide">AI-Powered Used Two-Wheeler Platform</span>
              <span className="text-slate-300 font-bold">•</span>
              <span className="text-slate-500 font-medium">India First</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
                Your next ride is <br />
                <span className="text-blue-600">
                  closer than you think.
                </span>
              </h1>
              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Discover trusted pre-owned bikes and scooters within 2 to 50 km of your coordinates. Compare smarter and unlock fair market pricing with AI.
              </p>
            </div>

            {/* Spec Highlights Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">120-Point</span>
                <span className="text-slate-500">Physical Inspection</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900">0% Deposit</span>
                <span className="text-slate-500">Doorstep Test Rides</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-900">AI Resale</span>
                <span className="text-slate-500">Upgrade Studio</span>
              </div>
            </div>

            {/* Interactive Search Bar directly in Hero */}
            <form
              onSubmit={handleHeroSearch}
              className="p-3 bg-white rounded-2xl border border-slate-200 shadow-elevated space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Brand, model (e.g. Classic 350, Activa)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-400"
                >
                  <option value="all">All Rides</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="scooter">Scooter</option>
                  <option value="electric">Electric EV</option>
                </select>

                <select
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-slate-400"
                >
                  <option value="all">Any Budget</option>
                  <option value="under50k">Under ₹50k</option>
                  <option value="under1lakh">Under ₹1 Lakh</option>
                  <option value="under2lakh">Under ₹2 Lakh</option>
                  <option value="above2lakh">Above ₹2 Lakh</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm whitespace-nowrap"
                >
                  <span>Find My Ride</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Current Search Origin indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Current search hub:</span>
              <span className="font-semibold text-slate-800 underline cursor-pointer" onClick={() => navigate('/explore')}>
                {currentLocation.name}
              </span>
              <span className="text-slate-400">({SEED_LISTINGS.length} rides in live database)</span>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-5 shadow-elevated group">
              <div className="flex items-center justify-between pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  FEATURED SPOTLIGHT
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Inspection 4.9/5.0
                </span>
              </div>

              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Royal Enfield Classic 350"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-heading font-extrabold text-2xl tracking-wide">
                    ROYAL ENFIELD CLASSIC 350
                  </h3>
                  <p className="text-xs text-slate-200 font-medium">J-Series Dual Channel ABS • Sector 35, Chandigarh</p>
                </div>
              </div>

              {/* Spec Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 text-[10px] uppercase">Fuel Tank</p>
                  <p className="font-heading font-bold text-slate-900 text-sm">13 L</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 text-[10px] uppercase">Max Power</p>
                  <p className="font-heading font-bold text-slate-900 text-sm">20.2 BHP</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500 text-[10px] uppercase">Real Mileage</p>
                  <p className="font-heading font-bold text-slate-900 text-sm">36 kmpl</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Estimated Fair Price</span>
                  <span className="font-heading font-extrabold text-xl text-slate-900">₹1,85,000</span>
                </div>
                <Link
                  to="/bike/bike-001"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Book Test Ride
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY BROWSER PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Browse by Two-Wheeler Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Curated for Indian city traffic, highways, and college campuses
            </p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Motorcycles Card */}
          <Link
            to="/explore?category=motorcycle"
            className="group relative rounded-3xl p-6 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-elevated transition-all overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cruisers & Commuters</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-semibold border border-slate-200">
                18+ Models
              </span>
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
              Motorcycles
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Royal Enfield, Pulsar, Apache, FZ, MT-15, Duke & Splendor
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Explore Bikes</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Scooters Card */}
          <Link
            to="/explore?category=scooter"
            className="group relative rounded-3xl p-6 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-elevated transition-all overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">City Runabouts</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-semibold border border-slate-200">
                12+ Models
              </span>
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
              Scooters
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Honda Activa 6G, TVS Jupiter, Suzuki Access 125 & Fascino
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Explore Scooters</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Electric EVs Card */}
          <Link
            to="/explore?category=electric"
            className="group relative rounded-3xl p-6 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-elevated transition-all overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600" /> Battery Certified
              </span>
              <span className="text-xs bg-emerald-50 px-2 py-1 rounded-md text-emerald-800 font-semibold border border-emerald-200">
                Low Running Cost
              </span>
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 group-hover:text-emerald-700 transition-colors">
              Electric Two-Wheelers
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Ather 450X, Ola S1 Pro, TVS iQube & Chetak with battery diagnostic
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
              <span>Explore EVs</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. DEDICATED MAP DISCOVERY TEASER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-elevated">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-blue-400">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>CORE MARKETPLACE EXPERIENCE</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
              Explore Available Rides on an Interactive GPS Map
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Filter with real-world radius circles: 2 km, 5 km, 10 km, 25 km, or 50 km from your doorstep. See actual motorcycle, scooter and EV markers updated in real time.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/explore"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
              >
                <span>Launch Interactive Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-400">
                Calculated with true Haversine distance coordinates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR BIKES & SCOOTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Top Rated Two-Wheelers Near You
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Live
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              RTO document verified, 120-point inspected with AI price insights
            </p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBikes.map((bike) => (
            <VehicleCard
              key={bike.id}
              vehicle={bike}
              isSaved={savedIds.includes(bike.id)}
              onToggleSave={onToggleSave}
              onOpenAudio={onOpenAudio}
            />
          ))}
        </div>
      </section>

      {/* 5. SIGNATURE FEATURE PROMOTION: RESALE UPGRADE STUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-elevated relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                <span>SIGNATURE SELLER FEATURE</span>
              </div>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                AI Resale Upgrade Studio
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Don&apos;t sell your bike as-is at a heavy discount. Our AI models analyze photos of your vehicle, identify easy cosmetic & mechanical touchups (seat leather, chain detailing, paint correction), and calculate the exact projected ROI in Indian Rupees before you list.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Average Spend</p>
                  <p className="font-heading font-bold text-slate-900 text-base">₹1,500 - ₹3,000</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Resale Increase</p>
                  <p className="font-heading font-bold text-emerald-700 text-base">+₹7,500 to ₹12k</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-medium">Avg. Selling Time</p>
                  <p className="font-heading font-bold text-blue-700 text-base">3.4x Faster</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/resale-studio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  <span>Launch Resale Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">Before vs After AI Transformation</span>
                <span className="text-amber-700 font-semibold">Factory Restore Theme</span>
              </div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
                  alt="Transformation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-bold">
                  After Detailing Preview
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-emerald-800 border border-emerald-200 text-[10px] font-bold shadow-sm">
                  Net Gain: +₹6,200
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *Visual preview generated to demonstrate potential return. Never substitutes for actual uploaded photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW BUYING & SELLING WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            TRANSPARENT WORKFLOWS
          </span>
          <h2 className="font-heading font-extrabold text-3xl text-slate-900">
            How GEAR UP Works for You
          </h2>
          <p className="text-sm text-slate-500">
            No unverified middlemen. No hidden paperwork fees. Complete confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Discover on Map</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find rides in your exact sector or neighborhood using accurate GPS radius filters. Listen to real rider audio stories.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">120-Point Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every certified bike undergoes strict cosmetic, battery, and engine diagnostics. Zero guesswork on accident history.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Hassle-Free RTO Transfer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We handle Form 29/30 transfer directly with Parivahan RTO across Punjab, Haryana, Delhi, Karnataka, and Maharashtra.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 space-y-8 shadow-sm">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              VERIFIED RIDER REVIEWS
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Loved by Riders Across Indian Cities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">★★★★★</div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;Found a 2023 Classic 350 just 2 km away in Sector 35 Chandigarh. Booked a doorstep test ride within 1 hour. The AI inspection report matched the bike 100%.&rdquo;
              </p>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Gurpreet Singh</p>
                <p className="text-slate-500">Chandigarh</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">★★★★★</div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;Used the Resale Upgrade Studio before listing my Activa 6G. Spent ₹1,200 on deep detailing and seat restoration, and sold it for ₹6,000 more than what local dealers offered.&rdquo;
              </p>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Priya Sharma</p>
                <p className="text-slate-500">Mohali</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">★★★★★</div>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                &ldquo;The battery health diagnostic on the Ather 450X was a game changer. I knew the exact battery condition before making an offer in Bengaluru.&rdquo;
              </p>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Nikhil R.</p>
                <p className="text-slate-500">Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">FAQ</span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          <details className="group p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              <span>How does the GPS radius discovery work?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="pt-3 text-slate-600 leading-relaxed">
              We calculate distances using the true Haversine geometric formula from your device coordinates or chosen city center (e.g. Sector 17 Chandigarh, CP Delhi, Koramangala Bengaluru). You can adjust the radius from 2 km to 50 km or anywhere.
            </p>
          </details>

          <details className="group p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              <span>Does AI inspection claim to test engine internals?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="pt-3 text-slate-600 leading-relaxed">
              Never. Our AI photo analyzer examines visible cosmetic traits (scratches, panel alignment, rust, tyre wear). Mechanical inspection is performed in-person by certified human technicians following our 120-point checklist.
            </p>
          </details>

          <details className="group p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-sm">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex items-center justify-between">
              <span>Who handles the RC ownership transfer?</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="pt-3 text-slate-600 leading-relaxed">
              GEAR UP coordinates the transfer with the respective RTO office via Parivahan Sewa, assisting both buyer and seller with Form 29, Form 30, and insurance endorsements.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
