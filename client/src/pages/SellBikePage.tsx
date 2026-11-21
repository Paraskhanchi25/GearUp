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
  Info,
  X,
  Lock,
  Trash2,
  RotateCcw,
  ExternalLink,
  UserCheck,
  FileSearch
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
  generateListing,
  getVerificationGateStatus,
  publishListing,
  deleteVerificationDocument,
  reuseRcForOwnership,
  getDocumentAnalysisReport
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

  // Step 4: Level 1 – Mandatory Vehicle Documents (4-Certificate System)
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [rcResult, setRcResult] = useState<any>(null);
  const [isRcUploading, setIsRcUploading] = useState(false);

  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [insuranceResult, setInsuranceResult] = useState<any>(null);
  const [isInsUploading, setIsInsUploading] = useState(false);

  const [pucFile, setPucFile] = useState<File | null>(null);
  const [pucResult, setPucResult] = useState<any>(null);
  const [isPucUploading, setIsPucUploading] = useState(false);

  // Document 4: Ownership / Seller Authorisation Proof
  const [ownershipFile, setOwnershipFile] = useState<File | null>(null);
  const [ownershipResult, setOwnershipResult] = useState<any>(null);
  const [isOwnershipUploading, setIsOwnershipUploading] = useState(false);
  const [ownershipMode, setOwnershipMode] = useState<'reuse_rc' | 'upload_custom'>('reuse_rc');

  // Mandatory Submission Gate State
  const [gateStatus, setGateStatus] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishBlockedAlert, setPublishBlockedAlert] = useState<string[] | null>(null);

  // In-Depth Document Analysis Report Modal State
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [activeAnalysisDoc, setActiveAnalysisDoc] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

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

  // Synchronize Gate Status from Server
  const refreshGateStatus = async () => {
    try {
      const data = await getVerificationGateStatus(listingId);
      if (data && data.gate) {
        setGateStatus(data.gate);
        data.gate.checklist?.forEach((item: any) => {
          if (item.doc_type === 'rc') setRcResult(item);
          if (item.doc_type === 'insurance') setInsuranceResult(item);
          if (item.doc_type === 'puc') setPucResult(item);
          if (item.doc_type === 'ownership_proof') setOwnershipResult(item);
        });
      }
    } catch (err) {
      console.warn('Error fetching gate status:', err);
    }
  };

  useEffect(() => {
    refreshGateStatus();
  }, [listingId]);

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

  // --------------------------------------------------------------------------
  // Upload & Document Analysis Handlers (Mandatory 4-Certificate Engine)
  // --------------------------------------------------------------------------
  const handleGenericUpload = async (docType: string, file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds maximum allowed 10MB limit.');
      return;
    }

    if (docType === 'rc') setIsRcUploading(true);
    if (docType === 'insurance') setIsInsUploading(true);
    if (docType === 'puc') setIsPucUploading(true);
    if (docType === 'ownership_proof') setIsOwnershipUploading(true);

    try {
      const fd = new FormData();
      fd.append('listing_id', listingId);
      fd.append('document_type', docType);
      fd.append('registration_number', registrationNumber);
      fd.append('brand', brand);
      fd.append('model', model);
      fd.append('fuel_type', category === 'electric' ? 'ELECTRIC' : 'PETROL');
      fd.append('file', file);

      const res = await uploadVerificationDocument(fd);
      if (res && res.result) {
        if (docType === 'rc') {
          setRcFile(file);
          setRcResult(res.result);
        }
        if (docType === 'insurance') {
          setInsuranceFile(file);
          setInsuranceResult(res.result);
        }
        if (docType === 'puc') {
          setPucFile(file);
          setPucResult(res.result);
        }
        if (docType === 'ownership_proof') {
          setOwnershipFile(file);
          setOwnershipResult(res.result);
        }
        if (res.gate_summary) {
          setGateStatus(res.gate_summary);
        }
      }
    } catch (err: any) {
      alert(`Upload Analysis Error:\n${err.message || 'Please upload a valid PDF, JPG, or PNG document.'}`);
    } finally {
      if (docType === 'rc') setIsRcUploading(false);
      if (docType === 'insurance') setIsInsUploading(false);
      if (docType === 'puc') setIsPucUploading(false);
      if (docType === 'ownership_proof') setIsOwnershipUploading(false);
    }
  };

  const handleReuseRcOwnership = async () => {
    setIsOwnershipUploading(true);
    try {
      const res = await reuseRcForOwnership(listingId, sellerFullName);
      if (res && res.gate_summary) {
        setGateStatus(res.gate_summary);
        const ownItem = res.gate_summary.checklist?.find((c: any) => c.doc_type === 'ownership_proof');
        if (ownItem) setOwnershipResult(ownItem);
      }
    } catch (err: any) {
      alert('Failed linking RC ownership: ' + err.message);
    } finally {
      setIsOwnershipUploading(false);
    }
  };

  const handleRemoveDocument = async (docType: string) => {
    if (!confirm(`Are you sure you want to remove this ${docType.toUpperCase()} document?`)) return;
    try {
      const res = await deleteVerificationDocument(listingId, docType);
      if (res && res.gate_summary) {
        setGateStatus(res.gate_summary);
        if (docType === 'rc') { setRcFile(null); setRcResult(null); }
        if (docType === 'insurance') { setInsuranceFile(null); setInsuranceResult(null); }
        if (docType === 'puc') { setPucFile(null); setPucResult(null); }
        if (docType === 'ownership_proof') { setOwnershipFile(null); setOwnershipResult(null); }
      }
    } catch (err: any) {
      alert('Error removing document: ' + err.message);
    }
  };

  const handleOpenAnalysisReport = async (docType: string) => {
    setActiveAnalysisDoc(docType);
    setAnalysisModalOpen(true);
    setIsLoadingAnalysis(true);
    try {
      const data = await getDocumentAnalysisReport(listingId, docType);
      if (data) {
        setAnalysisReport(data);
      }
    } catch (err) {
      console.warn('Analysis report fetch error:', err);
    } finally {
      setIsLoadingAnalysis(false);
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
    await refreshGateStatus();
    setIsLoadingSummary(false);
    setCurrentStep(7);
  };

  // Step 8 Final Publish (Authoritative Server-Side Gate)
  const handlePublishListing = async () => {
    setIsPublishing(true);
    setPublishBlockedAlert(null);

    try {
      const res = await publishListing({
        listing_id: listingId,
        seller_id: 'seller-default',
        notes: 'Submitted via seller workflow'
      });

      if (res && res.status === 'success') {
        localStorage.removeItem('gearup_seller_draft');
        alert(`🎉 Congratulations! Your listing for ${year} ${brand} ${model} is officially published live!\n\nReference ID: ${listingId}\nStatus: Verified Documents Published\n\nYour vehicle now proudly displays the official "GEAR UP Document Verified" badge on the discovery map and marketplace.`);
        navigate('/explore');
      }
    } catch (err: any) {
      // Show server-side gate rejection reasons
      const blocking = gateStatus?.blocking_reasons || [err.message || 'Mandatory document requirements incomplete.'];
      setPublishBlockedAlert(blocking);
      alert(`⚠️ Listing Publication Blocked by Verification Gate:\n\n${blocking.join('\n• ')}`);
    } finally {
      setIsPublishing(false);
    }
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
        {/* STEP 4: MANDATORY 4-CERTIFICATE VERIFICATION */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Mandatory Verification Gate
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Mandatory Vehicle Documents</h2>
              <p className="text-xs text-slate-400 mt-1">
                All four documents must pass verification before your listing can go live.
              </p>
            </div>

            {/* Verification Progress Counter */}
            <div className="p-4 rounded-2xl bg-forest-950 border border-forest-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-400" />
                  <span>Verification Progress</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {gateStatus?.passed_count || (
                    [rcResult?.status, insuranceResult?.status, pucResult?.status, ownershipResult?.status].filter(s => s === 'passed').length
                  )} of 4 documents verified
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-forest-400 transition-all duration-500 rounded-full"
                  style={{
                    width: `${((gateStatus?.passed_count || [rcResult?.status, insuranceResult?.status, pucResult?.status, ownershipResult?.status].filter(s => s === 'passed').length) / 4) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Document Upload Cards */}
            <div className="space-y-4">
              
              {/* CARD 1: REGISTRATION CERTIFICATE (RC) */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>1. Registration Certificate (RC)</span>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">*Mandatory</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Accepted: PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>

                  {rcResult?.status === 'passed' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASSED</span>
                    </span>
                  ) : rcResult?.status === 'mismatch_found' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 border border-red-500 text-red-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>MISMATCH</span>
                    </span>
                  ) : rcResult?.status === 'unreadable' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 border border-amber-500 text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>UNREADABLE</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-400">
                      NOT UPLOADED
                    </span>
                  )}
                </div>

                {/* RC Dropzone & Actions */}
                {!rcResult ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleGenericUpload('rc', file);
                    }}
                    className="border-2 border-dashed border-forest-800 hover:border-forest-600 rounded-2xl p-6 text-center transition-colors bg-[#08120F]"
                  >
                    <Upload className="w-8 h-8 text-forest-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold text-slate-200">
                      Drag & drop your RC document here, or browse
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Scanned Parivahan RC or physical registration card</p>
                    <label className="inline-block mt-3 cursor-pointer px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-bold transition-colors shadow-sm">
                      <span>{isRcUploading ? 'Analyzing Document & OCR...' : 'Browse RC File'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleGenericUpload('rc', e.target.files[0])}
                        disabled={isRcUploading}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Failure / Mismatch reason callout */}
                    {rcResult.status !== 'passed' && (
                      <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">RC Verification Issue:</p>
                          <p className="text-[11px] text-red-300">{rcResult.status_reason || rcResult.reason || 'Registration details differ from listing.'}</p>
                        </div>
                      </div>
                    )}

                    {/* Extracted Details Table */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-forest-900 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-forest-900 pb-2">
                        <span className="font-bold text-forest-300">RC OCR Analysis Summary</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAnalysisReport('rc')}
                            className="text-[11px] font-semibold text-forest-300 hover:text-white flex items-center gap-1 underline"
                          >
                            <FileSearch className="w-3 h-3" />
                            <span>View Full Analysis</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument('rc')}
                            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Registration No:</span>
                          <span className="font-mono font-bold text-white">
                            {rcResult.extracted_fields?.registration_number ? `${rcResult.extracted_fields.registration_number.slice(0, 4)}****${rcResult.extracted_fields.registration_number.slice(-2)}` : 'CH01****21'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Registered Owner:</span>
                          <span className="font-bold text-white">{rcResult.extracted_fields?.registered_owner || sellerFullName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Maker & Model:</span>
                          <span className="font-bold text-white">{rcResult.extracted_fields?.manufacturer || brand} {rcResult.extracted_fields?.model || model}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 2: INSURANCE CERTIFICATE */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>2. Insurance Certificate</span>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">*Mandatory</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Comprehensive or Third-Party policy certificate</p>
                    </div>
                  </div>

                  {insuranceResult?.status === 'passed' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASSED</span>
                    </span>
                  ) : insuranceResult?.status === 'expired' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 border border-red-500 text-red-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>EXPIRED</span>
                    </span>
                  ) : insuranceResult?.status === 'mismatch_found' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 border border-red-500 text-red-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>MISMATCH</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-400">
                      NOT UPLOADED
                    </span>
                  )}
                </div>

                {!insuranceResult ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleGenericUpload('insurance', file);
                    }}
                    className="border-2 border-dashed border-forest-800 hover:border-forest-600 rounded-2xl p-6 text-center transition-colors bg-[#08120F]"
                  >
                    <Upload className="w-8 h-8 text-forest-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold text-slate-200">
                      Drag & drop your Insurance Certificate here, or browse
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Active comprehensive or liability policy document</p>
                    <label className="inline-block mt-3 cursor-pointer px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-bold transition-colors shadow-sm">
                      <span>{isInsUploading ? 'Scanning Insurance & Expiry...' : 'Browse Insurance File'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleGenericUpload('insurance', e.target.files[0])}
                        disabled={isInsUploading}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {insuranceResult.status !== 'passed' && (
                      <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Insurance Verification Issue:</p>
                          <p className="text-[11px] text-red-300">{insuranceResult.status_reason || insuranceResult.reason || 'Insurance policy is expired or mismatched.'}</p>
                        </div>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-black/40 border border-forest-900 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-forest-900 pb-2">
                        <span className="font-bold text-forest-300">Policy Extraction Details</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAnalysisReport('insurance')}
                            className="text-[11px] font-semibold text-forest-300 hover:text-white flex items-center gap-1 underline"
                          >
                            <FileSearch className="w-3 h-3" />
                            <span>View Full Analysis</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument('insurance')}
                            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Provider:</span>
                          <span className="font-bold text-white">{insuranceResult.extracted_fields?.provider || 'HDFC ERGO'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Policy Expiry Date:</span>
                          <span className={`font-bold ${insuranceResult.is_expired ? 'text-red-400' : 'text-emerald-400'}`}>
                            {insuranceResult.extracted_fields?.expiry_date || insuranceResult.expiry_date}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Registration Checked:</span>
                          <span className="font-mono font-bold text-white">{registrationNumber ? `${registrationNumber.slice(0, 4)}****${registrationNumber.slice(-2)}` : 'CH01****21'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 3: POLLUTION UNDER CONTROL (PUC) */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>3. Pollution Under Control (PUC)</span>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">*Mandatory</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Emission test certificate and valid validity term</p>
                    </div>
                  </div>

                  {pucResult?.status === 'passed' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASSED</span>
                    </span>
                  ) : pucResult?.status === 'expired' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 border border-red-500 text-red-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>EXPIRED</span>
                    </span>
                  ) : pucResult?.status === 'mismatch_found' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 border border-red-500 text-red-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>MISMATCH</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-400">
                      NOT UPLOADED
                    </span>
                  )}
                </div>

                {!pucResult ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleGenericUpload('puc', file);
                    }}
                    className="border-2 border-dashed border-forest-800 hover:border-forest-600 rounded-2xl p-6 text-center transition-colors bg-[#08120F]"
                  >
                    <Upload className="w-8 h-8 text-forest-400 mx-auto mb-2 opacity-80" />
                    <p className="text-xs font-bold text-slate-200">
                      Drag & drop your PUC certificate here, or browse
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Government RTO emission compliance certificate</p>
                    <label className="inline-block mt-3 cursor-pointer px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-bold transition-colors shadow-sm">
                      <span>{isPucUploading ? 'Scanning PUC...' : 'Browse PUC File'}</span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleGenericUpload('puc', e.target.files[0])}
                        disabled={isPucUploading}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pucResult.status !== 'passed' && (
                      <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">PUC Verification Issue:</p>
                          <p className="text-[11px] text-red-300">{pucResult.status_reason || pucResult.reason || 'PUC certificate is expired or invalid.'}</p>
                        </div>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-black/40 border border-forest-900 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-forest-900 pb-2">
                        <span className="font-bold text-forest-300">PUC Emission Details</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenAnalysisReport('puc')}
                            className="text-[11px] font-semibold text-forest-300 hover:text-white flex items-center gap-1 underline"
                          >
                            <FileSearch className="w-3 h-3" />
                            <span>View Full Analysis</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument('puc')}
                            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Certificate No:</span>
                          <span className="font-mono font-bold text-white">{pucResult.extracted_fields?.certificate_number || 'CH01-PUC-2026-9921'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Valid Upto:</span>
                          <span className={`font-bold ${pucResult.is_expired ? 'text-red-400' : 'text-emerald-400'}`}>
                            {pucResult.extracted_fields?.expiry_date || pucResult.expiry_date}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Emission Result:</span>
                          <span className="font-bold text-emerald-400">{pucResult.extracted_fields?.emission_result || 'PASS (BS6 Compliant)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 4: OWNERSHIP / SELLER AUTHORISATION PROOF */}
              <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-forest-300">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>4. Ownership / Seller Authorisation Proof</span>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">*Mandatory</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">RC owner match, purchase invoice, or seller authorisation</p>
                    </div>
                  </div>

                  {ownershipResult?.status === 'passed' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASSED</span>
                    </span>
                  ) : ownershipResult?.status === 'needs_manual_review' ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 border border-amber-500 text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>NEEDS REVIEW</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-400">
                      NOT UPLOADED
                    </span>
                  )}
                </div>

                {/* Option Selector: Registered Owner vs Separate Authorisation */}
                <div className="flex items-center gap-2 text-xs border-b border-forest-900 pb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOwnershipMode('reuse_rc');
                      setIsRegisteredOwner(true);
                      handleReuseRcOwnership();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      ownershipMode === 'reuse_rc'
                        ? 'bg-forest-700 text-white'
                        : 'bg-forest-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    I am the Registered Owner (Use Verified RC)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOwnershipMode('upload_custom');
                      setIsRegisteredOwner(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      ownershipMode === 'upload_custom'
                        ? 'bg-forest-700 text-white'
                        : 'bg-forest-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload Authorisation / Invoice / POA
                  </button>
                </div>

                {ownershipMode === 'reuse_rc' ? (
                  <div className="p-4 rounded-xl bg-forest-900/40 border border-forest-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 font-medium">
                        RC Owner Endorsement Link:
                      </span>
                      {rcResult?.status === 'passed' ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Satisfied via Verified RC</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold">
                          Upload & Pass RC first
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Since you are the registered owner, your verified RC automatically satisfies Document 4 without requiring you to re-upload the same document.
                    </p>
                  </div>
                ) : (
                  <div>
                    {!ownershipResult || ownershipResult.status === 'not_uploaded' ? (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleGenericUpload('ownership_proof', file);
                        }}
                        className="border-2 border-dashed border-forest-800 hover:border-forest-600 rounded-2xl p-6 text-center transition-colors bg-[#08120F]"
                      >
                        <Upload className="w-8 h-8 text-forest-400 mx-auto mb-2 opacity-80" />
                        <p className="text-xs font-bold text-slate-200">
                          Upload Seller Authorisation Document or Original Invoice
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Authorisation letter from registered owner or dealership purchase invoice</p>
                        <label className="inline-block mt-3 cursor-pointer px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-bold transition-colors shadow-sm">
                          <span>{isOwnershipUploading ? 'Scanning Document...' : 'Browse Proof File'}</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleGenericUpload('ownership_proof', e.target.files[0])}
                            disabled={isOwnershipUploading}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-black/40 border border-forest-900 text-xs flex justify-between items-center">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Authorisation Status:</span>
                          <span className="font-bold text-white capitalize">{ownershipResult.status?.replace('_', ' ')}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument('ownership_proof')}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            <div className="p-3.5 rounded-2xl bg-forest-950/80 border border-forest-900 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mandatory Verification Notice:</strong> All four documents must pass automated OCR consistency and date validity checks. Sensitive identification numbers (chassis, engine, full registration) are strictly masked for privacy.
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
                <span>Continue to Level 2 (Condition)</span>
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
        {/* STEP 8: FINAL REVIEW & SUBMIT LISTING (MANDATORY GATE) */}
        {/* ======================================================== */}
        {currentStep === 8 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900 text-forest-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Step 8 of 8 • Mandatory Submission Gate
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-white">Review & Publish Listing</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your listing must clear the mandatory 4-document verification gate before it can go live.
              </p>
            </div>

            {/* Vehicle Summary Card */}
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
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Locality</span>
                  <span className="font-bold text-white text-sm">{pickupLocation.locality}, {pickupLocation.city}</span>
                </div>
              </div>
            </div>

            {/* MANDATORY 4-DOCUMENT GATE CHECKLIST */}
            <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-forest-900 pb-2">
                <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-400" />
                  <span>Mandatory Document Gate Status</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  gateStatus?.can_publish
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                    : 'bg-red-950 text-red-300 border border-red-500/50'
                }`}>
                  {gateStatus?.can_publish ? 'PASSED (4 of 4)' : `BLOCKED (${gateStatus?.passed_count || 0} of 4)`}
                </span>
              </div>

              <div className="space-y-2">
                {(gateStatus?.checklist || [
                  { name: 'Registration Certificate (RC)', passed: rcResult?.status === 'passed', reason: rcResult?.status_reason || 'Pending verification' },
                  { name: 'Insurance Certificate', passed: insuranceResult?.status === 'passed', reason: insuranceResult?.status_reason || 'Pending verification' },
                  { name: 'Pollution Under Control (PUC)', passed: pucResult?.status === 'passed', reason: pucResult?.status_reason || 'Pending verification' },
                  { name: 'Ownership / Seller Authorisation Proof', passed: ownershipResult?.status === 'passed', reason: ownershipResult?.status_reason || 'Pending verification' }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-forest-900/40 border border-forest-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <div>
                        <p className={`font-bold text-xs ${item.passed ? 'text-white' : 'text-red-200'}`}>{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.reason}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.passed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                        : 'bg-red-950 text-red-300 border border-red-600/40'
                    }`}>
                      {item.passed ? 'Passed' : 'Action Required'}
                    </span>
                  </div>
                ))}
              </div>

              {/* BLOCKING ALERT OR APPROVAL BANNER */}
              {!gateStatus?.can_publish ? (
                <div className="p-4 rounded-xl bg-red-950/80 border border-red-700/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-red-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Listing Publication Blocked by Verification Gate</span>
                  </div>
                  <p className="text-[11px] text-red-200/90 leading-relaxed">
                    GEAR UP requires all four mandatory certificates to pass OCR extraction and date validity before your listing can be published live to buyers.
                  </p>
                  {gateStatus?.blocking_reasons && gateStatus.blocking_reasons.length > 0 && (
                    <ul className="list-disc pl-5 text-[11px] text-red-300 space-y-0.5">
                      {gateStatus.blocking_reasons.map((reason: string, rIdx: number) => (
                        <li key={rIdx}>{reason}</li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Fix Incomplete Documents in Step 4</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/80 space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All 4 Mandatory Documents Verified — Cleared for Publication!</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90">
                    Registration Certificate, Insurance Policy, PUC Emission, and Ownership proofs have cleared automated checks. Your listing will carry the official "GEAR UP Document Verified" trust badge.
                  </p>
                </div>
              )}
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
                disabled={!gateStatus?.can_publish || isPublishing}
                title={!gateStatus?.can_publish ? 'Complete all 4 mandatory document checks to publish' : 'Publish listing live'}
                className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                  gateStatus?.can_publish
                    ? 'bg-forest-600 hover:bg-forest-500 text-white shadow-glow cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                {isPublishing ? (
                  <span>Revalidating Gate on Server...</span>
                ) : (
                  <>
                    <span>Publish Listing Live Now</span>
                    {gateStatus?.can_publish ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* IN-DEPTH DOCUMENT ANALYSIS REPORT MODAL */}
        {/* ======================================================== */}
        {analysisModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0E1A16] border border-forest-700/80 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-forest-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-900 text-forest-300 flex items-center justify-center">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-400">
                      OCR Document Analysis Report
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-white capitalize">
                      {activeAnalysisDoc?.replace('_', ' ')} Certificate Analysis
                    </h3>
                    <p className="text-xs text-slate-400">
                      Document #{analysisReport?.filename || 'Uploaded Scan'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAnalysisModalOpen(false)}
                  className="p-2 rounded-xl bg-forest-950 text-slate-400 hover:text-white border border-forest-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isLoadingAnalysis ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-forest-400" />
                  <p>Fetching full OCR analysis breakdown...</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    analysisReport?.status === 'passed'
                      ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
                      : analysisReport?.status === 'expired'
                      ? 'bg-red-950/60 border-red-600/50 text-red-200'
                      : 'bg-amber-950/60 border-amber-600/50 text-amber-200'
                  }`}>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Analysis Status</span>
                      <h4 className="font-bold text-sm text-white capitalize">{analysisReport?.status?.replace('_', ' ')}</h4>
                      <p className="text-[11px] opacity-90 mt-0.5">{analysisReport?.status_reason}</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 font-mono text-xs font-bold">
                      OCR: {Math.round((analysisReport?.ocr_confidence || 0.94) * 100)}%
                    </span>
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="p-4 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                      Structured Field Extractions (Masked for Privacy)
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {analysisReport?.extracted_fields && Object.entries(analysisReport.extracted_fields).map(([k, v]: any) => {
                        if (typeof v === 'object' || k === 'ocr_confidence') return null;
                        return (
                          <div key={k} className="p-2.5 rounded-lg bg-black/30 border border-forest-900/80">
                            <span className="text-slate-500 block text-[10px] capitalize">{k.replace('_', ' ')}:</span>
                            <span className="font-bold text-white font-mono">{String(v || '--')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Validation Checks Table */}
                  <div className="p-4 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                      Validation Checkpoints
                    </h4>
                    <div className="space-y-2">
                      {analysisReport?.validation_checks?.map((chk: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-forest-900/40 border border-forest-800/80 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="font-bold text-white text-[11px]">{chk.check}</p>
                            <p className="text-[10px] text-slate-400">{chk.details}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            chk.passed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-950 text-red-300 border border-red-500/40'
                          }`}>
                            {chk.passed ? 'Pass' : 'Fail'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy & Legal Callout */}
                  <p className="text-[10px] text-slate-500 italic">
                    * Automated document analysis verifies consistency between uploaded certificates and listing details. Personal identification numbers are masked in accordance with data privacy guidelines.
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-forest-900">
                <button
                  type="button"
                  onClick={() => setAnalysisModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold text-xs transition-colors"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
