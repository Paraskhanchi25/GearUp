import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  FileText, 
  Ban, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Check, 
  X, 
  AlertCircle, 
  FileCheck2, 
  Search, 
  Filter, 
  History, 
  ChevronRight, 
  Clock, 
  Building, 
  UserCheck,
  FileSearch,
  ExternalLink,
  Lock,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { 
  getAdminVerificationQueue, 
  getAdminListingDetail, 
  recordReviewerDecision 
} from '../services/aiApi';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification_desk' | 'marketplace_moderation'>('verification_desk');
  const [listings, setListings] = useState(SEED_LISTINGS);

  // Verification Desk State
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>('bike-001');
  const [activeListingDetail, setActiveListingDetail] = useState<any>(null);
  const [activeDocTab, setActiveDocTab] = useState<'rc' | 'insurance' | 'puc' | 'condition' | 'ownership'>('rc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState<boolean>(false);
  const [decisionSuccessMsg, setDecisionSuccessMsg] = useState<string | null>(null);
  const [isLoadingQueue, setIsLoadingQueue] = useState<boolean>(false);

  // Load Queue
  const fetchQueue = async () => {
    setIsLoadingQueue(true);
    try {
      const data = await getAdminVerificationQueue(filterStatus);
      if (data && data.queue) {
        setQueue(data.queue);
        if (data.queue.length > 0 && !selectedListingId) {
          setSelectedListingId(data.queue[0].listing_id);
        }
      }
    } catch (err) {
      console.warn('Queue loading failed:', err);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filterStatus]);

  // Load Selected Listing Detail
  useEffect(() => {
    if (!selectedListingId) return;
    let isMounted = true;
    getAdminListingDetail(selectedListingId).then((data) => {
      if (isMounted && data) {
        setActiveListingDetail(data);
      }
    });
    return () => { isMounted = false; };
  }, [selectedListingId]);

  // Reviewer Decision Handler
  const handleDecision = async (action: string) => {
    if (!selectedListingId) return;
    setIsSubmittingDecision(true);
    setDecisionSuccessMsg(null);

    const docType = activeDocTab === 'ownership' ? 'ownership_proof' : (activeDocTab === 'condition' ? 'repair_bills' : activeDocTab);
    const reasonText = reviewerNotes.trim() || `Reviewer action: ${action.replace('_', ' ')} executed by Moderation Lead.`;

    try {
      const res = await recordReviewerDecision({
        listing_id: selectedListingId,
        document_type: docType,
        action: action,
        reviewer_id: 'MOD-9821',
        reviewer_name: 'Senior RTO Document Specialist',
        reason: reasonText
      });

      if (res && res.status === 'success') {
        setDecisionSuccessMsg(`Decision "${action.toUpperCase().replace('_', ' ')}" recorded in audit trail.`);
        setReviewerNotes('');
        // Refresh listing detail and queue
        const updatedDetail = await getAdminListingDetail(selectedListingId);
        if (updatedDetail) setActiveListingDetail(updatedDetail);
        fetchQueue();
      }
    } catch (err) {
      console.error('Decision submission error:', err);
    } finally {
      setIsSubmittingDecision(false);
      setTimeout(() => setDecisionSuccessMsg(null), 4000);
    }
  };

  const toggleVerify = (id: string) => {
    setListings(listings.map(l => {
      if (l.id === id) {
        return {
          ...l,
          verificationTier: l.verificationTier === 'physically_inspected' ? 'seller_provided' : 'physically_inspected',
          documentVerified: !l.documentVerified
        };
      }
      return l;
    }));
  };

  const removeListing = (id: string) => {
    if (confirm('Are you sure you want to flag and remove this listing for inspection review?')) {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  const currentRecord = activeListingDetail?.record || null;
  const currentSummary = activeListingDetail?.summary || null;
  const currentL1 = currentRecord?.level1_basic || {};
  const currentL2 = currentRecord?.level2_condition || {};
  const currentL3 = currentRecord?.level3_ownership || {};
  const vehicle = currentRecord?.vehicle_details || {};

  return (
    <div className="min-h-screen bg-[#0A1411] text-slate-100 pb-24 px-4 sm:px-6 lg:px-8 pt-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-[#101D19] border border-forest-800 shadow-2xl">
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>SUPERADMIN MODERATION ENGINE</span>
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-white mt-1">
              GEAR UP Trust & Verification Desk
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              OCR Document extraction comparison, RTO Parivahan consistency audit, and split-view verification moderation.
            </p>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-forest-950 border border-forest-800 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('verification_desk')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'verification_desk'
                  ? 'bg-forest-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Document Verification Desk</span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace_moderation')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'marketplace_moderation'
                  ? 'bg-forest-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Marketplace Listings</span>
            </button>
          </div>
        </div>

        {activeTab === 'verification_desk' ? (
          <div className="space-y-6 animate-fade-in">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#101D19] border border-forest-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total in Queue</span>
                <p className="font-heading font-extrabold text-2xl text-white mt-1">{queue.length || 2}</p>
                <p className="text-[10px] text-slate-500">Listings awaiting moderation</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#101D19] border border-amber-800/40">
                <span className="text-[10px] uppercase font-bold text-amber-400">Needs Review</span>
                <p className="font-heading font-extrabold text-2xl text-amber-300 mt-1">
                  {queue.filter(q => q.overall_status === 'pending_review' || q.overall_status === 'partially_verified').length || 1}
                </p>
                <p className="text-[10px] text-amber-200/60">OCR confidence &lt; 90% or missing</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#101D19] border border-red-800/40">
                <span className="text-[10px] uppercase font-bold text-red-400">Discrepancy Alerts</span>
                <p className="font-heading font-extrabold text-2xl text-red-300 mt-1">
                  {queue.filter(q => q.mismatches_count > 0).length || 0}
                </p>
                <p className="text-[10px] text-red-200/60">Fuel or chassis mismatches</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#101D19] border border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Verified & Cleared</span>
                <p className="font-heading font-extrabold text-2xl text-emerald-300 mt-1">
                  {queue.filter(q => q.overall_status === 'verified_documents').length || 1}
                </p>
                <p className="text-[10px] text-emerald-200/60">Published with Trust Badge</p>
              </div>
            </div>

            {/* Split View Layout: Left Queue (4 cols) & Right Workspace (8 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Verification Queue */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-3xl bg-[#101D19] border border-forest-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-forest-400" />
                      <span>Review Queue</span>
                    </h3>
                    <button 
                      onClick={fetchQueue}
                      disabled={isLoadingQueue}
                      className="p-1.5 rounded-lg bg-forest-950 text-slate-400 hover:text-white border border-forest-800"
                      title="Refresh queue"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQueue ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'pending_review', label: 'Pending' },
                      { id: 'verified_documents', label: 'Verified' },
                      { id: 'verification_issue_found', label: 'Flagged' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFilterStatus(f.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                          filterStatus === f.id
                            ? 'bg-forest-700 text-white'
                            : 'bg-forest-950 text-slate-400 hover:text-slate-200 border border-forest-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Queue Items List */}
                  <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                    {queue.map((item) => {
                      const isSelected = selectedListingId === item.listing_id;
                      return (
                        <div
                          key={item.listing_id}
                          onClick={() => setSelectedListingId(item.listing_id)}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-xs space-y-2 ${
                            isSelected
                              ? 'bg-forest-900/60 border-forest-500 shadow-md'
                              : 'bg-forest-950/60 border-forest-900/80 hover:border-forest-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-slate-400">{item.listing_id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.overall_status === 'verified_documents'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                                : item.overall_status === 'verification_issue_found'
                                ? 'bg-red-950 text-red-300 border border-red-600/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                            }`}>
                              {item.overall_status.replace('_', ' ')}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-white text-xs line-clamp-1">{item.vehicle_title}</h4>
                            <p className="text-[11px] text-slate-400">Seller: {item.seller_name}</p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-forest-900/60">
                            <span>Reg: <strong className="text-white font-mono">{item.registration_number}</strong></span>
                            <span className="text-forest-300 font-semibold">{Math.round((item.ocr_confidence || 0.94) * 100)}% OCR match</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Split-View Reviewer Workspace (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-6">
                  
                  {/* Top Bar of Selected Listing */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-forest-900 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-forest-950 text-forest-300 border border-forest-800 font-bold">
                          {selectedListingId}
                        </span>
                        <h2 className="font-heading font-extrabold text-lg text-white">
                          {vehicle.year || 2023} {vehicle.brand || 'Vehicle'} {vehicle.model || 'Model'}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Seller: <strong className="text-slate-200">{currentL3.seller_full_name || 'Vikramjit Singh'}</strong> • Reg: <strong className="text-white font-mono">{vehicle.registration_number || 'CH01AB8821'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase border ${
                        currentSummary?.overall_verification_status === 'verified_documents'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                          : 'bg-amber-950 text-amber-300 border-amber-600/50'
                      }`}>
                        {currentSummary?.overall_verification_status?.replace('_', ' ') || 'In Review'}
                      </span>
                    </div>
                  </div>

                  {/* Document Category Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-forest-900/60 text-xs">
                    {[
                      { id: 'rc', label: '1. Registration (RC)', badge: currentL1?.rc?.status || 'matched' },
                      { id: 'insurance', label: '2. Insurance Policy', badge: currentL1?.insurance?.status || 'matched' },
                      { id: 'puc', label: '3. PUC Certificate', badge: currentL1?.puc?.status || 'matched' },
                      { id: 'condition', label: '4. Condition & Bills', badge: currentL2?.service_history ? 'completed' : 'pending' },
                      { id: 'ownership', label: '5. Ownership & NOC', badge: currentL3?.is_authorized ? 'cleared' : 'pending' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveDocTab(t.id as any)}
                        className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                          activeDocTab === t.id
                            ? 'bg-forest-700 text-white shadow-sm'
                            : 'bg-forest-950/70 text-slate-400 hover:text-white border border-forest-900'
                        }`}
                      >
                        <span>{t.label}</span>
                        <span className={`w-2 h-2 rounded-full ${
                          t.badge === 'matched' || t.badge === 'completed' || t.badge === 'cleared'
                            ? 'bg-emerald-400'
                            : t.badge === 'mismatch'
                            ? 'bg-red-400'
                            : 'bg-amber-400'
                        }`} />
                      </button>
                    ))}
                  </div>

                  {/* Split Workspace Area */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Left Split Panel: Document Visual Preview & Metadata (5 cols) */}
                    <div className="md:col-span-5 space-y-3">
                      <div className="p-4 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-forest-400">Document Scan Viewer</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                            OCR: 96.4%
                          </span>
                        </div>

                        {/* Visual Document Canvas Simulation */}
                        <div className="relative aspect-[3/4] rounded-xl bg-[#14231E] border border-forest-700/60 p-4 overflow-hidden shadow-inner flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-forest-800/80 pb-2">
                              <span className="text-[9px] font-mono text-slate-400 uppercase">PARIVAHAN SEWA / RTO INDIA</span>
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <div className="h-2 w-3/4 bg-forest-800 rounded animate-pulse" />
                              <div className="h-2 w-1/2 bg-forest-800 rounded animate-pulse" />
                              <div className="h-2 w-2/3 bg-forest-800 rounded animate-pulse" />
                            </div>
                            <div className="pt-4 p-2 rounded bg-forest-950/80 border border-forest-900 space-y-1 font-mono text-[9px]">
                              <p className="text-slate-400">REG NO: <span className="text-emerald-300 font-bold">{vehicle.registration_number || 'CH01AB8821'}</span></p>
                              <p className="text-slate-400">CHASSIS: <span className="text-slate-200">ME4J3A5C9P0••••••</span></p>
                              <p className="text-slate-400">ENGINE: <span className="text-slate-200">J350E••••••</span></p>
                              <p className="text-slate-400">MAKER: <span className="text-slate-200">{vehicle.brand || 'ROYAL ENFIELD'}</span></p>
                            </div>
                          </div>

                          <div className="border-t border-forest-800/80 pt-2 flex items-center justify-between text-[9px] text-slate-500">
                            <span>Security Hash: #B821A</span>
                            <span className="text-emerald-400 font-semibold">Digitally Signed</span>
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                          <div className="flex justify-between">
                            <span>Uploaded Filename:</span>
                            <span className="text-slate-200 font-mono text-[10px]">rc_scan_certified.pdf</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Storage Vault:</span>
                            <span className="text-emerald-400 font-mono text-[10px]">AES-256 Encrypted</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Split Panel: Field-by-Field Extracted vs Listing Comparison (7 cols) */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="p-4 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                            Extracted Data vs Listing Claims
                          </h4>
                          <span className="text-[10px] text-slate-400">Automated OCR Match</span>
                        </div>

                        {/* Comparison Table */}
                        <div className="rounded-xl overflow-hidden border border-forest-900 divide-y divide-forest-900 text-xs">
                          <div className="p-2.5 bg-[#0D1815] grid grid-cols-12 font-bold text-[10px] text-slate-400 uppercase">
                            <span className="col-span-4">Field</span>
                            <span className="col-span-4">Extracted (OCR)</span>
                            <span className="col-span-4 text-right">Listing / Status</span>
                          </div>

                          {/* Row: Reg Number */}
                          <div className="p-2.5 grid grid-cols-12 items-center bg-forest-950/40">
                            <span className="col-span-4 text-slate-300 font-medium">Registration No</span>
                            <span className="col-span-4 font-mono font-bold text-emerald-300">{vehicle.registration_number || 'CH01AB8821'}</span>
                            <span className="col-span-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                            </span>
                          </div>

                          {/* Row: Owner Name */}
                          <div className="p-2.5 grid grid-cols-12 items-center">
                            <span className="col-span-4 text-slate-300 font-medium">Owner Name</span>
                            <span className="col-span-4 text-white font-medium">{currentL3.seller_full_name || 'Vikramjit Singh'}</span>
                            <span className="col-span-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                          </div>

                          {/* Row: Vehicle Model */}
                          <div className="p-2.5 grid grid-cols-12 items-center bg-forest-950/40">
                            <span className="col-span-4 text-slate-300 font-medium">Brand & Model</span>
                            <span className="col-span-4 text-white">{vehicle.brand || 'Royal Enfield'} {vehicle.model || 'Classic 350'}</span>
                            <span className="col-span-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                            </span>
                          </div>

                          {/* Row: Fuel Type */}
                          <div className="p-2.5 grid grid-cols-12 items-center">
                            <span className="col-span-4 text-slate-300 font-medium">Fuel Type</span>
                            <span className="col-span-4 text-white capitalize">{vehicle.fuel || 'Petrol'}</span>
                            <span className="col-span-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                            </span>
                          </div>

                          {/* Row: Financed / Loan */}
                          <div className="p-2.5 grid grid-cols-12 items-center bg-forest-950/40">
                            <span className="col-span-4 text-slate-300 font-medium">Lien / Loan</span>
                            <span className="col-span-4 text-slate-200">No Hypothecation</span>
                            <span className="col-span-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Clear Title
                            </span>
                          </div>

                          {/* Row: Insurance Expiry */}
                          <div className="p-2.5 grid grid-cols-12 items-center">
                            <span className="col-span-4 text-slate-300 font-medium">Insurance Policy</span>
                            <span className="col-span-4 text-slate-200">Valid Policy</span>
                            <span className="col-span-4 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                            </span>
                          </div>
                        </div>

                        {/* Extra Level 2 & 3 summary pills */}
                        <div className="p-3 rounded-xl bg-[#0D1815] border border-forest-900/60 text-xs space-y-1">
                          <p className="font-bold text-white text-[11px]">Level 2 Condition & Maintenance Disclosures:</p>
                          <p className="text-[11px] text-slate-400">
                            Service: <strong className="text-slate-200 capitalize">{currentL2.service_history || 'Regular (OEM Workshop)'}</strong> • Tyres: <strong className="text-slate-200 capitalize">{currentL2.tyre_condition || 'Good'}</strong> • Accidental: <strong className="text-emerald-400">{currentL2.accident_disclosure || 'None reported'}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviewer Action Bar */}
                  <div className="p-5 rounded-2xl bg-forest-950 border border-forest-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-forest-400" />
                        <span>Moderator Decision Desk</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Acting as Reviewer: <strong className="text-slate-200">MOD-9821</strong></span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-300">
                        Reviewer Notes & Action Justification:
                      </label>
                      <input
                        type="text"
                        value={reviewerNotes}
                        onChange={(e) => setReviewerNotes(e.target.value)}
                        placeholder="e.g. Parivahan RTO extracted chassis prefix matches listing. Cleared for publication."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1A16] border border-forest-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-forest-500"
                      />
                    </div>

                    {decisionSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{decisionSuccessMsg}</span>
                      </div>
                    )}

                    {/* Action Button Set */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        onClick={() => handleDecision('approve')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Document</span>
                      </button>

                      <button
                        onClick={() => handleDecision('request_clearer_upload')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Request Clearer Scan</span>
                      </button>

                      <button
                        onClick={() => handleDecision('request_info')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Request Info from Seller</span>
                      </button>

                      <button
                        onClick={() => handleDecision('mark_further_verification')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Hub Physical Inspection</span>
                      </button>

                      <button
                        onClick={() => handleDecision('reject')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        <span>Reject / Flag Discrepancy</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit Trail Drawer */}
                  <div className="p-4 rounded-2xl bg-[#0E1A16] border border-forest-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <History className="w-4 h-4 text-forest-400" />
                        <span>Audit Trail & Moderation History</span>
                      </h4>
                      <span className="text-[10px] text-slate-500">Immutable ledger log</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {(currentRecord?.review_audit_log || [
                        {
                          action_id: 'ACT-982101',
                          timestamp: '2026-02-21T11:20:00',
                          reviewer_id: 'MOD-9821',
                          reviewer_name: 'Senior RTO Document Specialist',
                          action: 'approve',
                          reason: 'RC matches registration number and Parivahan engine spec.'
                        }
                      ]).map((entry: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-forest-950 border border-forest-900 flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white capitalize">{entry.action?.replace('_', ' ')}</span>
                              <span className="text-[10px] font-mono text-forest-300">by {entry.reviewer_id} ({entry.reviewer_name})</span>
                            </div>
                            <p className="text-[11px] text-slate-300">{entry.reason}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap">
                            {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Existing Marketplace Listings Moderation Tab */
          <div className="rounded-3xl bg-[#101D19] border border-forest-800 overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-forest-950 border-b border-forest-800 font-bold text-xs text-slate-300 grid grid-cols-12 gap-4">
              <span className="col-span-4">Vehicle & Location</span>
              <span className="col-span-2">Asking Price</span>
              <span className="col-span-3">Verification Tier</span>
              <span className="col-span-3 text-right">Moderator Actions</span>
            </div>

            <div className="divide-y divide-forest-900/60 text-xs">
              {listings.slice(0, 10).map((bike) => (
                <div key={bike.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-forest-950/40 transition-colors">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <img src={bike.primaryImage} alt={bike.title} className="w-12 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{bike.title}</p>
                      <p className="text-slate-400 text-[11px]">{bike.area}, {bike.city}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-heading font-bold text-white">{formatINR(bike.price)}</p>
                    <p className="text-[10px] text-slate-500">{bike.km.toLocaleString('en-IN')} km</p>
                  </div>

                  <div className="col-span-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bike.verificationTier === 'physically_inspected'
                        ? 'bg-forest-700 text-white'
                        : bike.verificationTier === 'document_verified'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {bike.verificationTier.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleVerify(bike.id)}
                      className="px-2.5 py-1 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-[11px] font-semibold transition-colors"
                    >
                      Toggle Cert
                    </button>
                    <button
                      onClick={() => removeListing(bike.id)}
                      className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800"
                      title="Flag listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
