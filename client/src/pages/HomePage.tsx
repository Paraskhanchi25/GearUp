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
import { CinematicMotorcycleHero } from '../components/3d/CinematicMotorcycleHero';

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

  const filteredInventory = SEED_LISTINGS.filter(
    (b) => selectedCategory === 'all' || b.category.toLowerCase() === selectedCategory.toLowerCase()
  ).slice(0, 6);

  return (
    <div className="bg-deepBlack text-sand-light selection:bg-sage-dark selection:text-sand-light overflow-x-hidden">
      {/* =========================================================================
          SECTION 2: CINEMATIC 3D MOTORCYCLE HERO (Scroll-driven Anduril style)
         ========================================================================= */}
      <CinematicMotorcycleHero />

      {/* =========================================================================
          SECTION 3: BRAND PHILOSOPHY (Warm Sand Background & Deep Black Typography)
         ========================================================================= */}
      <section className="relative py-28 px-6 sm:px-12 lg:px-20 bg-sand-light text-deepBlack transition-colors">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-darkSage font-bold">
                01 // THE GEAR UP PHILOSOPHY
              </span>
              <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-deepBlack tracking-tight leading-[1.05]">
                MORE THAN JUST A MOTORCYCLE.
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-charcoal/80 text-sm sm:text-base leading-relaxed">
                We believe trust is not a buzzword — it is an engineered certainty. By marrying advanced machine learning with rigorous physical hub inspections, we transform second-hand two-wheelers into certified assets.
              </p>
            </div>
          </div>

          {/* 4 Architectural Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-8 rounded-2xl bg-sand-offWhite border border-sand-warm/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-darkSage text-sand-light flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-heading font-bold text-xl text-deepBlack">
                Transparent Telemetry
              </h3>
              <p className="text-xs text-charcoal/80 leading-relaxed">
                No masked defects or misleading cosmetic polish. Every motorcycle displays authentic hub compression data, rotor wear, and tyre tread depth.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-sand-offWhite border border-sand-warm/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-darkSage text-sand-light flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-heading font-bold text-xl text-deepBlack">
                Data-Driven Valuation
              </h3>
              <p className="text-xs text-charcoal/80 leading-relaxed">
                Trained on 45,000+ real Indian market sales. Our gradient-boosted ML engine evaluates true residual value based on mechanical health, not guesswork.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-sand-offWhite border border-sand-warm/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-darkSage text-sand-light flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-heading font-bold text-xl text-deepBlack">
                Verified RTO Titles
              </h3>
              <p className="text-xs text-charcoal/80 leading-relaxed">
                3-level document verification ensures chassis and engine number consistency, active insurance validation, PUC compliance, and zero active loan encumbrances.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-sand-offWhite border border-sand-warm/60 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-darkSage text-sand-light flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-heading font-bold text-xl text-deepBlack">
                Zero-Friction Buying
              </h3>
              <p className="text-xs text-charcoal/80 leading-relaxed">
                Experience doorstep test rides, transparent escrow holding, and doorstep RTO ownership transfers without dealing with unverified middlemen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HOW GEARUP WORKS (Dark Minimalist Numbered Stages)
         ========================================================================= */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-deepBlack border-t border-darkSage/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs uppercase font-mono tracking-widest text-sage-muted font-bold">
              02 // THE PROCESS
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-sand-offWhite tracking-tight">
              ENGINEERED FOR ABSOLUTE CONFIDENCE.
            </h2>
            <p className="text-sand-light/70 text-sm sm:text-base leading-relaxed">
              From first exploration to handing over the keys, each stage is structured for total transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stage 1 */}
            <div className="relative p-6 rounded-2xl bg-charcoal border border-darkSage space-y-4 group hover:border-sage-muted transition-colors">
              <div className="text-3xl font-heading font-extrabold text-sand-warm">01</div>
              <h3 className="text-lg font-heading font-bold text-sand-offWhite">Discover</h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Explore real inventory mapped with live GPS coordinates across Tri-City, Delhi NCR, Bengaluru, Pune, and Jaipur.
              </p>
              <div className="pt-2 text-[11px] font-mono text-sage-muted flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Geographic Proximity</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="relative p-6 rounded-2xl bg-charcoal border border-darkSage space-y-4 group hover:border-sage-muted transition-colors">
              <div className="text-3xl font-heading font-extrabold text-sand-warm">02</div>
              <h3 className="text-lg font-heading font-bold text-sand-offWhite">Evaluate</h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Understand vehicle health with our ML valuation engine that dynamically adjusts for mechanical and component wear.
              </p>
              <div className="pt-2 text-[11px] font-mono text-sage-muted flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>ML Fair Price Engine</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="relative p-6 rounded-2xl bg-charcoal border border-darkSage space-y-4 group hover:border-sage-muted transition-colors">
              <div className="text-3xl font-heading font-extrabold text-sand-warm">03</div>
              <h3 className="text-lg font-heading font-bold text-sand-offWhite">Verify</h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Examine comprehensive 120-point certified hub inspection results, compression test logs, and verified RTO certificates.
              </p>
              <div className="pt-2 text-[11px] font-mono text-sage-muted flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>120-Point Certification</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="relative p-6 rounded-2xl bg-charcoal border border-darkSage space-y-4 group hover:border-sage-muted transition-colors">
              <div className="text-3xl font-heading font-extrabold text-sand-warm">04</div>
              <h3 className="text-lg font-heading font-bold text-sand-offWhite">Connect</h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Book a hub or doorstep test ride, initiate secure paperless booking, and let GearUp manage RC transfer and title clearance.
              </p>
              <div className="pt-2 text-[11px] font-mono text-sage-muted flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Direct Handover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: EXPLORE MOTORCYCLES (Actual Seed Inventory Showcase)
         ========================================================================= */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-charcoal border-t border-darkSage/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-darkSage/60 pb-8">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-sand-warm font-bold">
                03 // CERTIFIED INVENTORY
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-sand-offWhite">
                EXPLORE VERIFIED MOTORCYCLES.
              </h2>
              <p className="text-xs sm:text-sm text-sand-light/70 max-w-lg">
                Inspected on 120 mechanical parameters. Tested, certified, and ready for immediate ownership.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Machines' },
                { id: 'motorcycle', label: 'Cruisers & Street' },
                { id: 'scooter', label: 'Scooters' },
                { id: 'electric', label: 'EV Mobility' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-sand-warm text-deepBlack shadow-sm'
                      : 'bg-deepBlack text-sand-light hover:text-white border border-darkSage'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Machine Inventory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInventory.map((bike) => {
              const isSaved = savedIds.includes(bike.id);
              return (
                <div
                  key={bike.id}
                  className="group rounded-2xl bg-deepBlack border border-darkSage hover:border-sage-muted transition-all duration-300 overflow-hidden shadow-subtle hover:shadow-elevated flex flex-col"
                >
                  {/* Image Stage */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0D0B]">
                    <img
                      src={bike.primaryImage}
                      alt={bike.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deepBlack/90 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-sand-light uppercase tracking-wider border border-white/10">
                        {bike.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-darkSage/90 text-sand-light border border-sage/40 backdrop-blur-md">
                        <ShieldCheck className="w-3 h-3 text-sage" /> Hub Score: {bike.inspectionScore} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-sage-muted mb-1 font-mono">
                        <span>{bike.brand} • {bike.variant}</span>
                        <span>{bike.city}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-sand-offWhite group-hover:text-sand-warm transition-colors line-clamp-1">
                        {bike.title}
                      </h3>
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-darkSage/60 text-center text-xs">
                      <div>
                        <p className="text-[10px] text-sage-muted font-mono uppercase">Year</p>
                        <p className="font-bold text-sand-light">{bike.year}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-sage-muted font-mono uppercase">Mileage</p>
                        <p className="font-bold text-sand-light">{bike.km.toLocaleString('en-IN')} km</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-sage-muted font-mono uppercase">Owner</p>
                        <p className="font-bold text-sand-light">{bike.owners === 1 ? '1st' : `${bike.owners}nd`}</p>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] font-mono text-sage-muted uppercase">Asking Price</span>
                        <div className="font-heading font-extrabold text-xl text-sand-offWhite">
                          {formatINR(bike.price)}
                        </div>
                      </div>

                      <Link
                        to={`/bike/${bike.id}`}
                        className="px-4 py-2 rounded-xl bg-darkSage hover:bg-sage-dark text-sand-light hover:text-white text-xs font-heading font-bold tracking-wide transition-all border border-sage/30 flex items-center gap-1.5"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 text-center">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-sand-warm hover:bg-sand-light text-deepBlack font-heading font-bold text-sm tracking-wide transition-all shadow-glow-sand"
            >
              <span>Explore All {SEED_LISTINGS.length} Motorcycles & Scooters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: SELL WITH GEARUP (Editorial Seller Section)
         ========================================================================= */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-deepBlack border-t border-darkSage/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-sand-warm font-bold">
              04 // SELLER ECOSYSTEM
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-sand-offWhite tracking-tight leading-[1.05]">
              SELL YOUR TWO-WHEELER <br />
              <span className="text-sage-muted">AT ITS TRUE RESIDUAL VALUE.</span>
            </h2>
            <p className="text-sand-light/80 text-sm sm:text-base max-w-xl leading-relaxed">
              Forget endless negotiations and lowball dealer margins. GearUp uses machine learning trained on actual resale transactions to provide instant, authentic market valuations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-sand-light">
                <Check className="w-4 h-4 text-sand-warm mt-0.5 flex-shrink-0" />
                <span><strong>Instant Algorithmic Valuation:</strong> Enter make, model, year, and condition for an immediate market prediction.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-sand-light">
                <Check className="w-4 h-4 text-sand-warm mt-0.5 flex-shrink-0" />
                <span><strong>Free Hub Certification:</strong> Verified 120-point inspection badge commands up to 14% higher resale value.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-sand-light">
                <Check className="w-4 h-4 text-sand-warm mt-0.5 flex-shrink-0" />
                <span><strong>Paperless Handover:</strong> Secure payment escrow and RTO title transfer handled end-to-end.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/sell"
                className="px-7 py-3.5 rounded-xl bg-sand-warm hover:bg-sand-light text-deepBlack font-heading font-bold text-sm tracking-wide transition-all shadow-glow-sand flex items-center gap-2"
              >
                <span>List Your Motorcycle Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/price-estimator"
                className="px-7 py-3.5 rounded-xl bg-charcoal hover:bg-darkSage text-sand-light border border-darkSage font-heading font-semibold text-sm tracking-wide transition-all"
              >
                Calculate Fair Price
              </Link>
            </div>
          </div>

          {/* Seller Preview Card */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-charcoal border border-darkSage shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-darkSage/60 pb-4">
              <div>
                <p className="text-[11px] font-mono text-sage-muted uppercase">Sample Valuation</p>
                <h4 className="font-heading font-bold text-lg text-sand-offWhite">Royal Enfield Classic 350</h4>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-darkSage text-sand-light border border-sage/40">
                2023 Model
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-darkSage/40">
                <span className="text-sage-muted">Original Ex-Showroom</span>
                <span className="font-mono text-sand-light">₹2,14,000</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-darkSage/40">
                <span className="text-sage-muted">Kilometres Driven</span>
                <span className="font-mono text-sand-light">12,400 km</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-darkSage/40">
                <span className="text-sage-muted">Mechanical Grade</span>
                <span className="font-mono text-sage font-bold">Grade A+ (Certified)</span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="font-heading font-bold text-sm text-sand-warm">AI Suggested Resale</span>
                <span className="font-heading font-extrabold text-2xl text-sand-offWhite">₹1,73,000</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-deepBlack/80 border border-darkSage text-[11px] text-sand-light/70 space-y-1">
              <p className="font-bold text-sand-warm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> High Buyer Demand Index
              </p>
              <p>Average time to sell this model on GearUp: 4.2 days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: TRUST AND TRANSPARENCY (Technical Verification System)
         ========================================================================= */}
      <section className="py-28 px-6 sm:px-12 lg:px-20 bg-charcoal border-t border-darkSage/40">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-sand-warm font-bold">
              05 // TRUST ARCHITECTURE
            </span>
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-sand-offWhite">
              VERIFICATION OVER ASSUMPTION.
            </h2>
            <p className="text-sand-light/70 text-sm sm:text-base leading-relaxed">
              Every two-wheeler on GearUp is backed by physical verification checkpoints that guarantee quality, roadworthiness, and clean legal ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-deepBlack border border-darkSage space-y-4">
              <div className="w-12 h-12 rounded-xl bg-darkSage text-sand-light flex items-center justify-center border border-sage/40">
                <ShieldCheck className="w-6 h-6 text-sand-warm" />
              </div>
              <h3 className="font-heading font-bold text-xl text-sand-offWhite">
                120-Point Physical Inspection
              </h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Performed at authorized GearUp Hubs. Includes digital compression gauges (PSI), laser frame alignment check, tyre tread depth micrometer, and cold-crank battery testing.
              </p>
              <Link to="/trust" className="text-xs text-sand-warm font-bold inline-flex items-center gap-1 hover:underline">
                View Inspection Standards <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-deepBlack border border-darkSage space-y-4">
              <div className="w-12 h-12 rounded-xl bg-darkSage text-sand-light flex items-center justify-center border border-sage/40">
                <FileCheck2 className="w-6 h-6 text-sand-warm" />
              </div>
              <h3 className="font-heading font-bold text-xl text-sand-offWhite">
                3-Level RTO Title Verification
              </h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Optical character recognition checks Registration Certificates (RC) against listing attributes. Verifies active PUC, insurance validity, Form 29/30 signing, and bank NOC clearance.
              </p>
              <Link to="/how-it-works" className="text-xs text-sand-warm font-bold inline-flex items-center gap-1 hover:underline">
                Learn About RTO Clearance <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-deepBlack border border-darkSage space-y-4">
              <div className="w-12 h-12 rounded-xl bg-darkSage text-sand-light flex items-center justify-center border border-sage/40">
                <Sparkles className="w-6 h-6 text-sand-warm" />
              </div>
              <h3 className="font-heading font-bold text-xl text-sand-offWhite">
                Machine Learning Fair Valuation
              </h3>
              <p className="text-xs text-sand-light/70 leading-relaxed">
                Gradient Boosting model trained on thousands of Indian two-wheeler transactions. Factoring in mechanical sound, tyre health, cosmetic grade, and current market demand.
              </p>
              <Link to="/price-estimator" className="text-xs text-sand-warm font-bold inline-flex items-center gap-1 hover:underline">
                Explore ML Valuation <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FINAL CTA
         ========================================================================= */}
      <section className="relative py-28 px-6 sm:px-12 lg:px-20 bg-deepBlack border-t border-darkSage/40 overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-darkSage/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-xs uppercase font-mono tracking-widest text-sand-warm font-bold">
            THE NEXT STEP
          </span>

          <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-sand-offWhite tracking-tight">
            YOUR NEXT RIDE IS WAITING.
          </h2>

          <p className="text-sand-light/80 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover verified motorcycles, check honest machine telemetry, and buy or sell with complete peace of mind.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/explore"
              className="px-8 py-4 rounded-xl bg-sand-warm hover:bg-sand-light text-deepBlack font-heading font-bold text-sm tracking-wide transition-all shadow-glow-sand flex items-center gap-2"
            >
              <span>Explore Verified Motorcycles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sell"
              className="px-8 py-4 rounded-xl bg-charcoal hover:bg-darkSage text-sand-light border border-darkSage font-heading font-semibold text-sm tracking-wide transition-all"
            >
              Sell Your Two-Wheeler
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
