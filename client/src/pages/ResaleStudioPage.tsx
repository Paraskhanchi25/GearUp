import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  SlidersHorizontal, 
  ShieldCheck, 
  Camera, 
  DollarSign, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { RESALE_UPGRADES_CATALOG } from '../data/seedListings';
import { formatINR } from '../utils/geo';

const TRANSFORMATION_THEMES = [
  {
    id: 'factory_restore',
    name: 'Premium Factory Restore',
    desc: 'Deep ceramic polish, original emblem restoration & black plastics reconditioning',
    beforeImg: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'clean_polished',
    name: 'Clean and Polished',
    desc: 'Exhaust chrome de-oxidation, chain detailing & clear lens buffing',
    beforeImg: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'sporty',
    name: 'Sporty Appearance',
    desc: 'Rim pinstripe accents, bar-end mirrors & dark carbon-texture touchups',
    beforeImg: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'classic_look',
    name: 'Classic Vintage Look',
    desc: 'Tan ribbed leather seat, classic round mirrors & brass accents',
    beforeImg: 'https://images.unsplash.com/photo-1558981420-87aa9210d992?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  },
];

const TARGET_GOALS = [
  'Visual Appeal',
  'Performance & Reliability',
  'Comfort & Ergonomics',
  'Trust & Documentation',
  'Sell Faster',
  'Maximum Resale Return',
];

const BUDGET_TIERS = [
  { label: '₹0 (Free only)', value: 0 },
  { label: 'Under ₹1,000', value: 1000 },
  { label: '₹1,000 - ₹3,000', value: 3000 },
  { label: '₹3,000 - ₹7,000', value: 7000 },
  { label: 'Flexible Budget', value: 99999 },
];

export const ResaleStudioPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState(TRANSFORMATION_THEMES[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Visual Appeal', 'Trust & Documentation']);
  const [selectedBudget, setSelectedBudget] = useState<number>(3000);
  const [plannedUpgrades, setPlannedUpgrades] = useState<string[]>(['up-1', 'up-2', 'up-5']);
  const [quoteRequested, setQuoteRequested] = useState<boolean>(false);

  // Toggle goal
  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  // Toggle upgrade selection
  const toggleUpgrade = (id: string) => {
    if (plannedUpgrades.includes(id)) {
      setPlannedUpgrades(plannedUpgrades.filter((u) => u !== id));
    } else {
      setPlannedUpgrades([...plannedUpgrades, id]);
    }
  };

  // Calculate dynamic ROI
  const activeUpgrades = RESALE_UPGRADES_CATALOG.filter((u) => plannedUpgrades.includes(u.id));
  const totalCost = activeUpgrades.reduce((sum, u) => sum + u.cost, 0);
  const totalProjectedGain = activeUpgrades.reduce((sum, u) => sum + u.estimatedResaleGain, 0);
  const netEstimatedReturn = totalProjectedGain - totalCost;

  const baseCurrentPrice = 165000;
  const projectedNewPrice = baseCurrentPrice + totalProjectedGain;

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] pb-24">
      {/* Studio Hero Header (Porsche Automotive Editorial) */}
      <div className="border-b border-[#242622]/[0.08] bg-[#161816] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-bold text-white shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-[#A4AD98]" />
            <span>AI RESALE UPGRADE STUDIO</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Unlock Your Bike&apos;s Resale Value
          </h1>
          <p className="text-[#A4AD98] text-sm sm:text-base max-w-2xl leading-relaxed font-sans">
            Stop losing ₹10,000+ to aggressive buyers on minor cosmetic flaws. Our AI suggests high-ROI cosmetic & trust upgrades that maximize buyer confidence without unnecessary expenses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 1. BEFORE & AFTER TRANSFORMATION VISUALIZATION SLIDER */}
        <section className="p-6 sm:p-8 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#35483C] uppercase tracking-widest">
                AI PREVIEW ENGINE
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#242622] tracking-tight">
                Interactive Before vs After Preview
              </h2>
              <p className="text-xs text-[#85857E] mt-0.5">
                Drag the divider handle to inspect simulated detailing enhancements
              </p>
            </div>

            {/* Theme Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {TRANSFORMATION_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 tactile-btn ${
                    selectedTheme.id === theme.id
                      ? 'bg-[#35483C] text-white shadow-sm'
                      : 'bg-[#FAF9F5] text-[#85857E] hover:text-[#242622] border border-[#242622]/10 hover:border-[#35483C]'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Split Slider Container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden select-none border border-[#242622]/10 bg-black shadow-inner">
            {/* After Image (Background) */}
            <img
              src={selectedTheme.afterImg}
              alt="After AI detailing"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#161816]/90 text-white text-xs font-mono font-bold border border-white/20 backdrop-blur-md">
              AI Upgraded Preview ✨
            </div>

            {/* Before Image (Foreground clipped by sliderPosition) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={selectedTheme.beforeImg}
                alt="Before detailing"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/80 text-white/90 text-xs font-mono font-bold border border-white/20 backdrop-blur-md">
                Current Unprepped State
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-[#161816] border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs font-bold">
                ⇄
              </div>
            </div>

            {/* Transparent Range Input for scrubbing */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
              aria-label="Before/After Slider"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#85857E] font-mono">
            <span>Theme Description: <strong className="text-[#35483C] font-semibold">{selectedTheme.desc}</strong></span>
            <span className="italic text-[11px] text-[#85857E]">*Previews are AI generated estimates. Never used as fraudulent photographs.</span>
          </div>
        </section>

        {/* 2. GOALS & BUDGET CONFIGURATION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Goals Selection */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-sm space-y-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#242622]">What would you like to improve?</h3>
              <p className="text-xs text-[#85857E]">Select one or more seller priorities</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {TARGET_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all duration-200 tactile-btn ${
                      isSelected
                        ? 'bg-[#35483C] border-[#35483C] text-white shadow-sm'
                        : 'bg-[#FAF9F5] border-[#242622]/10 text-[#85857E] hover:text-[#242622]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{goal}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Selection */}
          <div className="p-6 sm:p-7 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-sm space-y-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#242622]">Target Upgrade Budget</h3>
              <p className="text-xs text-[#85857E]">How much are you comfortable investing in pre-sale prep?</p>
            </div>

            <div className="space-y-2">
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => setSelectedBudget(tier.value)}
                  className={`w-full p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all duration-200 tactile-btn ${
                    selectedBudget === tier.value
                      ? 'bg-[#35483C] border-[#35483C] text-white shadow-sm'
                      : 'bg-[#FAF9F5] border-[#242622]/10 text-[#85857E] hover:text-[#242622]'
                  }`}
                >
                  <span>{tier.label}</span>
                  {selectedBudget === tier.value && (
                    <span className="text-[10px] bg-white/20 text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LIVE AI ROI CALCULATOR & RESALE MATRIX (Liquid Glass HUD) */}
        <section className="p-7 sm:p-8 rounded-3xl bg-[#161816] text-white border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#A4AD98] uppercase tracking-widest">
                FINANCIAL PREDICTION
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Live AI Resale ROI Calculator
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 font-mono">
              <span className="text-[#A4AD98]">Confidence:</span>
              <span className="font-bold text-white">92% High Reliability</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[11px] text-[#A4AD98] font-mono">Est. Current Resale</p>
              <p className="font-heading font-bold text-xl text-white mt-1">{formatINR(baseCurrentPrice)}</p>
              <p className="text-[10px] text-white/50 font-mono">As-is condition</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[11px] text-[#A4AD98] font-mono">Total Upgrades Cost</p>
              <p className="font-heading font-bold text-xl text-amber-300 mt-1">{formatINR(totalCost)}</p>
              <p className="text-[10px] text-white/50 font-mono">{activeUpgrades.length} items planned</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-[11px] text-[#A4AD98] font-mono">Potential Resale Price</p>
              <p className="font-heading font-bold text-xl text-white mt-1">{formatINR(projectedNewPrice)}</p>
              <p className="text-[10px] text-emerald-400 font-mono font-semibold">+{formatINR(totalProjectedGain)} gross gain</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#35483C]/80 border border-emerald-400/40 shadow-sm">
              <p className="text-[11px] text-white/80 font-mono font-bold">Estimated Net Return</p>
              <p className="font-heading font-extrabold text-2xl text-white mt-1">+{formatINR(netEstimatedReturn)}</p>
              <p className="text-[10px] text-emerald-300 font-mono">ROI: {(totalCost > 0 ? (totalProjectedGain / totalCost).toFixed(1) : 1)}x multiplier</p>
            </div>
          </div>
        </section>

        {/* 4. UPGRADE ACTIONS CHECKLIST */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-[#242622]">Recommended Upgrades Checklist</h3>
              <p className="text-xs text-[#85857E]">Check or uncheck items to recalculate ROI instantly</p>
            </div>
            <button
              onClick={() => setPlannedUpgrades(RESALE_UPGRADES_CATALOG.map((u) => u.id))}
              className="text-xs text-[#35483C] font-mono font-bold hover:underline tactile-btn"
            >
              Select All Upgrades
            </button>
          </div>

          <div className="space-y-3">
            {RESALE_UPGRADES_CATALOG.map((item) => {
              const isChecked = plannedUpgrades.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleUpgrade(item.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 tactile-btn ${
                    isChecked
                      ? 'bg-white border-[#35483C] shadow-md ring-1 ring-[#35483C]/20'
                      : 'bg-white/60 border-[#242622]/10 opacity-70 hover:opacity-100 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isChecked ? 'bg-[#35483C] border-[#35483C] text-white' : 'border-[#242622]/30'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#242622]">{item.title}</span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase bg-[#FAF9F5] text-[#242622] border border-[#242622]/10">
                          {item.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#85857E]">{item.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs shrink-0 font-mono">
                    <div className="text-right">
                      <p className="text-[#85857E] text-[10px]">Cost</p>
                      <p className="font-bold text-[#242622]">{formatINR(item.cost)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#35483C] text-[10px]">Est. Boost</p>
                      <p className="font-bold text-[#35483C]">+{formatINR(item.estimatedResaleGain)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. WORKSHOP BOOKING & EXECUTION */}
        <section className="p-8 rounded-3xl bg-white border border-[#242622]/[0.08] shadow-lg space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-bold text-xl text-[#242622]">Execute Planned Upgrades with Certified Partners</h3>
              <p className="text-xs text-[#85857E] mt-1 max-w-xl">
                Book a partner workshop in Chandigarh, Mohali, Panchkula, Delhi, or Bangalore to complete detailing with zero upfront payment. We invoice only after inspection passes.
              </p>
            </div>

            {!quoteRequested ? (
              <button
                onClick={() => setQuoteRequested(true)}
                className="px-6 py-3 min-h-[44px] rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm whitespace-nowrap tactile-btn shrink-0"
              >
                Request Workshop Quote
              </button>
            ) : (
              <div className="px-5 py-3 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Quote Request Sent! A partner technician will call you in 15 mins.</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
