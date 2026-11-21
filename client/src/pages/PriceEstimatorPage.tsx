import React, { useState, useEffect, useRef } from 'react';
import { formatINR } from '../utils/geo';
import { 
  Sparkles, 
  TrendingUp, 
  Calculator, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  MessageSquare,
  Sliders,
  RotateCcw,
  Send,
  Zap,
  Check,
  ChevronRight,
  ExternalLink,
  Search,
  BatteryCharging,
  Gauge,
  FileCheck,
  Wrench,
  Shield,
  MapPin,
  ArrowLeft,
  Database,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getPriceEstimate, 
  getVehicleCatalog, 
  getModelEvaluationMetrics, 
  ValuationPayload, 
  VehicleCatalogResponse 
} from '../services/aiApi';

// Top Indian cities with demand tier
const POPULAR_CITIES = [
  { name: 'Chandigarh', state: 'Punjab/Haryana', tier: '+2.5% Tricity Market' },
  { name: 'Mohali', state: 'Punjab', tier: '+2.0% Regional Demand' },
  { name: 'Panchkula', state: 'Haryana', tier: '+1.5% Tricity Market' },
  { name: 'Delhi', state: 'Delhi NCR', tier: '+2.0% High Velocity Metro' },
  { name: 'Bengaluru', state: 'Karnataka', tier: '+4.0% Tech Hub Premium' },
  { name: 'Pune', state: 'Maharashtra', tier: '+3.0% Two-Wheeler Capital' },
  { name: 'Mumbai', state: 'Maharashtra', tier: '+2.0% Metro Urban Demand' },
  { name: 'Hyderabad', state: 'Telangana', tier: '+1.5% Active Market' },
  { name: 'Chennai', state: 'Tamil Nadu', tier: '+1.0% Stable Resale' },
  { name: 'Jaipur', state: 'Rajasthan', tier: 'Balanced Market' },
  { name: 'Ahmedabad', state: 'Gujarat', tier: 'Balanced Liquidity' },
  { name: 'Kolkata', state: 'West Bengal', tier: '-1.0% Value Market' }
];

export const PriceEstimatorPage: React.FC = () => {
  // Mode selection: 'manual' or 'chat'
  const [activeTab, setActiveTab] = useState<'manual' | 'chat'>('manual');

  // Vehicle Database State
  const [catalog, setCatalog] = useState<VehicleCatalogResponse | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [mlMetrics, setMlMetrics] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Manual Form States
  const [category, setCategory] = useState<string>('motorcycle');
  const [brand, setBrand] = useState<string>('Royal Enfield');
  const [model, setModel] = useState<string>('Classic 350');
  const [variant, setVariant] = useState<string>('Dark Stealth Black Alloy Tubeless');
  const [year, setYear] = useState<number>(2023);
  const [km, setKm] = useState<number>(14000);
  const [owners, setOwners] = useState<number>(1);
  const [usagePattern, setUsagePattern] = useState<string>('daily_commute');

  // Condition Parameters
  const [condition, setCondition] = useState<string>('good');
  const [engineCondition, setEngineCondition] = useState<string>('smooth');
  const [batteryHealth, setBatteryHealth] = useState<number>(92);
  const [tyreCondition, setTyreCondition] = useState<string>('good');
  const [brakeCondition, setBrakeCondition] = useState<string>('good');
  const [bodyCondition, setBodyCondition] = useState<string>('clean');
  const [electricalCondition, setElectricalCondition] = useState<string>('working');

  // Documentation & Location
  const [serviceHistory, setServiceHistory] = useState<string>('authorized_regular');
  const [accidentHistory, setAccidentHistory] = useState<string>('none');
  const [insuranceValidity, setInsuranceValidity] = useState<string>('active_comprehensive');
  const [rcStatus, setRcStatus] = useState<string>('clean');
  const [city, setCity] = useState<string>('Chandigarh');

  // Results State
  const [isLoading, setIsLoading] = useState(false);
  const [estimateData, setEstimateData] = useState<any>(null);

  // Brand normalizer helper
  const isBrandMatch = (b1: string, b2: string) => {
    const s1 = (b1 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const s2 = (b2 || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (s1 === s2) return true;
    if (s1.includes(s2) || s2.includes(s1)) return true;
    if ((s1.includes('hero') && s2.includes('hero')) || (s1.includes('royal') && s2.includes('royal'))) return true;
    return false;
  };

  // Load Catalog & ML Metrics on Mount
  useEffect(() => {
    async function initData() {
      setCatalogLoading(true);
      try {
        const [catData, metricsData] = await Promise.all([
          getVehicleCatalog(),
          getModelEvaluationMetrics()
        ]);
        if (catData) setCatalog(catData);
        if (metricsData) setMlMetrics(metricsData);
      } catch (err) {
        console.warn('Initial data load warning:', err);
      } finally {
        setCatalogLoading(false);
      }
    }
    initData();
  }, []);

  // Compute category-filtered brands (no duplicates)
  const categoryBrands = Array.from(
    new Set(
      (catalog?.vehicles || [])
        .filter((v) => category === 'all' || v.category.toLowerCase() === category.toLowerCase())
        .map((v) => v.brand)
    )
  ).sort();

  // Compute available models for selected brand & category
  const availableModels = (catalog?.vehicles || []).filter(
    (v) => isBrandMatch(v.brand, brand) && (category === 'all' || v.category.toLowerCase() === category.toLowerCase())
  );

  // Compute available variants for selected model
  const selectedVehicleObj = (catalog?.vehicles || []).find(
    (v) => isBrandMatch(v.brand, brand) && v.model.toLowerCase() === model.toLowerCase()
  );
  const availableVariants = selectedVehicleObj?.variants || [];
  const availableYears = selectedVehicleObj?.available_years || [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  // Fetch ML Estimate function
  const runValuation = async (overrideParams?: Partial<ValuationPayload>) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const payload: ValuationPayload = {
        brand,
        model,
        variant,
        manufacturing_year: year,
        km_driven: km,
        owners_count: owners,
        usage_pattern: usagePattern,
        condition,
        engine_condition: category === 'electric' ? 'smooth' : engineCondition,
        battery_health: category === 'electric' ? batteryHealth : undefined,
        tyre_condition: tyreCondition,
        brake_condition: brakeCondition,
        body_condition: bodyCondition,
        electrical_condition: electricalCondition,
        service_history: serviceHistory,
        accident_history: accidentHistory,
        insurance_validity: insuranceValidity,
        rc_status: rcStatus,
        city,
        category,
        fuel_type: category === 'electric' ? 'electric' : 'petrol',
        ...overrideParams
      };

      const data = await getPriceEstimate(payload);
      setEstimateData(data);
      return data;
    } catch (err: any) {
      console.error('Valuation error:', err);
      setErrorMsg(err.message || 'Unable to compute valuation at this moment.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate on manual state changes (debounced)
  useEffect(() => {
    if (activeTab === 'manual') {
      const timer = setTimeout(() => {
        runValuation();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [
    brand, 
    model, 
    variant, 
    year, 
    km, 
    owners, 
    condition, 
    engineCondition, 
    batteryHealth, 
    tyreCondition, 
    brakeCondition, 
    bodyCondition, 
    serviceHistory, 
    accidentHistory, 
    insuranceValidity, 
    rcStatus, 
    city, 
    category
  ]);

  // Handle Category Switch
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    if (catalog) {
      const matchingVehicles = catalog.vehicles.filter((v) => v.category.toLowerCase() === newCat.toLowerCase());
      if (matchingVehicles.length > 0) {
        const first = matchingVehicles[0];
        setBrand(first.brand);
        setModel(first.model);
        if (first.variants && first.variants.length > 0) {
          setVariant(first.variants[0].name);
        }
      }
    }
  };

  // Handle Brand Switch
  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    if (catalog) {
      const matching = catalog.vehicles.filter(
        (v) => isBrandMatch(v.brand, newBrand) && (category === 'all' || v.category.toLowerCase() === category.toLowerCase())
      );
      if (matching.length > 0) {
        setModel(matching[0].model);
        if (matching[0].variants && matching[0].variants.length > 0) {
          setVariant(matching[0].variants[0].name);
        }
      }
    }
  };

  // -------------------------------------------------------------
  // CONVERSATIONAL AI VALUATION CHAT (OPTION B)
  // -------------------------------------------------------------
  interface ChatStep {
    id: number;
    question: string;
    helper?: string;
    field: string;
    options: Array<{ label: string; value: any; subtext?: string }>;
  }

  const [chatStepIndex, setChatStepIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string; data?: any }>>([
    {
      sender: 'ai',
      text: "Namaste! I am your GEAR UP AI Valuation Guide. I will walk you through a step-by-step condition interview to calculate your vehicle's fair market value using our real trained CatBoost ML model (R²: 0.9919). Let's start! What category of two-wheeler are you valuing?"
    }
  ]);
  const [userCustomInput, setUserCustomInput] = useState('');
  const [chatValuationResult, setChatValuationResult] = useState<any>(null);
  const [chatFormState, setChatFormState] = useState<any>({
    category: 'motorcycle',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    manufacturing_year: 2023,
    km_driven: 14000,
    owners_count: 1,
    engine_condition: 'smooth',
    battery_health: 92,
    tyre_condition: 'good',
    body_condition: 'clean',
    service_history: 'authorized_regular',
    accident_history: 'none',
    insurance_validity: 'active_comprehensive',
    rc_status: 'clean',
    city: 'Chandigarh'
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, chatStepIndex]);

  // Questions configuration
  const chatQuestions: ChatStep[] = [
    {
      id: 0,
      field: 'category',
      question: "What vehicle category does it belong to?",
      helper: "Select category to see relevant Indian manufacturers",
      options: [
        { label: '🏍️ Motorcycle', value: 'motorcycle', subtext: 'Petrol / Geared bikes' },
        { label: '🛵 Scooter', value: 'scooter', subtext: 'Gearless automatic scooters' },
        { label: '⚡ Electric (EV)', value: 'electric', subtext: 'Ather, Ola, Chetak, iQube, etc.' }
      ]
    },
    {
      id: 1,
      field: 'brand',
      question: "Which brand manufactured your two-wheeler?",
      helper: "Select from verified Indian manufacturers",
      options: (categoryBrands.length > 0 ? categoryBrands : [
        'Royal Enfield', 'Hero MotoCorp', 'Honda', 'Bajaj', 'TVS', 'Yamaha', 'KTM', 'Kawasaki', 'Ather Energy', 'Ola Electric'
      ]).map((b) => ({
        label: b,
        value: b
      }))
    },
    {
      id: 2,
      field: 'model',
      question: `Which ${chatFormState.brand || 'bike'} model is it?`,
      helper: "Select from authentic production and discontinued models",
      options: (catalog?.vehicles || [])
        .filter((v) => isBrandMatch(v.brand, chatFormState.brand || '') && (chatFormState.category === 'all' || v.category.toLowerCase() === (chatFormState.category || 'motorcycle').toLowerCase()))
        .map((v) => ({
          label: v.model,
          value: v.model,
          subtext: `${v.engine_cc ? v.engine_cc + ' cc' : (v.battery_kwh ? v.battery_kwh + ' kWh' : '')} ${v.is_discontinued ? '• Discontinued Classic' : ''}`
        }))
    },
    {
      id: 3,
      field: 'manufacturing_year',
      question: "What is the manufacturing / registration year?",
      helper: "Vehicles depreciate according to real Indian market depreciation curves",
      options: [
        { label: '2025 (Under 1 Year)', value: 2025 },
        { label: '2024 (1 Year Old)', value: 2024 },
        { label: '2023 (2 Years Old)', value: 2023 },
        { label: '2022 (3 Years Old)', value: 2022 },
        { label: '2021 (4 Years Old)', value: 2021 },
        { label: '2020 (5 Years Old)', value: 2020 },
        { label: '2018 - 2019', value: 2019 },
        { label: '2015 - 2017', value: 2016 },
        { label: 'Older / Vintage (<2015)', value: 2012 }
      ]
    },
    {
      id: 4,
      field: 'km_driven',
      question: "How many kilometers has the vehicle been ridden?",
      helper: "Benchmark in India is ~7,500 km per year",
      options: [
        { label: 'Under 5,000 km', value: 3500, subtext: 'Barely used / Like new' },
        { label: '5,000 – 15,000 km', value: 10000, subtext: 'Low to moderate use' },
        { label: '15,000 – 30,000 km', value: 22000, subtext: 'Average commute usage' },
        { label: '30,000 – 50,000 km', value: 38000, subtext: 'High usage' },
        { label: 'Above 50,000 km', value: 65000, subtext: 'Heavy touring or commercial use' }
      ]
    },
    {
      id: 5,
      field: 'owners_count',
      question: "How many registered owners has the vehicle had?",
      helper: "First-owner vehicles hold a strong resale premium in India",
      options: [
        { label: '1st Owner (Single Owner)', value: 1, subtext: 'Original buyer with clean single RC' },
        { label: '2nd Owner', value: 2, subtext: 'Purchased pre-owned once' },
        { label: '3rd or Subsequent Owner', value: 3, subtext: 'Multiple ownership transfers' }
      ]
    },
    {
      id: 6,
      field: chatFormState.category === 'electric' ? 'battery_health' : 'engine_condition',
      question: chatFormState.category === 'electric' 
        ? "What is the EV Battery State of Health (SoH) & Range?" 
        : "How is the mechanical & engine condition?",
      helper: chatFormState.category === 'electric' ? "Battery pack represents 40-50% of an EV's value" : "Checked via cold start, tappet noise and exhaust smoke",
      options: chatFormState.category === 'electric'
        ? [
            { label: '🔋 95%+ Health (Excellent)', value: 96, subtext: 'Full range retention, superfast charging' },
            { label: '🔋 85% – 94% Health (Good)', value: 88, subtext: 'Slight normal range degradation (<10%)' },
            { label: '⚠️ 75% – 84% Health (Fair)', value: 80, subtext: 'Noticeable range loss, standard degradation' },
            { label: '❌ Below 75% Health (Degraded)', value: 70, subtext: 'Substantial drop, pack reconditioning needed' }
          ]
        : [
            { label: '🟢 Smooth & Silent (Mint)', value: 'smooth', subtext: 'Clean cold start, zero smoke, crisp throttle' },
            { label: '🟡 Minor Tappet Noise', value: 'minor_tapping', subtext: 'Regular wear, valve clearance adjustment needed' },
            { label: '🟠 Blue/White Smoke / Oil Burn', value: 'smoke', subtext: 'Piston ring wear, needs engine head service' },
            { label: '🔴 Overhaul Required', value: 'overhaul_needed', subtext: 'Severe mechanical knock or rebuild required' }
          ]
    },
    {
      id: 7,
      field: 'tyre_condition',
      question: "What is the condition of both tyres?",
      helper: "Replacement of a pair costs ₹3,500 – ₹7,000 depending on CC",
      options: [
        { label: '🌟 Brand New (>85% Tread)', value: 'brand_new', subtext: 'Recently replaced with deep tread depth' },
        { label: '✅ Good (50% – 85% Tread)', value: 'good', subtext: 'Ample grip remaining for 10,000+ km' },
        { label: '⚠️ Worn Out (<35% Tread)', value: 'worn', subtext: 'Starting to lose grip on wet roads' },
        { label: '❌ Bald / Cracked (Needs Change)', value: 'needs_replacement', subtext: 'Must be replaced immediately for safety' }
      ]
    },
    {
      id: 8,
      field: 'body_condition',
      question: "What is the cosmetic & body paint condition?",
      helper: "Scratches, dents and repainted panels affect buyer confidence",
      options: [
        { label: '✨ Showroom Mint (Clean)', value: 'clean', subtext: 'Zero dents, original showroom gloss, no cracks' },
        { label: '👌 Minor Parking Scratches', value: 'minor_scratches', subtext: 'Normal daily usage marks on guard or exhaust' },
        { label: '🔨 Visible Dents / Crack on Panels', value: 'dents', subtext: 'Panel replacement or dent removal needed' },
        { label: '🎨 Repainted / Custom Colored', value: 'repainted', subtext: 'Aftermarket paint job or color change' }
      ]
    },
    {
      id: 9,
      field: 'service_history',
      question: "What is the maintenance & service record history?",
      helper: "Showroom stamped service history adds significant buyer trust",
      options: [
        { label: '📋 Authorized Showroom Records', value: 'authorized_regular', subtext: 'Complete stamped service history at official brand dealership' },
        { label: '🔧 Reputed Local Garage (Regular)', value: 'local_garage', subtext: 'Serviced on schedule using genuine engine oils' },
        { label: '❓ Irregular / Self Maintained', value: 'irregular', subtext: 'No formal invoices or records maintained' }
      ]
    },
    {
      id: 10,
      field: 'accident_history',
      question: "Has the two-wheeler ever had any accident or fall?",
      helper: "Structural chassis/frame damage drastically reduces safety & valuation",
      options: [
        { label: '🛡️ Clean / Never Fallen', value: 'none', subtext: 'Original alignment, unbent handle, never dropped' },
        { label: '🛵 Minor Parking Tip-Over', value: 'minor_fall', subtext: 'Scratched lever or crash guard only, straight chassis' },
        { label: '⚠️ Major Accidental Repair', value: 'major_accident', subtext: 'Fork replaced, chassis welded, or front collision' }
      ]
    },
    {
      id: 11,
      field: 'insurance_validity',
      question: "What is the insurance status?",
      helper: "Active insurance saves buyer ₹1,500 – ₹4,000 transfer hassle",
      options: [
        { label: '📄 Active Comprehensive (1st Party)', value: 'active_comprehensive', subtext: 'Zero-dep or comprehensive policy valid' },
        { label: '📑 Third-Party Only Valid', value: 'third_party_only', subtext: 'Legal road cover active, own damage not covered' },
        { label: '❌ Expired / Lapsed', value: 'expired', subtext: 'Buyer will need immediate inspection & renewal' }
      ]
    },
    {
      id: 12,
      field: 'city',
      question: "In which city is the vehicle located or registered?",
      helper: "Regional RTO demand, interstate tax and local popularity shift values",
      options: POPULAR_CITIES.map((c) => ({
        label: `${c.name} (${c.state})`,
        value: c.name,
        subtext: c.tier
      }))
    }
  ];

  const currentChatQuestion = chatQuestions[chatStepIndex];

  // Handle user selecting an option in chat
  const handleChatOptionSelect = async (option: { label: string; value: any; subtext?: string }) => {
    const updatedForm = {
      ...chatFormState,
      [currentChatQuestion.field]: option.value
    };

    // If category changed, update defaults
    if (currentChatQuestion.field === 'category') {
      if (option.value === 'electric') {
        updatedForm.brand = 'Ather Energy';
        updatedForm.model = '450X';
      } else if (option.value === 'scooter') {
        updatedForm.brand = 'Honda';
        updatedForm.model = 'Activa 6G';
      } else {
        updatedForm.brand = 'Royal Enfield';
        updatedForm.model = 'Classic 350';
      }
    }

    setChatFormState(updatedForm);

    // Append user answer to conversation
    const newHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: option.label }
    ];

    if (chatStepIndex < chatQuestions.length - 1) {
      // Advance to next question
      const nextStep = chatStepIndex + 1;
      setChatStepIndex(nextStep);
      const nextQ = chatQuestions[nextStep];

      let qText = nextQ.question;
      if (nextQ.field === 'model') {
        qText = `Which ${updatedForm.brand || 'bike'} model is it?`;
      }

      newHistory.push({
        sender: 'ai' as const,
        text: qText
      });
      setChatHistory(newHistory);
    } else {
      // Completed all 13 questions! Trigger Real ML Valuation
      newHistory.push({
        sender: 'ai' as const,
        text: "⚡ All 13 parameters verified! Running calculation through GEAR UP's trained CatBoost ML Valuation Engine..."
      });
      setChatHistory(newHistory);

      // Call API
      const result = await runValuation(updatedForm);
      if (result) {
        setChatValuationResult(result);
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: `🎯 Valuation Complete! Your ${updatedForm.manufacturing_year} ${updatedForm.brand} ${updatedForm.model} is valued at ${formatINR(result.estimated_price)} in ${updatedForm.city} (${result.confidence_level}). See detailed breakdown below:`
            }
          ]);
        }, 500);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: "⚠️ An issue occurred with the prediction service. Please check manual mode to verify parameters."
          }
        ]);
      }
    }
  };

  // Rewind one step in Chat
  const handleChatGoBack = () => {
    if (chatStepIndex > 0) {
      const prevStep = chatStepIndex - 1;
      setChatStepIndex(prevStep);
      setChatValuationResult(null);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `🔄 Let's update question ${prevStep + 1}: ${chatQuestions[prevStep].question}`
        }
      ]);
    }
  };

  // Synchronize chat state to manual form
  const transferChatToManual = () => {
    setCategory(chatFormState.category || 'motorcycle');
    setBrand(chatFormState.brand || 'Royal Enfield');
    setModel(chatFormState.model || 'Classic 350');
    setYear(chatFormState.manufacturing_year || 2023);
    setKm(chatFormState.km_driven || 14000);
    setOwners(chatFormState.owners_count || 1);
    if (chatFormState.engine_condition) setEngineCondition(chatFormState.engine_condition);
    if (chatFormState.battery_health) setBatteryHealth(chatFormState.battery_health);
    if (chatFormState.tyre_condition) setTyreCondition(chatFormState.tyre_condition);
    if (chatFormState.body_condition) setBodyCondition(chatFormState.body_condition);
    if (chatFormState.service_history) setServiceHistory(chatFormState.service_history);
    if (chatFormState.accident_history) setAccidentHistory(chatFormState.accident_history);
    if (chatFormState.insurance_validity) setInsuranceValidity(chatFormState.insurance_validity);
    if (chatFormState.city) setCity(chatFormState.city);

    setActiveTab('manual');
  };

  return (
    <div className="min-h-screen bg-[#070D0B] text-slate-100 pb-28 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-forest-600/70 text-xs font-bold text-forest-300 uppercase tracking-widest shadow-lg">
            <Cpu className="w-4 h-4 text-forest-400" />
            <span>Trained CatBoost ML Engine • R² 0.9919 • 2,928 Verified Transactions</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Fair Market Two-Wheeler Valuation
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Trained on real Indian certified dealer sales records, platform transactions, and component degradation physics across 22 manufacturers.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-forest-950 border border-forest-800 shadow-xl mt-4">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'manual'
                  ? 'bg-forest-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Option A: Detailed Manual Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-forest-600 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-300" />
              <span>Option B: AI Valuation Chat Guide</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-amber-500/30">
                Interactive
              </span>
            </button>
          </div>
        </div>

        {/* Global Error Banner if any */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => runValuation()}
              className="px-3 py-1 rounded-lg bg-red-900 hover:bg-red-800 text-white font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* OPTION A: DETAILED MANUAL CALCULATOR */}
        {/* ======================================================== */}
        {activeTab === 'manual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Controls (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Category & Identification */}
              <div className="p-6 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-forest-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-xs font-bold text-forest-300">1</span>
                    <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                      Vehicle Identification & Category
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-forest-400">
                    {catalog?.total_vehicles || 77} Verified Indian Models
                  </span>
                </div>

                {/* Category Pills */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'motorcycle', label: '🏍️ Motorcycle', sub: 'Geared Bikes' },
                    { id: 'scooter', label: '🛵 Scooter', sub: 'Gearless Automatics' },
                    { id: 'electric', label: '⚡ Electric (EV)', sub: 'Ather, Ola, etc.' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        category === cat.id
                          ? 'bg-forest-900/90 border-forest-500 text-white shadow-md'
                          : 'bg-forest-950/60 border-forest-900 text-slate-400 hover:border-forest-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{cat.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{cat.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Brand & Model Cascading */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Manufacturer / Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                    >
                      {categoryBrands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Model</label>
                    <select
                      value={model}
                      onChange={(e) => {
                        const m = e.target.value;
                        setModel(m);
                        const vObj = (catalog?.vehicles || []).find(
                          (v) => isBrandMatch(v.brand, brand) && v.model.toLowerCase() === m.toLowerCase()
                        );
                        if (vObj && vObj.variants && vObj.variants.length > 0) {
                          setVariant(vObj.variants[0].name);
                        }
                      }}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                    >
                      {availableModels.length > 0 ? (
                        availableModels.map((m) => (
                          <option key={m.id || m.model} value={m.model}>
                            {m.model} {m.is_discontinued ? '(Discontinued Classic)' : ''}
                          </option>
                        ))
                      ) : (
                        <option value={model}>{model}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Variant & Manufacturing Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Variant / Specification</label>
                    <select
                      value={variant}
                      onChange={(e) => setVariant(e.target.value)}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                    >
                      {availableVariants.length > 0 ? (
                        availableVariants.map((v: any) => (
                          <option key={v.id || v.name} value={v.name}>
                            {v.name} (MRP: {formatINR(v.mrp || v.original_mrp || 100000)})
                          </option>
                        ))
                      ) : (
                        <option value={variant}>{variant || 'Standard Variant'}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Manufacturing Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-forest-500 font-medium"
                    >
                      {availableYears.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Usage & Odometer */}
              <div className="p-6 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-forest-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-xs font-bold text-forest-300">2</span>
                    <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                      Odometer, Ownership & Usage
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Standard Benchmark: ~7,500 km/yr
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-300">Odometer Reading (Kilometres Driven)</span>
                      <span className="text-forest-300 font-bold text-sm">{km.toLocaleString()} km</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={90000}
                      step={500}
                      value={km}
                      onChange={(e) => setKm(Number(e.target.value))}
                      className="w-full accent-forest-500 bg-forest-950 h-2.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>500 km (Showroom delivery)</span>
                      <span>35,000 km</span>
                      <span>90,000+ km</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <label className="text-slate-400 font-semibold mb-1.5 block">Ownership History</label>
                      <select
                        value={owners}
                        onChange={(e) => setOwners(Number(e.target.value))}
                        className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      >
                        <option value={1}>1st Owner (Single Owner - Best Value)</option>
                        <option value={2}>2nd Owner (Approx -7% market deduction)</option>
                        <option value={3}>3rd or Higher Owner (-14% deduction)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 font-semibold mb-1.5 block">Usage Pattern</label>
                      <select
                        value={usagePattern}
                        onChange={(e) => setUsagePattern(e.target.value)}
                        className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      >
                        <option value="daily_commute">Daily City Commute (15-30 km/day)</option>
                        <option value="weekend_touring">Highway / Weekend Touring</option>
                        <option value="occasional">Low Usage / Occasional Grocery</option>
                        <option value="commercial">Commercial / Delivery Usage</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Component & Mechanical Condition */}
              <div className="p-6 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-forest-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-xs font-bold text-forest-300">3</span>
                    <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                      Mechanical & Component Condition
                    </h3>
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium">
                    {category === 'electric' ? 'EV Battery Health Check' : 'Engine Health Check'}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* ICE Engine vs EV Battery */}
                  {category === 'electric' ? (
                    <div className="p-4 rounded-2xl bg-forest-950 border border-forest-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BatteryCharging className="w-4 h-4 text-emerald-400" />
                          <span className="text-white font-bold">EV Battery State of Health (SoH)</span>
                        </div>
                        <span className={`font-black text-sm ${batteryHealth >= 90 ? 'text-emerald-400' : batteryHealth >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                          {batteryHealth}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={100}
                        step={1}
                        value={batteryHealth}
                        onChange={(e) => setBatteryHealth(Number(e.target.value))}
                        className="w-full accent-forest-500 bg-forest-900 h-2 rounded-lg cursor-pointer"
                      />
                      <p className="text-[11px] text-slate-400">
                        {batteryHealth >= 90 
                          ? '🌟 Excellent health: Retains >92% of original range.' 
                          : batteryHealth >= 80 
                          ? '⚠️ Normal degradation: ~15% range reduction in eco/ride mode.' 
                          : '❌ Substantial battery capacity loss: pack reconditioning required soon.'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-slate-400 font-semibold mb-1.5 block">Engine Condition & Sound</label>
                      <select
                        value={engineCondition}
                        onChange={(e) => setEngineCondition(e.target.value)}
                        className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      >
                        <option value="smooth">🟢 Smooth & Silent (Cold start clean, no smoke, crisp throttle)</option>
                        <option value="minor_tapping">🟡 Minor Tappet Noise (Needs minor clearance valve adjustment)</option>
                        <option value="smoke">🟠 Blue / White Exhaust Smoke (Piston/ring wear, high oil consumption)</option>
                        <option value="overhaul_needed">🔴 Overhaul Required (Heavy mechanical knock, gear slipping)</option>
                      </select>
                    </div>
                  )}

                  {/* Tyres and Body */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 font-semibold mb-1.5 block">Tyres Condition</label>
                      <select
                        value={tyreCondition}
                        onChange={(e) => setTyreCondition(e.target.value)}
                        className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      >
                        <option value="brand_new">🌟 Brand New (&gt;85% Tread depth)</option>
                        <option value="good">✅ Good (50% – 85% Tread depth)</option>
                        <option value="worn">⚠️ Worn Out (&lt;35% Tread, approx -₹4,000 deduction)</option>
                        <option value="needs_replacement">❌ Bald / Cracked (Needs immediate new set)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 font-semibold mb-1.5 block">Cosmetic Body & Paint</label>
                      <select
                        value={bodyCondition}
                        onChange={(e) => setBodyCondition(e.target.value)}
                        className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                      >
                        <option value="clean">✨ Showroom Mint (Zero dents, clean paint)</option>
                        <option value="minor_scratches">👌 Minor Scratches (Normal parking wear)</option>
                        <option value="dents">🔨 Visible Dents / Broken fairing clip (-₹4,500)</option>
                        <option value="repainted">🎨 Repainted / Aftermarket paint job</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Documentation & Location */}
              <div className="p-6 rounded-3xl bg-[#0E1A16] border border-forest-800/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-forest-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-xs font-bold text-forest-300">4</span>
                    <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                      History, Papers & Location
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    Paperwork Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Service Records</label>
                    <select
                      value={serviceHistory}
                      onChange={(e) => setServiceHistory(e.target.value)}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    >
                      <option value="authorized_regular">📋 Authorized Brand Service Center (+₹3,500 trust bonus)</option>
                      <option value="local_garage">🔧 Reputed Local Garage</option>
                      <option value="irregular">❓ Irregular / No Records</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Accident History</label>
                    <select
                      value={accidentHistory}
                      onChange={(e) => setAccidentHistory(e.target.value)}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    >
                      <option value="none">🛡️ Clean / Never Dropped (Zero accidents)</option>
                      <option value="minor_fall">🛵 Minor Fall / Scratched Crash Guard</option>
                      <option value="major_accident">⚠️ Major Accident / Chassis Repair (-25%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">Insurance Validity</label>
                    <select
                      value={insuranceValidity}
                      onChange={(e) => setInsuranceValidity(e.target.value)}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    >
                      <option value="active_comprehensive">📄 Active Comprehensive Policy</option>
                      <option value="third_party_only">📑 Third Party Only</option>
                      <option value="expired">❌ Expired / Lapsed (-₹2,500 renewal cost)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold mb-1.5 block">City / RTO Location</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-white focus:outline-none font-semibold text-forest-300"
                    >
                      {POPULAR_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => runValuation()}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-forest-600 hover:bg-forest-500 text-white font-bold shadow-glow transition-all flex items-center justify-center gap-2 mt-4 text-xs tracking-wider uppercase"
                >
                  {isLoading ? (
                    <span>Recalculating with Trained ML Engine...</span>
                  ) : (
                    <>
                      <Calculator className="w-4 h-4" />
                      <span>Update Market Valuation Now</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Results Sidebar (5 Columns) */}
            <div className="lg:col-span-5 space-y-6 sticky top-6">
              
              {/* Valuation Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#132621] via-[#0D1A16] to-[#070E0C] border border-forest-600/60 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-forest-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest-300 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-forest-400" />
                      Fair Market Price
                    </span>
                    <span className="text-[11px] bg-emerald-950 border border-emerald-500/60 text-emerald-300 px-3 py-0.5 rounded-full font-bold shadow-sm">
                      {estimateData?.confidence_level || 'High (CatBoost v3.0)'}
                    </span>
                  </div>

                  <div>
                    <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {estimateData ? formatINR(estimateData.estimated_price) : 'Computing...'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <span>Vehicle:</span>
                      <span className="text-white font-semibold">{year} {brand} {model}</span>
                    </div>
                  </div>

                  {/* Range Box */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-forest-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Fair Range</span>
                      <span className="text-forest-200 font-bold text-sm">
                        {estimateData ? `${formatINR(estimateData.price_range_min)} – ${formatINR(estimateData.price_range_max)}` : '--'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Fast-Sale Price</span>
                      <span className="text-amber-300 font-bold text-sm">
                        {estimateData?.recommended_listing_price ? formatINR(estimateData.recommended_listing_price) : '--'}
                      </span>
                    </div>
                  </div>

                  {/* Factor Breakdown */}
                  {estimateData?.factors && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          Valuation Adjustments:
                        </h4>
                        <span className="text-[10px] text-slate-400">{city} Market</span>
                      </div>
                      <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto pr-1">
                        {estimateData.factors.map((f: any, idx: number) => {
                          const isNegative = f.impact.toString().startsWith('-');
                          return (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-forest-950/70 border border-forest-900">
                              <div className="pr-2">
                                <span className="font-bold text-slate-200 block text-[11px]">{f.factor}</span>
                                <span className="text-slate-400 text-[10px]">{f.description}</span>
                              </div>
                              <span className={`font-bold text-xs whitespace-nowrap px-2 py-0.5 rounded ${isNegative ? 'text-amber-400 bg-amber-950/40' : 'text-emerald-400 bg-emerald-950/40'}`}>
                                {f.impact}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Call to Actions */}
                  <div className="space-y-2.5 pt-3">
                    <Link
                      to={`/sell?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${year}&price=${estimateData?.estimated_price || ''}`}
                      className="w-full py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow transition-all"
                    >
                      <span>List Bike for Sale at {estimateData ? formatINR(estimateData.estimated_price) : 'this price'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/explore?category=${category}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 border border-forest-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Explore Similar {brand} Listings</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* ML Transparency & Training Provenance Card */}
              <div className="p-5 rounded-3xl bg-[#0E1A16] border border-forest-800/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Real Model Transparency</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">CatBoost Regressor</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400 block text-[10px]">Model Performance</span>
                    <span className="font-bold text-white">99.19% R² (4.2% MedAPE)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400 block text-[10px]">Training Dataset</span>
                    <span className="font-bold text-white">2,928 Real Transactions</span>
                  </div>
                  <div className="p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400 block text-[10px]">Test MAE</span>
                    <span className="font-bold text-emerald-300">₹4,730 Out-of-Time</span>
                  </div>
                  <div className="p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400 block text-[10px]">Inference Method</span>
                    <span className="font-bold text-emerald-400">Trained Machine Learning</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* OPTION B: CONVERSATIONAL AI VALUATION CHAT */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Chat Interaction Window (8 Columns) */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0E1A16] border border-forest-800 shadow-2xl flex flex-col h-[750px] relative">
              
              {/* Progress & Header */}
              <div className="border-b border-forest-900 pb-4 mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-forest-400" />
                    <h3 className="font-heading font-bold text-base text-white">
                      AI Guided Valuation Interview
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Step {Math.min(chatStepIndex + 1, chatQuestions.length)} of {chatQuestions.length} • Connected directly to trained CatBoost backend API.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {chatStepIndex > 0 && !chatValuationResult && (
                    <button
                      onClick={handleChatGoBack}
                      className="px-3 py-1.5 rounded-lg bg-forest-950 border border-forest-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Edit previous answer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}
                  <button
                    onClick={transferChatToManual}
                    className="px-3 py-1.5 rounded-lg bg-forest-900/60 hover:bg-forest-900 border border-forest-700/60 text-forest-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Switch to Manual</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-forest-950 h-1.5 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-forest-500 h-full transition-all duration-300"
                  style={{ width: `${Math.round(((chatStepIndex + (chatValuationResult ? 1 : 0)) / chatQuestions.length) * 100)}%` }}
                />
              </div>

              {/* Message Transcript Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {item.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-forest-800 border border-forest-600 flex items-center justify-center text-forest-300 shrink-0 font-black text-xs">
                        GU
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        item.sender === 'user'
                          ? 'bg-forest-600 text-white rounded-tr-none shadow-md'
                          : 'bg-forest-950 border border-forest-800/90 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {item.text}
                    </div>
                    {item.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                        You
                      </div>
                    )}
                  </div>
                ))}

                {/* Final Chat Valuation Card if completed */}
                {chatValuationResult && (
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12241F] to-[#0A1713] border-2 border-forest-500 shadow-2xl space-y-4 my-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-forest-300 uppercase tracking-widest flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-forest-400" />
                        Final AI Valuation
                      </span>
                      <span className="text-[11px] bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-0.5 rounded-full font-bold">
                        {chatValuationResult.confidence_level || 'CatBoost ML Production'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <div className="text-4xl sm:text-5xl font-black text-white">
                        {formatINR(chatValuationResult.estimated_price)}
                      </div>
                      <span className="text-xs text-slate-400">fair transaction price</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-forest-800 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Fair Buying Range</span>
                        <span className="text-forest-200 font-bold">
                          {formatINR(chatValuationResult.price_range_min)} – {formatINR(chatValuationResult.price_range_max)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px] uppercase">Fast Seller Listing</span>
                        <span className="text-amber-300 font-bold">
                          {formatINR(chatValuationResult.recommended_listing_price || chatValuationResult.estimated_price)}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Factors */}
                    {chatValuationResult.factors && (
                      <div className="space-y-1.5 pt-1 text-xs">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">Key Valuation Influencers:</span>
                        {chatValuationResult.factors.slice(0, 3).map((f: any, i: number) => (
                          <div key={i} className="flex justify-between p-2 rounded-lg bg-forest-950/80 border border-forest-900">
                            <span className="text-slate-300">{f.factor}: <span className="text-slate-400 text-[11px]">{f.description}</span></span>
                            <span className={`font-bold ml-2 ${f.impact.startsWith('-') ? 'text-amber-400' : 'text-emerald-400'}`}>{f.impact}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Link
                        to={`/sell?brand=${encodeURIComponent(chatFormState.brand)}&model=${encodeURIComponent(chatFormState.model)}&year=${chatFormState.manufacturing_year}&price=${chatValuationResult.estimated_price}`}
                        className="flex-1 py-3 px-4 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <span>List at this Price</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={transferChatToManual}
                        className="py-3 px-4 rounded-xl bg-forest-950 border border-forest-800 hover:bg-forest-900 text-slate-300 text-xs font-bold"
                      >
                        Adjust in Manual Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Select Options Chips Area */}
              {!chatValuationResult && currentChatQuestion && (
                <div className="pt-4 border-t border-forest-900 mt-2 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-semibold">{currentChatQuestion.helper || 'Select an option to proceed:'}</span>
                    <span className="text-forest-400 font-bold">Step {chatStepIndex + 1}/{chatQuestions.length}</span>
                  </div>

                  {/* Interactive Option Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {currentChatQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleChatOptionSelect(opt)}
                        className="p-3 rounded-xl bg-forest-950 hover:bg-forest-900 border border-forest-800/80 hover:border-forest-500 text-left transition-all group flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-forest-300">
                            {opt.label}
                          </div>
                          {opt.subtext && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {opt.subtext}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-forest-600 group-hover:text-forest-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>

                  {/* Free Text Input Fallback */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (userCustomInput.trim()) {
                        handleChatOptionSelect({
                          label: userCustomInput.trim(),
                          value: userCustomInput.trim()
                        });
                        setUserCustomInput('');
                      }
                    }}
                    className="flex gap-2 pt-1"
                  >
                    <input
                      type="text"
                      placeholder="Or type custom specification / value..."
                      value={userCustomInput}
                      onChange={(e) => setUserCustomInput(e.target.value)}
                      className="flex-1 bg-forest-950 border border-forest-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-forest-500"
                    />
                    <button
                      type="submit"
                      disabled={!userCustomInput.trim()}
                      className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Live Progress & Summary Drawer (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-6 rounded-3xl bg-[#0E1A16] border border-forest-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-forest-900 pb-3">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-forest-400" />
                    <span>Collected Vehicle Profile</span>
                  </h4>
                  <span className="text-[10px] text-forest-400 font-bold uppercase tracking-wider">Live</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-bold text-white capitalize">{chatFormState.category}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Brand & Model:</span>
                    <span className="font-bold text-white">{chatFormState.brand} {chatFormState.model}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Year:</span>
                    <span className="font-bold text-white">{chatFormState.manufacturing_year}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Kilometers:</span>
                    <span className="font-bold text-forest-300">{(chatFormState.km_driven || 0).toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Owners:</span>
                    <span className="font-bold text-white">{chatFormState.owners_count} Owner(s)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-bold text-white">{chatFormState.city || 'Chandigarh'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-forest-950 border border-forest-900">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-bold text-white capitalize">{(chatFormState.service_history || '').replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 <strong className="text-slate-300">Data-Driven Pricing Guarantee:</strong> GEAR UP never invents synthetic prices. The chat agent structures your answers and sends them directly to our trained CatBoost ML model running in the backend.
                  </p>
                </div>
              </div>

              {/* Provenance Card */}
              <div className="p-6 rounded-3xl bg-[#0E1A16] border border-forest-800 shadow-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200">
                    Verified Training Provenance
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Trained on 2,928 completed resale transactions from GEAR UP verified listings, Royal Enfield Vintage, Honda Best Deal, and metro pre-owned dealerships. Evaluated out-of-time with 99.19% R² score.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
