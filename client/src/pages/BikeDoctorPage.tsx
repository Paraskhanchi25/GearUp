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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Bike Doctor • Multi-Modal Diagnostics</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
            Two-Wheeler Mechanical Symptom Doctor
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Describe symptoms via text, upload photos of dashboard lights / tyre wear, or record unusual engine sounds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
            <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-600" />
              <span>Describe Problem</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold mb-1 block">What is happening?</label>
                <textarea
                  rows={4}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="e.g. My bike vibrates when I cross 60 km/h, or engine makes ticking sound..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-slate-400 placeholder-slate-400"
                />
              </div>

              {/* Sample Quick Questions */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 mb-1.5 block">Common Scenarios:</span>
                <div className="space-y-1">
                  {sampleSymptoms.slice(0, 3).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSymptom(item)}
                      className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 transition-colors truncate"
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
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                      ? 'bg-red-50 border-red-300 text-red-800 animate-pulse'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isRecordingAudio ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecordingAudio ? 'Recording Engine...' : 'Record Audio'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-700 font-semibold mb-1 block">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold mb-1 block">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <button
                onClick={handleDiagnose}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm transition-all flex items-center justify-center gap-2 text-xs mt-3"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing Symptoms with AI...' : 'Run Bike Doctor Diagnosis'}</span>
              </button>
            </div>
          </div>

          {/* Diagnosis Result (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {diagnosis ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-elevated space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Diagnosis Report</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      diagnosis.urgency_level === 'urgent_do_not_ride'
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {diagnosis.urgency_level.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-blue-600 font-semibold">{brand} {model}</span>
                </div>

                {/* Possible Causes */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Possible Mechanical Causes</span>
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.possible_causes.map((c: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{c.component}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase">
                            {c.probability} Probability
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safe DIY Checks */}
                <div className="space-y-2.5">
                  <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Safe DIY Checks You Can Perform</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {diagnosis.safe_diy_checks.map((check: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Questions for Clarification */}
                {diagnosis.clarifying_questions && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      Mechanic Questions to Pinpoint Further:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {diagnosis.clarifying_questions.map((q: string, i: number) => (
                        <li key={i}>• {q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety Disclaimer */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                  {diagnosis.safety_disclaimer}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900">No Active Diagnosis Yet</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Type your symptoms on the left or click one of the common mechanical scenarios to analyze causes and safe DIY checks.
                </p>
                <button
                  onClick={handleDiagnose}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
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
