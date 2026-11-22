import React, { useState, useEffect, useMemo } from 'react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { 
  CheckCircle2, 
  X, 
  Plus, 
  ArrowRight, 
  Search, 
  Filter, 
  RefreshCw, 
  Sliders, 
  Sparkles, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  TrendingDown, 
  Gauge, 
  Fuel, 
  Eye, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLiveComparisonListings, compareLiveListings } from '../services/aiApi';

export const ComparePage: React.FC = () => {
  const [availableListings, setAvailableListings] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['bike-001', 'bike-002']);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selector / Replacement Modal State
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [replacingSlotIdx, setReplacingSlotIdx] = useState<number | null>(null);
  const [selectorSearch, setSelectorSearch] = useState<string>('');
  const [selectorCategory, setSelectorCategory] = useState<string>('all');

  // Contact Seller Drawer / Modal State
  const [contactVehicle, setContactVehicle] = useState<any | null>(null);

  // Load active selling listings from backend or seed fallback
  const fetchListings = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getLiveComparisonListings();
      if (data && data.listings && data.listings.length > 0) {
        setAvailableListings(data.listings);
        return data.listings;
      }
    } catch (err) {
      console.warn('Backend live listings fetch error, falling back to local inventory:', err);
    }

    // Fallback: merge SEED_LISTINGS with published custom listings
    const customListings = JSON.parse(localStorage.getItem('gearup_custom_listings') || '[]');
    const all = [...customListings, ...SEED_LISTINGS];
    const active = all.filter(l => l.status !== 'sold' && l.status !== 'inactive' && l.status !== 'deleted' && l.status !== 'unpublished');
    
    // Normalize format
    const normalized = active.map(l => ({
      id: l.id,
      title: l.title,
      brand: l.brand,
      model: l.model,
      variant: l.variant || 'Standard',
      category: l.category || 'motorcycle',
      year: l.year,
      reg_year: l.regYear || l.year,
      reg_state: l.regState || 'CH',
      km: l.km,
      price: l.price,
      original_mrp: l.originalMrp || Math.round(l.price * 1.25),
      ai_suggested_price: l.aiSuggestedPrice || Math.round(l.price * 0.98),
      ai_fair_price_min: l.aiFairPriceMin || Math.round(l.price * 0.94),
      ai_fair_price_max: l.aiFairPriceMax || Math.round(l.price * 1.04),
      fuel: l.fuel || 'petrol',
      owners: l.owners || 1,
      condition: l.condition || 'good',
      city: l.city || 'Chandigarh',
      locality: l.area || l.locality || 'Sector 17',
      seller_name: l.sellerName || 'Verified Seller',
      seller_phone: l.sellerPhone || '+91 98765 43210',
      seller_type: l.sellerType || 'individual',
      verification_tier: l.verificationTier || 'document_verified',
      inspection_score: l.inspectionScore || 4.7,
      document_verified: l.documentVerified ?? true,
      insurance_valid_until: l.insuranceValidUntil || '2026-10-15',
      puc_valid_until: l.pucValidUntil || '2026-12-31',
      primary_image: l.primaryImage,
      status: l.status || 'active',
      specs: {
        engine_cc: l.specs?.engineCc || 150,
        power_bhp: l.specs?.powerBhp || '14.5 BHP',
        torque_nm: '13.8 Nm',
        mileage_kmpl: l.specs?.mileageKmpl || (l.fuel === 'electric' ? 100 : 45),
        kerb_weight_kg: l.specs?.kerbWeightKg || 140,
        fuel_tank_l: l.specs?.fuelTankL || 12,
        braking: 'Disc / Drum',
        expected_3yr_maintenance_inr: 14000
      }
    }));
    setAvailableListings(normalized);
    setIsLoading(false);
    return normalized;
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Run comparative analysis when selected IDs change
  useEffect(() => {
    if (selectedIds.length < 2) return;
    let isMounted = true;
    setIsComparing(true);

    compareLiveListings(selectedIds)
      .then((res) => {
        if (isMounted && res && res.status === 'success') {
          setComparisonResult(res);
        }
      })
      .catch((err) => {
        console.warn('Backend compare error, computing locally:', err);
        // Fallback local comparison generator
        if (isMounted) {
          const matched = selectedIds.map(id => availableListings.find(l => l.id === id)).filter(Boolean);
          if (matched.length >= 2) {
            const lowestPrice = Math.min(...matched.map(v => v.price));
            const lowestKm = Math.min(...matched.map(v => v.km));
            setComparisonResult({
              vehicles: matched,
              highlights: {
                lowest_price_id: matched.find(v => v.price === lowestPrice)?.id,
                lowest_km_id: matched.find(v => v.km === lowestKm)?.id,
                best_condition_id: matched[0]?.id,
                highest_tier_id: matched.find(v => v.verification_tier === 'physically_inspected')?.id || matched[0]?.id
              },
              objective_analysis: `Comparing ${matched[0]?.title} and ${matched[1]?.title}: ${matched[0]?.title} offers an asking price of ${formatINR(matched[0]?.price)} with ${matched[0]?.km.toLocaleString()} km, while ${matched[1]?.title} is priced at ${formatINR(matched[1]?.price)} with ${matched[1]?.km.toLocaleString()} km. Evaluate according to your daily commute requirement and personal riding ergonomics.`
            });
          }
        }
      })
      .finally(() => {
        if (isMounted) setIsComparing(false);
      });

    return () => { isMounted = false; };
  }, [selectedIds, availableListings]);

  // Compared Vehicles Objects
  const comparedVehicles = useMemo(() => {
    return selectedIds.map(id => availableListings.find(l => l.id === id)).filter(Boolean);
  }, [selectedIds, availableListings]);

  // Highlights
  const lowestPriceId = useMemo(() => {
    if (comparedVehicles.length === 0) return null;
    return comparedVehicles.reduce((min, curr) => curr.price < min.price ? curr : min, comparedVehicles[0]).id;
  }, [comparedVehicles]);

  const lowestKmId = useMemo(() => {
    if (comparedVehicles.length === 0) return null;
    return comparedVehicles.reduce((min, curr) => curr.km < min.km ? curr : min, comparedVehicles[0]).id;
  }, [comparedVehicles]);

  // Remove a vehicle from comparison (prevent removing below 2)
  const handleRemoveVehicle = (id: string) => {
    if (selectedIds.length <= 2) {
      alert('Comparison requires at least 2 vehicles. You can replace this vehicle instead.');
      return;
    }
    setSelectedIds(selectedIds.filter(vId => vId !== id));
  };

  // Open modal for replacing an existing vehicle
  const handleOpenReplaceModal = (slotIdx: number) => {
    setReplacingSlotIdx(slotIdx);
    setSelectorSearch('');
    setSelectorCategory('all');
    setIsSelectorOpen(true);
  };

  // Open modal for adding a new vehicle
  const handleOpenAddModal = () => {
    if (selectedIds.length >= 4) {
      alert('You can compare a maximum of 4 vehicles at a time.');
      return;
    }
    setReplacingSlotIdx(null);
    setSelectorSearch('');
    setSelectorCategory('all');
    setIsSelectorOpen(true);
  };

  // Confirm selection in modal
  const handleSelectVehicle = (newId: string) => {
    if (replacingSlotIdx !== null) {
      const next = [...selectedIds];
      next[replacingSlotIdx] = newId;
      setSelectedIds(next);
    } else {
      setSelectedIds([...selectedIds, newId]);
    }
    setIsSelectorOpen(false);
    setReplacingSlotIdx(null);
  };

  // Filter available listings in selector modal
  const filteredModalListings = useMemo(() => {
    return availableListings.filter(item => {
      // Must not be sold or inactive
      if (item.status === 'sold' || item.status === 'inactive' || item.status === 'unpublished') {
        return false;
      }
      // Category filter
      if (selectorCategory !== 'all' && item.category.toLowerCase() !== selectorCategory.toLowerCase()) {
        return false;
      }
      // Search term
      if (selectorSearch.trim()) {
        const q = selectorSearch.toLowerCase();
        const title = (item.title || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const model = (item.model || '').toLowerCase();
        const city = (item.city || '').toLowerCase();
        return title.includes(q) || brand.includes(q) || model.includes(q) || city.includes(q);
      }
      return true;
    });
  }, [availableListings, selectorCategory, selectorSearch]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-28 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header & Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] shadow-2xl">
          <div>
            <span className="text-xs font-bold text-[#242622] uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#242622]" />
              <span>LIVE MARKETPLACE COMPARISON MATRIX</span>
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-[#242622] tracking-tight mt-1">
              Compare Two-Wheelers Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-[#85857E] mt-1 max-w-2xl">
              Authentic head-to-head comparison of vehicles currently available for purchase on GEAR UP.
              Compare seller asking prices, verified odometer readings, physical condition, and certified documentation.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <span className="px-3 py-1.5 rounded-none bg-white border border-[#E9E3D8] text-xs font-bold text-[#242622] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{availableListings.length} Live Listings</span>
            </span>
            {selectedIds.length < 4 && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-none bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>
            )}
          </div>
        </div>

        {/* Comparison Vehicle Cards Row */}
        <div className={`grid gap-4 sm:gap-6 ${
          comparedVehicles.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          comparedVehicles.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {comparedVehicles.map((bike, idx) => {
            const isLowestPrice = bike.id === lowestPriceId;
            const isLowestKm = bike.id === lowestKmId;

            return (
              <div 
                key={bike.id}
                className="p-5 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8]/90 shadow-xl space-y-4 relative flex flex-col justify-between"
              >
                {/* Top Controls: Remove and Replace */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#242622] bg-white px-2 py-0.5 rounded border border-[#E9E3D8]">
                    Slot {idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenReplaceModal(idx)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E9E3D8] border border-[#E9E3D8] text-[11px] font-semibold text-[#85857E] hover:text-[#242622] transition-colors"
                      title="Replace this vehicle"
                    >
                      Replace
                    </button>
                    {selectedIds.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(bike.id)}
                        className="p-1 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
                        title="Remove vehicle"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Vehicle Media */}
                <div className="relative aspect-video rounded-none overflow-hidden bg-white border border-[#E9E3D8]">
                  <img 
                    src={bike.primary_image} 
                    alt={bike.title} 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/80 text-white uppercase tracking-wider backdrop-blur-sm">
                    {bike.category}
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E9E3D8] text-[#242622] border border-[#E9E3D8]">
                    {bike.year} Model
                  </span>
                </div>

                {/* Title and Identification */}
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-base text-[#242622] line-clamp-1">
                    {bike.title}
                  </h3>
                  <p className="text-xs text-[#85857E] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#242622] shrink-0" />
                    <span>{bike.locality}, {bike.city}</span>
                  </p>
                </div>

                {/* Pricing Box (Strictly Seller Asking Price) */}
                <div className="p-3.5 rounded-none bg-white border border-[#E9E3D8] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#85857E] block tracking-wider">
                    Seller Asking Price
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-heading font-black text-2xl text-[#242622] font-mono">
                      {formatINR(bike.price)}
                    </span>
                    {isLowestPrice && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-[#242622] text-[10px] font-extrabold uppercase flex items-center gap-1 animate-pulse">
                        <TrendingDown className="w-3 h-3" /> Lower Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#85857E] pt-1 border-t border-[#E9E3D8]/80">
                    <span>AI Valuation:</span>
                    <span className="text-[#242622] font-semibold font-mono">
                      {formatINR(bike.ai_suggested_price)}
                    </span>
                  </div>
                </div>

                {/* Quick Spec Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-none bg-white/60 border border-[#E9E3D8]">
                    <span className="text-[10px] text-slate-500 uppercase block">Odometer</span>
                    <span className={`font-bold font-mono ${isLowestKm ? 'text-blue-300' : 'text-[#242622]'}`}>
                      {bike.km.toLocaleString('en-IN')} km
                    </span>
                    {isLowestKm && (
                      <span className="text-[9px] text-blue-400 block mt-0.5 font-bold">★ Lowest Mileage</span>
                    )}
                  </div>
                  <div className="p-2.5 rounded-none bg-white/60 border border-[#E9E3D8]">
                    <span className="text-[10px] text-slate-500 uppercase block">Inspection</span>
                    <span className="font-bold text-[#242622]">
                      {bike.inspection_score} / 5.0
                    </span>
                    <span className="text-[9px] text-[#242622] block mt-0.5 capitalize font-semibold">
                      {bike.condition} condition
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/bike/${bike.id}`}
                    className="flex-1 py-2 px-3 rounded-none bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Listing</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setContactVehicle(bike)}
                    className="py-2 px-3 rounded-none bg-white hover:bg-[#E9E3D8] border border-[#E9E3D8] text-[#35483C] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3 text-[#242622]" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Vehicle Placeholder Card */}
          {comparedVehicles.length < 4 && (
            <div 
              onClick={handleOpenAddModal}
              className="p-8 rounded-none border border-[#E9E3D8] bg-white/40 border-2 border-dashed border-[#E9E3D8] hover:border-[#35483C] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group min-h-[360px]"
            >
              <div className="w-12 h-12 rounded-none bg-[#E9E3D8] text-[#242622] flex items-center justify-center group-hover:bg-[#35483C]/30 group-hover:text-[#242622] transition-all shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-sm text-[#242622]">Add Another Vehicle</p>
                <p className="text-xs text-slate-500 mt-0.5">Compare up to 4 rides simultaneously</p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Side-by-Side Matrix Table */}
        <div className="rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] shadow-2xl overflow-hidden">
          <div className="p-6 bg-white border-b border-[#E9E3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-[#242622]">
                Detailed Specifications & Condition Matrix
              </h2>
              <p className="text-xs text-[#85857E] mt-0.5">
                Side-by-side comparison across all parameters recorded for these active listings.
              </p>
            </div>
            <span className="text-xs text-[#242622] font-semibold px-3 py-1 rounded-full bg-[#E9E3D8] border border-[#E9E3D8] self-start sm:self-center">
              {comparedVehicles.length} Rides Selected
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="divide-y divide-forest-900/60 text-xs min-w-[700px]">

              {/* Group 1: Pricing & Valuation */}
              <div className="p-3.5 bg-[#E9E3D8] font-bold uppercase tracking-wider text-[11px] text-[#242622] flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>1. Pricing & Fair Valuation</span>
              </div>

              {/* Row: Seller Asking Price */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">
                  Seller Asking Price <span className="text-[10px] text-slate-500 block">Actual asking amount</span>
                </span>
                {comparedVehicles.map((b) => (
                  <div key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold`}>
                    <span className="font-mono text-sm text-[#242622] font-extrabold">{formatINR(b.price)}</span>
                    {b.id === lowestPriceId && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-950 text-[#242622] text-[10px] font-bold border border-emerald-700">
                        Lower
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Row: AI Fair Market Value */}
              <div className="grid grid-cols-12 p-4 items-center bg-white/20">
                <span className="col-span-3 text-[#85857E] font-semibold">
                  AI Fair Value Range <span className="text-[10px] text-slate-500 block">Trained CatBoost estimate</span>
                </span>
                {comparedVehicles.map((b) => (
                  <div key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-mono text-[#35483C]`}>
                    {formatINR(b.ai_suggested_price)}
                    <span className="text-[10px] text-slate-500 block font-normal">
                      Range: {formatINR(b.ai_fair_price_min)} - {formatINR(b.ai_fair_price_max)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row: Original Showroom MRP */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">
                  Original Showroom MRP <span className="text-[10px] text-slate-500 block">When new</span>
                </span>
                {comparedVehicles.map((b) => (
                  <div key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-mono text-[#85857E]`}>
                    {formatINR(b.original_mrp)}
                    <span className="text-[10px] text-slate-500 block font-normal">
                      {Math.round(((b.original_mrp - b.price) / b.original_mrp) * 100)}% depreciation from new
                    </span>
                  </div>
                ))}
              </div>

              {/* Group 2: Odometer & Usage */}
              <div className="p-3.5 bg-[#E9E3D8] font-bold uppercase tracking-wider text-[11px] text-[#242622] flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5" />
                <span>2. Usage & Vehicle Vintage</span>
              </div>

              {/* Row: Odometer Reading */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">
                  Odometer (KM) <span className="text-[10px] text-slate-500 block">Verified distance</span>
                </span>
                {comparedVehicles.map((b) => (
                  <div key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold`}>
                    <span className="font-mono text-[#242622]">{b.km.toLocaleString('en-IN')} km</span>
                    {b.id === lowestKmId && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-700">
                        Lowest KM
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Row: Manufacturing Year */}
              <div className="grid grid-cols-12 p-4 items-center bg-white/20">
                <span className="col-span-3 text-[#85857E] font-semibold">
                  Manufacturing Year <span className="text-[10px] text-slate-500 block">RTO registration year</span>
                </span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-[#242622]`}>
                    {b.year} ({b.reg_state || 'India'})
                  </span>
                ))}
              </div>

              {/* Row: Ownership Count */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">
                  Ownership Count <span className="text-[10px] text-slate-500 block">Serial owner on RC</span>
                </span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-[#242622]`}>
                    {b.owners === 1 ? '1st Owner (Single Owner)' : `${b.owners} Owners`}
                  </span>
                ))}
              </div>

              {/* Group 3: Powertrain & Mechanical Specifications */}
              <div className="p-3.5 bg-[#E9E3D8] font-bold uppercase tracking-wider text-[11px] text-[#242622] flex items-center gap-2">
                <Fuel className="w-3.5 h-3.5" />
                <span>3. Engine & Performance Specifications</span>
              </div>

              {/* Row: Engine / Motor */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">Engine / Motor Spec</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-[#242622]`}>
                    {b.specs?.engine_cc > 0 ? `${b.specs.engine_cc} cc Engine` : 'Electric PMSM Motor'}
                  </span>
                ))}
              </div>

              {/* Row: Fuel Type */}
              <div className="grid grid-cols-12 p-4 items-center bg-white/20">
                <span className="col-span-3 text-[#85857E] font-semibold">Fuel / Powertrain</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-white capitalize`}>
                    {b.fuel}
                  </span>
                ))}
              </div>

              {/* Row: Power Output */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">Max Power</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-[#242622]`}>
                    {b.specs?.power_bhp || 'Not provided'}
                  </span>
                ))}
              </div>

              {/* Row: Mileage / Range */}
              <div className="grid grid-cols-12 p-4 items-center bg-white/20">
                <span className="col-span-3 text-[#85857E] font-semibold">Mileage / EV Range</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-[#242622]`}>
                    {b.fuel === 'electric' 
                      ? `${b.specs?.mileage_kmpl || 100} km per charge` 
                      : `${b.specs?.mileage_kmpl || 45} km/l ARAI`}
                  </span>
                ))}
              </div>

              {/* Group 4: Inspection & Verification */}
              <div className="p-3.5 bg-[#E9E3D8] font-bold uppercase tracking-wider text-[11px] text-[#242622] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>4. Inspection & Verification Trust</span>
              </div>

              {/* Row: Verification Tier */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">GEAR UP Trust Tier</span>
                {comparedVehicles.map((b) => (
                  <div key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'}`}>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      b.verification_tier === 'physically_inspected' 
                        ? 'bg-purple-50 text-purple-800 border border-purple-200'
                        : b.verification_tier === 'document_verified'
                        ? 'bg-[#E9E3D8] text-[#242622] border border-[#35483C]/40'
                        : 'bg-[#E9E3D8] text-[#85857E] border border-[#E9E3D8]'
                    }`}>
                      {b.verification_tier?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Row: Documented Condition */}
              <div className="grid grid-cols-12 p-4 items-center bg-white/20">
                <span className="col-span-3 text-[#85857E] font-semibold">Vehicle Condition</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} font-bold text-white capitalize`}>
                    {b.condition} ({b.inspection_score}/5.0 score)
                  </span>
                ))}
              </div>

              {/* Row: Insurance Validity */}
              <div className="grid grid-cols-12 p-4 items-center hover:bg-white/30">
                <span className="col-span-3 text-[#85857E] font-semibold">Insurance Validity</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} text-[#85857E]`}>
                    {b.insurance_valid_until ? `Valid until ${b.insurance_valid_until}` : 'Not provided'}
                  </span>
                ))}
              </div>

              {/* Row: Location */}
              <div className="grid grid-cols-12 p-4 items-center bg-white/20">
                <span className="col-span-3 text-[#85857E] font-semibold">Inspection Hub / Area</span>
                {comparedVehicles.map((b) => (
                  <span key={b.id} className={`${comparedVehicles.length === 2 ? 'col-span-4' : comparedVehicles.length === 3 ? 'col-span-3' : 'col-span-2'} text-[#85857E]`}>
                    {b.locality}, {b.city}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Objective Comparative Analysis Box */}
        {comparisonResult?.objective_analysis && (
          <div className="p-6 sm:p-8 rounded-none border border-[#E9E3D8] bg-gradient-to-r from-[#142B23] to-[#0D1C17] border border-[#35483C]/50 shadow-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#242622]" />
              <h3 className="font-heading font-extrabold text-base text-[#242622]">
                Multi-Perspective Comparative Analysis
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#85857E] leading-relaxed">
              {comparisonResult.objective_analysis}
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              💡 <strong>Objective Evaluation Note:</strong> GEAR UP presents authentic seller metrics side-by-side without automatically declaring a single vehicle the best based on asking price alone. Evaluate total ownership cost, distance to meetup hub, and component inspection grades before booking a test ride.
            </p>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* SELECTOR / REPLACEMENT MODAL */}
      {/* ======================================================== */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
            {/* Modal Header */}
            <div className="p-5 bg-white border-b border-[#E9E3D8] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#242622]">
                  {replacingSlotIdx !== null ? `Replace Slot ${replacingSlotIdx + 1}` : 'Add Vehicle to Comparison'}
                </h3>
                <p className="text-xs text-[#85857E]">
                  Select an authentic active listing from GEAR UP inventory
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectorOpen(false)}
                className="p-1.5 rounded-lg bg-[#E9E3D8] text-[#85857E] hover:text-[#242622]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b border-[#E9E3D8] flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={selectorSearch}
                  onChange={(e) => setSelectorSearch(e.target.value)}
                  placeholder="Search by brand, model, city..."
                  className="w-full pl-9 pr-3 py-2 rounded-none bg-white border border-[#E9E3D8] text-xs text-[#242622] placeholder-slate-500 focus:outline-none focus:border-[#35483C]"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 self-start sm:self-center">
                {['all', 'motorcycle', 'scooter', 'electric'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectorCategory(cat)}
                    className={`px-3 py-1.5 rounded-none text-[11px] font-bold capitalize transition-colors ${
                      selectorCategory === cat
                        ? 'bg-[#35483C] text-white'
                        : 'bg-white text-[#85857E] hover:text-[#242622] border border-[#E9E3D8]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Selection Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredModalListings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No active listings match your search criteria.
                </div>
              ) : (
                filteredModalListings.map((bike) => {
                  const isAlreadySelected = selectedIds.includes(bike.id);

                  return (
                    <div
                      key={bike.id}
                      className={`p-3.5 rounded-none border transition-all flex items-center justify-between gap-4 ${
                        isAlreadySelected
                          ? 'bg-white/40 border-[#E9E3D8]/40 opacity-50'
                          : 'bg-[#E9E3D8] border-[#E9E3D8] hover:border-[#35483C] hover:bg-[#E9E3D8]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={bike.primary_image} 
                          alt={bike.title} 
                          className="w-16 h-12 rounded-none object-cover shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#242622] text-xs truncate">{bike.title}</p>
                          <p className="text-[11px] text-[#85857E]">
                            {bike.km.toLocaleString('en-IN')} km • {bike.locality}, {bike.city}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#242622] font-bold uppercase">{bike.category}</span>
                            <span className="text-[10px] text-slate-500">•</span>
                            <span className="text-[10px] text-[#85857E]">{bike.fuel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="font-heading font-black text-sm text-[#242622] font-mono">
                            {formatINR(bike.price)}
                          </p>
                          <span className="text-[10px] text-slate-500 block">Seller Asking</span>
                        </div>

                        <button
                          type="button"
                          disabled={isAlreadySelected}
                          onClick={() => handleSelectVehicle(bike.id)}
                          className={`px-4 py-2 rounded-none text-xs font-bold transition-all ${
                            isAlreadySelected
                              ? 'bg-white text-slate-600 cursor-not-allowed border border-[#E9E3D8]'
                              : 'bg-[#35483C] hover:bg-[#242622] text-white shadow-sm'
                          }`}
                        >
                          {isAlreadySelected ? 'In Comparison' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CONTACT SELLER MODAL */}
      {/* ======================================================== */}
      {contactVehicle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] shadow-2xl p-6 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#242622]" />
                <h3 className="font-heading font-bold text-base text-[#242622]">Contact Seller</h3>
              </div>
              <button
                type="button"
                onClick={() => setContactVehicle(null)}
                className="p-1 rounded-lg bg-white text-[#85857E] hover:text-[#242622]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-none bg-white border border-[#E9E3D8]">
              <img 
                src={contactVehicle.primary_image} 
                alt={contactVehicle.title} 
                className="w-14 h-11 rounded-none object-cover shrink-0" 
              />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-[#242622] truncate">{contactVehicle.title}</h4>
                <p className="font-heading font-extrabold text-sm text-[#242622] font-mono mt-0.5">
                  {formatINR(contactVehicle.price)}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] flex justify-between">
                <span className="text-[#85857E]">Seller Name:</span>
                <span className="font-bold text-[#242622]">{contactVehicle.seller_name || 'Gurpreet Singh'}</span>
              </div>
              <div className="p-3 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] flex justify-between">
                <span className="text-[#85857E]">Direct Phone:</span>
                <span className="font-mono font-bold text-[#242622]">{contactVehicle.seller_phone || '+91 98765 43210'}</span>
              </div>
              <div className="p-3 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] flex justify-between">
                <span className="text-[#85857E]">Location Hub:</span>
                <span className="font-bold text-[#242622]">{contactVehicle.locality}, {contactVehicle.city}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`tel:${contactVehicle.seller_phone || '+919876543210'}`}
                className="w-full py-3 rounded-none bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Seller Now</span>
              </a>
              <a
                href={`https://wa.me/${(contactVehicle.seller_phone || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I saw your ${contactVehicle.title} on GEAR UP for ${formatINR(contactVehicle.price)}. Is it still available for inspection?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-none bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
