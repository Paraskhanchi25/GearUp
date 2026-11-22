import React, { useState, useEffect } from 'react';
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
  Award, 
  FileCheck2, 
  Lock, 
  ExternalLink, 
  X, 
  FileText, 
  Navigation, 
  Compass, 
  CreditCard, 
  Camera, 
  CheckCircle, 
  Clock, 
  ShieldAlert,
  Layers
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { VehicleListing } from '../types';
import { BookTestRideModal } from '../components/BookTestRideModal';
import { AudioPlayerModal } from '../components/AudioPlayerModal';
import { 
  getPublicTrustSummary, 
  getLocationAccess, 
  createLocationOrder, 
  verifyLocationPayment 
} from '../services/aiApi';

interface BikeDetailPageProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const BikeDetailPage: React.FC<BikeDetailPageProps> = ({ savedIds, onToggleSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Support custom published listings alongside seed listings
  const customListings: VehicleListing[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('gearup_custom_listings') || '[]');
    } catch {
      return [];
    }
  })();
  const allListings = [...customListings, ...SEED_LISTINGS];
  const vehicle = allListings.find((b) => b.id === id) || SEED_LISTINGS[0];

  const [activeImage, setActiveImage] = useState<string>(vehicle.primaryImage);
  const [testRideModalOpen, setTestRideModalOpen] = useState(false);
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [trustModalOpen, setTrustModalOpen] = useState(false);
  const [publicTrust, setPublicTrust] = useState<any>(null);

  // Paid Pickup Location & Ride Access State
  const [currentBuyerId] = useState<string>(() => {
    const b = localStorage.getItem('gearup_buyer_id');
    if (b) return b;
    const newB = 'buyer-' + Math.floor(100 + Math.random() * 900);
    localStorage.setItem('gearup_buyer_id', newB);
    return newB;
  });
  const [locationAccess, setLocationAccess] = useState<any>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [locationOrder, setLocationOrder] = useState<any>(null);
  const [unlockSuccessToast, setUnlockSuccessToast] = useState(false);

  // Load public trust report & location access entitlement
  const refreshLocationAccess = async () => {
    try {
      setIsLocationLoading(true);
      const loc = await getLocationAccess(vehicle.id, currentBuyerId);
      if (loc) {
        setLocationAccess(loc);
      }
    } catch (err) {
      console.warn('Error loading location access:', err);
    } finally {
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getPublicTrustSummary(vehicle.id).then(res => {
      if (isMounted && res) {
        setPublicTrust(res);
      }
    });
    refreshLocationAccess();
    return () => { isMounted = false; };
  }, [vehicle.id, currentBuyerId]);

  const isSaved = savedIds.includes(vehicle.id);
  const similarBikes = SEED_LISTINGS.filter(b => b.category === vehicle.category && b.id !== vehicle.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242923] pb-24">
      {/* Editorial Breadcrumb Header */}
      <div className="border-b border-[#E5E1D7] bg-[#F1EEE5]/80 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#596B59] hover:text-[#242923] font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Collection</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[#77796F] font-mono text-[11px]">ID: {vehicle.id}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Listing link copied to clipboard!');
              }}
              className="p-1.5 rounded-lg bg-white text-[#596B59] hover:text-[#242923] border border-[#E5E1D7] shadow-sm transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleSave(vehicle.id)}
              className="p-1.5 rounded-lg bg-white text-[#77796F] hover:text-red-500 border border-[#E5E1D7] shadow-sm transition-colors"
              title="Save"
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visual Gallery & Detailed AI Reports (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Stage Image & Gallery Presentation */}
            <div className="bg-white rounded-3xl border border-[#E5E1D7] p-3 shadow-subtle overflow-hidden">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#F1EEE5] flex items-center justify-center">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={vehicle.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 space-y-2">
                    <Camera className="w-12 h-12 text-[#77796F]/40 mb-1" />
                    <p className="font-heading font-medium text-base text-[#242923]">No vehicle photos uploaded yet.</p>
                    <p className="text-xs text-[#77796F] max-w-xs">
                      The seller has not uploaded the required vehicle photographs for this listing.
                    </p>
                  </div>
                )}
                
                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-[#242923]/80 backdrop-blur-md text-white">
                    {vehicle.category}
                  </span>
                  {vehicle.batteryHealth && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#879783]/90 backdrop-blur-md text-white flex items-center gap-1 shadow-sm">
                      <Zap className="w-3.5 h-3.5" /> Battery Health: {vehicle.batteryHealth}%
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-[#242923] border border-[#E5E1D7] shadow-sm">
                    {1 + (vehicle.galleryImages?.length || 0)} Certified Photos
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pt-3 px-1 pb-1">
                {[vehicle.primaryImage, ...(vehicle.galleryImages || [])].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img ? 'border-[#879783] shadow-sm scale-105' : 'border-[#E5E1D7] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Rider Audio Story Banner (if available) */}
            {vehicle.audioStory && (
              <div className="p-5 rounded-3xl bg-[#F1EEE5] border border-[#E5D9C7] flex items-center justify-between shadow-subtle">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white text-[#596B59] flex items-center justify-center border border-[#E5E1D7] shadow-sm">
                    <Volume2 className="w-5 h-5 text-[#879783]" />
                  </div>
                  <div>
                    <h4 className="font-heading font-medium text-sm text-[#242923]">Listen to Owner&apos;s Voice Note</h4>
                    <p className="text-xs text-[#77796F]">
                      {vehicle.audioStory.speakerName} shares ownership history & route habits ({vehicle.audioStory.duration}s)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAudioModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs transition-colors shadow-sm"
                >
                  Play Audio
                </button>
              </div>
            )}

            {/* AI Fair-Price Assessment Gauge Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#879783]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-medium text-[#242923]">AI Fair-Price Valuation</h3>
                    <p className="text-xs text-[#77796F]">Trained on 45,000+ verified Indian two-wheeler transactions</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1EEE5] text-[#596B59] border border-[#E5D9C7] uppercase tracking-wider">
                  {vehicle.aiDealBadge.replace('_', ' ')}
                </span>
              </div>

              {/* Price Range Meter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-[#77796F]">
                  <span>Market Low: <strong className="text-[#242923]">{formatINR(vehicle.aiFairPriceMin)}</strong></span>
                  <span className="text-[#596B59] font-semibold">Suggested: {formatINR(vehicle.aiSuggestedPrice)}</span>
                  <span>Market High: <strong className="text-[#242923]">{formatINR(vehicle.aiFairPriceMax)}</strong></span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#F1EEE5] border border-[#E5E1D7] relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-[#879783] to-[#596B59] rounded-full"
                    style={{ left: '20%', right: '20%' }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-2.5 bg-white rounded-full shadow-md border border-[#879783]"
                    style={{ left: '48%' }}
                  />
                </div>
                <p className="text-xs text-[#77796F] leading-relaxed pt-1">
                  Asking price (<strong className="text-[#242923]">{formatINR(vehicle.price)}</strong>) is directly aligned with true market residual values for a {vehicle.year} model with {vehicle.km.toLocaleString('en-IN')} km.
                </p>
              </div>
            </div>

            {/* AI Visible Cosmetic Condition Observations */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-medium text-[#242923]">Cosmetic Condition Observations</h3>
                <span className="text-xs font-semibold text-[#596B59] bg-[#F1EEE5] px-3 py-1 rounded-full border border-[#E5D9C7]">
                  Cosmetic Score: {vehicle.aiCosmeticScore} / 10
                </span>
              </div>

              <div className="space-y-2.5">
                {vehicle.aiCosmeticNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#242923]">
                    <CheckCircle2 className="w-4 h-4 text-[#879783] flex-shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] flex items-start gap-2 text-xs text-[#77796F]">
                <AlertCircle className="w-4 h-4 text-[#879783] flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> AI photo analysis strictly detects visible exterior cosmetic conditions. It does not certify engine health, accident history, or odometer authenticity. In-person physical inspection is always recommended.
                </p>
              </div>
            </div>

            {/* 120-Point Inspection Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-medium text-[#242923]">Certified Physical Inspection</h3>
                  <p className="text-xs text-[#77796F]">Conducted at GEAR UP Inspection Hub</p>
                </div>
                <div className="text-right">
                  <span className="font-heading font-medium text-2xl text-[#596B59]">{vehicle.inspectionScore}</span>
                  <span className="text-xs text-[#77796F]"> / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7]">
                  <p className="text-[#77796F] text-[10px]">Engine Compression</p>
                  <p className="font-semibold text-[#242923] mt-0.5">Pass (4.9/5)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7]">
                  <p className="text-[#77796F] text-[10px]">Chassis & Frame Alignment</p>
                  <p className="font-semibold text-[#242923] mt-0.5">Zero Tilt (Pass)</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7]">
                  <p className="text-[#77796F] text-[10px]">Tyre Tread Depth</p>
                  <p className="font-semibold text-[#242923] mt-0.5">4.2mm remaining</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7]">
                  <p className="text-[#77796F] text-[10px]">Electrical & Wiring</p>
                  <p className="font-semibold text-[#242923] mt-0.5">OEM Standard</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7]">
                  <p className="text-[#77796F] text-[10px]">Braking & ABS Sensor</p>
                  <p className="font-semibold text-[#242923] mt-0.5">Optimal Response</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7]">
                  <p className="text-[#77796F] text-[10px]">Document Authenticity</p>
                  <p className="font-semibold text-[#596B59] mt-0.5">RC & PUC Match</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/inspect/${vehicle.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Launch 3D Digital Twin Inspection</span>
                </Link>
              </div>
            </div>

            {/* GEAR UP Comprehensive Document Verification */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center border border-[#E5D9C7]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-medium text-[#242923]">GEAR UP Verification</h3>
                    <p className="text-xs text-[#77796F]">Multi-level document & ownership readiness verification</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#F1EEE5] text-[#596B59] border border-[#E5D9C7] uppercase tracking-wider">
                  {publicTrust?.badge_label || (vehicle.documentVerified ? 'Document Verified' : 'Partially Verified')}
                </span>
              </div>

              {/* Public Safe Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {(publicTrust?.verified_checks || [
                  { category: 'Registration', title: 'RC Certificate Consistency', status: 'Details Matched with Listing', details: 'Engine & chassis match, single owner, commercial loan hypothecation checked.', is_passed: true },
                  { category: 'Compliance', title: 'Insurance & PUC Expiry', status: `Valid until ${vehicle.insuranceValidUntil}`, details: 'Active comprehensive insurance and emission compliance verified.', is_passed: true },
                  { category: 'Condition', title: 'Condition & Service History', status: 'OEM Workshop Serviced', details: 'Periodic maintenance bills and tyre tread depth inspected.', is_passed: true },
                  { category: 'Ownership & NOC', title: 'Transfer Authorisation', status: 'Seller Identity Confirmed', details: 'Form 29/30 transfer readiness checked. Zero active bank lien.', is_passed: true }
                ]).map((check: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#77796F] uppercase tracking-wider">{check.category}</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-[#596B59]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                      </span>
                    </div>
                    <p className="font-medium text-[#242923] text-xs">{check.title}</p>
                    <p className="text-[11px] text-[#77796F]">{check.status}</p>
                    <p className="text-[10px] text-[#77796F]/80 leading-relaxed pt-0.5">{check.details}</p>
                  </div>
                ))}
              </div>

              {/* Masked Info & Privacy Protection Callout */}
              <div className="p-4 rounded-2xl bg-[#F1EEE5] border border-[#E5D9C7] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#596B59] flex-shrink-0" />
                  <span className="text-[#77796F] text-xs">
                    Registration No: <strong className="text-[#242923] font-mono">{publicTrust?.masked_registration || `${vehicle.regState}•••••${vehicle.id.slice(-2)}`}</strong>
                  </span>
                </div>
                <button
                  onClick={() => setTrustModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F7F5EF] text-[#242923] border border-[#E5E1D7] font-medium text-xs flex items-center gap-1 transition-colors shadow-sm"
                >
                  <span>View Trust Report</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#596B59]" />
                </button>
              </div>

              <p className="text-[11px] text-[#77796F] italic">
                * GEAR UP Verification confirms submitted seller document consistency. Official government transfer requires RTO processing. Sensitive identification numbers are masked for privacy.
              </p>
            </div>

            {/* PAID PICKUP / MEETUP LOCATION & RIDE ACCESS */}
            <div className={`p-6 rounded-3xl border transition-all ${
              locationAccess?.is_unlocked
                ? 'bg-white border-[#879783] shadow-elevated'
                : 'bg-white border-[#E5E1D7] shadow-subtle'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    locationAccess?.is_unlocked ? 'bg-[#F1EEE5] text-[#596B59]' : 'bg-[#F1EEE5] text-[#596B59]'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-medium text-[#242923]">
                      {locationAccess?.is_unlocked ? 'Exact Meetup & Test Ride Location' : 'Unlock Pickup & Ride Location'}
                    </h3>
                    <p className="text-xs text-[#77796F]">
                      {locationAccess?.is_unlocked
                        ? 'Verified inspection address & navigation coordinates'
                        : 'Exact meetup address and inspection pin protected by GEAR UP gate'}
                    </p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  locationAccess?.is_unlocked
                    ? 'bg-[#F1EEE5] text-[#596B59] border border-[#E5D9C7]'
                    : 'bg-[#F1EEE5] text-[#77796F] border border-[#E5D9C7]'
                }`}>
                  {locationAccess?.is_unlocked ? 'UNLOCKED • 7 DAYS ACTIVE' : `₹${locationAccess?.access_fee_inr || 49} ACCESS FEE`}
                </span>
              </div>

              {locationAccess?.is_unlocked ? (
                /* UNLOCKED VIEW */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-2.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-[#596B59] uppercase tracking-wider">Exact Meetup Address</span>
                        <p className="font-medium text-[#242923] text-sm mt-0.5">{locationAccess.exact_address}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-[#596B59] text-[10px] font-semibold border border-[#E5E1D7] flex-shrink-0">
                        {locationAccess.days_remaining} Days Left
                      </span>
                    </div>

                    {locationAccess.landmark && (
                      <div className="flex items-center gap-1.5 text-[#77796F]">
                        <Compass className="w-3.5 h-3.5 text-[#596B59] flex-shrink-0" />
                        <span>Landmark: <strong className="text-[#242923]">{locationAccess.landmark}</strong></span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E5E1D7] text-xs">
                      <div>
                        <span className="text-[#77796F]">Meetup Spot Type:</span>
                        <p className="font-medium text-[#242923]">{locationAccess.meetup_spot_type || 'Safe Public Hub'}</p>
                      </div>
                      <div>
                        <span className="text-[#77796F]">Test Ride Policy:</span>
                        <p className={`font-medium ${locationAccess.test_ride_available ? 'text-[#596B59]' : 'text-[#77796F]'}`}>
                          {locationAccess.test_ride_available ? '✓ Test Rides Permitted with DL' : 'Inspection Only'}
                        </p>
                      </div>
                    </div>

                    {locationAccess.pickup_instructions && (
                      <div className="pt-2 border-t border-[#E5E1D7] text-xs">
                        <span className="text-[#77796F]">Seller Instructions:</span>
                        <p className="text-[#242923] italic mt-0.5">&ldquo;{locationAccess.pickup_instructions}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  {/* Directions Button */}
                  <div className="flex items-center gap-3">
                    <a
                      href={locationAccess.directions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F5EF] border border-[#E5E1D7] text-[11px] text-[#77796F] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#879783] flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Safety Reminder:</strong> Meet in daylight at the agreed public hub. Inspect vehicle documents and carry an original driving licence and helmet before initiating a test ride.
                    </p>
                  </div>
                </div>
              ) : (
                /* LOCKED VIEW */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#77796F]">Approximate Viewing Area:</span>
                      <span className="font-medium text-[#242923]">
                        {locationAccess?.approximate_locality || vehicle.area}, {locationAccess?.approximate_city || vehicle.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#77796F]">Test Ride Option:</span>
                      <span className={`font-medium ${locationAccess?.test_ride_available ? 'text-[#596B59]' : 'text-[#77796F]'}`}>
                        {locationAccess?.test_ride_available ? 'Offered by Seller' : 'Inspection Only'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#E5E1D7]">
                      <span className="text-[#77796F]">Privacy Status:</span>
                      <span className="text-[#596B59] font-medium flex items-center gap-1 text-xs">
                        <Lock className="w-3.5 h-3.5" /> Exact address revealed upon verified unlock
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#77796F]">
                    <p className="font-medium text-[#242923]">Want to inspect or test ride this vehicle?</p>
                    <p className="text-xs leading-relaxed">
                      Unlock the seller&apos;s verified meetup location and pickup schedule to arrange your in-person visit.
                    </p>
                    <ul className="text-xs text-[#242923] space-y-1 pt-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#879783] flex-shrink-0" />
                        <span>Exact street address, landmark & GPS coordinates</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#879783] flex-shrink-0" />
                        <span>Seller inspection instructions & test ride schedule</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#879783] flex-shrink-0" />
                        <span>Valid for 7 full days from purchase</span>
                      </li>
                    </ul>
                  </div>

                  {/* Payment Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const ord = await createLocationOrder({
                            listing_id: vehicle.id,
                            buyer_id: currentBuyerId,
                            buyer_name: 'Verified Buyer',
                            buyer_email: 'buyer@gearup.in'
                          });
                          if (ord.status === 'already_unlocked') {
                            alert('You already possess active access to this seller location!');
                            await refreshLocationAccess();
                            return;
                          }
                          setLocationOrder(ord);
                          setPaymentModalOpen(true);
                        } catch (err: any) {
                          alert('Error creating location order: ' + err.message);
                        }
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlock Location — ₹{locationAccess?.access_fee_inr || 49}</span>
                    </button>
                    <p className="text-[11px] text-[#77796F] text-center mt-2 italic">
                      * One-time ₹49 fee is for GEAR UP&apos;s verified location-access service, not a payment for the vehicle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing, Specs & Booking Actions (5 Cols Sticky) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] shadow-elevated space-y-6 sticky top-24">
              <div>
                <div className="flex items-center justify-between text-xs text-[#77796F] mb-1.5">
                  <span className="font-medium">{vehicle.brand} • {vehicle.variant}</span>
                  <span className="text-[#596B59] font-medium">{vehicle.area}, {vehicle.city}</span>
                </div>
                <h1 className="font-heading font-medium text-2xl sm:text-3xl text-[#242923] tracking-tight">
                  {vehicle.title}
                </h1>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F1EEE5] text-[#596B59] border border-[#E5D9C7]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{publicTrust?.badge_label || (vehicle.documentVerified ? 'Document Verified' : 'Partially Verified')}</span>
                  </span>
                  <button
                    onClick={() => setTrustModalOpen(true)}
                    className="text-xs font-medium text-[#596B59] hover:text-[#242923] underline underline-offset-2 flex items-center gap-0.5"
                  >
                    <span>Trust Report</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#77796F] tracking-wider">Asking Price</span>
                  <div className="font-heading font-medium text-3xl text-[#242923]">
                    {formatINR(vehicle.price)}
                  </div>
                  {vehicle.originalMrp && (
                    <span className="text-xs text-[#77796F] line-through">
                      New MRP: {formatINR(vehicle.originalMrp)}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-[#596B59] block">
                    Save ~₹{(vehicle.originalMrp ? vehicle.originalMrp - vehicle.price : 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#77796F]">EMI from ₹3,490/mo</span>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#879783]" />
                  <div>
                    <p className="text-[#77796F] text-[10px]">Year / Reg</p>
                    <p className="font-medium text-[#242923]">{vehicle.year} ({vehicle.regState})</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-[#879783]" />
                  <div>
                    <p className="text-[#77796F] text-[10px]">Odometer</p>
                    <p className="font-medium text-[#242923]">{vehicle.km.toLocaleString('en-IN')} km</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] flex items-center gap-2.5">
                  <Fuel className="w-4 h-4 text-[#879783]" />
                  <div>
                    <p className="text-[#77796F] text-[10px]">Fuel / Battery</p>
                    <p className="font-medium text-[#242923] capitalize">{vehicle.fuel}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#879783]" />
                  <div>
                    <p className="text-[#77796F] text-[10px]">Ownership</p>
                    <p className="font-medium text-[#242923]">{vehicle.owners === 1 ? '1st Owner' : `${vehicle.owners} Owners`}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2 border-t border-[#E5E1D7] text-xs">
                <h4 className="font-heading font-medium text-sm text-[#242923]">Technical Highlights</h4>
                <div className="space-y-2 text-[#77796F]">
                  {vehicle.specs.powerBhp && (
                    <div className="flex justify-between py-1 border-b border-[#F1EEE5]">
                      <span>Max Power</span>
                      <span className="font-medium text-[#242923]">{vehicle.specs.powerBhp}</span>
                    </div>
                  )}
                  {vehicle.specs.mileageKmpl && (
                    <div className="flex justify-between py-1 border-b border-[#F1EEE5]">
                      <span>Tested Mileage</span>
                      <span className="font-medium text-[#242923]">{vehicle.specs.mileageKmpl} kmpl</span>
                    </div>
                  )}
                  {vehicle.specs.rangeKm && (
                    <div className="flex justify-between py-1 border-b border-[#F1EEE5]">
                      <span>Real-World Range</span>
                      <span className="font-medium text-[#596B59]">{vehicle.specs.rangeKm} km</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-[#F1EEE5]">
                    <span>Insurance Validity</span>
                    <span className="font-medium text-[#242923]">{vehicle.insuranceValidUntil}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>PUC Pollution Certificate</span>
                    <span className="font-medium text-[#242923]">{vehicle.pucValidUntil}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Test Ride & WhatsApp Contact */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setTestRideModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Test Ride</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20your%20${encodeURIComponent(vehicle.title)}%20listed%20on%20GEAR%20UP`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-[#596B59] hover:bg-[#354638] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => alert(`Connecting you to ${vehicle.sellerName}: ${vehicle.sellerPhone || '+91 98765 43210'}`)}
                    className="py-2.5 rounded-xl bg-white hover:bg-[#F7F5EF] border border-[#E5E1D7] text-[#242923] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-[#596B59]" />
                    <span>Call Seller</span>
                  </button>
                </div>
              </div>

              {/* Resale Studio Cross-Promotion */}
              <div className="p-4 rounded-2xl bg-[#F1EEE5] border border-[#E5D9C7] flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-[#242923]">Selling a motorcycle too?</p>
                  <p className="text-[11px] text-[#77796F]">Boost resale value by up to ₹12,000 with AI</p>
                </div>
                <Link
                  to="/resale-studio"
                  className="px-3.5 py-1.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs transition-colors shadow-sm"
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
              <h3 className="font-heading font-medium text-2xl text-[#242923]">Similar Two-Wheelers in {vehicle.city}</h3>
              <p className="text-xs text-[#77796F]">Discover comparable verified models within driving distance</p>
            </div>
            <Link to="/explore" className="text-xs font-medium text-[#596B59] hover:text-[#242923] flex items-center gap-1">
              <span>View Full Collection</span>
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
                className="rounded-3xl overflow-hidden bg-white border border-[#E5E1D7] hover:border-[#879783] hover:shadow-elevated cursor-pointer transition-all p-3"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#F1EEE5]">
                  <img src={bike.primaryImage} alt={bike.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-[#77796F]">{bike.brand} • {bike.year}</p>
                  <h4 className="font-heading font-medium text-base text-[#242923] line-clamp-1">{bike.title}</h4>
                  <p className="font-heading font-medium text-base text-[#596B59] pt-1">{formatINR(bike.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking and Audio Modals */}
      <BookTestRideModal vehicle={testRideModalOpen ? vehicle : null} onClose={() => setTestRideModalOpen(false)} />
      <AudioPlayerModal vehicle={audioModalOpen ? vehicle : null} onClose={() => setAudioModalOpen(false)} />

      {/* Public Trust & Verification Report Modal */}
      {trustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242923]/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#E5E1D7] shadow-elevated p-6 sm:p-8 space-y-6 text-[#242923]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E5E1D7] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center border border-[#E5D9C7]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#596B59]">Official Buyer Trust Report</span>
                  <h3 className="font-heading font-medium text-xl text-[#242923]">
                    {vehicle.title}
                  </h3>
                  <p className="text-xs text-[#77796F] flex items-center gap-2 mt-0.5">
                    <span>Masked Reg: <strong className="text-[#242923] font-mono">{publicTrust?.masked_registration || `${vehicle.regState}•••••${vehicle.id.slice(-2)}`}</strong></span>
                    <span>•</span>
                    <span>Location: {vehicle.area}, {vehicle.city}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTrustModalOpen(false)}
                className="p-2 rounded-xl bg-[#F7F5EF] text-[#77796F] hover:text-[#242923] border border-[#E5E1D7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Status Banner */}
            <div className="p-4 rounded-2xl bg-[#F1EEE5] border border-[#E5D9C7] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#596B59] uppercase tracking-wider">Verification Status</span>
                <h4 className="font-heading font-medium text-base text-[#242923] capitalize mt-0.5">
                  {publicTrust?.badge_label || 'GEAR UP Document Verified'}
                </h4>
                <p className="text-xs text-[#77796F] mt-0.5">
                  Multi-level OCR document consistency and ownership readiness checks completed.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white text-[#596B59] border border-[#E5E1D7] font-mono text-xs font-semibold shadow-sm">
                Level 1–3 Cleared
              </span>
            </div>

            {/* Detailed Verification Checks */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#77796F]">Verified Checkpoints</h4>
              <div className="space-y-2.5">
                {(publicTrust?.verified_checks || [
                  {
                    category: 'Registration Document (RC)',
                    title: 'RC Certificate Consistency Check',
                    status: 'Matched',
                    details: 'Chassis number prefix, engine number prefix, fuel type, and registration state match listing attributes.',
                    is_passed: true
                  },
                  {
                    category: 'Insurance Certificate',
                    title: 'Active Policy Validation',
                    status: `Valid until ${vehicle.insuranceValidUntil}`,
                    details: 'Valid comprehensive third-party/own-damage policy uploaded and verified against expiry.',
                    is_passed: true
                  },
                  {
                    category: 'Pollution Under Control (PUC)',
                    title: 'Emission Compliance Check',
                    status: `Valid until ${vehicle.pucValidUntil}`,
                    details: 'Current pollution under control certificate uploaded and verified.',
                    is_passed: true
                  },
                  {
                    category: 'Maintenance & Service Records',
                    title: 'Service History Disclosure',
                    status: 'OEM Standard',
                    details: 'Periodic maintenance bills and regular service center invoices uploaded by seller.',
                    is_passed: true
                  },
                  {
                    category: 'Ownership & Legal Title',
                    title: 'Seller Authorisation & Transfer Readiness',
                    status: 'Clear Title',
                    details: 'Seller identified as registered owner. Form 29 & Form 30 transfer documentation prepared. No active bank hypothecation found.',
                    is_passed: true
                  }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#242923] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#879783] flex-shrink-0" />
                        <span>{item.title}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#596B59] border border-[#E5E1D7]">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#77796F] pl-6 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Shield Notice */}
            <div className="p-4 rounded-2xl bg-[#F1EEE5] border border-[#E5D9C7] flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#596B59] flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-medium text-[#242923]">Seller Privacy & Identity Shield</p>
                <p className="text-[#77796F] leading-relaxed">
                  To protect seller privacy against identity theft and misuse, full unmasked registration numbers, chassis/engine serial numbers, and raw government document images are kept secure in encrypted storage and never exposed on public pages.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTrustModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs transition-colors shadow-sm"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paid Location Unlock Checkout Modal */}
      {paymentModalOpen && locationOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#242923]/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#E5E1D7] p-6 sm:p-8 space-y-5 shadow-elevated">
            <div className="flex items-center justify-between border-b border-[#E5E1D7] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-medium text-base text-[#242923]">Location Access Checkout</h3>
                  <p className="text-[10px] text-[#77796F]">Order: {locationOrder.order_id}</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F7F5EF] border border-[#E5E1D7] flex items-center justify-center text-[#77796F] hover:text-[#242923]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E5E1D7] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#77796F]">Target Vehicle:</span>
                <span className="font-medium text-[#242923]">{vehicle.year} {vehicle.brand} {vehicle.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77796F]">Service:</span>
                <span className="font-medium text-[#596B59]">Exact Pickup Pin & Test Ride Details</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77796F]">Access Duration:</span>
                <span className="font-medium text-[#242923]">7 Full Days Access</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E1D7] font-semibold text-sm">
                <span className="text-[#242923]">Amount Payable:</span>
                <span className="text-[#596B59] font-heading text-lg">₹{locationOrder.amount_inr || 49}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={async () => {
                  setIsProcessingPayment(true);
                  try {
                    const paymentId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase();
                    const res = await verifyLocationPayment({
                      listing_id: vehicle.id,
                      buyer_id: currentBuyerId,
                      order_id: locationOrder.order_id,
                      payment_id: paymentId,
                      signature: 'mock_sandbox_sig',
                      buyer_name: 'Verified Buyer'
                    });
                    if (res && res.status === 'success') {
                      setPaymentModalOpen(false);
                      setUnlockSuccessToast(true);
                      setTimeout(() => setUnlockSuccessToast(false), 5000);
                      await refreshLocationAccess();
                    }
                  } catch (err: any) {
                    alert('Payment Verification Failed: ' + err.message);
                  } finally {
                    setIsProcessingPayment(false);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Transaction...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Pay ₹{locationOrder.amount_inr || 49}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-[#F7F5EF] text-[#77796F] hover:text-[#242923] text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unlock Success Notification Toast */}
      {unlockSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-white border border-[#879783] text-[#242923] text-xs shadow-elevated flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#879783] flex-shrink-0" />
          <div>
            <p className="font-semibold text-[#242923]">Location Unlocked Successfully!</p>
            <p className="text-[11px] text-[#77796F]">Exact meetup address and navigation directions are now visible.</p>
          </div>
        </div>
      )}
    </div>
  );
};
