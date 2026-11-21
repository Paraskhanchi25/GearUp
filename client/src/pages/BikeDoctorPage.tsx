import React, { useState } from 'react';
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
  Volume2
} from 'lucide-react';
import { diagnoseProblem } from '../services/aiApi';

export const BikeDoctorPage: React.FC = () => {
  const [symptom, setSymptom] = useState('My bike makes a metallic clicking sound that increases with speed');
  const [brand, setBrand] = useState('Royal Enfield');
  const [model, setModel] = useState('Classic 350');
  const [year, setYear] = useState<number>(2023);
  const [km, setKm] = useState<number>(14000);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const handleDiagnose = async () => {
    if (!symptom.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await diagnoseProblem({
        symptom_text: symptom,
        brand,
        model,
        year,
        km,
      });
      setDiagnosis(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sampleSymptoms = [
    'Metallic clicking noise near cylinder head when accelerating',
    'Severe handlebar vibration between 60 to 70 km/h',
    'Spongy front brake lever with delayed stopping bite',
    'Scooter judders and vibrates heavily when starting from standstill (CVT)',
    'White smoke coming from silencer exhaust pipe on cold start',
  ];

  return (
    <div className="min-h-screen bg-[#0A1411] text-slate-100 pb-24 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/80 border border-forest-600/60 text-xs font-bold text-forest-300 uppercase tracking-widest">
            <Stethoscope className="w-3.5 h-3.5 text-forest-400" />
            <span>AI Bike Doctor • Multi-Modal Diagnostics</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Two-Wheeler Mechanical Symptom Doctor
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Describe symptoms via text, upload photos of dashboard lights / tyre wear, or record unusual engine sounds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#101D19] border border-forest-800 space-y-5 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-forest-400" />
              <span>Describe Problem</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold mb-1 block">What is happening?</label>
                <textarea
                  rows={4}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="e.g. My bike vibrates when I cross 60 km/h, or engine makes ticking sound..."
                  className="w-full bg-forest-950 border border-forest-800 rounded-xl p-3 text-white focus:outline-none focus:border-forest-500"
                />
              </div>

              {/* Sample Quick Questions */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 mb-1.5 block">Common Scenarios:</span>
                <div className="space-y-1">
                  {sampleSymptoms.slice(0, 3).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSymptom(item)}
                      className="w-full text-left p-2 rounded-lg bg-forest-950/60 hover:bg-forest-900 border border-forest-900/80 text-[11px] text-slate-300 hover:text-white transition-colors truncate"
                    >
                      • {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Attachments */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAttachedPhoto(attachedPhoto ? null : 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=70')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold text-xs transition-colors ${
                    attachedPhoto
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-forest-950 border-forest-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{attachedPhoto ? 'Photo Attached' : 'Attach Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRecordingAudio(!isRecordingAudio)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold text-xs transition-colors ${
                    isRecordingAudio
                      ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                      : 'bg-forest-950 border-forest-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isRecordingAudio ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecordingAudio ? 'Recording Engine...' : 'Record Audio'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold mb-1 block">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleDiagnose}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold shadow-glow transition-all flex items-center justify-center gap-2 text-xs mt-3"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing Symptoms with AI...' : 'Run Bike Doctor Diagnosis'}</span>
              </button>
            </div>
          </div>

          {/* Diagnosis Result (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {diagnosis ? (
              <div className="p-8 rounded-3xl bg-[#101D19] border border-forest-700/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-forest-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnosis Report</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      diagnosis.urgency_level === 'urgent_do_not_ride'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}>
                      {diagnosis.urgency_level.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-forest-400 font-semibold">{brand} {model}</span>
                </div>

                {/* Possible Causes */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Possible Mechanical Causes</span>
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.possible_causes.map((c: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl bg-forest-950/70 border border-forest-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 text-xs">{c.component}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-forest-900 text-forest-300 font-bold uppercase">
                            {c.probability} Probability
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe DIY Checks */}
                <div className="space-y-2.5">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Safe DIY Checks You Can Perform</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {diagnosis.safe_diy_checks.map((check: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-black/30">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Questions for Clarification */}
                {diagnosis.clarifying_questions && (
                  <div className="p-4 rounded-xl bg-forest-950/40 border border-forest-900 space-y-2">
                    <span className="text-xs font-bold text-forest-300 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Mechanic Questions to Pinpoint Further:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-400">
                      {diagnosis.clarifying_questions.map((q: string, i: number) => (
                        <li key={i}>• {q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Disclaimer */}
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-[11px] text-amber-200/90 leading-relaxed">
                  {diagnosis.safety_disclaimer}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-[#101D19] border border-forest-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-forest-900/60 border border-forest-700/50 flex items-center justify-center mx-auto text-forest-400">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">No Active Diagnosis Yet</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Type your symptoms on the left or click one of the common mechanical scenarios to analyze causes and safe DIY checks.
                </p>
                <button
                  onClick={handleDiagnose}
                  className="px-5 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Test Sample Diagnosis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};