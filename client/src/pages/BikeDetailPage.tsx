import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  UserCheck, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Share2, 
  Heart, 
  Phone, 
  MessageCircle, 
  ChevronLeft,
  ArrowRight,
  Zap,
  Award
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR, formatINRLakh } from '../utils/geo';
import { VehicleListing } from '../types';
import { BookTestRideModal } from '../components/BookTestRideModal';
import { AudioPlayerModal } from '../components/AudioPlayerModal';

interface BikeDetailPageProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const BikeDetailPage: React.FC<BikeDetailPageProps> = ({ savedIds, onToggleSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vehicle = SEED_LISTINGS.find((b) => b.id === id) || SEED_LISTINGS[0];
  const [activeImage, setActiveImage] = useState<string>(vehicle.primaryImage);
  const [testRideModalOpen, setTestRideModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);

  const isSaved = savedIds.includes(vehicle.id);
  const similarBikes = SEED_LISTINGS.filter(b => b.category === vehicle.category && b.id !== vehicle.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A1411] pb-24 text-slate-100">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#1A332B] bg-[#0E1A16] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-forest-400" />
            <span>Back to listings</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Listing ID: {vehicle.id}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Listing link copied to clipboard!');
              }}
              className="p-1.5 rounded-lg bg-forest-950 text-slate-400 hover:text-white border border-forest-800"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(vehicle.id)}
              className="p-1.5 rounded-lg bg-forest-950 text-slate-400 hover:text-red-400 border border-forest-800"
              title="Save"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual Gallery & Detailed AI Reports (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-forest-950 border border-forest-800 shadow-2xl">
              <img
                src={activeImage}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                  {vehicle.category}
                </span>
                {vehicle.batteryHealth && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> Battery Health: {vehicle.batteryHealth}%
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {[vehicle.primaryImage, ...(vehicle.galleryImages || [])].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-forest-400 scale-105' : 'border-forest-900 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Rider Audio Story Banner (if available) */}
            {vehicle.audioStory && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#211B0F] to-[#17140B] border border-amber-600/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Listen to Seller&apos;s Ride Story</h4>
                    <p className="text-[11px] text-amber-200">
                      {vehicle.audioStory.speakerName} shares ownership history & route habits ({vehicle.audioStory.duration}s)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAudioModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Play Audio
                </button>
              </div>
            )}

            {/* AI Fair-Price Assessment Gauge Box */}
            <div className="p-6 rounded-3xl bg-[#101D19] border border-forest-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 text-forest-200 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">AI Fair-Price Assessment</h3>
                    <p className="text-xs text-slate-400">Trained on 45,000+ Indian two-wheeler transactions</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/50 uppercase">
                  {vehicle.aiDealBadge.replace('_', ' ')}
                </span>
              </div>

              {/* Price Range Meter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Market Low: {formatINR(vehicle.aiFairPriceMin)}</span>
                  <span className="text-emerald-400 font-bold">Suggested: {formatINR(vehicle.aiSuggestedPrice)}</span>
                  <span>Market High: {formatINR(vehicle.aiFairPriceMax)}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-forest-950 border border-forest-900 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-forest-400 rounded-full"
                    style={{ left: '20%', right: '20%' }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-glow"
                    style={{ left: '48%' }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Asking price ({formatINR(vehicle.price)}) is directly aligned with true market residual values for a {vehicle.year} model with {vehicle.km.toLocaleString('en-IN')} km.
                </p>
              </div>
            </div>

            {/* AI Visible Cosmetic Condition Observations */}
            <div className="p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-white">AI Visible Condition Observations</h3>
                <span className="text-xs font-bold text-forest-300">
                  Cosmetic Score: {vehicle.aiCosmeticScore} / 10
                </span>
              </div>

              <div className="space-y-2">
                {vehicle.aiCosmeticNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              {/* Strict Disclaimer as required in prompt */}
              <div className="p-3 rounded-xl bg-forest-950/80 border border-forest-900 flex items-start gap-2 text-[11px] text-slate-400">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> AI photo analysis strictly detects visible exterior cosmetic conditions. It does not certify engine health, accident history, or odometer authenticity. In-person physical inspection is always recommended.
                </p>
              </div>
            </div>

            {/* 120-Point Inspection Breakdown */}
            <div className="p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Certified Physical Inspection</h3>
                  <p className="text-xs text-slate-400">Conducted at GEAR UP Inspection Hub</p>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-xl text-forest-300">{vehicle.inspectionScore}</span>
                  <span className="text-xs text-slate-400"> / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-forest-950 border border-forest-900">
                  <p className="text-slate-400 text-[10px]">Engine Compression</p>
                  <p className="font-bold text-white mt-0.5">Pass (4.9/5)</p>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-forest-900">
                  <p className="text-slate-400 text-[10px]">Chassis & Frame Alignment</p>
                  <p className="font-bold text-white mt-0.5">Zero Tilt (Pass)</p>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-forest-900">
                  <p className="text-slate-400 text-[10px]">Tyre Tread Depth</p>
                  <p className="font-bold text-white mt-0.5">4.2mm remaining</p>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-forest-900">
                  <p className="text-slate-400 text-[10px]">Electrical & Wiring</p>
                  <p className="font-bold text-white mt-0.5">OEM Standard</p>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-forest-900">
                  <p className="text-slate-400 text-[10px]">Braking & ABS Sensor</p>
                  <p className="font-bold text-white mt-0.5">Optimal Response</p>
                </div>
                <div className="p-3 rounded-xl bg-forest-950 border border-forest-900">
                  <p className="text-slate-400 text-[10px]">Document Authenticity</p>
                  <p className="font-bold text-emerald-400 mt-0.5">RC & PUC Match</p>
                </div>
              </div>
            </div>

            {/* Vehicle Pickup Locality & Privacy Protection (Phase 4 & 5 Requirement) */}
            <div className="p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-forest-400" />
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">Pickup & Viewing Location</h3>
                    <p className="text-xs text-slate-400">Available for doorstep or partner hub test rides</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-forest-950 text-forest-200 border border-forest-700">
                  {vehicle.pickupLocality || vehicle.area}, {vehicle.city}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-950/80 border border-forest-900 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Public Locality:</span>
                  <span className="font-bold text-white">{vehicle.pickupLocality || vehicle.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Distance from Selected Center:</span>
                  <span className="font-bold text-forest-300">{vehicle.distanceKm !== undefined ? `${vehicle.distanceKm} km` : 'Near City Center'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-forest-900/60">
                  <span className="text-slate-400">Location Privacy Policy:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Exact address revealed upon test ride booking
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Specs & Booking Actions (5 Cols Sticky) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Details Card */}
            <div className="p-6 rounded-3xl bg-[#12221D] border border-forest-700/80 shadow-2xl space-y-5 sticky top-24">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{vehicle.brand} • {vehicle.variant}</span>
                  <span className="text-forest-300 font-bold">{vehicle.area}, {vehicle.city}</span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl text-white">
                  {vehicle.title}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-forest-950/90 border border-forest-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asking Price</span>
                  <div className="font-heading font-extrabold text-3xl text-white">
                    {formatINR(vehicle.price)}
                  </div>
                  {vehicle.originalMrp && (
                    <span className="text-xs text-slate-400 line-through">
                      New MRP: {formatINR(vehicle.originalMrp)}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">Save ~₹{(vehicle.originalMrp ? vehicle.originalMrp - vehicle.price : 0).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400">EMI from ₹3,490/mo</span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-[#0D1815] border border-forest-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-400" />
                  <div>
                    <p className="text-slate-400 text-[10px]">Year / Reg</p>
                    <p className="font-bold text-white">{vehicle.year} ({vehicle.regState})</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1815] border border-forest-900 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-forest-400" />
                  <div>
                    <p className="text-slate-400 text-[10px]">Odometer</p>
                    <p className="font-bold text-white">{vehicle.km.toLocaleString('en-IN')} km</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1815] border border-forest-900 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-forest-400" />
                  <div>
                    <p className="text-slate-400 text-[10px]">Fuel / Battery</p>
                    <p className="font-bold text-white capitalize">{vehicle.fuel}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1815] border border-forest-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-forest-400" />
                  <div>
                    <p className="text-slate-400 text-[10px]">Ownership</p>
                    <p className="font-bold text-white">{vehicle.owners === 1 ? '1st Owner' : `${vehicle.owners} Owners`}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2 border-t border-forest-900 text-xs">
                <h4 className="font-bold text-white">Technical Highlights</h4>
                <div className="space-y-1.5 text-slate-300">
                  {vehicle.specs.powerBhp && (
                    <div className="flex justify-between py-1 border-b border-forest-950">
                      <span className="text-slate-400">Max Power</span>
                      <span className="font-semibold text-white">{vehicle.specs.powerBhp}</span>
                    </div>
                  )}
                  {vehicle.specs.mileageKmpl && (
                    <div className="flex justify-between py-1 border-b border-forest-950">
                      <span className="text-slate-400">Tested Mileage</span>
                      <span className="font-semibold text-white">{vehicle.specs.mileageKmpl} kmpl</span>
                    </div>
                  )}
                  {vehicle.specs.rangeKm && (
                    <div className="flex justify-between py-1 border-b border-forest-950">
                      <span className="text-slate-400">Real-World Range</span>
                      <span className="font-semibold text-emerald-400">{vehicle.specs.rangeKm} km</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-forest-950">
                    <span className="text-slate-400">Insurance Validity</span>
                    <span className="font-semibold text-white">{vehicle.insuranceValidUntil}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">PUC Pollution Certificate</span>
                    <span className="font-semibold text-white">{vehicle.pucValidUntil}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Test Ride & WhatsApp Contact */}
              <div className="space-y-3 pt-3">
                <button
                  onClick={() => setTestRideModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-forest-500 hover:bg-forest-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-glow flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Test Ride</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20your%20${encodeURIComponent(vehicle.title)}%20listed%20on%20GEAR%20UP`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => alert(`Connecting you to ${vehicle.sellerName}: ${vehicle.sellerPhone || '+91 98765 43210'}`)}
                    className="py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 border border-forest-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Seller</span>
                  </button>
                </div>
              </div>

              {/* Resale Studio Cross-Promotion */}
              <div className="p-3.5 rounded-2xl bg-[#162016] border border-gold/40 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-gold-light">Selling a two-wheeler too?</p>
                  <p className="text-[11px] text-slate-300">Boost its resale by up to ₹12,000 with AI</p>
                </div>
                <Link
                  to="/resale-studio"
                  className="px-3 py-1.5 rounded-lg bg-gold hover:bg-gold-light text-slate-950 font-bold text-[11px] transition-colors"
                >
                  Try Studio
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Listings Nearby */}
        <div className="mt-20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-white">Similar Two-Wheelers in {vehicle.city}</h3>
              <p className="text-xs text-slate-400">Discover comparable models within driving distance</p>
            </div>
            <Link to="/explore" className="text-xs font-bold text-forest-300 hover:text-white flex items-center gap-1">
              <span>View More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarBikes.map((bike) => (
              <div
                key={bike.id}
                onClick={() => {
                  navigate(`/bike/${bike.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-2xl overflow-hidden bg-[#101D19] border border-forest-900 hover:border-forest-600 cursor-pointer transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={bike.primaryImage} alt={bike.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-slate-400">{bike.brand} • {bike.year}</p>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{bike.title}</h4>
                  <p className="font-heading font-extrabold text-base text-forest-300 pt-1">{formatINR(bike.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking and Audio Modals */}
      <BookTestRideModal vehicle={testRideModalOpen ? vehicle : null} onClose={() => setTestRideModalOpen(false)} />
      <AudioPlayerModal vehicle={audioModalOpen ? vehicle : null} onClose={() => setAudioModalOpen(false)} />
    </div>
  );
};
