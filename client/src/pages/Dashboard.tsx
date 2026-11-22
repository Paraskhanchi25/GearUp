import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Wrench, 
  Clock, 
  Activity, 
  FileText, 
  User, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  DollarSign,
  Navigation,
  ExternalLink,
  Compass
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { Link } from 'react-router-dom';
import { getBuyerPurchases, getListingFeeStatus, getPlatformFeeConfig } from '../services/aiApi';
import { PlatformListingFeeModal } from '../components/PlatformListingFeeModal';
import { 
  CreditCard, 
  RotateCcw, 
  Plus, 
  AlertCircle 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer' | 'admin'>('dealer');
  const [buyerPurchases, setBuyerPurchases] = useState<any[]>([]);
  const [sellerListings, setSellerListings] = useState<any[]>([]);
  const [feeConfig, setFeeConfig] = useState<any>({ listing_fee_inr: 299, currency: 'INR' });
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    listingId: string;
    vehicleTitle: string;
  }>({
    isOpen: false,
    listingId: '',
    vehicleTitle: ''
  });

  const loadSellerData = async () => {
    try {
      const cfg = await getPlatformFeeConfig().catch(() => null);
      if (cfg) setFeeConfig(cfg);

      const customListings = JSON.parse(localStorage.getItem('gearup_custom_listings') || '[]');
      
      // Also inspect active draft in local storage
      const activeDraftId = localStorage.getItem('gearup_current_listing_id');
      const draftDataRaw = activeDraftId ? localStorage.getItem('gearup_seller_draft_' + activeDraftId) : null;
      let draftItem: any = null;
      if (draftDataRaw && activeDraftId) {
        try {
          const parsed = JSON.parse(draftDataRaw);
          draftItem = {
            id: activeDraftId,
            title: `${parsed.year || 2023} ${parsed.brand || 'Vehicle'} ${parsed.model || ''}`,
            price: parsed.askingPrice || 0,
            km: parsed.km || 0,
            area: parsed.city || 'Chandigarh',
            primaryImage: '',
            isDraft: true,
            status: 'draft'
          };
        } catch (e) {}
      }

      const allListings = [...customListings];
      if (draftItem && !allListings.some(l => l.id === draftItem.id)) {
        allListings.unshift(draftItem);
      }

      // If empty, add a demonstration seller listing
      if (allListings.length === 0) {
        allListings.push({
          id: 'GEAR-UP-101',
          title: '2023 Royal Enfield Classic 350 Stealth Black',
          price: 182000,
          km: 14000,
          area: 'Sector 17, Chandigarh',
          primaryImage: SEED_LISTINGS[0]?.primaryImage || '',
          isPublished: true,
          status: 'published',
          paymentStatus: 'paid'
        });
      }

      // Fetch payment statuses from backend for each listing
      const enriched = await Promise.all(
        allListings.map(async (item) => {
          try {
            const st = await getListingFeeStatus(item.id);
            return {
              ...item,
              paymentInfo: st,
              status: item.isDraft
                ? (st.status === 'payment_failed' ? 'payment_failed' : 'awaiting_payment')
                : (st.is_paid ? 'published' : st.status)
            };
          } catch (e) {
            return {
              ...item,
              paymentInfo: { is_paid: item.paymentStatus === 'paid', status: item.paymentStatus || 'paid' },
              status: item.status || 'published'
            };
          }
        })
      );

      setSellerListings(enriched);
    } catch (err) {
      console.warn('Error loading seller data:', err);
    }
  };

  useEffect(() => {
    const buyerId = localStorage.getItem('gearup_buyer_id') || 'buyer-101';
    getBuyerPurchases(buyerId).then(res => {
      if (res && res.purchases) {
        setBuyerPurchases(res.purchases);
      }
    });

    loadSellerData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar with Role Switcher (Apple Liquid Glass Style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#35483C] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              DJ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#85857E]">Welcome Back,</span>
                <h2 className="font-heading font-bold text-xl text-[#242622] tracking-tight">David John (Tri-City Motors)</h2>
              </div>
              <p className="text-xs text-[#35483C] font-semibold mt-0.5">Verified GEAR UP Partner Dealer • Sector 17, Chandigarh</p>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-1.5 rounded-full border border-[#242622]/10 text-xs font-mono font-medium overflow-x-auto">
            <button
              onClick={() => setRole('dealer')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 tactile-btn ${role === 'dealer' ? 'bg-[#35483C] text-white shadow-sm font-bold' : 'text-[#85857E] hover:text-[#242622]'}`}
            >
              Dealer Portal
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 tactile-btn ${role === 'seller' ? 'bg-[#35483C] text-white shadow-sm font-bold' : 'text-[#85857E] hover:text-[#242622]'}`}
            >
              Seller View
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 tactile-btn ${role === 'buyer' ? 'bg-[#35483C] text-white shadow-sm font-bold' : 'text-[#85857E] hover:text-[#242622]'}`}
            >
              Buyer View
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 tactile-btn ${role === 'admin' ? 'bg-[#35483C] text-white shadow-sm font-bold' : 'text-[#85857E] hover:text-[#242622]'}`}
            >
              Admin View
            </button>
          </div>
        </div>

        {/* SELLER VIEW: VEHICLE LISTINGS & PAYMENT STATUSES */}
        {role === 'seller' && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white space-y-6 shadow-lg animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242622]/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#35483C]" />
                  <h3 className="font-heading font-extrabold text-xl text-[#242622]">My Vehicle Listings & Platform Fees</h3>
                </div>
                <p className="text-xs text-[#85857E] mt-0.5 font-sans">
                  Manage your marketplace submissions, track verification, and complete mandatory listing fee payments.
                </p>
              </div>

              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm tactile-btn shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>List Another Two-Wheeler</span>
              </Link>
            </div>

            {/* Seller Listings Cards Grid */}
            <div className="space-y-4">
              {sellerListings.map((listing) => {
                const status = listing.status || 'published';
                const isPaid = listing.paymentInfo?.is_paid;

                return (
                  <div
                    key={listing.id}
                    className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] hover:border-[#35483C]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-start gap-4">
                      {listing.primaryImage ? (
                        <img
                          src={listing.primaryImage}
                          alt={listing.title}
                          className="w-20 h-16 rounded-xl object-cover bg-black/10 border border-[#242622]/10 shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-16 rounded-xl bg-[#242622]/5 border border-dashed border-[#242622]/20 flex items-center justify-center text-[#85857E] text-[10px] font-mono shrink-0">
                          Photos
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[10px] uppercase text-[#35483C] bg-white px-2 py-0.5 rounded border border-[#242622]/10">
                            {listing.id}
                          </span>

                          {/* Payment & Publication Status Indicator Badges */}
                          {status === 'published' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>PUBLISHED LIVE</span>
                            </span>
                          )}
                          {status === 'paid' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>PAID • READY TO PUBLISH</span>
                            </span>
                          )}
                          {status === 'awaiting_payment' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>AWAITING PAYMENT</span>
                            </span>
                          )}
                          {status === 'payment_failed' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-50 text-red-800 border border-red-200 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-600" />
                              <span>PAYMENT FAILED</span>
                            </span>
                          )}
                          {status === 'draft' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              DRAFT
                            </span>
                          )}
                        </div>

                        <h4 className="font-heading font-bold text-base text-[#242622]">
                          {listing.title}
                        </h4>

                        <div className="flex items-center gap-3 text-[#85857E] text-[11px] font-mono">
                          <span>{listing.km ? `${listing.km.toLocaleString('en-IN')} km` : '0 km'}</span>
                          <span>•</span>
                          <span>{listing.area || 'Chandigarh'}</span>
                          <span>•</span>
                          <span className="font-bold text-[#242622]">{formatINR(listing.price || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Action Buttons for Each Status */}
                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#242622]/10 shrink-0">
                      {status === 'payment_failed' && (
                        <button
                          type="button"
                          onClick={() => setPaymentModalState({
                            isOpen: true,
                            listingId: listing.id,
                            vehicleTitle: listing.title
                          })}
                          className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all tactile-btn"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry Payment ({formatINR(feeConfig.listing_fee_inr || 299)})</span>
                        </button>
                      )}

                      {(status === 'awaiting_payment' || status === 'draft') && !isPaid && (
                        <button
                          type="button"
                          onClick={() => setPaymentModalState({
                            isOpen: true,
                            listingId: listing.id,
                            vehicleTitle: listing.title
                          })}
                          className="px-4 py-2 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all tactile-btn"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Listing Fee ({formatINR(feeConfig.listing_fee_inr || 299)})</span>
                        </button>
                      )}

                      {isPaid && status !== 'published' && (
                        <Link
                          to="/sell"
                          className="px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all tactile-btn"
                        >
                          <span>Complete & Publish Live</span>
                        </Link>
                      )}

                      {status === 'published' && (
                        <Link
                          to={`/bike/${listing.id}`}
                          className="px-4 py-2 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/15 text-[#242622] font-mono font-bold text-xs flex items-center gap-1.5 transition-all tactile-btn shadow-sm"
                        >
                          <span>View Live Listing</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {role === 'buyer' && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#242622]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#35483C]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#242622]">My Unlocked Meetup Locations</h3>
                  <p className="text-xs text-[#85857E]">Paid seller locations and test-ride authorizations active for your account</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FAF9F5] text-[#35483C] text-xs font-mono font-bold border border-[#242622]/10">
                {buyerPurchases.length} Active Pass(es)
              </span>
            </div>

            {buyerPurchases.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#242622]/10 text-center space-y-3">
                <Compass className="w-8 h-8 text-[#35483C] mx-auto opacity-70" />
                <p className="text-xs font-semibold text-[#242622]">No active location passes unlocked yet.</p>
                <p className="text-xs text-[#85857E] max-w-sm mx-auto">
                  When you unlock a seller&apos;s exact meetup spot from any vehicle details page, it will be saved here for quick navigation.
                </p>
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs mt-2 transition-all shadow-sm tactile-btn"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Explore Marketplace</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyerPurchases.map((p, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-[#35483C]">Listing: {p.listing_id}</span>
                        <p className="font-bold text-[#242622] text-sm mt-0.5">{p.location_details?.address}</p>
                        <p className="text-[#85857E] text-[11px]">{p.location_details?.locality}, {p.location_details?.city}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white text-[#242622] text-[10px] font-mono font-bold border border-[#242622]/10 shrink-0">
                        {p.days_remaining} Days Left
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-[#242622]/[0.08]">
                      <span className="text-[11px] text-[#85857E]">
                        {p.location_details?.test_ride_available ? '✓ Test Ride Authorized' : 'Inspection Only'}
                      </span>
                      <a
                        href={p.location_details?.directions_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-[11px] flex items-center gap-1.5 transition-all shadow-sm tactile-btn"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Get Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STATS METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-[#85857E]">
              <span>Active Marketplace Listings</span>
              <Activity className="w-4 h-4 text-[#35483C]" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-[#242622]">91</p>
            <p className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +14% from last month
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-[#85857E]">
              <span>Vehicles Under Inspection</span>
              <Wrench className="w-4 h-4 text-[#35483C]" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-[#242622]">18</p>
            <p className="text-xs text-[#85857E]">In Resale Studio pipeline</p>
          </div>

          <div className="p-6 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-[#85857E]">
              <span>Total Revenue / Sales (MTD)</span>
              <DollarSign className="w-4 h-4 text-[#35483C]" />
            </div>
            <p className="font-heading font-extrabold text-3xl text-[#242622]">₹85.7 Lakh</p>
            <p className="text-xs text-emerald-700 font-semibold">+35% vs target</p>
          </div>

          <div className="p-6 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-[#85857E]">
              <span>Telematics / Live GPS Tracking</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="font-heading font-extrabold text-3xl text-[#242622]">6 Active</p>
            <p className="text-xs text-[#85857E]">Customer test rides in progress</p>
          </div>
        </div>

        {/* Inventory & Appointments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Listings Table (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-[#242622]">Inventory & Enquiries</h3>
            </div>

            <div className="space-y-3">
              {SEED_LISTINGS.slice(0, 5).map((bike) => (
                <div
                  key={bike.id}
                  className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] hover:border-[#35483C] flex items-center justify-between gap-4 text-xs transition-all duration-200 tactile-btn"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={bike.primaryImage} alt={bike.title} className="w-12 h-12 rounded-xl object-cover bg-black/10 border border-[#242622]/10" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#242622] truncate">{bike.title}</p>
                      <p className="text-[#85857E] text-[11px] font-mono">{bike.km.toLocaleString('en-IN')} km • {bike.area}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-heading font-extrabold text-[#35483C] text-sm">{formatINR(bike.price)}</p>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">Active Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Ride Schedule & Alerts (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-md space-y-5">
            <h3 className="font-heading font-bold text-lg text-[#242622]">Today&apos;s Test Ride Appointments</h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#242622]">Classic 350 Dual Channel</span>
                  <span className="text-[#35483C] font-mono font-bold">11:00 AM Today</span>
                </div>
                <p className="text-[#85857E]">Rider: Gurpreet Singh (Sector 35 Hub)</p>
                <div className="flex items-center gap-1.5 pt-1 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Licence Verified
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#242622]">Ather 450X Gen 3 Pro</span>
                  <span className="text-[#35483C] font-mono font-bold">03:30 PM Today</span>
                </div>
                <p className="text-[#85857E]">Rider: Rohit Sharma (Doorstep Test Ride)</p>
                <div className="flex items-center gap-1.5 pt-1 text-xs text-[#85857E]">
                  <Clock className="w-3.5 h-3.5 text-[#35483C]" /> Doorstep Driver Assigned
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-[#242622]/[0.08] grid grid-cols-2 gap-3 text-xs font-mono">
              <Link
                to="/resale-studio"
                className="py-2.5 rounded-full bg-[#FAF9F5] hover:bg-white text-center font-bold text-[#242622] border border-[#242622]/10 transition-all tactile-btn shadow-sm"
              >
                Resale Studio
              </Link>
              <Link
                to="/explore"
                className="py-2.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-center font-bold text-white transition-all shadow-sm tactile-btn border border-[#35483C]"
              >
                Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Listing Fee Modal */}
      <PlatformListingFeeModal
        isOpen={paymentModalState.isOpen}
        onClose={() => setPaymentModalState({ isOpen: false, listingId: '', vehicleTitle: '' })}
        listingId={paymentModalState.listingId}
        vehicleTitle={paymentModalState.vehicleTitle}
        feeConfig={feeConfig}
        onPaymentSuccess={() => {
          loadSellerData();
        }}
      />
    </div>
  );
};
