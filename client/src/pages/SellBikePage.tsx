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
  FileSearch,
  Navigation,
  Crosshair,
  Compass,
  Cpu,
  CreditCard
} from 'lucide-react';
import { formatINR } from '../utils/geo';
import { PickupLocation } from '../types';
import { SellerPickupLocationPicker } from '../components/SellerPickupLocationPicker';
import { SmartRCVerificationModal } from '../components/SmartRCVerificationModal';
import { PlatformListingFeeModal } from '../components/PlatformListingFeeModal';
import { Vehicle3DViewer } from '../components/3d/Vehicle3DViewer';
import { 
  getVehicleCatalog,
  uploadVerificationDocument, 
  getVerificationGateStatus,
  publishListing,
  deleteVerificationDocument,
  reuseRcForOwnership,
  getDocumentAnalysisReport,
  uploadVehiclePhoto,
  getVehiclePhotos,
  deleteVehiclePhoto,
  setSellerLocationConfig,
  getPlatformFeeConfig,
  getListingFeeStatus
} from '../services/aiApi';

// 8 Mandatory Vehicle Photo Angles (Strictly no stock photos)
const REQUIRED_PHOTO_SLOTS = [
  { slot: 'front', label: '1. Front View', desc: 'Direct frontal shot showing headlamp, mirrors and windshield' },
  { slot: 'rear', label: '2. Rear View', desc: 'Direct rear angle showing tail lamp, indicators and number plate' },
  { slot: 'left_side', label: '3. Left Side View', desc: 'Full side profile showing exhaust, left panels, footrest and frame' },
  { slot: 'right_side', label: '4. Right Side View', desc: 'Full side profile showing chain/belt, brake levers, and right bodywork' },
  { slot: 'front_left_diagonal', label: '5. Front-Left Diagonal', desc: '45-degree angle capturing front tyre, mudguard and left body panels' },
  { slot: 'front_right_diagonal', label: '6. Front-Right Diagonal', desc: '45-degree angle capturing front tyre, mudguard and right body panels' },
  { slot: 'rear_left_diagonal', label: '7. Rear-Left Diagonal', desc: '45-degree angle capturing rear wheel, suspension, and left side' },
  { slot: 'rear_right_diagonal', label: '8. Rear-Right Diagonal', desc: '45-degree angle capturing silencer/exhaust, rear swingarm and right side' }
];

export const SellBikePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [listingId, setListingId] = useState<string>(() => {
    const saved = localStorage.getItem('gearup_current_listing_id');
    if (saved) return saved;
    const newId = 'GEAR-UP-' + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem('gearup_current_listing_id', newId);
    return newId;
  });

  // Step 1: Vehicle Details State
  const [category, setCategory] = useState<'motorcycle' | 'scooter' | 'electric'>('motorcycle');
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('Classic 350');
  const [variant, setVariant] = useState('Dark Stealth Black Dual Channel ABS');
  const [year, setYear] = useState<number>(2023);
  const [registrationNumber, setRegistrationNumber] = useState('CH01AB8821');
  const [city, setCity] = useState('Chandigarh');
  const [km, setKm] = useState<number>(14000);
  const [owners, setOwners] = useState<number>(1);
  const [overallCondition, setOverallCondition] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [askingPrice, setAskingPrice] = useState<number>(182000);
  const [fuelType, setFuelType] = useState('PETROL');

  // Step 2: 8 Required Vehicle Photographs (Zero Mock Photos)
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, any>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Step 3: Mandatory 4-Certificate Documents
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [rcResult, setRcResult] = useState<any>(null);
  const [isRcUploading, setIsRcUploading] = useState(false);

  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [insuranceResult, setInsuranceResult] = useState<any>(null);
  const [isInsUploading, setIsInsUploading] = useState(false);

  const [pucFile, setPucFile] = useState<File | null>(null);
  const [pucResult, setPucResult] = useState<any>(null);
  const [isPucUploading, setIsPucUploading] = useState(false);

  const [ownershipFile, setOwnershipFile] = useState<File | null>(null);
  const [ownershipResult, setOwnershipResult] = useState<any>(null);
  const [isOwnershipUploading, setIsOwnershipUploading] = useState(false);
  const [ownershipMode, setOwnershipMode] = useState<'reuse_rc' | 'upload_custom'>('reuse_rc');
  const [sellerFullName, setSellerFullName] = useState('Vikramjit Singh');
  const [smartRCModalOpen, setSmartRCModalOpen] = useState(false);

  // Step 4: Pickup & Test Ride Location
  const [pickupLocation, setPickupLocation] = useState<PickupLocation>({
    lat: 30.7333,
    lng: 76.7794,
    address: 'SCO 88-89, Sector 17-C, Chandigarh',
    city: 'Chandigarh',
    locality: 'Sector 17',
    landmark: 'Near Neelam Cinema & Plaza Fountain',
    visibility: 'approximate_public',
  });
  const [meetupSpotType, setMeetupSpotType] = useState('Safe Public Commercial Hub');
  const [testRideAvailable, setTestRideAvailable] = useState<boolean>(true);
  const [pickupInstructions, setPickupInstructions] = useState(
    'Available on weekends between 10:00 AM - 4:00 PM. Please bring an original driving licence and helmet for a test ride.'
  );
  const [locationSaved, setLocationSaved] = useState<boolean>(true);

  // Gate & Analysis Modal State
  const [gateStatus, setGateStatus] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishBlockedAlert, setPublishBlockedAlert] = useState<string[] | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [activeAnalysisDoc, setActiveAnalysisDoc] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Platform Listing Fee State
  const [feeConfig, setFeeConfig] = useState<any>({
    listing_fee_inr: 299,
    currency: 'INR',
    fee_title: 'GEAR UP Verified Marketplace Listing Fee',
    refund_policy: 'Full refund if vehicle fails mandatory RTO document verification; non-refundable once listing is published live on the marketplace.',
    included_features: [
      'Interactive 3D Digital Twin linking based on vehicle platform specifications',
      'Mandatory 4-certificate AI OCR & RTO government document validation badge',
      '8-angle high-resolution vehicle photo inspection showcase',
      'AI Resale Price recommendation and Deal Detector optimization',
      'Protected seller location privacy with verified buyer screening'
    ]
  });
  const [feeStatus, setFeeStatus] = useState<any>({
    is_paid: false,
    status: 'awaiting_payment',
    amount_inr: 299
  });
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

  // Synchronize Gate Status, Uploaded Photos & Platform Fee from Server
  const refreshStatus = async () => {
    try {
      const gateData = await getVerificationGateStatus(listingId);
      if (gateData && gateData.gate) {
        setGateStatus(gateData.gate);
        gateData.gate.checklist?.forEach((item: any) => {
          if (item.doc_type === 'rc') setRcResult(item);
          if (item.doc_type === 'insurance') setInsuranceResult(item);
          if (item.doc_type === 'puc') setPucResult(item);
          if (item.doc_type === 'ownership_proof') setOwnershipResult(item);
        });
      }

      // Fetch uploaded photos from storage
      const photosData = await getVehiclePhotos(listingId);
      if (photosData && photosData.slots) {
        const photoMap: Record<string, any> = {};
        photosData.slots.forEach((s: any) => {
          if (s.is_uploaded && s.photo) {
            photoMap[s.slot] = s.photo;
          }
        });
        setUploadedPhotos(photoMap);
      }

      // Fetch platform fee config and listing payment status
      const [configData, statusData] = await Promise.all([
        getPlatformFeeConfig().catch(() => null),
        getListingFeeStatus(listingId).catch(() => null)
      ]);
      if (configData) setFeeConfig(configData);
      if (statusData) setFeeStatus(statusData);
    } catch (err) {
      console.warn('Error fetching listing status:', err);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [listingId]);

  // Restore Draft on Mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('gearup_seller_draft_' + listingId);
    if (savedDraft) {
      try {
        const d = JSON.parse(savedDraft);
        if (d.brand) setBrand(d.brand);
        if (d.model) setModel(d.model);
        if (d.variant) setVariant(d.variant);
        if (d.year) setYear(d.year);
        if (d.registrationNumber) setRegistrationNumber(d.registrationNumber);
        if (d.askingPrice) setAskingPrice(d.askingPrice);
        if (d.city) setCity(d.city);
        if (d.km) setKm(d.km);
        if (d.pickupLocation) setPickupLocation(d.pickupLocation);
        if (d.testRideAvailable !== undefined) setTestRideAvailable(d.testRideAvailable);
        if (d.pickupInstructions) setPickupInstructions(d.pickupInstructions);
      } catch (e) {
        console.warn('Error reading saved draft', e);
      }
    }
  }, [listingId]);

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
      pickupLocation,
      testRideAvailable,
      pickupInstructions,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem('gearup_seller_draft_' + listingId, JSON.stringify(draftData));
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  // --------------------------------------------------------------------------
  // Step 2: 8 Required Vehicle Photos Handlers
  // --------------------------------------------------------------------------
  const handlePhotoUpload = async (slot: string, file: File) => {
    if (!file) return;
    setPhotoError(null);

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError('Image file exceeds the maximum allowed 10MB limit.');
      return;
    }

    setUploadingSlot(slot);
    try {
      const fd = new FormData();
      fd.append('listing_id', listingId);
      fd.append('slot', slot);
      fd.append('file', file);

      const res = await uploadVehiclePhoto(fd);
      if (res && res.photo) {
        setUploadedPhotos(prev => ({ ...prev, [slot]: res.photo }));
        if (res.gate_summary) {
          setGateStatus(res.gate_summary);
        }
      }
    } catch (err: any) {
      setPhotoError(`Photo upload error: ${err.message || 'Please upload a valid JPG, PNG, or WEBP image.'}`);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handlePhotoDelete = async (slot: string) => {
    if (!confirm('Are you sure you want to remove this photograph?')) return;
    try {
      const res = await deleteVehiclePhoto(listingId, slot);
      if (res && res.status === 'success') {
        setUploadedPhotos(prev => {
          const next = { ...prev };
          delete next[slot];
          return next;
        });
        if (res.gate_summary) {
          setGateStatus(res.gate_summary);
        }
      }
    } catch (err: any) {
      alert('Error removing photo: ' + err.message);
    }
  };

  const uploadedPhotosCount = Object.keys(uploadedPhotos).length;
  const isPhotosComplete = uploadedPhotosCount === 8;

  // --------------------------------------------------------------------------
  // Step 3: Mandatory Document Upload Handlers
  // --------------------------------------------------------------------------
  const handleDocumentUpload = async (docType: string, file: File) => {
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
        if (docType === 'rc') { setRcFile(file); setRcResult(res.result); }
        if (docType === 'insurance') { setInsuranceFile(file); setInsuranceResult(res.result); }
        if (docType === 'puc') { setPucFile(file); setPucResult(res.result); }
        if (docType === 'ownership_proof') { setOwnershipFile(file); setOwnershipResult(res.result); }
        if (res.gate_summary) setGateStatus(res.gate_summary);
      }
    } catch (err: any) {
      alert(`Document Upload Analysis Error:\n${err.message || 'Please upload a valid PDF, JPG, or PNG document.'}`);
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
      if (data) setAnalysisReport(data);
    } catch (err) {
      console.warn('Analysis report fetch error:', err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const passedDocsCount = gateStatus?.passed_count || 0;
  const isDocumentsComplete = passedDocsCount === 4;

  // --------------------------------------------------------------------------
  // Step 4: Pickup & Test Ride Location Handlers
  // --------------------------------------------------------------------------
  const handleLocationConfirmed = async (loc: PickupLocation) => {
    setPickupLocation(loc);
    try {
      await setSellerLocationConfig({
        listing_id: listingId,
        lat: loc.lat,
        lng: loc.lng,
        address: loc.address,
        city: loc.city,
        locality: loc.locality,
        landmark: loc.landmark,
        meetup_spot_type: meetupSpotType,
        test_ride_available: testRideAvailable,
        pickup_instructions: pickupInstructions
      });
      setLocationSaved(true);
    } catch (err) {
      console.warn('Location save error:', err);
    }
  };

  // --------------------------------------------------------------------------
  // Step 5: Final Publish (Authoritative Server-Side Gate)
  // --------------------------------------------------------------------------
  const handlePublishListing = async () => {
    setIsPublishing(true);
    setPublishBlockedAlert(null);

    // Platform listing fee payment requirement check
    if (!feeStatus?.is_paid) {
      setIsPublishing(false);
      setPublishBlockedAlert([
        `GEAR UP platform listing fee (${formatINR(feeConfig.listing_fee_inr)}) is required before publication. Please complete the payment below.`
      ]);
      setIsFeeModalOpen(true);
      return;
    }

    try {
      const res = await publishListing({
        listing_id: listingId,
        seller_id: 'seller-default',
        notes: 'Submitted via 5-step seller verification workflow'
      });

      if (res && res.status === 'success') {
        const primaryImg = uploadedPhotos['front']?.url || Object.values(uploadedPhotos)[0]?.url || '';
        const gallery = Object.values(uploadedPhotos).map((p: any) => p.url);

        const newListingItem = {
          id: listingId,
          title: `${year} ${brand} ${model} ${variant}`,
          brand,
          model,
          variant,
          category,
          year,
          regYear: year,
          regState: registrationNumber.slice(0, 2),
          rtoCode: registrationNumber.slice(0, 4),
          km,
          fuel: fuelType.toLowerCase() as any,
          owners,
          price: askingPrice,
          originalMrp: askingPrice + 25000,
          city,
          state: 'Punjab / Chandigarh',
          area: pickupLocation.locality,
          lat: pickupLocation.lat,
          lng: pickupLocation.lng,
          pickupAddress: pickupLocation.address,
          pickupCity: pickupLocation.city,
          pickupLocality: pickupLocation.locality,
          pickupLandmark: pickupLocation.landmark,
          locationVisibility: 'exact_verified_only' as any,
          sellerType: 'individual' as any,
          sellerName: sellerFullName,
          verificationTier: 'document_verified' as any,
          inspectionScore: 4.8,
          documentVerified: true,
          insuranceValidUntil: insuranceResult?.expiry_date || '20/12/2026',
          pucValidUntil: pucResult?.expiry_date || '15/11/2026',
          aiFairPriceMin: Math.round(askingPrice * 0.95),
          aiFairPriceMax: Math.round(askingPrice * 1.05),
          aiSuggestedPrice: askingPrice,
          aiDealBadge: 'good_deal' as any,
          aiCosmeticScore: 9.0,
          aiCosmeticNotes: ['Verified 8/8 camera angles', 'High-res bodywork inspected'],
          aiMechanicalNotes: ['BS6 emission certified', 'OEM documented service'],
          primaryImage: primaryImg,
          galleryImages: gallery,
          specs: {
            engineCc: category === 'electric' ? undefined : 349,
            powerBhp: category === 'electric' ? '8.5 kW' : '20.2 bhp',
            mileageKmpl: category === 'electric' ? undefined : 36,
            rangeKm: category === 'electric' ? 140 : undefined
          }
        };

        const existingCustom = JSON.parse(localStorage.getItem('gearup_custom_listings') || '[]');
        localStorage.setItem('gearup_custom_listings', JSON.stringify([newListingItem, ...existingCustom]));

        localStorage.removeItem('gearup_seller_draft_' + listingId);
        localStorage.removeItem('gearup_current_listing_id');
        alert(`🎉 Congratulations! Your listing for ${year} ${brand} ${model} is officially published live!\n\nReference ID: ${listingId}\nStatus: Verified Documents & Photographs Live\n\nYour vehicle now proudly displays the official "GEAR UP Document Verified" badge on the discovery map and marketplace.`);
        navigate('/explore');
      }
    } catch (err: any) {
      const blocking = gateStatus?.blocking_reasons || [err.message || 'Mandatory photo and document requirements incomplete.'];
      setPublishBlockedAlert(blocking);
      alert(`⚠️ Listing Publication Blocked by Verification Gate:\n\n${blocking.join('\n• ')}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-28">
      {/* Save Draft Floating Notification */}
      {draftSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#161816] border border-white/15 text-white text-xs shadow-2xl flex items-center gap-2.5 animate-bounce backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Listing draft saved safely! You can resume anytime.</span>
        </div>
      )}

      {/* 5-Step Clear Selling Process Navigation Header (Apple Liquid Glass) */}
      <div className="border-b border-[#242622]/[0.08] bg-[#FAF9F5]/85 backdrop-blur-[24px] saturate-[180%] px-4 sm:px-6 py-3.5 sticky top-16 sm:top-20 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#35483C] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
              {currentStep}
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#85857E]">
                Step {currentStep} of 5
              </span>
              <h2 className="font-heading font-bold text-sm sm:text-base text-[#242622] tracking-tight">
                {currentStep === 1 && '1. Vehicle Information'}
                {currentStep === 2 && '2. Vehicle Photographs (8 Angles Required)'}
                {currentStep === 3 && '3. Mandatory Vehicle Documents (4 Certificates)'}
                {currentStep === 4 && '4. Pickup & Test Ride Location'}
                {currentStep === 5 && '5. Review & Publish Listing'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={saveDraft}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/10 text-[#85857E] hover:text-[#242622] text-xs font-mono font-semibold flex items-center gap-1.5 transition-all tactile-btn shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-[#35483C]" />
              <span>Save Draft</span>
            </button>

            {/* 5-Step Progress Indicators */}
            <div className="flex items-center gap-1.5">
              {[
                { step: 1, title: 'Vehicle Info' },
                { step: 2, title: '8 Photos' },
                { step: 3, title: '4 Documents' },
                { step: 4, title: 'Location' },
                { step: 5, title: 'Publish' }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => s.step <= currentStep && setCurrentStep(s.step)}
                  disabled={s.step > currentStep}
                  title={`Step ${s.step}: ${s.title}`}
                  className={`h-2 rounded-full transition-all flex items-center justify-center ${
                    s.step === currentStep
                      ? 'bg-[#35483C] w-8'
                      : s.step < currentStep
                      ? 'bg-[#35483C]/40 w-4'
                      : 'bg-black/10 w-4'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">

        {/* ======================================================== */}
        {/* STEP 1: VEHICLE INFORMATION */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#35483C] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#242622]/10">
                Step 1 of 5
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-[#242622]">Vehicle Information</h2>
              <p className="text-xs text-[#85857E] mt-1">
                Enter core vehicle specifications, ownership, and pricing to initialize verification.
              </p>
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
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 tactile-btn ${
                    category === c.id
                      ? 'bg-[#35483C] border-[#35483C] text-white shadow-md'
                      : 'bg-[#FAF9F5] border-[#242622]/10 text-[#242622] hover:border-[#35483C]'
                  }`}
                >
                  <div className={`text-xs font-bold ${category === c.id ? 'text-white' : 'text-[#242622]'}`}>
                    {c.label}
                  </div>
                  <div className={`text-[10px] mt-0.5 ${category === c.id ? 'text-white/80' : 'text-[#85857E]'}`}>
                    {c.sub}
                  </div>
                </button>
              ))}
            </div>

            {/* Core Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Brand / Manufacturer</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/10 font-medium"
                />
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/10 font-medium"
                />
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Variant / Specification</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/10 font-medium"
                />
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Manufacturing Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C]"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Kilometers Driven (Odometer)</label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C]"
                />
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Number of Previous Owners</label>
                <select
                  value={owners}
                  onChange={(e) => setOwners(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C]"
                >
                  <option value={1}>1st Owner (Single Handed)</option>
                  <option value={2}>2nd Owner</option>
                  <option value={3}>3rd Owner</option>
                  <option value={4}>4+ Owners</option>
                </select>
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">
                  Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CH01AB8821"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] uppercase font-mono font-bold"
                />
                <span className="text-[10px] text-[#85857E] mt-1 block">Masked publicly (e.g. CH01****21)</span>
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">City / RTO Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C]"
                />
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Overall Condition</label>
                <select
                  value={overallCondition}
                  onChange={(e) => setOverallCondition(e.target.value as any)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C]"
                >
                  <option value="excellent">Excellent (Showroom Like)</option>
                  <option value="good">Good (Normal Wear & Tear)</option>
                  <option value="fair">Fair (Requires Minor Service)</option>
                  <option value="poor">Needs Major Overhaul</option>
                </select>
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Expected Asking Price (₹)</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] font-mono font-bold focus:outline-none focus:border-[#35483C]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[#242622]/[0.08]">
              <span className="text-xs text-[#85857E] font-mono">Step 1 of 5</span>
              <button
                type="button"
                onClick={() => {
                  if (!registrationNumber.trim()) {
                    alert('Please enter a valid vehicle registration number.');
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="px-6 py-3 min-h-[44px] rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm tactile-btn border border-[#35483C]"
              >
                <span>Continue to 8 Photographs</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: VEHICLE PHOTOGRAPHS (EXACTLY 8 REQUIRED ANGLES) */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#35483C] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#242622]/10">
                  Step 2 of 5 • Mandatory Photos
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-[#242622]">8 Real Vehicle Photographs</h2>
                <p className="text-xs text-[#85857E] mt-1">
                  Upload genuine photographs from all 8 required angles. Stock or sample photos are strictly prohibited.
                </p>
              </div>

              {/* Live Counter Badge */}
              <div className={`px-4 py-2 rounded-full border text-xs font-mono font-bold flex items-center gap-2 shadow-sm ${
                isPhotosComplete
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}>
                {isPhotosComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                )}
                <span>{uploadedPhotosCount} / 8 Photos Uploaded</span>
              </div>
            </div>

            {photoError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            {/* Helpful Angle Visual Guide Notice */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/10 text-xs text-[#85857E] space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#242622]">
                <Camera className="w-4 h-4 text-[#35483C]" />
                <span>8-Angle Coverage Requirement</span>
              </div>
              <p className="text-[11px] text-[#85857E] leading-relaxed">
                Take photos during daytime in a clean, well-lit environment. Ensure the entire vehicle fits into each frame. All 8 slots must be completed before your listing can be published live.
              </p>
            </div>

            {/* 8 Photo Upload Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {REQUIRED_PHOTO_SLOTS.map((s) => {
                const existing = uploadedPhotos[s.slot];
                const isUploadingThis = uploadingSlot === s.slot;

                return (
                  <div
                    key={s.slot}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between h-56 relative overflow-hidden transition-all duration-300 ${
                      existing
                        ? 'bg-white border-[#35483C]/40 shadow-md ring-1 ring-[#35483C]/20'
                        : 'bg-[#FAF9F5] border-dashed border-[#242622]/15 hover:border-[#35483C]'
                    }`}
                  >
                    {/* Angle Title & Status Tag */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#242622] truncate">{s.label}</span>
                      {existing ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                          ✓
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF9F5] border border-[#242622]/10 text-[9px] font-mono font-semibold text-[#85857E] uppercase">
                          Required
                        </span>
                      )}
                    </div>

                    {/* Preview Image or Upload Box */}
                    {existing ? (
                      <div className="relative flex-1 rounded-xl overflow-hidden group bg-black/10">
                        <img
                          src={existing.url}
                          alt={s.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                          <label className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#242622] cursor-pointer shadow-lg transition-colors tactile-btn" title="Replace photo">
                            <RefreshCw className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handlePhotoUpload(s.slot, f);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handlePhotoDelete(s.slot)}
                            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors tactile-btn"
                            title="Delete photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-2 rounded-xl bg-white border border-[#242622]/[0.08]">
                        {isUploadingThis ? (
                          <div className="flex flex-col items-center gap-2">
                            <Clock className="w-6 h-6 text-[#35483C] animate-spin" />
                            <span className="text-[10px] text-[#35483C] font-semibold">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-6 h-6 text-[#85857E] mb-1" />
                            <p className="text-[10px] text-[#85857E] leading-tight mb-2 px-1 line-clamp-2">
                              {s.desc}
                            </p>
                            <label className="cursor-pointer px-3 py-1.5 rounded-full bg-[#FAF9F5] hover:bg-[#35483C] text-[#242622] hover:text-white border border-[#242622]/10 text-[10px] font-mono font-bold flex items-center gap-1 transition-all tactile-btn shadow-sm">
                              <Upload className="w-3 h-3" />
                              <span>Select Photo</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handlePhotoUpload(s.slot, f);
                                }}
                              />
                            </label>
                          </>
                        )}
                      </div>
                    )}

                    <div className="text-[9px] text-[#85857E] mt-2 truncate font-mono">
                      {existing ? existing.filename || 'Photo uploaded' : 'Slot pending upload'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between items-center border-t border-[#242622]/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/10 text-[#85857E] hover:text-[#242622] text-xs font-mono font-semibold flex items-center gap-1.5 tactile-btn shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Vehicle Info</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`px-6 py-3 min-h-[44px] rounded-full font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all tactile-btn shadow-sm ${
                  isPhotosComplete
                    ? 'bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C]'
                    : 'bg-[#FAF9F5] hover:bg-white text-[#85857E] border border-[#242622]/10'
                }`}
              >
                <span>Continue to Documents</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: MANDATORY 4-CERTIFICATE VEHICLE DOCUMENTS */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#35483C] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#242622]/10">
                  Step 3 of 5 • Mandatory Gate
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-[#242622]">4 Mandatory Vehicle Certificates</h2>
                <p className="text-xs text-[#85857E] mt-1">
                  Upload all four required certificates for AI cross-validation and listing submission clearance.
                </p>
              </div>

              {/* Document Progress Counter */}
              <div className={`px-4 py-2 rounded-full border text-xs font-mono font-bold flex items-center gap-2 shadow-sm ${
                isDocumentsComplete
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}>
                {isDocumentsComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                )}
                <span>{passedDocsCount} / 4 Documents Verified</span>
              </div>
            </div>

            {/* Dedicated Smart RC AI Verification & Hackathon Showcase Banner */}
            <div className="p-5 rounded-2xl bg-[#161816] text-white border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center border border-white/15 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-white flex items-center gap-2">
                    <span>SMART RC VERIFICATION & AUTHENTICITY ENGINE</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/15 text-emerald-300 border border-white/10 uppercase">
                      AI OCR + ML
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#A4AD98] mt-0.5 font-sans">
                    Launch the interactive RC intelligence studio with field confirmation, OpenCV quality checks, and Hackathon demo presets.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmartRCModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all tactile-btn shrink-0 border border-white/20"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch RC Studio</span>
              </button>
            </div>

            {/* 4 Compulsory Document Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* CARD 1: REGISTRATION CERTIFICATE (RC) */}
              <div className={`p-5 rounded-2xl border transition-all ${
                rcResult?.passed
                  ? 'bg-white border-[#35483C]/40 shadow-sm ring-1 ring-[#35483C]/20'
                  : rcResult?.status === 'mismatch_found' || rcResult?.status === 'failed'
                  ? 'bg-red-50/50 border-red-300'
                  : 'bg-[#FAF9F5] border-[#242622]/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#35483C] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                      RC
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#242622]">Registration Certificate (RC)</h4>
                      <p className="text-[10px] text-[#85857E]">Smart Card or Parivahan Digital Copy</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    rcResult?.passed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : rcResult?.status === 'mismatch_found'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-[#FAF9F5] text-[#85857E] border border-[#242622]/10'
                  }`}>
                    {rcResult?.status || 'Not Uploaded'}
                  </span>
                </div>

                {rcResult ? (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#242622]/[0.08] text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Reg No:</span>
                        <span className="font-mono font-bold text-[#242622]">{rcResult.extracted_preview?.registration_number || registrationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Owner:</span>
                        <span className="font-semibold text-[#242622]">{rcResult.extracted_preview?.owner_name || sellerFullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Model:</span>
                        <span className="font-semibold text-[#242622]">{rcResult.extracted_preview?.model || `${brand} ${model}`}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => handleOpenAnalysisReport('rc')}
                        className="text-[#35483C] hover:text-[#242622] font-semibold flex items-center gap-1 underline underline-offset-2 tactile-btn"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>View Analysis Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument('rc')}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 tactile-btn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#242622]/15 hover:border-[#35483C] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white tactile-btn">
                    {isRcUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="w-6 h-6 text-[#35483C] animate-spin" />
                        <span className="text-xs text-[#35483C] font-semibold">Analyzing RC Document...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#35483C] mb-2" />
                        <span className="text-xs font-bold text-[#242622]">Upload RC Scan or PDF</span>
                        <span className="text-[10px] text-[#85857E] mt-0.5">PDF, JPG, PNG up to 10MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleDocumentUpload('rc', f);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* CARD 2: INSURANCE CERTIFICATE */}
              <div className={`p-5 rounded-2xl border transition-all ${
                insuranceResult?.passed
                  ? 'bg-white border-[#35483C]/40 shadow-sm ring-1 ring-[#35483C]/20'
                  : insuranceResult?.status === 'expired'
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-[#FAF9F5] border-[#242622]/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#35483C] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                      INS
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#242622]">Insurance Certificate</h4>
                      <p className="text-[10px] text-[#85857E]">Comprehensive or Third-Party Policy</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    insuranceResult?.passed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : insuranceResult?.status === 'expired'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-[#FAF9F5] text-[#85857E] border border-[#242622]/10'
                  }`}>
                    {insuranceResult?.status || 'Not Uploaded'}
                  </span>
                </div>

                {insuranceResult ? (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#242622]/[0.08] text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Policy No:</span>
                        <span className="font-mono font-bold text-[#242622]">{insuranceResult.extracted_preview?.policy_number || 'POL-99214'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Provider:</span>
                        <span className="font-semibold text-[#242622]">{insuranceResult.extracted_preview?.provider || 'HDFC ERGO General Insurance'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Expiry Date:</span>
                        <span className={`font-semibold ${insuranceResult.is_expired ? 'text-red-500' : 'text-[#242622]'}`}>
                          {insuranceResult.expiry_date || '20/12/2026'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => handleOpenAnalysisReport('insurance')}
                        className="text-[#35483C] hover:text-[#242622] font-semibold flex items-center gap-1 underline underline-offset-2 tactile-btn"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>View Analysis Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument('insurance')}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 tactile-btn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#242622]/15 hover:border-[#35483C] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white tactile-btn">
                    {isInsUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="w-6 h-6 text-[#35483C] animate-spin" />
                        <span className="text-xs text-[#35483C] font-semibold">Checking Policy Validity...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#35483C] mb-2" />
                        <span className="text-xs font-bold text-[#242622]">Upload Insurance Policy</span>
                        <span className="text-[10px] text-[#85857E] mt-0.5">Active unexpired policy required</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleDocumentUpload('insurance', f);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* CARD 3: POLLUTION UNDER CONTROL (PUC) */}
              <div className={`p-5 rounded-2xl border transition-all ${
                pucResult?.passed
                  ? 'bg-white border-[#35483C]/40 shadow-sm ring-1 ring-[#35483C]/20'
                  : pucResult?.status === 'expired'
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-[#FAF9F5] border-[#242622]/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#35483C] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                      PUC
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#242622]">Pollution Under Control (PUC)</h4>
                      <p className="text-[10px] text-[#85857E]">BS6 Emission Compliance Slip</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    pucResult?.passed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : pucResult?.status === 'expired'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-[#FAF9F5] text-[#85857E] border border-[#242622]/10'
                  }`}>
                    {pucResult?.status || 'Not Uploaded'}
                  </span>
                </div>

                {pucResult ? (
                  <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#242622]/[0.08] text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Certificate No:</span>
                        <span className="font-mono font-bold text-[#242622]">{pucResult.extracted_preview?.certificate_number || 'PUC-CH-2026-991'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Emission Norms:</span>
                        <span className="font-semibold text-[#242622]">BS-VI Compliant (Pass)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#85857E]">Valid Through:</span>
                        <span className={`font-semibold ${pucResult.is_expired ? 'text-red-500' : 'text-[#242622]'}`}>
                          {pucResult.expiry_date || '15/11/2026'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-1 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => handleOpenAnalysisReport('puc')}
                        className="text-[#35483C] hover:text-[#242622] font-semibold flex items-center gap-1 underline underline-offset-2 tactile-btn"
                      >
                        <FileSearch className="w-3.5 h-3.5" />
                        <span>View Analysis Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument('puc')}
                        className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 tactile-btn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#242622]/15 hover:border-[#35483C] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white tactile-btn">
                    {isPucUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="w-6 h-6 text-[#35483C] animate-spin" />
                        <span className="text-xs text-[#35483C] font-semibold">Validating Emission Readings...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#35483C] mb-2" />
                        <span className="text-xs font-bold text-[#242622]">Upload PUC Certificate</span>
                        <span className="text-[10px] text-[#85857E] mt-0.5">Government RTO emission receipt</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleDocumentUpload('puc', f);
                      }}
                    />
                  </label>
                )}
              </div>

              {/* CARD 4: OWNERSHIP PROOF / SELLER AUTHORISATION */}
              <div className={`p-5 rounded-2xl border transition-all ${
                ownershipResult?.passed
                  ? 'bg-white border-[#35483C]/40 shadow-sm ring-1 ring-[#35483C]/20'
                  : 'bg-[#FAF9F5] border-[#242622]/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#35483C] text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                      OWN
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#242622]">Ownership & Transfer Proof</h4>
                      <p className="text-[10px] text-[#85857E]">Registered Owner Endorsement or Form 29/30</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    ownershipResult?.passed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-[#FAF9F5] text-[#85857E] border border-[#242622]/10'
                  }`}>
                    {ownershipResult?.status || 'Pending'}
                  </span>
                </div>

                <div className="space-y-3 font-sans">
                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setOwnershipMode('reuse_rc');
                        handleReuseRcOwnership();
                      }}
                      className={`p-3 rounded-xl border text-left font-bold transition-all duration-200 tactile-btn ${
                        ownershipMode === 'reuse_rc'
                          ? 'bg-[#35483C] border-[#35483C] text-white shadow-sm'
                          : 'bg-white border-[#242622]/10 text-[#85857E] hover:text-[#242622]'
                      }`}
                    >
                      <UserCheck className={`w-3.5 h-3.5 mb-1 ${ownershipMode === 'reuse_rc' ? 'text-white' : 'text-[#35483C]'}`} />
                      <span>I am the Registered Owner</span>
                      <p className={`text-[9px] font-normal mt-0.5 ${ownershipMode === 'reuse_rc' ? 'text-white/80' : 'text-[#85857E]'}`}>
                        Use verified RC endorsement
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOwnershipMode('upload_custom')}
                      className={`p-3 rounded-xl border text-left font-bold transition-all duration-200 tactile-btn ${
                        ownershipMode === 'upload_custom'
                          ? 'bg-[#35483C] border-[#35483C] text-white shadow-sm'
                          : 'bg-white border-[#242622]/10 text-[#85857E] hover:text-[#242622]'
                      }`}
                    >
                      <FileText className={`w-3.5 h-3.5 mb-1 ${ownershipMode === 'upload_custom' ? 'text-white' : 'text-amber-500'}`} />
                      <span>Authorised Representative</span>
                      <p className={`text-[9px] font-normal mt-0.5 ${ownershipMode === 'upload_custom' ? 'text-white/80' : 'text-[#85857E]'}`}>
                        Upload Form 29/30 / NOC
                      </p>
                    </button>
                  </div>

                  {ownershipMode === 'reuse_rc' ? (
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#242622]/[0.08] text-xs space-y-1">
                      <div className="flex items-center gap-2 text-[#35483C] font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>RC Registered Ownership Reused</span>
                      </div>
                      <p className="text-[11px] text-[#85857E]">
                        Ownership confirmed from verified Registration Certificate for seller <strong>{sellerFullName}</strong>. No redundant re-upload needed.
                      </p>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-[#242622]/15 hover:border-[#35483C] rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white tactile-btn">
                      {isOwnershipUploading ? (
                        <div className="flex flex-col items-center gap-1">
                          <Clock className="w-5 h-5 text-[#35483C] animate-spin" />
                          <span className="text-[11px] text-[#35483C]">Uploading Authorisation Document...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-[#35483C] mb-1" />
                          <span className="text-xs font-bold text-[#242622]">Upload Authorisation Letter / Form 29/30</span>
                          <span className="text-[10px] text-[#85857E]">PDF, JPG up to 10MB</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleDocumentUpload('ownership_proof', f);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between items-center border-t border-[#242622]/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/10 text-[#85857E] hover:text-[#242622] text-xs font-mono font-semibold flex items-center gap-1.5 tactile-btn shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to 8 Photographs</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className={`px-6 py-3 min-h-[44px] rounded-full font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all tactile-btn shadow-sm ${
                  isDocumentsComplete
                    ? 'bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C]'
                    : 'bg-[#FAF9F5] hover:bg-white text-[#85857E] border border-[#242622]/10'
                }`}
              >
                <span>Continue to Pickup Location</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: PICKUP & TEST RIDE LOCATION */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#35483C] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#242622]/10">
                Step 4 of 5 • Monetized Pickup Hub
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-[#242622]">Pickup & Test Ride Location</h2>
              <p className="text-xs text-[#85857E] mt-1 font-sans">
                Designate where prospective buyers can inspect or test ride your vehicle. Your exact coordinates remain completely private until a buyer unlocks location access.
              </p>
            </div>

            {/* Privacy Protection Callout Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-emerald-400/40 flex items-start gap-3.5 text-xs shadow-sm">
              <Lock className="w-5 h-5 text-[#35483C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#242622] block mb-0.5">Strict Privacy & Revenue Protection:</strong>
                <p className="text-[#85857E] leading-relaxed text-[11px] font-sans">
                  Before payment, buyers only see your approximate locality (e.g. <em>{pickupLocation.locality}, {pickupLocation.city}</em>). Your exact street address and interactive pin are safely hidden behind GEAR UP&apos;s ₹49 location-unlock gate.
                </p>
              </div>
            </div>

            {/* Interactive Leaflet Location Picker */}
            <SellerPickupLocationPicker
              initialLocation={pickupLocation}
              onLocationConfirmed={handleLocationConfirmed}
            />

            {/* Meetup Spot Type & Test Ride Policy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 font-sans">
              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Preferred Meetup Spot Type</label>
                <select
                  value={meetupSpotType}
                  onChange={(e) => setMeetupSpotType(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] font-medium"
                >
                  <option value="Safe Public Commercial Hub">Safe Public Commercial Hub (Recommended)</option>
                  <option value="Authorized Two-Wheeler Workshop">Authorized Two-Wheeler Workshop</option>
                  <option value="Metro / Transit Terminal">Metro / Transit Terminal Plaza</option>
                  <option value="Residential Premises">Residential Premises / Parking Gate</option>
                </select>
              </div>

              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Test Ride Availability</label>
                <select
                  value={testRideAvailable ? 'yes' : 'no'}
                  onChange={(e) => setTestRideAvailable(e.target.value === 'yes')}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] font-medium"
                >
                  <option value="yes">Test Rides Permitted (Valid DL & Helmet Required)</option>
                  <option value="no">Inspection Only (Test Rides Not Permitted)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[#85857E] font-semibold mb-1 block">
                  Pickup & Test Ride Instructions for Unlocked Buyers
                </label>
                <textarea
                  rows={2}
                  value={pickupInstructions}
                  onChange={(e) => setPickupInstructions(e.target.value)}
                  placeholder="e.g. Available on weekends between 10am-4pm. Please call 30 mins before arriving."
                  className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl p-3 text-[#242622] focus:outline-none focus:border-[#35483C] text-xs font-sans"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between items-center border-t border-[#242622]/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/10 text-[#85857E] hover:text-[#242622] text-xs font-mono font-semibold flex items-center gap-1.5 tactile-btn shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to 4 Documents</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleLocationConfirmed(pickupLocation);
                  setCurrentStep(5);
                }}
                className="px-6 py-3 min-h-[44px] rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm tactile-btn border border-[#35483C]"
              >
                <span>Review & Publish Listing</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: REVIEW & PUBLISH LISTING */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] text-[#35483C] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-[#242622]/10">
                Step 5 of 5 • Final Inspection
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-[#242622]">Review & Publish Listing</h2>
              <p className="text-xs text-[#85857E] mt-1 font-sans">
                Inspect your 8 verified photographs, mandatory certificates, and meetup parameters before publishing live.
              </p>
            </div>

            {/* Submission Gate Alert Banner if Blocked */}
            {(!isPhotosComplete || !isDocumentsComplete) && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 space-y-2 font-sans shadow-sm">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                  <span>Publication Blocked: Incomplete Verification Requirements</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-amber-800/90 text-xs pt-1">
                  {!isPhotosComplete && (
                    <li>
                      <strong>Vehicle Photographs:</strong> {uploadedPhotosCount}/8 uploaded ({8 - uploadedPhotosCount} angle photo(s) remaining).
                    </li>
                  )}
                  {!isDocumentsComplete && (
                    <li>
                      <strong>Mandatory Documents:</strong> {passedDocsCount}/4 verified. All four compulsory certificates must pass before going live.
                    </li>
                  )}
                </ul>
              </div>
            )}

            {publishBlockedAlert && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs space-y-1 font-sans">
                <div className="flex items-center gap-2 font-bold text-red-700">
                  <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Publication Rejection Notice</span>
                </div>
                {publishBlockedAlert.map((reason, idx) => (
                  <p key={idx} className="text-[11px] text-red-700 font-sans">• {reason}</p>
                ))}
              </div>
            )}

            {/* Section A: Vehicle Core Specifications */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#242622]">Vehicle Specifications</h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-mono font-semibold text-[#35483C] hover:text-[#242622] underline underline-offset-2 tactile-btn"
                >
                  Edit Details
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Vehicle</span>
                  <span className="font-bold text-[#242622]">{year} {brand} {model}</span>
                </div>
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Variant</span>
                  <span className="font-semibold text-[#242622] truncate block">{variant}</span>
                </div>
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Odometer & Owners</span>
                  <span className="font-semibold text-[#242622]">{km.toLocaleString('en-IN')} km • {owners} Owner</span>
                </div>
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Asking Price</span>
                  <span className="font-bold text-[#242622] font-mono text-sm">{formatINR(askingPrice)}</span>
                </div>
              </div>
            </div>

            {/* Section A.2: 3D Digital Twin Platform Representation Preview */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#161816] text-white space-y-3 shadow-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-sm text-white">3D Digital Twin Representation Preview</h4>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Chassis Twin
                </span>
              </div>
              <p className="text-xs text-[#A4AD98] font-sans">
                Every verified listing on GEAR UP is automatically linked to its interactive 3D digital twin based on chassis platform specifications ({brand} {model}).
              </p>
              <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-white/10 bg-black/50">
                <Vehicle3DViewer
                  vehicle={{
                    id: listingId,
                    brand,
                    model,
                    variant,
                    category,
                    year,
                    km,
                    price: askingPrice,
                    title: `${year} ${brand} ${model}`,
                    primaryImage: uploadedPhotos['front']?.url || ''
                  } as any}
                  height="280px"
                  showControls={true}
                  enableColorCustomization={false}
                  enableComponentInspection={false}
                  inspectionOverlay={false}
                />
              </div>
            </div>

            {/* Section B: 8-Angle Real Photographs Gallery */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#242622]">Vehicle Photographs</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isPhotosComplete ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {uploadedPhotosCount}/8 Uploaded
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-mono font-semibold text-[#35483C] hover:text-[#242622] underline underline-offset-2 tactile-btn"
                >
                  Manage Photos
                </button>
              </div>

              {uploadedPhotosCount === 0 ? (
                <div className="p-8 rounded-xl bg-white border border-dashed border-[#242622]/15 text-center space-y-2">
                  <Camera className="w-8 h-8 text-[#85857E] mx-auto" />
                  <p className="text-xs font-semibold text-[#85857E]">No vehicle photos uploaded yet.</p>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs tactile-btn"
                  >
                    Upload 8 Angles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {REQUIRED_PHOTO_SLOTS.map((s) => {
                    const p = uploadedPhotos[s.slot];
                    return (
                      <div key={s.slot} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/10 border border-[#242622]/10 shadow-inner">
                        {p ? (
                          <>
                            <img src={p.url} alt={s.label} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                              <span className="text-[9px] font-mono font-bold text-white block truncate">{s.label}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-[#85857E] p-2 text-center">
                            <Camera className="w-5 h-5 mb-1 text-[#85857E]" />
                            <span className="text-[9px] font-mono font-bold text-amber-600">{s.label} Missing</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section C: 4 Mandatory Certificates Checklist */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#242622]">4 Mandatory Certificates</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isDocumentsComplete ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {passedDocsCount}/4 Verified
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-mono font-semibold text-[#35483C] hover:text-[#242622] underline underline-offset-2 tactile-btn"
                >
                  Manage Documents
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { name: '1. Registration Certificate (RC)', passed: rcResult?.passed, reason: rcResult?.reason || 'RC document verified' },
                  { name: '2. Insurance Certificate', passed: insuranceResult?.passed, reason: insuranceResult?.reason || 'Active policy verified' },
                  { name: '3. Pollution Under Control (PUC)', passed: pucResult?.passed, reason: pucResult?.reason || 'BS6 compliance verified' },
                  { name: '4. Ownership / Seller Authorisation', passed: ownershipResult?.passed, reason: ownershipResult?.reason || 'Title and ownership cleared' }
                ].map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#242622]/[0.08] flex items-start gap-3 shadow-xs">
                    {doc.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold text-[#242622] text-xs">{doc.name}</p>
                      <p className="text-[10px] text-[#85857E] mt-0.5 font-sans">{doc.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section D: Pickup & Test Ride Parameters */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#242622]">Pickup & Test Ride Setup</h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs font-mono font-semibold text-[#35483C] hover:text-[#242622] underline underline-offset-2 tactile-btn"
                >
                  Change Location
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Public Viewing Area</span>
                  <span className="font-bold text-[#242622]">{pickupLocation.locality}, {pickupLocation.city}</span>
                </div>
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Meetup Spot Type</span>
                  <span className="font-semibold text-[#242622]">{meetupSpotType}</span>
                </div>
                <div>
                  <span className="text-[#85857E] block text-[10px] font-mono">Test Rides</span>
                  <span className="font-semibold text-[#242622]">{testRideAvailable ? 'Permitted with DL' : 'Inspection Only'}</span>
                </div>
              </div>
            </div>

            {/* Section E: GEAR UP Platform Listing Fee & Verification Monetization */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.08] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#35483C]" />
                  <h4 className="font-bold text-sm text-[#242622]">GEAR UP Platform Listing Fee</h4>
                </div>
                {feeStatus?.is_paid ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PAID & VERIFIED</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>AWAITING PAYMENT</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-[#85857E] font-sans">
                A one-time platform listing fee is required to verify and publish your vehicle listing on GEAR UP. This covers AI document extraction, 3D Digital Twin linking, and verified buyer fraud protection.
              </p>

              {/* Fee Breakdown Table */}
              <div className="p-4 rounded-xl bg-white border border-[#242622]/10 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[#85857E] pb-2 border-b border-[#242622]/10 text-[11px]">
                  <span>Description</span>
                  <span className="font-mono font-bold">Amount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#242622]">Platform listing fee</span>
                  <span className="font-mono font-bold text-[#242622]">{formatINR(feeConfig.listing_fee_inr || 299)}</span>
                </div>
                <div className="flex items-center justify-between text-[#85857E]">
                  <span>Additional charges / Gateway fee</span>
                  <span className="font-mono font-semibold text-emerald-700">₹0 (Waived)</span>
                </div>
                <div className="pt-2 border-t border-[#242622]/10 flex items-center justify-between font-bold">
                  <span className="text-[#242622]">Total Payable</span>
                  <span className="font-mono text-sm text-[#35483C]">{formatINR(feeConfig.listing_fee_inr || 299)}</span>
                </div>
              </div>

              {/* Policy & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-[#85857E] max-w-md font-sans">
                  <strong>Policy:</strong> {feeConfig.refund_policy || 'Full refund if vehicle fails mandatory RTO document verification; non-refundable once listing is published live on the marketplace.'}
                </p>
                {!feeStatus?.is_paid ? (
                  <button
                    type="button"
                    onClick={() => setIsFeeModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all tactile-btn shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay Listing Fee ({formatINR(feeConfig.listing_fee_inr || 299)})</span>
                  </button>
                ) : (
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-emerald-700 block font-bold">
                      Tx: {feeStatus.transaction_id || 'VERIFIED'}
                    </span>
                    <span className="text-[9px] text-[#85857E] block">
                      Paid: {feeStatus.paid_at ? new Date(feeStatus.paid_at).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Final Publish Gate Action Buttons */}
            <div className="pt-4 flex justify-between items-center border-t border-[#242622]/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/10 text-[#85857E] hover:text-[#242622] text-xs font-mono font-semibold flex items-center gap-1.5 tactile-btn shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Location</span>
              </button>

              <div className="flex items-center gap-3">
                {!feeStatus?.is_paid && (
                  <button
                    type="button"
                    onClick={() => setIsFeeModalOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-sm transition-all tactile-btn"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Platform Fee ({formatINR(feeConfig.listing_fee_inr || 299)})</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={!isPhotosComplete || !isDocumentsComplete || !feeStatus?.is_paid || isPublishing}
                  onClick={handlePublishListing}
                  className={`px-8 py-3.5 min-h-[44px] rounded-full font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all tactile-btn shadow-sm ${
                    isPhotosComplete && isDocumentsComplete && feeStatus?.is_paid && !isPublishing
                      ? 'bg-[#35483C] hover:bg-[#242622] text-white cursor-pointer border border-[#35483C]'
                      : 'bg-[#FAF9F5] border border-[#242622]/10 text-[#85857E] cursor-not-allowed'
                  }`}
                >
                  {isPublishing ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin text-white" />
                      <span>Publishing Live...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Publish Listing Live Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* In-Depth Document Analysis Report Modal */}
      {analysisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-none border border-[#E9E3D8] bg-white p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#E9E3D8] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#242622] uppercase tracking-wider">
                  Automated Document Extraction & AI Inspection
                </span>
                <h3 className="font-heading font-extrabold text-xl text-[#242622]">
                  {activeAnalysisDoc?.toUpperCase()} Verification Breakdown
                </h3>
              </div>
              <button
                onClick={() => setAnalysisModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E9E3D8] flex items-center justify-center text-[#85857E] hover:text-[#242622]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isLoadingAnalysis ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Clock className="w-8 h-8 text-[#242622] animate-spin" />
                <p className="text-xs text-[#85857E]">Extracting Document Data...</p>
              </div>
            ) : analysisReport ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-none bg-[#E9E3D8] border border-[#E9E3D8]">
                  <div>
                    <span className="text-[10px] text-[#85857E]">Document Type</span>
                    <p className="font-bold text-[#242622] capitalize">{analysisReport.document_type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#85857E]">OCR Confidence</span>
                    <p className="font-bold text-[#242622]">{Math.round((analysisReport.ocr_confidence || 0.95) * 100)}% High Confidence</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-[#242622] mb-2">Automated Field Analysis</h4>
                  <div className="p-4 rounded-none bg-white/60 border border-[#E9E3D8] space-y-2">
                    {Object.entries(analysisReport.extracted_fields || {}).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-1 border-b border-[#E9E3D8]/50">
                        <span className="text-[#85857E] capitalize">{k.replace(/_/g, ' ')}:</span>
                        <span className="font-semibold text-[#242622] font-mono">{String(v || 'N/A')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-none bg-white/60 border border-[#E9E3D8]/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#242622]" />
                    <span className="text-[11px] text-[#85857E]">Sensitive chassis, engine & policy numbers masked.</span>
                  </div>
                  <button
                    onClick={() => setAnalysisModalOpen(false)}
                    className="px-4 py-2 rounded-none bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-[#85857E] text-xs">
                No analysis data available for this document.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart RC AI Verification Modal */}
      <SmartRCVerificationModal
        isOpen={smartRCModalOpen}
        onClose={() => setSmartRCModalOpen(false)}
        listingDetails={{
          brand: brand,
          model: model,
          year: year,
          registration_number: registrationNumber,
          fuel_type: fuelType
        }}
        onVerificationComplete={(compRes) => {
          if (compRes.finalWorkflowStatus === 'DOCUMENT_MATCHED' || compRes.finalWorkflowStatus === 'GOVERNMENT_VERIFIED') {
            setRcResult({
              passed: true,
              status: compRes.finalWorkflowStatus,
              registration_number: registrationNumber,
              owner_name: 'Verified Owner',
              manufacturer: brand,
              model: model
            });
            refreshStatus();
          }
        }}
      />

      {/* GEAR UP Platform Listing Fee Payment Modal */}
      <PlatformListingFeeModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        listingId={listingId}
        vehicleTitle={`${year} ${brand} ${model} ${variant}`}
        feeConfig={feeConfig}
        onPaymentSuccess={(paymentRes) => {
          setFeeStatus({
            is_paid: true,
            status: 'paid',
            amount_inr: paymentRes.amount_inr || feeConfig.listing_fee_inr,
            transaction_id: paymentRes.transaction_id,
            paid_at: paymentRes.paid_at || new Date().toISOString()
          });
          refreshStatus();
        }}
      />
    </div>
  );
};
export default SellBikePage;
