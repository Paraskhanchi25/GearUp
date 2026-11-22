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
    <div className="min-h-screen bg-[#091310] text-[#242923] pb-24">
      {/* Studio Hero Header */}
      <div className="border-b border-[#182C24] bg-gradient-to-b from-[#11241C] via-[#0E1C16] to-[#091310] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-xs font-bold text-gold-light">
            <Wrench className="w-3.5 h-3.5 text-gold" />
            <span>AI RESALE UPGRADE STUDIO</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Unlock Your Bike&apos;s Resale Value
          </h1>
          <p className="text-[#77796F] text-sm sm:text-base max-w-2xl leading-relaxed">
            Stop losing ₹10,000+ to aggressive buyers on minor cosmetic flaws. Our AI suggests high-ROI cosmetic & trust upgrades that maximize buyer confidence without unnecessary expenses.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 1. BEFORE & AFTER TRANSFORMATION VISUALIZATION SLIDER */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E1D7]/80 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#596B59] uppercase tracking-widest">
                AI PREVIEW ENGINE
              </span>
              <h2 className="font-heading font-bold text-2xl text-white">
                Interactive Before vs After Preview
              </h2>
              <p className="text-xs text-[#77796F] mt-0.5">
                Drag the divider handle to inspect simulated detailing enhancements
              </p>
            </div>

            {/* Theme Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {TRANSFORMATION_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedTheme.id === theme.id
                      ? 'bg-[#879783] text-white shadow-elevated'
                      : 'bg-white text-[#77796F] hover:text-white border border-[#E5E1D7]'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Split Slider Container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden select-none border border-[#E5E1D7] bg-black">
            {/* After Image (Background) */}
            <img
              src={selectedTheme.afterImg}
              alt="After AI detailing"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#E5D9C7]/40/90 text-white text-xs font-bold border border-[#879783] backdrop-blur-md">
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
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/80 text-[#77796F] text-xs font-bold border border-white/20 backdrop-blur-md">
                Current Unprepped State
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-sm z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#879783] border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs font-bold">
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

          <div className="flex items-center justify-between text-xs text-[#77796F]">
            <span>Theme Description: <strong className="text-[#354638]">{selectedTheme.desc}</strong></span>
            <span className="italic text-[11px]">*Previews are AI generated estimates. Never used as fraudulent photographs.</span>
          </div>
        </section>

        {/* 2. GOALS & BUDGET CONFIGURATION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Goals Selection */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] space-y-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">What would you like to improve?</h3>
              <p className="text-xs text-[#77796F]">Select one or more seller priorities</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {TARGET_GOALS.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-[#E5D9C7]/40 border-forest-400 text-white'
                        : 'bg-white/60 border-[#E5E1D7] text-[#77796F] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{goal}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#596B59]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Selection */}
          <div className="p-6 rounded-3xl bg-white border border-[#E5E1D7] space-y-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Target Upgrade Budget</h3>
              <p className="text-xs text-[#77796F]">How much are you comfortable investing in pre-sale prep?</p>
            </div>

            <div className="space-y-2">
              {BUDGET_TIERS.map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => setSelectedBudget(tier.value)}
                  className={`w-full p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                    selectedBudget === tier.value
                      ? 'bg-[#E5D9C7]/40 border-gold text-gold-light'
                      : 'bg-white/60 border-[#E5E1D7] text-[#77796F] hover:text-white'
                  }`}
                >
                  <span>{tier.label}</span>
                  {selectedBudget === tier.value && <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded font-bold">Selected</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. LIVE AI ROI CALCULATOR & RESALE MATRIX */}
        <section className="p-8 rounded-3xl bg-gradient-to-br from-[#132820] to-[#0A1612] border border-[#879783]/60 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-widest">
                FINANCIAL PREDICTION
              </span>
              <h2 className="font-heading font-extrabold text-2xl text-white">
                Live AI Resale ROI Calculator
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-[#E5E1D7]">
              <span className="text-[#77796F]">Algorithm Confidence:</span>
              <span className="font-bold text-[#596B59]">92% High Reliability</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-[#0C1914] border border-[#E5E1D7]">
              <p className="text-[11px] text-[#77796F]">Est. Current Resale</p>
              <p className="font-heading font-bold text-xl text-white mt-1">{formatINR(baseCurrentPrice)}</p>
              <p className="text-[10px] text-slate-500">As-is condition</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0C1914] border border-[#E5E1D7]">
              <p className="text-[11px] text-[#77796F]">Total Upgrades Cost</p>
              <p className="font-heading font-bold text-xl text-gold mt-1">{formatINR(totalCost)}</p>
              <p className="text-[10px] text-slate-500">{activeUpgrades.length} items planned</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0C1914] border border-[#E5E1D7]">
              <p className="text-[11px] text-[#77796F]">Potential Resale Price</p>
              <p className="font-heading font-bold text-xl text-[#596B59] mt-1">{formatINR(projectedNewPrice)}</p>
              <p className="text-[10px] text-[#596B59] font-semibold">+{formatINR(totalProjectedGain)} gross gain</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#152B22] border border-emerald-500/50 shadow-sm">
              <p className="text-[11px] text-[#354638] font-bold">Estimated Net Return</p>
              <p className="font-heading font-extrabold text-2xl text-[#596B59] mt-1">+{formatINR(netEstimatedReturn)}</p>
              <p className="text-[10px] text-[#354638]">ROI: {(totalCost > 0 ? (totalProjectedGain / totalCost).toFixed(1) : 1)}x multiplier</p>
            </div>
          </div>
        </section>

        {/* 4. UPGRADE ACTIONS CHECKLIST */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white">Recommended Upgrades Checklist</h3>
              <p className="text-xs text-[#77796F]">Check or uncheck items to recalculate ROI instantly</p>
            </div>
            <button
              onClick={() => setPlannedUpgrades(RESALE_UPGRADES_CATALOG.map((u) => u.id))}
              className="text-xs text-[#596B59] font-bold hover:underline"
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
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isChecked
                      ? 'bg-[#12231E] border-[#879783] shadow-md'
                      : 'bg-white border-[#E5E1D7] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                        isChecked ? 'bg-[#879783] border-forest-400 text-white' : 'border-slate-600'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.title}</span>
                        <span className="text-[10px] px-2 py-0.2 rounded font-bold uppercase bg-white text-[#596B59] border border-[#E5E1D7]">
                          {item.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#77796F]">{item.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-xs flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[#77796F] text-[10px]">Cost</p>
                      <p className="font-bold text-white">{formatINR(item.cost)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#596B59] text-[10px]">Est. Resale Boost</p>
                      <p className="font-bold text-[#596B59]">+{formatINR(item.estimatedResaleGain)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. WORKSHOP BOOKING & EXECUTION */}
        <section className="p-8 rounded-3xl bg-[#0F1E19] border border-[#E5E1D7] space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-xl text-white">Execute Planned Upgrades with Certified Partners</h3>
              <p className="text-xs text-[#77796F] mt-1 max-w-xl">
                Book a partner workshop in Chandigarh, Mohali, Panchkula, Delhi, or Bangalore to complete detailing with zero upfront payment. We invoice only after inspection passes.
              </p>
            </div>

            {!quoteRequested ? (
              <button
                onClick={() => setQuoteRequested(true)}
                className="px-6 py-3 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-elevated whitespace-nowrap"
              >
                Request Partner Workshop Quote
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-600/50 text-[#596B59] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Quote Request Sent! A partner technician will call you in 15 mins.</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
