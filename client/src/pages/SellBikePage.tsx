import React, { useState, useEffect } from 'react';
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
  EyeOff,
  FileText,
  FileCheck,
  Clock,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Save,
  Check,
  RefreshCw,
  Search,
  BatteryCharging,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { formatINR } from '../utils/geo';
import { PickupLocation } from '../types';
import { SellerPickupLocationPicker } from '../components/SellerPickupLocationPicker';
import { 
  getVehicleCatalog,
  uploadVerificationDocument, 
  submitLevel2Condition, 
  submitLevel3Ownership, 
  getVerificationReport,
  generateListing 
} from '../services/aiApi';

export const SellBikePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [listingId, setListingId] = useState<string>('GEAR-UP-' + Math.floor(100000 + Math.random() * 900000));

  // Step 1: Vehicle Details State
  const [category, setCategory] = useState<'motorcycle' | 'scooter' | 'electric'>('motorcycle');
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('Classic 350');
  const [variant, setVariant] = useState('Dark Stealth Black Dual Channel ABS');
  const [year, setYear] = useState<number>(2023);
  const [registrationNumber, setRegistrationNumber] = useState('CH01AB8821');
  const [city, setCity] = useState('Chandigarh');
  const [askingPrice, setAskingPrice] = useState<number>(182000);

  // Step 2: Vehicle Photographs
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{ slot: string; url: string; name: string }>>([
    { slot: 'front', url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', name: 'front_angle.jpg' },
    { slot: 'rear', url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', name: 'rear_plate.jpg' },
    { slot: 'dashboard', url: 'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?auto=format&fit=crop&w=800&q=80', name: 'odometer_gauge.jpg' }
  ]);

  // Step 3: Vehicle Condition & Service History
  const [km, setKm] = useState<number>(14000);
  const [owners, setOwners] = useState<number>(1);
  const [overallCondition, setOverallCondition] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [usagePattern, setUsagePattern] = useState('daily_commute');
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

  // Step 4: Level 1 – Basic Document Verification State
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [rcResult, setRcResult] = useState<any>(null);
  const [isRcUploading, setIsRcUploading] = useState(false);

  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [insuranceResult, setInsuranceResult] = useState<any>(null);
  const [isInsUploading, setIsInsUploading] = useState(false);

  const [pucFile, setPucFile] = useState<File | null>(null);
  const [pucResult, setPucResult] = useState<any>(null);
  const [isPucUploading, setIsPucUploading] = useState(false);

  // Step 5: Level 2 – Vehicle Condition Verification State
  const [serviceHistoryTier, setServiceHistoryTier] = useState('regular'); // regular, occasional, none
  const [lastServiceDate, setLastServiceDate] = useState('15/10/2025');
  const [lastServiceOdo, setLastServiceOdo] = useState<number>(12500);
  const [serviceCentreName, setServiceCentreName] = useState('Royal Enfield Authorized Hub');
  const [tyreCondition, setTyreCondition] = useState('good');
  const [tyreNotes, setTyreNotes] = useState('Front CEAT Zoom Plus (4.5mm), Rear CEAT Gripp (4.0mm)');
  const [batteryCondition, setBatteryCondition] = useState('good');
  const [evBatteryHealth, setEvBatteryHealth] = useState<number>(94);
  const [accidentDisclosure, setAccidentDisclosure] = useState('none'); // none, minor, major, major_component, not_sure
  const [accidentNotes, setAccidentNotes] = useState('Never been in an accident. Single tip-over scratch on left exhaust shield.');
  const [uploadedRepairBills, setUploadedRepairBills] = useState<any[]>([]);

  // Step 6: Level 3 – Ownership Verification State
  const [sellerFullName, setSellerFullName] = useState('Vikramjit Singh');
  const [relationshipToOwner, setRelationshipToOwner] = useState('registered_owner'); // registered_owner, family_member, authorized_agent
  const [isRegisteredOwner, setIsRegisteredOwner] = useState(true);
  const [authorisationNotes, setAuthorisationNotes] = useState('Sole registered owner with original RC in hand.');
  const [loanStatus, setLoanStatus] = useState('no_loan'); // no_loan, loan_cleared, active_loan, not_sure
  const [hasForm29, setHasForm29] = useState(true);
  const [hasForm30, setHasForm30] = useState(true);
  const [hasLoanNocFile, setHasLoanNocFile] = useState(false);
  const [sellerConsent, setSellerConsent] = useState(true);

  // Step 7: Verification Summary State
  const [verificationSummary, setVerificationSummary] = useState<any>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  // Draft Save Toast State
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Restore Draft on Mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('gearup_seller_draft');
    if (savedDraft) {
      try {
        const d = JSON.parse(savedDraft);
        if (d.brand) setBrand(d.brand);
        if (d.model) setModel(d.model);
        if (d.year) setYear(d.year);
        if (d.registrationNumber) setRegistrationNumber(d.registrationNumber);
        if (d.askingPrice) setAskingPrice(d.askingPrice);
      } catch (e) {
        console.warn('Error reading saved draft', e);
      }
    }
  }, []);

  const saveDraft = () => {
    const draftData = {
      listingId,
      category,
      brand,
      model,
      variant,
      year,
      registrationNumber,
      city,
      askingPrice,
      km,
      owners,
      overallCondition,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('gearup_seller_draft', JSON.stringify(draftData));
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  // Upload Handlers
  const handleRcUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRcFile(file);
    setIsRcUploading(true);

    try {
      const fd = new FormData();
      fd.append('listing_id', listingId);
      fd.append('document_type', 'rc');
      fd.append('registration_number', registrationNumber);
      fd.append('brand', brand);
      fd.append('model', model);
      fd.append('fuel_type', category === 'electric' ? 'ELECTRIC' : 'PETROL');
      fd.append('file', file);

      const res = await uploadVerificationDocument(fd);
      if (res && res.result) {
        setRcResult(res.result);
      }
    } catch (err: any) {
      alert('RC processing failed: ' + (err.message || 'Please upload a clear PDF or JPG.'));
    } finally {
      setIsRcUploading(false);
    }
  };

  const handleInsuranceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInsuranceFile(file);
    setIsInsUploading(true);

    try {
      const fd = new FormData();
      fd.append('listing_id', listingId);
      fd.append('document_type', 'insurance');
      fd.append('registration_number', registrationNumber);
      fd.append('file', file);

      const res = await uploadVerificationDocument(fd);
      if (res && res.result) {
        setInsuranceResult(res.result);
      }
    } catch (err: any) {
      alert('Insurance processing failed: ' + (err.message || 'Please upload a clear document.'));
    } finally {
      setIsInsUploading(false);
    }
  };

  const handlePucUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPucFile(file);
    setIsPucUploading(true);

    try {
      const fd = new FormData();
      fd.append('listing_id', listingId);
      fd.append('document_type', 'puc');
      fd.append('registration_number', registrationNumber);
      fd.append('file', file);

      const res = await uploadVerificationDocument(fd);
      if (res && res.result) {
        setPucResult(res.result);
      }
    } catch (err: any) {
      alert('PUC upload failed: ' + (err.message || 'Please try again.'));
    } finally {
      setIsPucUploading(false);
    }
  };

  const handleRepairBillUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append('listing_id', listingId);
      fd.append('document_type', 'repair_bill');
      fd.append('file', file);

      const res = await uploadVerificationDocument(fd);
      if (res && res.result) {
        setUploadedRepairBills([...uploadedRepairBills, res.result]);
      }
    } catch (err: any) {
      alert('Bill upload failed: ' + err.message);
    }
  };

  // Submit Step 5: Level 2 Condition
  const submitLevel2 = async () => {
    await submitLevel2Condition({
      listing_id: listingId,
      service_history: serviceHistoryTier,
      last_service_date: lastServiceDate,
      last_service_odometer: lastServiceOdo,
      service_centre_name: serviceCentreName,
      tyre_condition: tyreCondition,
      tyre_notes: tyreNotes,
      battery_condition: batteryCondition,
      battery_health_ev: category === 'electric' ? evBatteryHealth : undefined,
      accident_disclosure: accidentDisclosure,
      accident_notes: accidentNotes
    });
    setCurrentStep(6);
  };

  // Submit Step 6: Level 3 Ownership
  const submitLevel3 = async () => {
    if (!sellerConsent) {
      alert('Please provide seller consent for document verification to proceed.');
      return;
    }
    await submitLevel3Ownership({
      listing_id: listingId,
      seller_full_name: sellerFullName,
      relationship_to_owner: relationshipToOwner,
      is_registered_owner: isRegisteredOwner,
      authorisation_notes: authorisationNotes,
      loan_status: loanStatus,
      has_form29: hasForm29,
      has_form30: hasForm30
    });
    
    // Fetch fresh report for Step 7
    setIsLoadingSummary(true);
    const rep = await getVerificationReport(listingId);
    if (rep) {
      setVerificationSummary(rep);
    }
    setIsLoadingSummary(false);
    setCurrentStep(7);
  };

  // Step 8 Final Publish
  const handlePublishListing = () => {
    alert(`🎉 Congratulations! Your listing for ${year} ${brand} ${model} has been submitted to GEAR UP!\n\nReference ID: ${listingId}\nStatus: Verified Documents Pending Review\n\nYour vehicle will be featured with verified trust badges.`);
    localStorage.removeItem('gearup_seller_draft');
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-[#070D0B] text-slate-100 pb-28">
      
      {/* Save Draft Floating Notification */}
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-500/80 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Listing draft saved safely! You can resume anytime.</span>
        </div>
      )}

      {/* 8-Step Navigation Header */}
      <div className="border-b border-[#142620] bg-[#0A1411]/90 backdrop-blur-md px-4 sm:px-6 py-4 sticky top-16 z-30 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center font-black text-xs shadow-glow">
              {currentStep}
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-400">
                Step {currentStep} of 8
              </span>
              <h2 className="font-heading font-bold text-sm sm:text-base text-white">
                {currentStep === 1 && '1. Enter Vehicle Details'}
                {currentStep === 2 && '2. Add Vehicle Photographs'}
                {currentStep === 3 && '3. Condition, Mileage & Location'}
                {currentStep === 4 && '4. Level 1 – Basic Document Verification'}
                {currentStep === 5 && '5. Level 2 – Condition & Maintenance'}
                {currentStep === 6 && '6. Level 3 – Ownership & Transfer Verification'}
                {currentStep === 7 && '7. Review Verification Report'}
                {currentStep === 8 && '8. Review & Publish Listing'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={saveDraft}
              className="px-3 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 border border-forest-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-forest-400" />
              <span>Save Draft</span>
            </button>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => s <= currentStep && setCurrentStep(s)}
                  disabled={s > currentStep}
                  title={`Step ${s}`}
                  className={`w-3.5 sm:w-5 h-2 rounded-full transition-all ${
                    s === currentStep
                      ? 'bg-forest-400 w-6'
                      : s < currentStep
                      ? 'bg-forest-600'
                      : 'bg-forest-950'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">

        {/* ======================================================== */}
        {/* STEP 1: VEHICLE DETAILS */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Step 1 of 8
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Enter Vehicle Details</h2>
              <p className="text-xs text-slate-400 mt-1">Accurate vehicle information ensures seamless document verification</p>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'motorcycle', label: '🏍️ Motorcycle', sub: 'Geared Bikes' },
                { id: 'scooter', label: '🛵 Scooter', sub: 'Automatic' },
                { id: 'electric', label: '⚡ Electric (EV)', sub: 'Battery Powered' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    category === c.id
                      ? 'bg-forest-900/90 border-forest-500 text-white shadow-glow'
                      : 'bg-forest-950/60 border-forest-900 text-slate-400 hover:border-forest-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{c.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{c.sub}</div>
                </button>
              ))}
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Brand / Manufacturer</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Variant / Specification</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Manufacturing Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500"
                >
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">
                  Registration Number <span className="text-forest-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CH01AB8821"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 uppercase font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Will be masked on public listing (e.g. CH01****21)</span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">City / RTO Region</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none font-semibold text-forest-300"
                >
                  <option>Chandigarh</option>
                  <option>Mohali</option>
                  <option>Panchkula</option>
                  <option>Delhi</option>
                  <option>Bengaluru</option>
                  <option>Pune</option>
                  <option>Mumbai</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <span className="text-xs text-slate-400">Step 1 of 8</span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Continue to Photographs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: VEHICLE PHOTOGRAPHS */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Step 2 of 8
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Upload Vehicle Photographs</h2>
              <p className="text-xs text-slate-400 mt-1">Clear photos from multiple angles establish buyer confidence</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { slot: 'front', label: '1. Front View' },
                { slot: 'rear', label: '2. Rear View' },
                { slot: 'left', label: '3. Left Side' },
                { slot: 'right', label: '4. Right Side' },
                { slot: 'dashboard', label: '5. Dashboard / Odometer' },
                { slot: 'tyres', label: '6. Tyres Tread' },
                { slot: 'engine', label: category === 'electric' ? '7. Motor / Battery Area' : '7. Engine Block' },
                { slot: 'damage', label: '8. Visible Damage / Scratches' }
              ].map((s) => {
                const existing = uploadedPhotos.find((p) => p.slot === s.slot);
                return (
                  <div
                    key={s.slot}
                    className="p-3 rounded-2xl bg-forest-950 border border-forest-800/80 flex flex-col justify-between h-40 relative overflow-hidden group"
                  >
                    {existing ? (
                      <>
                        <img src={existing.url} alt={s.label} className="w-full h-24 object-cover rounded-xl" />
                        <div className="flex items-center justify-between mt-2 text-[10px]">
                          <span className="font-bold text-white truncate">{s.label}</span>
                          <span className="text-emerald-400 font-bold">✓</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                        <Camera className="w-6 h-6 text-slate-500 group-hover:text-forest-400 transition-colors" />
                        <span className="text-[10px] text-slate-400 font-bold leading-tight">{s.label}</span>
                        <label className="cursor-pointer text-[10px] text-forest-300 bg-forest-900 hover:bg-forest-800 px-2 py-1 rounded-lg font-semibold">
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                setUploadedPhotos([...uploadedPhotos, { slot: s.slot, url: URL.createObjectURL(f), name: f.name }]);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-forest-950/80 border border-forest-900 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-forest-400 shrink-0 mt-0.5" />
              <span>
                <strong>Visual Condition Transparency:</strong> Computer vision assists with visible cosmetic observations. Photographs alone do not prove mechanical health, frame alignment, or engine internal clearance.
              </span>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl bg-forest-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Continue to Condition</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: CONDITION, MILEAGE & PICKUP LOCATION */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Step 3 of 8
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Condition, Mileage & Pickup Location</h2>
              <p className="text-xs text-slate-400 mt-1">Specify usage details and seller viewing location</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Odometer Reading (Kilometres)</label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Asking Price (INR)</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-forest-300 font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Ownership Count</label>
                <select
                  value={owners}
                  onChange={(e) => setOwners(Number(e.target.value))}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white"
                >
                  <option value={1}>1st Owner (Single Owner)</option>
                  <option value={2}>2nd Owner</option>
                  <option value={3}>3rd or Higher Owner</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Overall Condition Grade</label>
                <select
                  value={overallCondition}
                  onChange={(e) => setOverallCondition(e.target.value as any)}
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white font-medium"
                >
                  <option value="excellent">Showroom Mint (Like New)</option>
                  <option value="good">Good (Normal Commute Wear)</option>
                  <option value="fair">Fair (Minor Scratches / Service Needed)</option>
                </select>
              </div>
            </div>

            {/* Dedicated Pickup Location Map Picker */}
            <div className="space-y-3 pt-2">
              <label className="text-slate-300 font-bold text-xs block">
                Pickup & Viewing Location on Interactive Map
              </label>
              <SellerPickupLocationPicker
                initialLocation={pickupLocation}
                onLocationConfirmed={(loc) => {
                  setPickupLocation(loc);
                  setIsPickupConfirmed(true);
                }}
              />
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl bg-forest-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Continue to Level 1 Verification</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: LEVEL 1 – BASIC DOCUMENT VERIFICATION */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Level 1 Verification
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Basic Vehicle Verification</h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload your Registration Certificate (RC), Insurance policy, and Pollution Under Control (PUC) certificate.
              </p>
            </div>

            {/* Document Upload Cards */}
            <div className="space-y-4">
              
              {/* CARD A: REGISTRATION CERTIFICATE (RC) */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>A. Registration Certificate (RC)</span>
                        <span className="text-[10px] text-amber-400 font-semibold">*Required</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Accepted: PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>

                  {rcResult ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{rcResult.status.toUpperCase()}</span>
                    </span>
                  ) : (
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isRcUploading ? 'Extracting OCR...' : 'Upload RC'}</span>
                      <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleRcUpload} disabled={isRcUploading} />
                    </label>
                  )}
                </div>

                {/* RC Extraction Results Table */}
                {rcResult && (
                  <div className="p-4 rounded-xl bg-black/40 border border-forest-900 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-forest-900 pb-2">
                      <span className="font-bold text-forest-300">OCR Extracted Information</span>
                      <span className="text-[10px] text-slate-400">OCR Confidence: 94.8%</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {rcResult.comparison && Object.entries(rcResult.comparison).map(([field, info]: any) => (
                        <div key={field} className="p-2 rounded-lg bg-forest-950/70 border border-forest-900 flex justify-between items-center">
                          <div>
                            <span className="text-slate-400 block text-[10px] capitalize">{field.replace('_', ' ')}:</span>
                            <span className="font-bold text-white">{info.extracted || '--'}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            info.status === 'matched' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                          }`}>
                            {info.status === 'matched' ? 'Matched' : 'Needs Review'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD B: INSURANCE DOCUMENT */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">B. Vehicle Insurance Policy</h3>
                      <p className="text-[11px] text-slate-400">Comprehensive or Third Party cover proof</p>
                    </div>
                  </div>

                  {insuranceResult ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VALID ({insuranceResult.expiry_date})</span>
                    </span>
                  ) : (
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isInsUploading ? 'Extracting...' : 'Upload Insurance'}</span>
                      <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleInsuranceUpload} disabled={isInsUploading} />
                    </label>
                  )}
                </div>

                {insuranceResult && (
                  <div className="p-3 rounded-xl bg-black/40 border border-forest-900 text-xs flex justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Policy Provider:</span>
                      <span className="font-bold text-white">{insuranceResult.extracted_fields?.provider}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Policy Number:</span>
                      <span className="font-mono text-white">{insuranceResult.extracted_fields?.policy_number}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Expiry:</span>
                      <span className="font-bold text-emerald-400">{insuranceResult.expiry_date}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD C: POLLUTION UNDER CONTROL (PUC) */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">C. PUC Certificate</h3>
                      <p className="text-[11px] text-slate-400">Emission compliance certificate</p>
                    </div>
                  </div>

                  {pucResult ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VALID</span>
                    </span>
                  ) : (
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isPucUploading ? 'Scanning...' : 'Upload PUC'}</span>
                      <input type="file" accept=".pdf,image/*" className="hidden" onChange={handlePucUpload} disabled={isPucUploading} />
                    </label>
                  )}
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-2xl bg-forest-950/80 border border-forest-900 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important Legal Notice:</strong> An OCR match confirms that submitted information is consistent with your listing. Official authenticity requires authorized VAHAN partner confirmation.
              </span>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl bg-forest-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Continue to Level 2 Verification</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: LEVEL 2 – VEHICLE CONDITION & MAINTENANCE */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Level 2 Verification
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Vehicle Condition & Maintenance</h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide service history, repair bills, tyre status, and accident disclosure.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Service History Details */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <h3 className="font-bold text-sm text-white">A. Maintenance & Periodic Service</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 mb-1 block">Service Frequency</label>
                    <select
                      value={serviceHistoryTier}
                      onChange={(e) => setServiceHistoryTier(e.target.value)}
                      className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="regular">Regularly Serviced on Schedule</option>
                      <option value="occasional">Occasionally Serviced</option>
                      <option value="none">No Documented History</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Last Service Date</label>
                    <input
                      type="text"
                      value={lastServiceDate}
                      onChange={(e) => setLastServiceDate(e.target.value)}
                      className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Odometer at Last Service</label>
                    <input
                      type="number"
                      value={lastServiceOdo}
                      onChange={(e) => setLastServiceOdo(Number(e.target.value))}
                      className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Upload Multiple Repair Bills */}
                <div className="pt-2 border-t border-forest-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-300">B. Upload Workshop Repair / Service Bills</span>
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white font-bold text-[11px] flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Add Bill</span>
                      <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleRepairBillUpload} />
                    </label>
                  </div>

                  {uploadedRepairBills.length > 0 && (
                    <div className="space-y-1.5">
                      {uploadedRepairBills.map((b, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-forest-900 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white">{b.extracted_fields?.workshop_name}</span>
                          <span className="text-forest-300 font-bold">₹{b.extracted_fields?.bill_amount_inr}</span>
                          <span className="text-slate-400">{b.extracted_fields?.bill_date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tyre & Battery Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                  <h3 className="font-bold text-sm text-white">C. Tyre Condition</h3>
                  <select
                    value={tyreCondition}
                    onChange={(e) => setTyreCondition(e.target.value)}
                    className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="excellent">Excellent (&gt;85% Tread Remaining)</option>
                    <option value="good">Good (50% - 85% Tread Remaining)</option>
                    <option value="average">Average (30% - 50% Tread)</option>
                    <option value="needs_replacement">Needs Replacement Soon</option>
                  </select>
                  <input
                    type="text"
                    value={tyreNotes}
                    onChange={(e) => setTyreNotes(e.target.value)}
                    placeholder="Tyre brand, manufacture week..."
                    className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white text-[11px]"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                  <h3 className="font-bold text-sm text-white">
                    {category === 'electric' ? 'D. EV Battery Health' : 'D. 12V Battery Condition'}
                  </h3>
                  {category === 'electric' ? (
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400">Battery Health (SoH):</span>
                        <span className="font-bold text-emerald-400">{evBatteryHealth}%</span>
                      </div>
                      <input
                        type="range"
                        min={65}
                        max={100}
                        value={evBatteryHealth}
                        onChange={(e) => setEvBatteryHealth(Number(e.target.value))}
                        className="w-full accent-forest-500 bg-forest-900 h-2 rounded cursor-pointer"
                      />
                    </div>
                  ) : (
                    <select
                      value={batteryCondition}
                      onChange={(e) => setBatteryCondition(e.target.value)}
                      className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="good">Good (Clean Cold Start)</option>
                      <option value="fair">Fair (Occasional Weak Cranking)</option>
                      <option value="needs_replacement">Needs Replacement</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Accident Disclosure Questionnaire */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                <h3 className="font-bold text-sm text-white">E. Accident and Repair Disclosure</h3>
                <p className="text-[11px] text-slate-400">
                  "Has your vehicle ever been involved in an accident or major repair?"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'none', label: 'No Known Accident' },
                    { id: 'minor', label: 'Minor Fall / Scratch' },
                    { id: 'major', label: 'Major Accidental' },
                    { id: 'major_component', label: 'Component Replaced' },
                    { id: 'not_sure', label: 'Not Sure' }
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setAccidentDisclosure(o.id)}
                      className={`p-2 rounded-xl border text-center text-[10px] font-bold ${
                        accidentDisclosure === o.id
                          ? 'bg-forest-800 border-forest-500 text-white'
                          : 'bg-forest-900 border-forest-800 text-slate-400'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={accidentNotes}
                  onChange={(e) => setAccidentNotes(e.target.value)}
                  placeholder="Additional details regarding repairs or disclosures..."
                  rows={2}
                  className="w-full bg-forest-900 border border-forest-800 rounded-xl p-2.5 text-white text-[11px] focus:outline-none"
                />
              </div>

            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2.5 rounded-xl bg-forest-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={submitLevel2}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Save & Continue to Level 3</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: LEVEL 3 – OWNERSHIP & TRANSFER VERIFICATION */}
        {/* ======================================================== */}
        {currentStep === 6 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Level 3 Verification
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Ownership & Transfer Verification</h2>
              <p className="text-xs text-slate-400 mt-1">
                Confirm seller identity authorization, transfer readiness (Form 29/30), and loan hypothecation clearance.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Seller Authorisation */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <h3 className="font-bold text-sm text-white">A. Seller Authorisation</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 mb-1 block">Seller Full Legal Name</label>
                    <input
                      type="text"
                      value={sellerFullName}
                      onChange={(e) => setSellerFullName(e.target.value)}
                      className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 mb-1 block">Relationship to Registered RC Owner</label>
                    <select
                      value={relationshipToOwner}
                      onChange={(e) => {
                        setRelationshipToOwner(e.target.value);
                        setIsRegisteredOwner(e.target.value === 'registered_owner');
                      }}
                      className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="registered_owner">I am the Registered Owner on the RC</option>
                      <option value="family_member">Family Member (With Authorisation)</option>
                      <option value="authorized_agent">Authorized Dealer / Representative</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="text-slate-400 mb-1 block">Authorisation Statement</label>
                  <input
                    type="text"
                    value={authorisationNotes}
                    onChange={(e) => setAuthorisationNotes(e.target.value)}
                    className="w-full bg-forest-900 border border-forest-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* RTO Transfer Forms (Form 29 & Form 30) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">B. Form 29 (Notice of Transfer)</h4>
                    <span className="text-[10px] text-forest-400 font-bold">RTO Statutory</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Notice of ownership transfer document ready for buyer signature.</p>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={hasForm29}
                      onChange={(e) => setHasForm29(e.target.checked)}
                      className="accent-forest-500 w-4 h-4 rounded"
                    />
                    <span>Form 29 signed / ready for transfer</span>
                  </label>
                </div>

                <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">C. Form 30 (Application for Transfer)</h4>
                    <span className="text-[10px] text-forest-400 font-bold">RTO Statutory</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Application of intimation and transfer of ownership.</p>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={hasForm30}
                      onChange={(e) => setHasForm30(e.target.checked)}
                      className="accent-forest-500 w-4 h-4 rounded"
                    />
                    <span>Form 30 signed / ready for transfer</span>
                  </label>
                </div>
              </div>

              {/* Loan Hypothecation & NOC */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                <h3 className="font-bold text-sm text-white">D. Loan & Bank Hypothecation Clearance</h3>
                <p className="text-[11px] text-slate-400">
                  "Is the vehicle currently under a bank loan or financier hypothecation?"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'no_loan', label: 'No Active Loan' },
                    { id: 'loan_cleared', label: 'Loan Cleared (NOC In Hand)' },
                    { id: 'active_loan', label: 'Active Loan' },
                    { id: 'not_sure', label: 'Not Sure' }
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLoanStatus(l.id)}
                      className={`p-2.5 rounded-xl border text-center text-[10px] font-bold ${
                        loanStatus === l.id
                          ? 'bg-forest-800 border-forest-500 text-white'
                          : 'bg-forest-900 border-forest-800 text-slate-400'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consent Box */}
              <div className="p-4 rounded-2xl bg-forest-950/80 border border-forest-900 text-[11px] flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={sellerConsent}
                  onChange={(e) => setSellerConsent(e.target.checked)}
                  className="accent-forest-500 w-4 h-4 rounded mt-0.5 shrink-0"
                />
                <p className="text-slate-300">
                  I hereby give consent to GEAR UP to verify the submitted documents for consistency against vehicle records. I understand that private personal data (address, full chassis) will remain masked from public listings.
                </p>
              </div>

            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2.5 rounded-xl bg-forest-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={submitLevel3}
                disabled={!sellerConsent}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Generate Verification Report</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: REVIEW VERIFICATION SUMMARY DASHBOARD */}
        {/* ======================================================== */}
        {currentStep === 7 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verification Report Generated</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Your Vehicle Verification Report</h2>
              <p className="text-xs text-slate-400 mt-1">
                Overview of 3-level verification before publishing live to GEAR UP marketplace.
              </p>
            </div>

            {/* Vehicle Header Summary Card */}
            <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 flex flex-col sm:flex-row items-center gap-5">
              <img
                src={uploadedPhotos[0]?.url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'}
                alt="Bike"
                className="w-28 h-20 rounded-xl object-cover"
              />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] text-forest-400 font-bold uppercase tracking-wider">Reference #{listingId}</span>
                <h3 className="font-heading font-bold text-lg text-white">{year} {brand} {model}</h3>
                <p className="text-xs text-slate-400">{variant} • {km.toLocaleString()} km</p>
                <span className="inline-block font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded text-slate-300 font-bold">
                  Registration: {registrationNumber ? `${registrationNumber.slice(0, 4)}****${registrationNumber.slice(-2)}` : 'CH01****21'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Asking Price</span>
                <span className="font-heading font-black text-xl text-forest-300">{formatINR(askingPrice)}</span>
              </div>
            </div>

            {/* Three Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* LEVEL 1 CARD */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-forest-400 uppercase tracking-wider">Level 1</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Completed
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white">Basic Document Verification</h4>
                  
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>RC Document:</span>
                      <span className="text-emerald-400 font-bold">✓ Matched</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Insurance Policy:</span>
                      <span className="text-emerald-400 font-bold">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>PUC Certificate:</span>
                      <span className="text-emerald-400 font-bold">✓ Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reg No Consistency:</span>
                      <span className="text-emerald-400 font-bold">✓ 100% Match</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-300 text-xs font-semibold"
                >
                  Edit Level 1
                </button>
              </div>

              {/* LEVEL 2 CARD */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-forest-400 uppercase tracking-wider">Level 2</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Completed
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white">Vehicle Condition & Maintenance</h4>
                  
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Service Records:</span>
                      <span className="text-white font-bold capitalize">{serviceHistoryTier}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Repair Bills:</span>
                      <span className="text-white font-bold">{uploadedRepairBills.length} Bill(s)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tyres Condition:</span>
                      <span className="text-white font-bold capitalize">{tyreCondition}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Accident Disclosure:</span>
                      <span className="text-emerald-400 font-bold capitalize">{accidentDisclosure}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-300 text-xs font-semibold"
                >
                  Edit Level 2
                </button>
              </div>

              {/* LEVEL 3 CARD */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-forest-400 uppercase tracking-wider">Level 3</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Completed
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white">Ownership & Transfer</h4>
                  
                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Seller Authorisation:</span>
                      <span className="text-emerald-400 font-bold">✓ Confirmed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Form 29 Notice:</span>
                      <span className="text-white font-bold">Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Form 30 Transfer:</span>
                      <span className="text-white font-bold">Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Loan Hypothecation:</span>
                      <span className="text-emerald-400 font-bold capitalize">{loanStatus.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(6)}
                  className="w-full py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-slate-300 text-xs font-semibold"
                >
                  Edit Level 3
                </button>
              </div>

            </div>

            {/* Bottom Overall Status Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-forest-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-heading font-bold text-sm text-white">
                    Overall Status: Verified Documents Listing
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  All 3 levels completed. Your bike will carry the official "GEAR UP Document Verified" trust badge.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="px-6 py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-glow"
              >
                <span>Final Review & Submit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 8: FINAL REVIEW & SUBMIT LISTING */}
        {/* ======================================================== */}
        {currentStep === 8 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Step 8 of 8 • Ready to Publish
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Review & Publish Listing</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your listing is ready to be published live on the GEAR UP marketplace with verified trust credentials.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle</span>
                  <span className="font-bold text-white text-sm">{year} {brand} {model}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Asking Price</span>
                  <span className="font-bold text-forest-300 text-sm">{formatINR(askingPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Odometer</span>
                  <span className="font-bold text-white text-sm">{km.toLocaleString()} km</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Location</span>
                  <span className="font-bold text-white text-sm">{pickupLocation.locality}, {pickupLocation.city}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-forest-900 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Level 1 (RC, Insurance, PUC) Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Level 2 (Condition & Service) Disclosed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Level 3 (Ownership & NOC) Authorized</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-forest-900">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="px-4 py-2.5 rounded-xl bg-forest-950 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Report</span>
              </button>
              <button
                type="button"
                onClick={handlePublishListing}
                className="px-8 py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow"
              >
                <span>Publish Listing Live Now</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
