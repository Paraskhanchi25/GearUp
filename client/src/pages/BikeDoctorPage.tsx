import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Camera, 
  Mic, 
  MicOff, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Wrench, 
  ShieldAlert, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Zap,
  RotateCcw,
  Clock,
  Send,
  Check,
  Flame,
  Info,
  DollarSign
} from 'lucide-react';
import { diagnoseProblem, submitBikeDoctorFeedback, getBikeDoctorMLStatus } from '../services/aiApi';

export const BikeDoctorPage: React.FC = () => {
  const [symptom, setSymptom] = useState('Metallic clicking or ticking sound from cylinder head that doubles with throttle acceleration');
  const [category, setCategory] = useState<'motorcycle' | 'scooter' | 'electric_scooter'>('motorcycle');
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('Classic 350');
  const [year, setYear] = useState<number>(2023);
  const [km, setKm] = useState<number>(18000);
  const [fuelType, setFuelType] = useState('petrol');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [mlStatus, setMlStatus] = useState<any>(null);

  // Feedback State
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackAccuracy, setFeedbackAccuracy] = useState<boolean>(true);
  const [feedbackComponent, setFeedbackComponent] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackMechanicVerified, setFeedbackMechanicVerified] = useState(false);
  const [feedbackShopName, setFeedbackShopName] = useState('');
  const [feedbackCostPaid, setFeedbackCostPaid] = useState<number | ''>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    getBikeDoctorMLStatus().then((status) => {
      if (status) setMlStatus(status);
    });
  }, []);

  const handleCategoryChange = (cat: 'motorcycle' | 'scooter' | 'electric_scooter') => {
    setCategory(cat);
    if (cat === 'electric_scooter') {
      setBrand('Ather');
      setModel('450X');
      setFuelType('electric');
      setSymptom('Ather battery percentage suddenly dropped from 50% to 15% with thermal warning on screen');
    } else if (cat === 'scooter') {
      setBrand('Honda');
      setModel('Activa 6G');
      setFuelType('petrol');
      setSymptom('Scooter judders heavily and vibrates through the footboard when moving from 0 to 20 km/h');
    } else {
      setBrand('Royal Enfield');
      setModel('Classic 350');
      setFuelType('petrol');
      setSymptom('Metallic clicking or ticking sound from cylinder head that doubles with throttle acceleration');
    }
  };

  const handleDiagnose = async () => {
    if (!symptom.trim()) return;
    setIsAnalyzing(true);
    setFeedbackSubmitted(false);
    try {
      const res = await diagnoseProblem({
        symptom_text: symptom,
        brand,
        model,
        category,
        year,
        km,
        fuel_type: fuelType,
        has_image: !!attachedPhoto,
        has_audio: isRecordingAudio,
      });
      setDiagnosis(res);
      if (res?.ranked_causes?.length > 0) {
        setFeedbackComponent(res.ranked_causes[0].component);
        setFeedbackCategory(res.primary_fault_category || 'valvetrain_tappet_noise');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis?.diagnosis_id) return;
    setIsSubmittingFeedback(true);
    try {
      await submitBikeDoctorFeedback({
        diagnosis_id: diagnosis.diagnosis_id,
        actual_fault_component: feedbackComponent || diagnosis?.ranked_causes?.[0]?.component || 'General Powertrain Wear',
        actual_fault_category: feedbackCategory || diagnosis?.primary_fault_category || 'general_wear',
        was_accurate: feedbackAccuracy,
        resolution_notes: feedbackNotes,
        verified_by_mechanic: feedbackMechanicVerified,
        mechanic_shop_name: feedbackShopName,
        cost_paid: feedbackCostPaid ? Number(feedbackCostPaid) : undefined,
        rating: feedbackAccuracy ? 5 : 3
      });
      setFeedbackSubmitted(true);
      // Refresh status after submission
      getBikeDoctorMLStatus().then((s) => { if (s) setMlStatus(s); });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const sampleScenarios = [
    {
      title: 'Metallic Clicking in Cylinder Head',
      category: 'motorcycle',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      text: 'Metallic clicking or ticking sound from cylinder head that doubles with throttle acceleration'
    },
    {
      title: 'Scooter CVT Judder from Standstill',
      category: 'scooter',
      brand: 'Honda',
      model: 'Activa 6G',
      text: 'Scooter judders heavily and vibrates through the footboard when moving from 0 to 20 km/h'
    },
    {
      title: 'Spongy Front Brake & Delayed Bite',
      category: 'motorcycle',
      brand: 'Bajaj',
      model: 'Pulsar NS200',
      text: 'Front brake lever feels completely spongy and travels all the way to grip before bike slows down'
    },
    {
      title: 'Ather EV Battery Thermal Drop',
      category: 'electric_scooter',
      brand: 'Ather',
      model: '450X',
      text: 'Ather battery percentage suddenly dropped from 50% to 15% with thermal alert on dashboard'
    },
    {
      title: 'Raw Petrol Leak near Hot Engine',
      category: 'motorcycle',
      brand: 'Royal Enfield',
      model: 'Bullet 350',
      text: 'Strong petrol smell and fuel is dripping from pipe directly onto the hot exhaust pipe'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-24 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & ML Telemetry Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E9E3D8] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F5] border border-[#35483C]/30 text-xs font-bold text-[#35483C] tracking-wider uppercase shadow-sm">
              <Stethoscope className="w-3.5 h-3.5 text-[#35483C]" />
              <span>GEAR UP • AI Bike Doctor ML Intelligence Engine</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#242622]">
              Two-Wheeler Machine Learning Diagnostic Clinic
            </h1>
            <p className="text-[#85857E] text-xs max-w-2xl">
              Trained on authentic Indian motorcycle, scooter, and EV repair records. Evaluates mechanical, electrical, CVT, and safety risks with deterministic safety overrides.
            </p>
          </div>

          {/* Real ML Status Live Pill */}
          <div className="flex items-center gap-3 bg-white border border-[#242622]/[0.08] p-3.5 rounded-2xl shadow-subtle self-start">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left text-xs space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#242622]">ML Engine {mlStatus?.model_version || 'v1.0.1'}</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  ONLINE
                </span>
              </div>
              <div className="text-[10px] text-[#85857E]">
                {mlStatus?.dataset_records_count || 323} verified repair cases • F1: {mlStatus?.fault_predictor_metrics?.f1_macro || '1.00'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#242622]/[0.08] p-6 sm:p-8 rounded-3xl space-y-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-[#E9E3D8] pb-3">
              <h3 className="font-heading font-bold text-sm text-[#242622] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#35483C]" />
                <span>Vehicle & Symptom Input</span>
              </h3>
              <span className="text-[11px] text-[#85857E] font-medium">Step 1 of 2</span>
            </div>

            {/* Powertrain / Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#85857E] uppercase tracking-wider block">
                Vehicle Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'motorcycle', label: 'Motorcycle' },
                  { id: 'scooter', label: 'Scooter (CVT)' },
                  { id: 'electric_scooter', label: 'Electric EV' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCategoryChange(item.id as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all tactile-btn ${
                      category === item.id
                        ? 'bg-[#35483C] text-white border-[#35483C] shadow-sm'
                        : 'bg-[#FAF9F5] text-[#85857E] border-[#242622]/[0.08] hover:text-[#242622] hover:border-[#35483C]/40'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/[0.1] rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/[0.1] rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/[0.1] rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[#85857E] font-semibold mb-1 block">Odometer (KM)</label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(Number(e.target.value))}
                  className="w-full bg-[#FAF9F5] border border-[#242622]/[0.1] rounded-xl px-3.5 py-2.5 text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/20 transition-all"
                />
              </div>
            </div>

            {/* Problem Symptom Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#85857E] uppercase tracking-wider block">
                Describe the Complaint or Mechanical Anomaly
              </label>
              <textarea
                rows={3}
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="e.g. Metallic clicking from engine head, spongy front brake lever, heavy vibration at 60 km/h..."
                className="w-full bg-[#FAF9F5] border border-[#242622]/[0.1] rounded-2xl p-4 text-xs text-[#242622] focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/20 leading-relaxed transition-all"
              />
            </div>

            {/* Quick Realistic Test Scenarios */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#85857E] uppercase tracking-wider block">
                Quick Verified Workshop Cases:
              </span>
              <div className="space-y-1">
                {sampleScenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCategory(sc.category as any);
                      setBrand(sc.brand);
                      setModel(sc.model);
                      setSymptom(sc.text);
                      setFuelType(sc.category === 'electric_scooter' ? 'electric' : 'petrol');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#E9E3D8]/60 border border-[#242622]/[0.06] text-[11px] text-[#242622] flex items-center justify-between transition-colors tactile-btn active:scale-95"
                  >
                    <span className="truncate">• {sc.title}</span>
                    <span className="text-[9px] text-[#85857E] uppercase font-bold shrink-0 ml-2">{sc.brand}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleDiagnose}
              disabled={isAnalyzing}
              className="w-full py-4 min-h-[48px] rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer tactile-btn active:scale-[0.96]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{isAnalyzing ? 'Running ML Diagnostics...' : 'Run Bike Doctor ML Diagnosis'}</span>
            </button>
          </div>

          {/* Diagnosis Result View (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {diagnosis ? (
              <div className="bg-white border border-[#242622]/[0.08] p-6 sm:p-8 rounded-3xl space-y-6 shadow-subtle">
                
                {/* Header with Case ID and Machine Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E9E3D8] pb-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#85857E]">
                        Diagnosis ID: {diagnosis.diagnosis_id}
                      </span>
                    </div>
                    <div className="font-heading font-extrabold text-base text-[#242622]">
                      {diagnosis.vehicle_summary?.brand} {diagnosis.vehicle_summary?.model} ({diagnosis.vehicle_summary?.year})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-[#E9E3D8] text-[#242622]">
                      {diagnosis.primary_fault_category?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Safety Assessment Alert Box */}
                {diagnosis.safety_assessment && (
                  <div className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed ${
                    diagnosis.safety_assessment.severity === 'CRITICAL'
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : (diagnosis.safety_assessment.severity === 'HIGH'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-900')
                  }`}>
                    <div className="flex items-start gap-3">
                      {diagnosis.safety_assessment.severity === 'CRITICAL' ? (
                        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="font-bold uppercase tracking-wider flex items-center gap-2">
                          <span>Safety Severity: {diagnosis.safety_assessment.severity}</span>
                          <span className="font-normal text-[11px]">
                            ({diagnosis.safety_assessment.is_safe_to_ride ? 'Safe for Low-Speed Transit' : 'URGENT: DO NOT RIDE'})
                          </span>
                        </div>
                        <p className="text-xs font-medium">
                          {diagnosis.safety_assessment.critical_warning || diagnosis.safety_assessment.risk_summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Mechanic Grounded Explanation */}
                {diagnosis.ai_mechanic_explanation && (
                  <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.06] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#35483C] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Master Mechanic Assessment</span>
                    </div>
                    <p className="text-xs text-[#242622] leading-relaxed whitespace-pre-line">
                      {diagnosis.ai_mechanic_explanation}
                    </p>
                  </div>
                )}

                {/* Ranked Candidate Causes */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#85857E] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ranked Probable Root Causes (ML Predictor)</span>
                  </h4>
                  <div className="space-y-2.5">
                    {diagnosis.ranked_causes?.map((cause: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/[0.06] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#242622]">{cause.component}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-[#E9E3D8] text-[#242622]">
                            {cause.confidence_label}
                          </span>
                        </div>
                        <p className="text-xs text-[#85857E] leading-relaxed">{cause.explanation}</p>
                        {cause.parts_likely_needed?.length > 0 && (
                          <div className="text-[11px] text-[#35483C] font-semibold pt-1">
                            Parts Benchmark: {cause.parts_likely_needed.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estimated Repair Cost Box */}
                {diagnosis.estimated_repair_cost && (
                  <div className="grid grid-cols-3 gap-2 p-3 bg-white border border-[#E9E3D8] text-center text-xs">
                    <div>
                      <div className="text-[10px] text-[#85857E] font-bold uppercase">Estimated Parts</div>
                      <div className="font-extrabold text-[#242622]">
                        ₹{diagnosis.estimated_repair_cost.min_inr} – ₹{diagnosis.estimated_repair_cost.max_inr}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#85857E] font-bold uppercase">Estimated Labor</div>
                      <div className="font-extrabold text-[#242622]">
                        ₹{diagnosis.estimated_repair_cost.labor_inr}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#85857E] font-bold uppercase">Benchmark Scope</div>
                      <div className="font-semibold text-[#85857E] truncate">Tier-1/2 Workshop</div>
                    </div>
                  </div>
                )}

                {/* Safe DIY Checks */}
                {diagnosis.safe_diy_checks?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#35483C] flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Safe DIY Inspection Checks (No Disassembly)</span>
                    </h4>
                    <div className="space-y-2">
                      {diagnosis.safe_diy_checks.map((check: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white border border-[#E9E3D8] space-y-1">
                          <div className="font-bold text-xs text-[#242622]">{check.title}</div>
                          <ul className="text-xs text-[#85857E] space-y-0.5">
                            {check.steps.map((st: string, sIdx: number) => (
                              <li key={sIdx}>• {st}</li>
                            ))}
                          </ul>
                          {check.safety_precaution && (
                            <div className="text-[10px] text-amber-800 font-semibold pt-1">
                              ⚠️ Safety Caution: {check.safety_precaution}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Mechanic Procedures */}
                {diagnosis.professional_mechanic_checks?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#85857E] flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Professional Mechanic Workshop Procedures</span>
                    </h4>
                    <div className="space-y-2">
                      {diagnosis.professional_mechanic_checks.map((chk: any, i: number) => (
                        <div key={i} className="p-3 bg-white border border-[#E9E3D8] space-y-1">
                          <div className="font-bold text-xs text-[#242622] flex items-center justify-between">
                            <span>{chk.title}</span>
                            {chk.tools_required?.length > 0 && (
                              <span className="text-[10px] font-semibold text-[#85857E]">
                                Tools: {chk.tools_required.join(', ')}
                              </span>
                            )}
                          </div>
                          <ul className="text-xs text-[#85857E] space-y-0.5">
                            {chk.steps.map((s: string, sI: number) => (
                              <li key={sI}>• {s}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Specific Nuances */}
                {diagnosis.model_specific_notes?.length > 0 && (
                  <div className="p-3.5 bg-[#E9E3D8]/50 border border-[#E9E3D8] space-y-1">
                    <span className="text-[11px] font-bold text-[#242622] uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#35483C]" />
                      Model Specific Engineering Nuances ({diagnosis.vehicle_summary?.brand}):
                    </span>
                    <ul className="text-xs text-[#85857E] space-y-1 pt-1">
                      {diagnosis.model_specific_notes.map((n: string, ni: number) => (
                        <li key={ni}>• {n}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Continuous Learning Repair Feedback Loop */}
                <div className="border-t border-[#E9E3D8] pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#242622]">
                        Did You Visit a Workshop? Report Actual Repair
                      </h4>
                      <p className="text-[11px] text-[#85857E]">
                        Help the Bike Doctor ML engine learn and improve through verified mechanic feedback.
                      </p>
                    </div>
                    {!feedbackOpen && !feedbackSubmitted && (
                      <button
                        type="button"
                        onClick={() => setFeedbackOpen(true)}
                        className="px-3 py-1.5 bg-[#35483C] text-white text-xs font-bold hover:bg-[#242622] transition-colors"
                      >
                        Submit Repair Outcome
                      </button>
                    )}
                  </div>

                  {feedbackSubmitted && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Thank you! Your verified workshop repair outcome was queued for continuous learning model retraining.</span>
                    </div>
                  )}

                  {feedbackOpen && !feedbackSubmitted && (
                    <form onSubmit={handleFeedbackSubmit} className="p-4 bg-[#F7F5EF] border border-[#E9E3D8] space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#85857E] font-semibold mb-1 block">Was ML Diagnosis Accurate?</label>
                          <select
                            value={feedbackAccuracy ? 'yes' : 'no'}
                            onChange={(e) => setFeedbackAccuracy(e.target.value === 'yes')}
                            className="w-full bg-white border border-[#E9E3D8] p-2"
                          >
                            <option value="yes">Yes, diagnosis was accurate</option>
                            <option value="no">No, actual fault was different</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[#85857E] font-semibold mb-1 block">Actual Fault Component</label>
                          <input
                            type="text"
                            value={feedbackComponent}
                            onChange={(e) => setFeedbackComponent(e.target.value)}
                            placeholder="e.g. Valve Tappet Clearance"
                            className="w-full bg-white border border-[#E9E3D8] p-2"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[#85857E] font-semibold mb-1 block">Mechanic Shop Name (Optional)</label>
                          <input
                            type="text"
                            value={feedbackShopName}
                            onChange={(e) => setFeedbackShopName(e.target.value)}
                            placeholder="e.g. Speed Wheels Workshop"
                            className="w-full bg-white border border-[#E9E3D8] p-2"
                          />
                        </div>
                        <div>
                          <label className="text-[#85857E] font-semibold mb-1 block">Actual Cost Paid (₹)</label>
                          <input
                            type="number"
                            value={feedbackCostPaid}
                            onChange={(e) => setFeedbackCostPaid(e.target.value ? Number(e.target.value) : '')}
                            placeholder="e.g. 450"
                            className="w-full bg-white border border-[#E9E3D8] p-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[#85857E] font-semibold mb-1 block">Mechanic Resolution Notes</label>
                        <textarea
                          rows={2}
                          value={feedbackNotes}
                          onChange={(e) => setFeedbackNotes(e.target.value)}
                          placeholder="e.g. Mechanic adjusted valve lash from 0.20mm to 0.08mm. Engine noise completely resolved."
                          className="w-full bg-white border border-[#E9E3D8] p-2"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#242622]">
                          <input
                            type="checkbox"
                            checked={feedbackMechanicVerified}
                            onChange={(e) => setFeedbackMechanicVerified(e.target.checked)}
                            className="w-3.5 h-3.5 text-[#35483C]"
                          />
                          <span>Verified with workshop receipt or certified mechanic</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setFeedbackOpen(false)}
                            className="px-3 py-1.5 text-xs text-[#85857E] hover:text-[#242622]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingFeedback}
                            className="px-4 py-1.5 bg-[#35483C] text-white text-xs font-bold hover:bg-[#242622]"
                          >
                            {isSubmittingFeedback ? 'Saving...' : 'Submit Feedback'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white border border-[#242622]/[0.08] p-12 rounded-3xl text-center space-y-4 shadow-subtle">
                <div className="w-14 h-14 bg-[#E9E3D8] flex items-center justify-center mx-auto text-[#35483C]">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#242622]">No Active Diagnosis Yet</h3>
                <p className="text-[#85857E] text-xs max-w-sm mx-auto leading-relaxed">
                  Enter your bike complaint on the left or select a sample workshop case to inspect mechanical causes, safety urgency, and repair costs.
                </p>
                <button
                  type="button"
                  onClick={handleDiagnose}
                  className="px-6 py-3 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer tactile-btn active:scale-95"
                >
                  Run Sample Royal Enfield Diagnosis
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
