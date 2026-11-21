import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Camera, 
  Sparkles, 
  AlertCircle, 
  Upload, 
  DollarSign, 
  ShieldCheck, 
  Wrench,
  Zap,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';
import { formatINR } from '../utils/geo';
import { PickupLocation } from '../types';
import { SellerPickupLocationPicker } from '../components/SellerPickupLocationPicker';
import { generateListing } from '../services/aiApi';

export const SellBikePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<'motorcycle' | 'scooter' | 'electric'>('motorcycle');
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('Classic 350');
  const [variant, setVariant] = useState('Halcyon Black Dual Channel ABS');
  const [year, setYear] = useState<number>(2023);
  const [km, setKm] = useState<number>(8500);
  const [owners, setOwners] = useState<number>(1);
  const [city, setCity] = useState('Chandigarh');
  const [askingPrice, setAskingPrice] = useState<number>(182000);
  const [aiDraft, setAiDraft] = useState<any>(null);
  const [isDrafting, setIsDrafting] = useState<boolean>(false);

  // Dedicated Pickup Location State (Phase 4 Requirement)
  const [pickupLocation, setPickupLocation] = useState<PickupLocation>({
    lat: 30.7333,
    lng: 76.7794,
    address: 'SCO 88-89, Sector 17-C, Chandigarh',
    city: 'Chandigarh',
    locality: 'Sector 17',
    landmark: 'Near Neelam Cinema',
    visibility: 'approximate_public',
  });
  const [isPickupConfirmed, setIsPickupConfirmed] = useState<boolean>(true);

  // Uploaded Photos Simulation
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
  ]);

  // AI Photo Analysis States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(true);

  // Disclosures
  const [disclosures, setDisclosures] = useState({
    scratches: false,
    dents: false,
    accidents: false,
    serviceRecords: true,
    rcValid: true,
    insuranceValid: true,
  });

  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysisComplete(true);
    }, 800);
  };

  const handlePublish = () => {
    if (!pickupLocation || !isPickupConfirmed) {
      alert('Please confirm the vehicle pickup and inspection location before publishing.');
      setCurrentStep(4);
      return;
    }
    alert(`Listing for ${year} ${brand} ${model} published live to GEAR UP marketplace!\nPickup Location: ${pickupLocation.locality}, ${pickupLocation.city} (Privacy: ${pickupLocation.visibility})`);
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-[#0A1411] text-slate-100 pb-24">
      {/* Step Progress Bar */}
      <div className="border-b border-[#182C24] bg-[#0E1A16] px-4 sm:px-6 py-4 sticky top-20 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-forest-600 text-white flex items-center justify-center font-bold text-xs">
              {currentStep}
            </span>
            <span className="font-heading font-bold text-sm text-white">
              {currentStep === 1 && 'Step 1: Category Selection'}
              {currentStep === 2 && 'Step 2: Vehicle Details & Specs'}
              {currentStep === 3 && 'Step 3: Photographs & AI Vision'}
              {currentStep === 4 && 'Step 4: Pickup Location & Privacy'}
              {currentStep === 5 && 'Step 5: Disclosures & Condition'}
              {currentStep === 6 && 'Step 6: AI Fair Price Recommendation'}
              {currentStep === 7 && 'Step 7: Resale Studio & Finalize'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`w-5 sm:w-8 h-1.5 rounded-full transition-colors ${
                  s <= currentStep ? 'bg-forest-400' : 'bg-forest-950'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        {/* STEP 1: CATEGORY */}
        {currentStep === 1 && (
          <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Select Two-Wheeler Category</h2>
              <p className="text-xs text-slate-400 mt-1">What type of ride are you listing for sale?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setCategory('motorcycle')}
                className={`p-6 rounded-2xl border text-center space-y-3 transition-all ${
                  category === 'motorcycle'
                    ? 'bg-forest-800 border-forest-400 text-white shadow-glow'
                    : 'bg-forest-950/60 border-forest-900 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-forest-700/60 flex items-center justify-center mx-auto text-forest-200">
                  🏍️
                </div>
                <h3 className="font-bold text-sm text-white">Motorcycle</h3>
                <p className="text-[11px] text-slate-400">Cruisers, streetbikes, commuters, sports</p>
              </button>

              <button
                onClick={() => setCategory('scooter')}
                className={`p-6 rounded-2xl border text-center space-y-3 transition-all ${
                  category === 'scooter'
                    ? 'bg-forest-800 border-forest-400 text-white shadow-glow'
                    : 'bg-forest-950/60 border-forest-900 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-forest-700/60 flex items-center justify-center mx-auto text-forest-200">
                  🛵
                </div>
                <h3 className="font-bold text-sm text-white">Scooter</h3>
                <p className="text-[11px] text-slate-400">Activa, Jupiter, Access, Fascino</p>
              </button>

              <button
                onClick={() => setCategory('electric')}
                className={`p-6 rounded-2xl border text-center space-y-3 transition-all ${
                  category === 'electric'
                    ? 'bg-emerald-900 border-emerald-400 text-white shadow-glow'
                    : 'bg-forest-950/60 border-forest-900 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-800/60 flex items-center justify-center mx-auto text-emerald-200">
                  ⚡
                </div>
                <h3 className="font-bold text-sm text-white">Electric (EV)</h3>
                <p className="text-[11px] text-slate-400">Ather, Ola, Chetak, TVS iQube</p>
              </button>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Continue to Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VEHICLE DETAILS */}
        {currentStep === 2 && (
          <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Vehicle Information</h2>
              <p className="text-xs text-slate-400 mt-1">Accurate details speed up verification and buyer enquiries</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                >
                  <option>Royal Enfield</option>
                  <option>Honda</option>
                  <option>TVS</option>
                  <option>Bajaj</option>
                  <option>Yamaha</option>
                  <option>Suzuki</option>
                  <option>Ather</option>
                  <option>Ola Electric</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Variant / Color</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Manufacturing Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Kilometres Driven</label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Number of Owners</label>
                <select
                  value={owners}
                  onChange={(e) => setOwners(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value={1}>1st Owner</option>
                  <option value={2}>2nd Owner</option>
                  <option value={3}>3rd Owner</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">City / Registration Hub</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl bg-forest-950 text-slate-300 border border-forest-800 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Continue to Photos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PHOTOS & AI PHOTO ANALYZER */}
        {currentStep === 3 && (
          <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white">Upload Vehicle Photos</h2>
                <p className="text-xs text-slate-400 mt-1">Upload clear photos of front, sides, instrument cluster and exhaust</p>
              </div>
              <span className="text-xs font-bold text-forest-300">{uploadedPhotos.length} / 8 Photos</span>
            </div>

            {/* Photo Previews Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {uploadedPhotos.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-forest-800 group">
                  <img src={url} alt="Upload" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white">
                    Photo {idx + 1}
                  </span>
                </div>
              ))}

              <button
                onClick={() => {
                  setUploadedPhotos([
                    ...uploadedPhotos,
                    'https://images.unsplash.com/photo-1558981420-87aa9210d992?auto=format&fit=crop&w=800&q=80',
                  ]);
                }}
                className="aspect-video rounded-xl border-2 border-dashed border-forest-800 hover:border-forest-500 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <Camera className="w-5 h-5 text-forest-400" />
                <span className="text-[10px] font-bold">Add Photo</span>
              </button>
            </div>

            {/* AI Photo Analyzer Box */}
            <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-xs text-white">AI Vision Cosmetic Analyzer</h4>
                </div>
                <button
                  onClick={runAiAnalysis}
                  className="text-xs text-forest-300 underline font-semibold"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Re-scan Images'}
                </button>
              </div>

              {aiAnalysisComplete && (
                <div className="space-y-2 text-xs text-slate-300">
                  <p className="text-emerald-400 font-semibold">✓ Vehicle confirmed as {brand} {model} ({year})</p>
                  <p>• Exterior Paint Condition: <strong>9.2/10 High gloss showroom shine</strong></p>
                  <p>• Missing Angles: Recommend adding 1 rear tyre tread close-up</p>
                  <p className="text-[11px] text-slate-400 italic">
                    *Cosmetic observations only. Mechanical integrity requires physical inspection.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-forest-950 text-slate-300 border border-forest-800 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Continue to Pickup Location</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SELLER PICKUP LOCATION & PRIVACY (Phase 4 Requirement) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <SellerPickupLocationPicker
              initialLocation={pickupLocation}
              onLocationConfirmed={(loc) => {
                setPickupLocation(loc);
                setCity(loc.city);
                setIsPickupConfirmed(true);
                setCurrentStep(5);
              }}
              onCancel={() => setCurrentStep(3)}
            />
          </div>
        )}

        {/* STEP 5: DISCLOSURES */}
        {currentStep === 5 && (
          <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Seller Disclosures & Health</h2>
              <p className="text-xs text-slate-400 mt-1">Honest disclosures build 3x higher trust with serious buyers</p>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-950 border border-forest-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclosures.rcValid}
                  onChange={(e) => setDisclosures({ ...disclosures, rcValid: e.target.checked })}
                  className="rounded text-forest-500 accent-forest-500"
                />
                <div>
                  <p className="font-bold text-white">Original RC (Registration Certificate) available</p>
                  <p className="text-slate-400 text-[11px]">Ready for ownership transfer via Parivahan Sewa</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-950 border border-forest-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclosures.insuranceValid}
                  onChange={(e) => setDisclosures({ ...disclosures, insuranceValid: e.target.checked })}
                  className="rounded text-forest-500 accent-forest-500"
                />
                <div>
                  <p className="font-bold text-white">Active Insurance Policy in place</p>
                  <p className="text-slate-400 text-[11px]">Comprehensive or third-party validity</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-950 border border-forest-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclosures.serviceRecords}
                  onChange={(e) => setDisclosures({ ...disclosures, serviceRecords: e.target.checked })}
                  className="rounded text-forest-500 accent-forest-500"
                />
                <div>
                  <p className="font-bold text-white">Authorized Dealership Service Records available</p>
                  <p className="text-slate-400 text-[11px]">Invoices or digital service stamp history</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-forest-950 border border-forest-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclosures.accidents}
                  onChange={(e) => setDisclosures({ ...disclosures, accidents: e.target.checked })}
                  className="rounded text-forest-500 accent-forest-500"
                />
                <div>
                  <p className="font-bold text-white">Any major accident or frame damage history?</p>
                  <p className="text-slate-400 text-[11px]">Checked during 120-point inspection</p>
                </div>
              </label>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-xl bg-forest-950 text-slate-300 border border-forest-800 text-xs font-semibold"
              >
                Back to Pickup Location
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Check AI Price Valuation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: AI FAIR PRICE ESTIMATION */}
        {currentStep === 6 && (
          <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">AI Fair-Price Valuation</h2>
              <p className="text-xs text-slate-400 mt-1">Based on 45,000+ verified Indian two-wheeler transactions</p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950 border border-forest-700/80 text-center space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                RECOMMENDED RESALE PRICE
              </span>
              <div className="font-heading font-extrabold text-4xl text-white">
                ₹1,80,000 - ₹1,88,000
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Vehicles priced in this band in {pickupLocation.city} typically sell in <strong>4 to 7 days</strong>.
              </p>

              <div className="pt-4 border-t border-forest-900 max-w-sm mx-auto text-left space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Your Set Asking Price (₹)</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full bg-[#101E19] border border-forest-800 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-forest-500"
                />
              </div>

              {/* AI Listing Assistant Card */}
              <div className="pt-4 border-t border-forest-900 text-left">
                {!aiDraft ? (
                  <button
                    type="button"
                    disabled={isDrafting}
                    onClick={async () => {
                      setIsDrafting(true);
                      try {
                        const draft = await generateListing({
                          brand,
                          model,
                          year,
                          km,
                          city: pickupLocation.city || city,
                          variant,
                          ownership: owners
                        });
                        setAiDraft(draft);
                        if (draft.suggested_asking_price) {
                          setAskingPrice(draft.suggested_asking_price);
                        }
                      } finally {
                        setIsDrafting(false);
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-forest-900/90 hover:bg-forest-800 border border-forest-500/60 text-forest-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-forest-400" />
                    <span>{isDrafting ? 'Drafting Title & Description...' : 'Auto-Generate Listing Title & Description with AI Assistant'}</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-700/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-forest-900">
                      <span className="text-xs font-bold text-forest-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-forest-400" />
                        AI Listing Assistant Generated Draft:
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">Suggested: {formatINR(aiDraft.suggested_asking_price)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Draft Title</span>
                      <p className="font-bold text-white text-xs mt-0.5">{aiDraft.title}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Structured Description</span>
                      <p className="text-slate-300 text-[11px] whitespace-pre-line mt-1 bg-black/40 p-3 rounded-lg border border-forest-900">
                        {aiDraft.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 rounded-xl bg-forest-950 text-slate-300 border border-forest-800 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(7)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>Final Review & Publish</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: PREVIEW & PUBLISH */}
        {currentStep === 7 && (
          <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
            <div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Preview & Publish Listing</h2>
              <p className="text-xs text-slate-400 mt-1">Review your two-wheeler summary before going live</p>
            </div>

            {/* Confirmed Pickup Location Banner */}
            <div className="p-4 rounded-2xl bg-forest-950 border border-forest-700 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-forest-900">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-forest-400" />
                  <span className="font-bold text-white">Confirmed Pickup Location</span>
                </div>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="text-xs text-forest-300 underline font-semibold"
                >
                  Edit Location
                </button>
              </div>

              <div className="space-y-1 text-slate-300">
                <p><strong>Locality:</strong> {pickupLocation.locality}, {pickupLocation.city}</p>
                <p><strong>Full Address:</strong> {pickupLocation.address}</p>
                {pickupLocation.landmark && <p><strong>Landmark:</strong> {pickupLocation.landmark}</p>}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-forest-900 text-forest-200 border border-forest-700 font-mono">
                    Coords: {pickupLocation.lat.toFixed(4)}, {pickupLocation.lng.toFixed(4)}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-forest-900 text-gold-light border border-gold/40">
                    Privacy: {pickupLocation.visibility === 'approximate_public' ? 'Locality Public' : 'Exact Verified Only'}
                  </span>
                </div>
              </div>
            </div>

            {/* Listing Summary Preview */}
            <div className="p-4 rounded-2xl bg-forest-950 border border-forest-900 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-forest-900">
                <span className="text-slate-400">Vehicle</span>
                <span className="font-bold text-white">{brand} {model} ({year})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-forest-900">
                <span className="text-slate-400">Variant</span>
                <span className="text-white">{variant}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-forest-900">
                <span className="text-slate-400">Odometer</span>
                <span className="text-white">{km.toLocaleString('en-IN')} km</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Asking Price</span>
                <span className="font-bold text-forest-300 text-sm">{formatINR(askingPrice)}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(6)}
                className="px-5 py-2.5 rounded-xl bg-forest-950 text-slate-300 border border-forest-800 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handlePublish}
                className="px-8 py-3.5 rounded-xl bg-forest-500 hover:bg-forest-400 text-white font-bold text-xs uppercase tracking-wider shadow-glow"
              >
                Publish Live to GEAR UP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
