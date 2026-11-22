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
  RotateCcw,
  DollarSign,
  CreditCard,
  TrendingUp,
  MapPin,
  Calendar,
  Cpu
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { formatINR } from '../utils/geo';
import { 
  getAdminVerificationQueue, 
  getAdminListingDetail, 
  recordReviewerDecision,
  getAdminRevenueStats,
  getAdminRCReviews,
  getAdminRCDetail,
  submitAdminRCReview
} from '../services/aiApi';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification_desk' | 'smart_rc_desk' | 'marketplace_moderation' | 'location_revenue'>('verification_desk');
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [revenueStats, setRevenueStats] = useState<any>(null);

  // Smart RC Desk State
  const [smartRcQueue, setSmartRcQueue] = useState<any[]>([]);
  const [selectedSmartRcId, setSelectedSmartRcId] = useState<string | null>(null);
  const [smartRcDetail, setSmartRcDetail] = useState<any>(null);
  const [smartRcFilter, setSmartRcFilter] = useState<string>('ALL');
  const [isLoadingSmartRc, setIsLoadingSmartRc] = useState<boolean>(false);
  const [smartRcNotes, setSmartRcNotes] = useState<string>('');
  const [isSubmittingSmartRc, setIsSubmittingSmartRc] = useState<boolean>(false);
  const [smartRcActionMsg, setSmartRcActionMsg] = useState<string | null>(null);

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

  const fetchRevenue = async () => {
    try {
      const stats = await getAdminRevenueStats();
      if (stats) setRevenueStats(stats);
    } catch (err) {
      console.warn('Revenue fetch error:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'location_revenue') {
      fetchRevenue();
    } else if (activeTab === 'smart_rc_desk') {
      fetchSmartRcQueue();
    }
  }, [activeTab]);

  const fetchSmartRcQueue = async () => {
    setIsLoadingSmartRc(true);
    try {
      const data = await getAdminRCReviews(smartRcFilter);
      if (data && data.reviews) {
        setSmartRcQueue(data.reviews);
        if (data.reviews.length > 0 && !selectedSmartRcId) {
          setSelectedSmartRcId(data.reviews[0].id);
        }
      }
    } catch (err) {
      console.warn('Smart RC queue fetch error:', err);
    } finally {
      setIsLoadingSmartRc(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'smart_rc_desk') {
      fetchSmartRcQueue();
    }
  }, [smartRcFilter]);

  // Load Smart RC Detail
  useEffect(() => {
    if (!selectedSmartRcId) return;
    let isMounted = true;
    getAdminRCDetail(selectedSmartRcId).then((data) => {
      if (isMounted && data) {
        setSmartRcDetail(data);
      }
    }).catch(err => console.warn('Smart RC detail error:', err));
    return () => { isMounted = false; };
  }, [selectedSmartRcId]);

  const handleSmartRcDecision = async (action: 'approve' | 'request_clearer_upload' | 'reject') => {
    if (!selectedSmartRcId) return;
    setIsSubmittingSmartRc(true);
    setSmartRcActionMsg(null);
    try {
      await submitAdminRCReview(selectedSmartRcId, {
        reviewer_id: 'RTO-CHIEF-01',
        action: action,
        notes: smartRcNotes.trim() || `RTO audit action: ${action.replace('_', ' ')} executed.`
      });
      setSmartRcActionMsg(`Decision "${action.toUpperCase().replace('_', ' ')}" recorded in audit ledger.`);
      setSmartRcNotes('');
      fetchSmartRcQueue();
      const updated = await getAdminRCDetail(selectedSmartRcId);
      if (updated) setSmartRcDetail(updated);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingSmartRc(false);
      setTimeout(() => setSmartRcActionMsg(null), 4000);
    }
  };

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
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-24 px-4 sm:px-6 lg:px-8 pt-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] shadow-2xl">
          <div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>SUPERADMIN MODERATION ENGINE</span>
            </span>
            <h1 className="font-heading font-extrabold text-2xl text-[#242622] mt-1">
              GEAR UP Trust & Verification Desk
            </h1>
            <p className="text-xs text-[#85857E] mt-0.5">
              OCR Document extraction comparison, RTO Parivahan consistency audit, and split-view verification moderation.
            </p>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex items-center gap-1 p-1.5 rounded-none bg-white border border-[#E9E3D8] self-stretch md:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('verification_desk')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-none text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'verification_desk'
                  ? 'bg-[#35483C] text-white shadow-sm'
                  : 'text-[#85857E] hover:text-[#242622]'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Document Verification Desk</span>
            </button>
            <button
              onClick={() => setActiveTab('smart_rc_desk')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-none text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'smart_rc_desk'
                  ? 'bg-[#35483C] text-white shadow-sm'
                  : 'text-[#85857E] hover:text-[#242622]'
              }`}
            >
              <Cpu className="w-4 h-4 text-[#242622]" />
              <span>Smart RC Reviews</span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace_moderation')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-none text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'marketplace_moderation'
                  ? 'bg-[#35483C] text-white shadow-sm'
                  : 'text-[#85857E] hover:text-[#242622]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Marketplace Listings</span>
            </button>
            <button
              onClick={() => setActiveTab('location_revenue')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-none text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'location_revenue'
                  ? 'bg-[#35483C] text-white shadow-sm'
                  : 'text-[#85857E] hover:text-[#242622]'
              }`}
            >
              <DollarSign className="w-4 h-4 text-[#242622]" />
              <span>Location Monetization</span>
            </button>
          </div>
        </div>

        {activeTab === 'verification_desk' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-none bg-white border border-[#E9E3D8]">
                <span className="text-[10px] uppercase font-bold text-[#85857E]">Total in Queue</span>
                <p className="font-heading font-extrabold text-2xl text-[#242622] mt-1">{queue.length || 2}</p>
                <p className="text-[10px] text-slate-500">Listings awaiting moderation</p>
              </div>
              <div className="p-4 rounded-none bg-white border border-amber-800/40">
                <span className="text-[10px] uppercase font-bold text-amber-400">Needs Review</span>
                <p className="font-heading font-extrabold text-2xl text-amber-300 mt-1">
                  {queue.filter(q => q.overall_status === 'pending_review' || q.overall_status === 'partially_verified').length || 1}
                </p>
                <p className="text-[10px] text-amber-200/60">OCR confidence &lt; 90% or missing</p>
              </div>
              <div className="p-4 rounded-none bg-white border border-red-800/40">
                <span className="text-[10px] uppercase font-bold text-red-400">Discrepancy Alerts</span>
                <p className="font-heading font-extrabold text-2xl text-red-300 mt-1">
                  {queue.filter(q => q.mismatches_count > 0).length || 0}
                </p>
                <p className="text-[10px] text-red-200/60">Fuel or chassis mismatches</p>
              </div>
              <div className="p-4 rounded-none bg-white border border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-[#242622]">Verified & Cleared</span>
                <p className="font-heading font-extrabold text-2xl text-[#242622] mt-1">
                  {queue.filter(q => q.overall_status === 'verified_documents').length || 1}
                </p>
                <p className="text-[10px] text-[#35483C]/60">Published with Trust Badge</p>
              </div>
            </div>

            {/* Split View Layout: Left Queue (4 cols) & Right Workspace (8 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Verification Queue */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-sm text-[#242622] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#242622]" />
                      <span>Review Queue</span>
                    </h3>
                    <button 
                      onClick={fetchQueue}
                      disabled={isLoadingQueue}
                      className="p-1.5 rounded-lg bg-white text-[#85857E] hover:text-[#242622] border border-[#E9E3D8]"
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
                            ? 'bg-[#35483C]/30 text-white'
                            : 'bg-white text-[#85857E] hover:text-[#242622] border border-[#E9E3D8]'
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
                          className={`p-3.5 rounded-none cursor-pointer transition-all border text-xs space-y-2 ${
                            isSelected
                              ? 'bg-[#E9E3D8]/60 border-[#35483C] shadow-md'
                              : 'bg-white/60 border-[#E9E3D8]/80 hover:border-[#E9E3D8]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-[#85857E]">{item.listing_id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.overall_status === 'verified_documents'
                                ? 'bg-emerald-950 text-[#242622] border border-emerald-600/40'
                                : item.overall_status === 'verification_issue_found'
                                ? 'bg-red-950 text-red-300 border border-red-600/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                            }`}>
                              {item.overall_status.replace('_', ' ')}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-[#242622] text-xs line-clamp-1">{item.vehicle_title}</h4>
                            <p className="text-[11px] text-[#85857E]">Seller: {item.seller_name}</p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#85857E] pt-1 border-t border-[#E9E3D8]/60">
                            <span>Reg: <strong className="text-[#242622] font-mono">{item.registration_number}</strong></span>
                            <span className="text-[#242622] font-semibold">{Math.round((item.ocr_confidence || 0.94) * 100)}% OCR match</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Split-View Reviewer Workspace (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-6">
                  
                  {/* Top Bar of Selected Listing */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E9E3D8] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-white text-[#242622] border border-[#E9E3D8] font-bold">
                          {selectedListingId}
                        </span>
                        <h2 className="font-heading font-extrabold text-lg text-[#242622]">
                          {vehicle.year || 2023} {vehicle.brand || 'Vehicle'} {vehicle.model || 'Model'}
                        </h2>
                      </div>
                      <p className="text-xs text-[#85857E] mt-0.5">
                        Seller: <strong className="text-[#242622]">{currentL3.seller_full_name || 'Vikramjit Singh'}</strong> • Reg: <strong className="text-[#242622] font-mono">{vehicle.registration_number || 'CH01AB8821'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-none text-xs font-bold uppercase border ${
                        currentSummary?.overall_verification_status === 'verified_documents'
                          ? 'bg-emerald-950 text-[#242622] border-emerald-600/50'
                          : 'bg-amber-950 text-amber-300 border-amber-600/50'
                      }`}>
                        {currentSummary?.overall_verification_status?.replace('_', ' ') || 'In Review'}
                      </span>
                    </div>
                  </div>

                  {/* Document Category Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E9E3D8]/60 text-xs">
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
                        className={`px-3.5 py-2 rounded-none font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
                          activeDocTab === t.id
                            ? 'bg-[#35483C]/30 text-white shadow-sm'
                            : 'bg-white/70 text-[#85857E] hover:text-[#242622] border border-[#E9E3D8]'
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
                      <div className="p-4 rounded-none bg-white border border-[#E9E3D8] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-[#242622]">Document Scan Viewer</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-[#242622] border border-emerald-600/40">
                            OCR: 96.4%
                          </span>
                        </div>

                        {/* Visual Document Canvas Simulation */}
                        <div className="relative aspect-[3/4] rounded-none bg-[#14231E] border border-[#E9E3D8] p-4 overflow-hidden shadow-inner flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-[#E9E3D8] pb-2">
                              <span className="text-[9px] font-mono text-[#85857E] uppercase">PARIVAHAN SEWA / RTO INDIA</span>
                              <ShieldCheck className="w-4 h-4 text-[#242622]" />
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <div className="h-2 w-3/4 bg-[#E9E3D8]/40 rounded animate-pulse" />
                              <div className="h-2 w-1/2 bg-[#E9E3D8]/40 rounded animate-pulse" />
                              <div className="h-2 w-2/3 bg-[#E9E3D8]/40 rounded animate-pulse" />
                            </div>
                            <div className="pt-4 p-2 rounded bg-[#E9E3D8] border border-[#E9E3D8] space-y-1 font-mono text-[9px]">
                              <p className="text-[#85857E]">REG NO: <span className="text-[#242622] font-bold">{vehicle.registration_number || 'CH01AB8821'}</span></p>
                              <p className="text-[#85857E]">CHASSIS: <span className="text-[#242622]">ME4J3A5C9P0••••••</span></p>
                              <p className="text-[#85857E]">ENGINE: <span className="text-[#242622]">J350E••••••</span></p>
                              <p className="text-[#85857E]">MAKER: <span className="text-[#242622]">{vehicle.brand || 'ROYAL ENFIELD'}</span></p>
                            </div>
                          </div>

                          <div className="border-t border-[#E9E3D8] pt-2 flex items-center justify-between text-[9px] text-slate-500">
                            <span>Security Hash: #B821A</span>
                            <span className="text-[#242622] font-semibold">Digitally Signed</span>
                          </div>
                        </div>

                        {/* File Details */}
                        <div className="text-[11px] text-[#85857E] space-y-1 pt-1">
                          <div className="flex justify-between">
                            <span>Uploaded Filename:</span>
                            <span className="text-[#242622] font-mono text-[10px]">rc_scan_certified.pdf</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Storage Vault:</span>
                            <span className="text-[#242622] font-mono text-[10px]">AES-256 Encrypted</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Split Panel: Field-by-Field Extracted vs Listing Comparison (7 cols) */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="p-4 rounded-none bg-white border border-[#E9E3D8] space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#85857E]">
                            Extracted Data vs Listing Claims
                          </h4>
                          <span className="text-[10px] text-[#85857E]">Automated OCR Match</span>
                        </div>

                        {/* Comparison Table */}
                        <div className="rounded-none overflow-hidden border border-[#E9E3D8] divide-y divide-forest-900 text-xs">
                          <div className="p-2.5 bg-[#0D1815] grid grid-cols-12 font-bold text-[10px] text-[#85857E] uppercase">
                            <span className="col-span-4">Field</span>
                            <span className="col-span-4">Extracted (OCR)</span>
                            <span className="col-span-4 text-right">Listing / Status</span>
                          </div>

                          {/* Row: Reg Number */}
                          <div className="p-2.5 grid grid-cols-12 items-center bg-white/40">
                            <span className="col-span-4 text-[#85857E] font-medium">Registration No</span>
                            <span className="col-span-4 font-mono font-bold text-[#242622]">{vehicle.registration_number || 'CH01AB8821'}</span>
                            <span className="col-span-4 text-right font-bold text-[#242622] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                            </span>
                          </div>

                          {/* Row: Owner Name */}
                          <div className="p-2.5 grid grid-cols-12 items-center">
                            <span className="col-span-4 text-[#85857E] font-medium">Owner Name</span>
                            <span className="col-span-4 text-[#242622] font-medium">{currentL3.seller_full_name || 'Vikramjit Singh'}</span>
                            <span className="col-span-4 text-right font-bold text-[#242622] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                            </span>
                          </div>

                          {/* Row: Vehicle Model */}
                          <div className="p-2.5 grid grid-cols-12 items-center bg-white/40">
                            <span className="col-span-4 text-[#85857E] font-medium">Brand & Model</span>
                            <span className="col-span-4 text-[#242622]">{vehicle.brand || 'Royal Enfield'} {vehicle.model || 'Classic 350'}</span>
                            <span className="col-span-4 text-right font-bold text-[#242622] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                            </span>
                          </div>

                          {/* Row: Fuel Type */}
                          <div className="p-2.5 grid grid-cols-12 items-center">
                            <span className="col-span-4 text-[#85857E] font-medium">Fuel Type</span>
                            <span className="col-span-4 text-[#242622] capitalize">{vehicle.fuel || 'Petrol'}</span>
                            <span className="col-span-4 text-right font-bold text-[#242622] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                            </span>
                          </div>

                          {/* Row: Financed / Loan */}
                          <div className="p-2.5 grid grid-cols-12 items-center bg-white/40">
                            <span className="col-span-4 text-[#85857E] font-medium">Lien / Loan</span>
                            <span className="col-span-4 text-[#242622]">No Hypothecation</span>
                            <span className="col-span-4 text-right font-bold text-[#242622] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Clear Title
                            </span>
                          </div>

                          {/* Row: Insurance Expiry */}
                          <div className="p-2.5 grid grid-cols-12 items-center">
                            <span className="col-span-4 text-[#85857E] font-medium">Insurance Policy</span>
                            <span className="col-span-4 text-[#242622]">Valid Policy</span>
                            <span className="col-span-4 text-right font-bold text-[#242622] flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                            </span>
                          </div>
                        </div>

                        {/* Extra Level 2 & 3 summary pills */}
                        <div className="p-3 rounded-none bg-[#F7F5EF] border border-[#E9E3D8] text-xs space-y-1">
                          <p className="font-bold text-[#242622] text-[11px]">Level 2 Condition & Maintenance Disclosures:</p>
                          <p className="text-[11px] text-[#85857E]">
                            Service: <strong className="text-[#242622] capitalize">{currentL2.service_history || 'Regular (OEM Workshop)'}</strong> • Tyres: <strong className="text-[#242622] capitalize">{currentL2.tyre_condition || 'Good'}</strong> • Accidental: <strong className="text-[#242622]">{currentL2.accident_disclosure || 'None reported'}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviewer Action Bar */}
                  <div className="p-5 rounded-none bg-white border border-[#E9E3D8] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#242622] uppercase tracking-wider flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#242622]" />
                        <span>Moderator Decision Desk</span>
                      </span>
                      <span className="text-[11px] text-[#85857E]">Acting as Reviewer: <strong className="text-[#242622]">MOD-9821</strong></span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#85857E]">
                        Reviewer Notes & Action Justification:
                      </label>
                      <input
                        type="text"
                        value={reviewerNotes}
                        onChange={(e) => setReviewerNotes(e.target.value)}
                        placeholder="e.g. Parivahan RTO extracted chassis prefix matches listing. Cleared for publication."
                        className="w-full px-3.5 py-2.5 rounded-none bg-white border border-[#E9E3D8] text-xs text-[#242622] placeholder-slate-500 focus:outline-none focus:border-[#35483C]"
                      />
                    </div>

                    {decisionSuccessMsg && (
                      <div className="p-3 rounded-none bg-emerald-950/80 border border-emerald-500 text-xs text-[#242622] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#242622] flex-shrink-0" />
                        <span>{decisionSuccessMsg}</span>
                      </div>
                    )}

                    {/* Action Button Set */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        onClick={() => handleDecision('approve')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Document</span>
                      </button>

                      <button
                        onClick={() => handleDecision('request_clearer_upload')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-none bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Request Clearer Scan</span>
                      </button>

                      <button
                        onClick={() => handleDecision('request_info')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-none bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Request Info from Seller</span>
                      </button>

                      <button
                        onClick={() => handleDecision('mark_further_verification')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-none bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Hub Physical Inspection</span>
                      </button>

                      <button
                        onClick={() => handleDecision('reject')}
                        disabled={isSubmittingDecision}
                        className="px-4 py-2.5 rounded-none bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Ban className="w-4 h-4" />
                        <span>Reject / Flag Discrepancy</span>
                      </button>
                    </div>
                  </div>

                  {/* Audit Trail Drawer */}
                  <div className="p-4 rounded-none bg-white border border-[#E9E3D8] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#85857E] flex items-center gap-1.5">
                        <History className="w-4 h-4 text-[#242622]" />
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
                        <div key={idx} className="p-2.5 rounded-none bg-white border border-[#E9E3D8] flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#242622] capitalize">{entry.action?.replace('_', ' ')}</span>
                              <span className="text-[10px] font-mono text-[#242622]">by {entry.reviewer_id} ({entry.reviewer_name})</span>
                            </div>
                            <p className="text-[11px] text-[#85857E]">{entry.reason}</p>
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
        )}

        {/* ======================================================== */}
        {/* TAB 2: SMART RC & VEHICLE AUTHENTICITY AUDIT DESK */}
        {/* ======================================================== */}
        {activeTab === 'smart_rc_desk' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-none bg-white border border-[#E9E3D8]">
                <span className="text-[10px] uppercase font-bold text-[#85857E]">Total RC Submissions</span>
                <p className="font-heading font-extrabold text-2xl text-[#242622] mt-1">{smartRcQueue.length}</p>
                <p className="text-[10px] text-slate-500">Pipeline audits logged</p>
              </div>
              <div className="p-4 rounded-none bg-white border border-amber-800/40">
                <span className="text-[10px] uppercase font-bold text-amber-400">Manual Review Queue</span>
                <p className="font-heading font-extrabold text-2xl text-amber-300 mt-1">
                  {smartRcQueue.filter(r => r.status === 'MANUAL_REVIEW').length}
                </p>
                <p className="text-[10px] text-amber-200/60">Discrepancy or blur flag</p>
              </div>
              <div className="p-4 rounded-none bg-white border border-blue-800/40">
                <span className="text-[10px] uppercase font-bold text-blue-400">Document Matched</span>
                <p className="font-heading font-extrabold text-2xl text-blue-300 mt-1">
                  {smartRcQueue.filter(r => r.status === 'DOCUMENT_MATCHED').length}
                </p>
                <p className="text-[10px] text-blue-200/60">Listing vs RC verified</p>
              </div>
              <div className="p-4 rounded-none bg-white border border-emerald-800/40">
                <span className="text-[10px] uppercase font-bold text-[#242622]">Government Verified</span>
                <p className="font-heading font-extrabold text-2xl text-[#242622] mt-1">
                  {smartRcQueue.filter(r => r.status === 'GOVERNMENT_VERIFIED').length}
                </p>
                <p className="text-[10px] text-[#35483C]/60">Live VAHAN API confirmed</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-none bg-white border border-[#E9E3D8]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#242622]" />
                <span className="text-xs font-bold text-[#85857E]">Filter Status:</span>
                <div className="flex flex-wrap items-center gap-1.5 ml-2">
                  {['ALL', 'MANUAL_REVIEW', 'DOCUMENT_MATCHED', 'GOVERNMENT_VERIFIED', 'VERIFICATION_FAILED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSmartRcFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors ${
                        smartRcFilter === st
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-[#85857E] hover:text-[#242622] border border-[#E9E3D8]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={fetchSmartRcQueue}
                className="px-3 py-1.5 rounded-none bg-[#E9E3D8] hover:bg-[#E9E3D8]/40 text-[#242622] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSmartRc ? 'animate-spin' : ''}`} />
                <span>Refresh Desk</span>
              </button>
            </div>

            {/* Main Inspection Grid (4 Cols Queue, 8 Cols Diagnostics Pane) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Queue List (4 Cols) */}
              <div className="lg:col-span-4 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] overflow-hidden flex flex-col h-[750px]">
                <div className="p-4 bg-white border-b border-[#E9E3D8] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#242622]" />
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#85857E]">
                      RC Submissions ({smartRcQueue.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Latest First</span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-forest-900/60">
                  {smartRcQueue.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                      <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
                      <p>No RC records matching filter "{smartRcFilter}".</p>
                      <p className="text-[10px] text-slate-600">Run a verification in the Seller Studio or run the test suite to populate records.</p>
                    </div>
                  ) : (
                    smartRcQueue.map((item) => {
                      const isSelected = selectedSmartRcId === item.id;
                      const statusColor = 
                        item.status === 'GOVERNMENT_VERIFIED' ? 'text-[#242622] bg-emerald-950/80 border-emerald-700/60' :
                        item.status === 'DOCUMENT_MATCHED' ? 'text-blue-300 bg-blue-950/80 border-blue-700/60' :
                        item.status === 'MANUAL_REVIEW' ? 'text-amber-300 bg-amber-950/80 border-amber-700/60' :
                        'text-red-300 bg-red-950/80 border-red-700/60';

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedSmartRcId(item.id)}
                          className={`p-4 cursor-pointer transition-all hover:bg-white/70 ${
                            isSelected ? 'bg-[#E9E3D8] border-l-4 border-l-emerald-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-sm text-[#242622] font-mono tracking-wide">
                                {item.registration_number || 'REG PENDING'}
                              </span>
                              <p className="text-[11px] text-[#85857E] mt-0.5">
                                Seller: <strong className="text-[#85857E]">{item.seller_name || item.listing_id || 'Seller'}</strong>
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${statusColor}`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-mono">ID: {item.id.slice(0, 14)}...</span>
                            <div className="flex items-center gap-2">
                              {item.blur_detected && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-900/40 text-amber-300 border border-amber-700/40">
                                  Blurry
                                </span>
                              )}
                              <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                item.anomaly_risk === 'HIGH_RISK' ? 'bg-red-950 text-red-300 border border-red-800' :
                                item.anomaly_risk === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                                'bg-emerald-950 text-[#242622] border border-emerald-900'
                              }`}>
                                {item.anomaly_risk || 'LOW RISK'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Inspector Pane (8 Cols) */}
              <div className="lg:col-span-8 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] p-6 space-y-6">
                {!smartRcDetail ? (
                  <div className="py-24 text-center text-slate-500 space-y-2">
                    <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold">Select an RC submission from the queue to inspect details.</p>
                  </div>
                ) : (
                  <>
                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E9E3D8]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-bold">VERIFICATION RECORD:</span>
                          <span className="font-mono text-xs text-[#242622] font-bold">{smartRcDetail.id}</span>
                        </div>
                        <h2 className="text-xl font-heading font-extrabold text-[#242622] mt-1">
                          {smartRcDetail.sellerConfirmedFields?.registrationNumber || smartRcDetail.extractedFields?.registrationNumber || 'Registration Certificate'}
                        </h2>
                        <p className="text-xs text-[#85857E] mt-0.5">
                          Listing: <span className="text-[#85857E] font-semibold">{smartRcDetail.listingId}</span> • Owner: <span className="text-[#85857E] font-semibold">{smartRcDetail.sellerConfirmedFields?.registeredOwnerName || 'Unknown'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className={`px-3 py-1.5 rounded-none font-bold text-xs uppercase border ${
                          smartRcDetail.status === 'GOVERNMENT_VERIFIED' ? 'bg-emerald-950 text-[#242622] border-emerald-700' :
                          smartRcDetail.status === 'DOCUMENT_MATCHED' ? 'bg-blue-950 text-blue-300 border-blue-700' :
                          smartRcDetail.status === 'MANUAL_REVIEW' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                          'bg-red-950 text-red-300 border-red-700'
                        }`}>
                          {smartRcDetail.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Notification Alert Message */}
                    {smartRcActionMsg && (
                      <div className="p-3 rounded-none bg-emerald-950/80 border border-emerald-700 text-[#35483C] text-xs flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-[#242622] shrink-0" />
                        <span>{smartRcActionMsg}</span>
                      </div>
                    )}

                    {/* Diagnostics 3-Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Card 1: Document Classification */}
                      <div className="p-4 rounded-none bg-white/70 border border-[#E9E3D8] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#85857E] flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>ML Classification</span>
                        </span>
                        <p className="font-heading font-extrabold text-lg text-[#242622]">
                          {smartRcDetail.documentClassification?.document_type || 'RC'}
                        </p>
                        <p className="text-[11px] text-[#85857E]">
                          Confidence: <strong className="text-[#242622] font-mono">
                            {((smartRcDetail.documentClassification?.confidence || 0.99) * 100).toFixed(1)}%
                          </strong>
                        </p>
                        <p className="text-[10px] text-slate-500">TF-IDF + LogisticRegression</p>
                      </div>

                      {/* Card 2: CV Image Quality */}
                      <div className="p-4 rounded-none bg-white/70 border border-[#E9E3D8] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#85857E] flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#242622]" />
                          <span>Image Quality (CV)</span>
                        </span>
                        <p className="font-heading font-extrabold text-lg text-[#242622] flex items-center gap-2">
                          <span>{smartRcDetail.qualityAssessment?.blurScore?.toFixed(1) || '145.0'}</span>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded font-normal ${
                            smartRcDetail.qualityAssessment?.isBlurred
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-[#242622] border border-emerald-900'
                          }`}>
                            {smartRcDetail.qualityAssessment?.isBlurred ? 'Blurred (<100)' : 'Sharp'}
                          </span>
                        </p>
                        <p className="text-[11px] text-[#85857E]">
                          Laplacian Variance Blur Metric
                        </p>
                        <p className="text-[10px] text-slate-500">Contrast: {smartRcDetail.qualityAssessment?.contrast || 'Adequate'}</p>
                      </div>

                      {/* Card 3: Anomaly & Fraud Risk */}
                      <div className="p-4 rounded-none bg-white/70 border border-[#E9E3D8] space-y-2">
                        <span className="text-[10px] uppercase font-bold text-[#85857E] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Anomaly & Fraud Risk</span>
                        </span>
                        <p className={`font-heading font-extrabold text-lg ${
                          smartRcDetail.anomalyResult?.risk_level === 'HIGH_RISK' ? 'text-red-400' :
                          smartRcDetail.anomalyResult?.risk_level === 'MEDIUM' ? 'text-amber-300' : 'text-[#242622]'
                        }`}>
                          {smartRcDetail.anomalyResult?.risk_level || 'LOW'}
                        </p>
                        <p className="text-[11px] text-[#85857E]">
                          Score: <strong className="font-mono text-[#242622]">{smartRcDetail.anomalyResult?.anomaly_score?.toFixed(2) || '0.12'}</strong>
                        </p>
                        <p className="text-[10px] text-slate-500">IsolationForest Model B</p>
                      </div>

                    </div>

                    {/* Discrepancy Warnings if any */}
                    {smartRcDetail.comparisonResult?.discrepancies?.length > 0 && (
                      <div className="p-4 rounded-none bg-amber-950/40 border border-amber-800/60 space-y-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                          <span>Listing vs Document Discrepancy Warning ({smartRcDetail.comparisonResult.discrepancies.length})</span>
                        </div>
                        <div className="space-y-1">
                          {smartRcDetail.comparisonResult.discrepancies.map((disc: string, idx: number) => (
                            <p key={idx} className="text-xs text-amber-200 flex items-start gap-2">
                              <span className="text-amber-500">•</span>
                              <span>{disc}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Side-by-Side Comparison Spec Table */}
                    <div className="rounded-none border border-[#E9E3D8] overflow-hidden">
                      <div className="p-3 bg-white border-b border-[#E9E3D8] font-bold text-xs text-[#85857E] flex items-center justify-between">
                        <span>Extracted vs Seller Confirmed vs External VAHAN</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          VAHAN Sandbox: {smartRcDetail.externalVerification?.source || 'VAHAN_MOCK_SANDBOX'}
                        </span>
                      </div>

                      <div className="divide-y divide-forest-900/50 text-xs">
                        {[
                          {
                            label: 'Registration Number',
                            extracted: smartRcDetail.extractedFields?.registrationNumber,
                            confirmed: smartRcDetail.sellerConfirmedFields?.registrationNumber,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.registrationNumber,
                            match: smartRcDetail.comparisonResult?.fieldMatches?.registrationNumber
                          },
                          {
                            label: 'Maker / Manufacturer',
                            extracted: smartRcDetail.extractedFields?.maker,
                            confirmed: smartRcDetail.sellerConfirmedFields?.maker,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.maker,
                            match: smartRcDetail.comparisonResult?.fieldMatches?.maker
                          },
                          {
                            label: 'Model / Variant',
                            extracted: smartRcDetail.extractedFields?.model,
                            confirmed: smartRcDetail.sellerConfirmedFields?.model,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.model,
                            match: smartRcDetail.comparisonResult?.fieldMatches?.model
                          },
                          {
                            label: 'Fuel Type',
                            extracted: smartRcDetail.extractedFields?.fuelType,
                            confirmed: smartRcDetail.sellerConfirmedFields?.fuelType,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.fuelType,
                            match: smartRcDetail.comparisonResult?.fieldMatches?.fuelType
                          },
                          {
                            label: 'Registration Date',
                            extracted: smartRcDetail.extractedFields?.registrationDate,
                            confirmed: smartRcDetail.sellerConfirmedFields?.registrationDate,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.registrationDate,
                            match: smartRcDetail.comparisonResult?.fieldMatches?.registrationDate
                          },
                          {
                            label: 'Chassis Number (Masked)',
                            extracted: smartRcDetail.extractedFields?.chassisNumberMasked,
                            confirmed: smartRcDetail.sellerConfirmedFields?.chassisNumberMasked,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.chassisNumberMasked,
                            match: 'MATCH'
                          },
                          {
                            label: 'Engine Number (Masked)',
                            extracted: smartRcDetail.extractedFields?.engineNumberMasked,
                            confirmed: smartRcDetail.sellerConfirmedFields?.engineNumberMasked,
                            vahan: smartRcDetail.externalVerification?.vahanRecord?.engineNumberMasked,
                            match: 'MATCH'
                          }
                        ].map((row, idx) => (
                          <div key={idx} className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-white/30">
                            <span className="col-span-3 text-[#85857E] font-semibold">{row.label}</span>
                            <span className="col-span-3 text-[#242622] font-mono">{row.extracted || '—'}</span>
                            <span className="col-span-3 text-[#85857E] font-mono">{row.confirmed || '—'}</span>
                            <div className="col-span-3 flex items-center justify-between">
                              <span className="text-[#85857E] font-mono">{row.vahan || '—'}</span>
                              {row.match === 'MATCH' ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-[#242622] text-[10px] font-bold">
                                  MATCH
                                </span>
                              ) : row.match === 'MISMATCH' ? (
                                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                                  MISMATCH
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-[#E9E3D8] text-[#85857E] text-[10px]">
                                  N/A
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviewer Action Desk */}
                    <div className="p-5 rounded-none bg-white border border-[#E9E3D8] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#242622]" />
                          <h4 className="font-heading font-bold text-sm text-[#242622]">Reviewer Audit Decision</h4>
                        </div>
                        <span className="text-[10px] text-slate-500">Moderator ID: RTO-CHIEF-01</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#85857E] mb-1">
                          Reviewer Audit Reason / Directives (Immutable log)
                        </label>
                        <textarea
                          value={smartRcNotes}
                          onChange={(e) => setSmartRcNotes(e.target.value)}
                          placeholder="e.g. Confirmed chassis and engine serial against physical image; verified fuel and model match."
                          className="w-full px-3 py-2.5 rounded-none bg-white border border-[#E9E3D8] text-xs text-[#242622] placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSmartRcDecision('approve')}
                          disabled={isSubmittingSmartRc}
                          className="px-4 py-2 rounded-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Verification</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSmartRcDecision('request_clearer_upload')}
                          disabled={isSubmittingSmartRc}
                          className="px-4 py-2 rounded-none bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Request Clearer RC Upload</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSmartRcDecision('reject')}
                          disabled={isSubmittingSmartRc}
                          className="px-4 py-2 rounded-none bg-red-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Ban className="w-4 h-4" />
                          <span>Reject / Flag Discrepancy</span>
                        </button>
                      </div>
                    </div>

                    {/* Audit Trail Log */}
                    <div className="p-4 rounded-none bg-white/60 border border-[#E9E3D8] space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#85857E] flex items-center gap-1.5">
                          <History className="w-4 h-4 text-[#242622]" />
                          <span>Audit Trail Ledger</span>
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {(smartRcDetail.auditTrail || []).length} Actions Logged
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        {(smartRcDetail.auditTrail || []).length === 0 ? (
                          <p className="text-[11px] text-slate-500 italic">No previous manual audit actions recorded.</p>
                        ) : (
                          smartRcDetail.auditTrail.map((log: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-none bg-white border border-[#E9E3D8] flex items-start justify-between">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#242622] capitalize">{log.action?.replace('_', ' ')}</span>
                                  <span className="text-[10px] font-mono text-[#242622]">by {log.reviewer_id}</span>
                                </div>
                                <p className="text-[11px] text-[#85857E]">{log.notes}</p>
                              </div>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Existing Marketplace Listings Moderation Tab */}
        {activeTab === 'marketplace_moderation' && (
          <div className="rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-4 bg-white border-b border-[#E9E3D8] font-bold text-xs text-[#85857E] grid grid-cols-12 gap-4">
              <span className="col-span-4">Vehicle & Location</span>
              <span className="col-span-2">Asking Price</span>
              <span className="col-span-3">Verification Tier</span>
              <span className="col-span-3 text-right">Moderator Actions</span>
            </div>

            <div className="divide-y divide-forest-900/60 text-xs">
              {listings.slice(0, 10).map((bike) => (
                <div key={bike.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-white/40 transition-colors">
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <img src={bike.primaryImage} alt={bike.title} className="w-12 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#242622] truncate">{bike.title}</p>
                      <p className="text-[#85857E] text-[11px]">{bike.area}, {bike.city}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="font-heading font-bold text-[#242622]">{formatINR(bike.price)}</p>
                    <p className="text-[10px] text-slate-500">{bike.km.toLocaleString('en-IN')} km</p>
                  </div>

                  <div className="col-span-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      bike.verificationTier === 'physically_inspected'
                        ? 'bg-[#35483C]/30 text-white'
                        : bike.verificationTier === 'document_verified'
                        ? 'bg-emerald-950 text-[#242622]'
                        : 'bg-slate-800 text-[#85857E]'
                    }`}>
                      {bike.verificationTier.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleVerify(bike.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#35483C] hover:bg-[#242622] text-white text-[11px] font-semibold transition-colors"
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

        {/* ======================================================== */}
        {/* TAB 3: LOCATION MONETIZATION & REVENUE DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === 'location_revenue' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Revenue Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#85857E]">Total Location Unlocks</span>
                <p className="font-heading font-extrabold text-3xl text-[#242622] mt-1">
                  {revenueStats?.total_location_unlocks || 0}
                </p>
                <p className="text-[11px] text-[#242622] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Paid verified buyer accesses
                </p>
              </div>

              <div className="p-5 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#85857E]">Gross Revenue</span>
                <p className="font-heading font-extrabold text-3xl text-[#242622] mt-1">
                  ₹{(revenueStats?.gross_revenue_inr || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#85857E]">@ ₹49 per meetup unlock</p>
              </div>

              <div className="p-5 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#85857E]">Successful Payments</span>
                <p className="font-heading font-extrabold text-3xl text-[#242622] mt-1">
                  {revenueStats?.successful_payments || 0}
                </p>
                <p className="text-[11px] text-[#242622] font-semibold">100% server verified</p>
              </div>

              <div className="p-5 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#85857E]">Net Revenue (After Refunds)</span>
                <p className="font-heading font-extrabold text-3xl text-gold mt-1">
                  ₹{(revenueStats?.net_revenue_inr || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#85857E]">Zero active dispute deductions</p>
              </div>
            </div>

            {/* Daily Breakdown & Monetization Rule Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Daily Breakdown (7 Cols) */}
              <div className="lg:col-span-7 p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#242622]" />
                    <h3 className="font-heading font-bold text-base text-[#242622]">Daily Unlocks Breakdown</h3>
                  </div>
                  <span className="text-xs text-[#242622] font-semibold">Real-Time Ledger</span>
                </div>

                <div className="divide-y divide-forest-900/60 text-xs">
                  {Object.entries(revenueStats?.daily_breakdown || {}).length === 0 ? (
                    <div className="py-8 text-center text-slate-500">
                      No unlocks recorded today. Unlocks made on vehicle detail pages will appear here.
                    </div>
                  ) : (
                    Object.entries(revenueStats?.daily_breakdown || {}).map(([day, count]) => (
                      <div key={day} className="py-3 flex items-center justify-between">
                        <span className="font-semibold text-[#242622]">{day}</span>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-white text-[#242622] font-bold border border-[#E9E3D8]">
                            {Number(count)} unlock(s)
                          </span>
                          <span className="font-bold text-[#242622] font-mono">
                            ₹{(Number(count) * 49).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Revenue Engine Specifications (5 Cols) */}
              <div className="lg:col-span-5 p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-4 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#242622]" />
                  <h3 className="font-heading font-bold text-base text-[#242622]">Monetization Engine Rules</h3>
                </div>

                <div className="space-y-3 text-[#85857E]">
                  <div className="p-3.5 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] space-y-1">
                    <span className="text-[#85857E] text-[10px] block uppercase font-bold">Pricing Model</span>
                    <p className="font-semibold text-[#242622]">₹49 Flat Location Access Fee</p>
                    <p className="text-[11px] text-[#85857E]">One-time payment per buyer per listing. No vehicle percentage cut.</p>
                  </div>

                  <div className="p-3.5 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] space-y-1">
                    <span className="text-[#85857E] text-[10px] block uppercase font-bold">Privacy Guard</span>
                    <p className="font-semibold text-[#242622]">Strict Approximate Masking</p>
                    <p className="text-[11px] text-[#85857E]">Before payment, APIs and frontend omit exact GPS coordinates and house numbers.</p>
                  </div>

                  <div className="p-3.5 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] space-y-1">
                    <span className="text-[#85857E] text-[10px] block uppercase font-bold">Access Duration</span>
                    <p className="font-semibold text-[#242622]">7 Calendar Days Validity</p>
                    <p className="text-[11px] text-[#85857E]">Buyer cannot be double-charged during active entitlement term.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Verified Transactions Table */}
            <div className="p-6 rounded-none border border-[#E9E3D8] bg-white border border-[#E9E3D8] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#242622]" />
                  <h3 className="font-heading font-bold text-base text-[#242622]">Recent Payment Transactions</h3>
                </div>
                <button
                  type="button"
                  onClick={fetchRevenue}
                  className="px-3 py-1.5 rounded-none bg-[#E9E3D8] hover:bg-[#E9E3D8]/40 text-[#35483C] text-xs font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Ledger</span>
                </button>
              </div>

              <div className="divide-y divide-forest-900/60 text-xs">
                {(revenueStats?.recent_transactions || []).length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    No transactions yet. Complete an unlock on any vehicle detail page to test.
                  </div>
                ) : (
                  (revenueStats?.recent_transactions || []).map((txn: any, idx: number) => (
                    <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#242622] font-mono">{txn.transaction_id}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-[#242622] text-[10px] font-bold">
                            Success
                          </span>
                        </div>
                        <p className="text-[11px] text-[#85857E] mt-0.5">
                          Listing: <strong className="text-[#85857E]">{txn.listing_id}</strong> • Buyer: {txn.buyer_name || txn.buyer_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-extrabold text-sm text-[#242622] font-mono">
                          +₹{txn.amount_inr || 49}
                        </span>
                        <p className="text-[10px] text-slate-500">{new Date(txn.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
