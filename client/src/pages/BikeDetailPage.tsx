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
import { formatINR } from '../utils/geo';
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
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      {/* Top Breadcrumb */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>Back to listings</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Listing ID: {vehicle.id}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Listing link copied to clipboard!');
              }}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(vehicle.id)}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-red-500 border border-slate-200"
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
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-elevated">
              <img
                src={activeImage}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 shadow-sm uppercase tracking-wider">
                  {vehicle.category}
                </span>
                {vehicle.batteryHealth && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 backdrop-blur-md text-emerald-800 border border-emerald-200 shadow-sm flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" /> Battery Health: {vehicle.batteryHealth}%
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
                    activeImage === img ? 'border-blue-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Rider Audio Story Banner (if available) */}
            {vehicle.audioStory && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
                    <Volume2 className="w-5 h-5 animate-pulse text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-amber-900">Listen to Seller&apos;s Ride Story</h4>
                    <p className="text-[11px] text-amber-700">
                      {vehicle.audioStory.speakerName} shares ownership history & route habits ({vehicle.audioStory.duration}s)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAudioModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Play Audio
                </button>
              </div>
            )}

            {/* AI Fair-Price Assessment Gauge Box */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">AI Fair-Price Assessment</h3>
                    <p className="text-xs text-slate-500">Trained on 45,000+ Indian two-wheeler transactions</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                  {vehicle.aiDealBadge.replace('_', ' ')}
                </span>
              </div>

              {/* Price Range Meter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Market Low: {formatINR(vehicle.aiFairPriceMin)}</span>
                  <span className="text-emerald-700 font-bold">Suggested: {formatINR(vehicle.aiSuggestedPrice)}</span>
                  <span>Market High: {formatINR(vehicle.aiFairPriceMax)}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-200 relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                    style={{ left: '20%', right: '20%' }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-2.5 bg-slate-900 rounded-full shadow-sm"
                    style={{ left: '48%' }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Asking price ({formatINR(vehicle.price)}) is directly aligned with true market residual values for a {vehicle.year} model with {vehicle.km.toLocaleString('en-IN')} km.
                </p>
              </div>
            </div>

            {/* AI Visible Cosmetic Condition Observations */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-slate-900">AI Visible Condition Observations</h3>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Cosmetic Score: {vehicle.aiCosmeticScore} / 10
                </span>
              </div>

              <div className="space-y-2">
                {vehicle.aiCosmeticNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              {/* Strict Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-500">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> AI photo analysis strictly detects visible exterior cosmetic conditions. It does not certify engine internals or hidden accidents. In-person physical inspection is always recommended.
                </p>
              </div>
            </div>

            {/* 120-Point Inspection Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">Certified Physical Inspection</h3>
                  <p className="text-xs text-slate-500">Conducted at GEAR UP Inspection Hub</p>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-xl text-emerald-700">{vehicle.inspectionScore}</span>
                  <span className="text-xs text-slate-400"> / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] font-medium">Engine Compression</p>
                  <p className="font-bold text-slate-900 mt-0.5">Pass (4.9/5)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] font-medium">Chassis & Frame Alignment</p>
                  <p className="font-bold text-slate-900 mt-0.5">Zero Tilt (Pass)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] font-medium">Tyre Tread Depth</p>
                  <p className="font-bold text-slate-900 mt-0.5">4.2mm remaining</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] font-medium">Electrical & Wiring</p>
                  <p className="font-bold text-slate-900 mt-0.5">OEM Standard</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] font-medium">Braking & ABS Sensor</p>
                  <p className="font-bold text-slate-900 mt-0.5">Optimal Response</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[10px] font-medium">Document Authenticity</p>
                  <p className="font-bold text-emerald-700 mt-0.5">RC & PUC Match</p>
                </div>
              </div>
            </div>

            {/* Vehicle Pickup Locality & Privacy Protection */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">Pickup & Viewing Location</h3>
                    <p className="text-xs text-slate-500">Available for doorstep or partner hub test rides</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                  {vehicle.pickupLocality || vehicle.area}, {vehicle.city}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Public Locality:</span>
                  <span className="font-bold text-slate-900">{vehicle.pickupLocality || vehicle.area}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Distance from Selected Center:</span>
                  <span className="font-bold text-blue-600">{vehicle.distanceKm !== undefined ? `${vehicle.distanceKm} km` : 'Near City Center'}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Location Privacy Policy:</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Exact address revealed upon test ride booking
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Specs & Booking Actions (5 Cols Sticky) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-elevated space-y-5 sticky top-24">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{vehicle.brand} • {vehicle.variant}</span>
                  <span className="text-blue-600 font-semibold">{vehicle.area}, {vehicle.city}</span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl text-slate-900">
                  {vehicle.title}
                </h1>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asking Price</span>
                  <div className="font-heading font-extrabold text-3xl text-slate-900">
                    {formatINR(vehicle.price)}
                  </div>
                  {vehicle.originalMrp && (
                    <span className="text-xs text-slate-400 line-through">
                      New MRP: {formatINR(vehicle.originalMrp)}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 block">Save ~₹{(vehicle.originalMrp ? vehicle.originalMrp - vehicle.price : 0).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-500">EMI from ₹3,490/mo</span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-[10px]">Year / Reg</p>
                    <p className="font-bold text-slate-900">{vehicle.year} ({vehicle.regState})</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-[10px]">Odometer</p>
                    <p className="font-bold text-slate-900">{vehicle.km.toLocaleString('en-IN')} km</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-[10px]">Fuel / Battery</p>
                    <p className="font-bold text-slate-900 capitalize">{vehicle.fuel}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-[10px]">Ownership</p>
                    <p className="font-bold text-slate-900">{vehicle.owners === 1 ? '1st Owner' : `${vehicle.owners} Owners`}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <h4 className="font-bold text-slate-900">Technical Highlights</h4>
                <div className="space-y-1.5 text-slate-600">
                  {vehicle.specs.powerBhp && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Max Power</span>
                      <span className="font-semibold text-slate-900">{vehicle.specs.powerBhp}</span>
                    </div>
                  )}
                  {vehicle.specs.mileageKmpl && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Tested Mileage</span>
                      <span className="font-semibold text-slate-900">{vehicle.specs.mileageKmpl} kmpl</span>
                    </div>
                  )}
                  {vehicle.specs.rangeKm && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Real-World Range</span>
                      <span className="font-semibold text-emerald-700">{vehicle.specs.rangeKm} km</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Insurance Validity</span>
                    <span className="font-semibold text-slate-900">{vehicle.insuranceValidUntil}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">PUC Pollution Certificate</span>
                    <span className="font-semibold text-slate-900">{vehicle.pucValidUntil}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Test Ride & WhatsApp Contact */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setTestRideModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Test Ride</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20your%20${encodeURIComponent(vehicle.title)}%20listed%20on%20GEAR%20UP`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => alert(`Connecting you to ${vehicle.sellerName}: ${vehicle.sellerPhone || '+91 98765 43210'}`)}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span>Call Seller</span>
                  </button>
                </div>
              </div>

              {/* Resale Studio Cross-Promotion */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-amber-900">Selling a two-wheeler too?</p>
                  <p className="text-[11px] text-amber-700">Boost its resale by up to ₹12,000 with AI</p>
                </div>
                <Link
                  to="/resale-studio"
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors shadow-sm"
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
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">Similar Two-Wheelers in {vehicle.city}</h3>
              <p className="text-xs text-slate-500">Discover comparable models within driving distance</p>
            </div>
            <Link to="/explore" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
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
                className="rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-elevated cursor-pointer transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  <img src={bike.primaryImage} alt={bike.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-slate-500">{bike.brand} • {bike.year}</p>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{bike.title}</h4>
                  <p className="font-heading font-extrabold text-base text-slate-900 pt-1">{formatINR(bike.price)}</p>
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
