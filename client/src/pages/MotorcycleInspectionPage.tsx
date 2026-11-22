import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  RotateCcw,
  Layers,
  Sparkles,
  ShieldCheck,
  Eye,
  Camera,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Gauge,
  MapPin,
  ExternalLink,
  Zap,
  Maximize2,
  ChevronDown,
  X,
  SlidersHorizontal,
  Fuel
} from 'lucide-react';
import { SEED_LISTINGS } from '../data/seedListings';
import { MotorcycleViewer3D } from '../components/3d/MotorcycleViewer3D';
import { ComponentInfoDrawer } from '../components/3d/ComponentInfoDrawer';
import {
  MOTORCYCLE_COMPONENTS,
  COMPONENT_CATEGORIES,
  InspectionComponentDef,
  ComponentCategory
} from '../components/3d/inspectionComponentData';
import { BookTestRideModal } from '../components/BookTestRideModal';
import { formatINR } from '../utils/geo';
import { VehicleListing } from '../types';

export const MotorcycleInspectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find vehicle from existing GEAR UP data exclusively
  const vehicle = SEED_LISTINGS.find((b) => b.id === id);

  // Active state
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [explodedView, setExplodedView] = useState(false);
  const [testRideModalOpen, setTestRideModalOpen] = useState(false);
  const [vehicleSelectorOpen, setVehicleSelectorOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'motorcycle' | 'scooter'>('all');

  // Filter existing vehicles by category
  const filteredVehicles = SEED_LISTINGS.filter((v) => {
    if (filterType === 'all') return true;
    if (filterType === 'motorcycle') return v.category === 'motorcycle';
    if (filterType === 'scooter') return v.category === 'scooter' || v.category === 'electric';
    return true;
  });

  // Filter components by assembly category
  const filteredComponents =
    selectedCategory === 'all'
      ? MOTORCYCLE_COMPONENTS
      : MOTORCYCLE_COMPONENTS.filter((c) => c.category === selectedCategory);

  // When changing vehicle via model selector
  const handleSelectVehicle = (newId: string) => {
    navigate(`/inspect/${newId}`);
    setSelectedComponentId(null);
    setVehicleSelectorOpen(false);
  };

  // If the requested ID is not in the existing vehicle data, display an honest fallback state
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] text-[#242622] flex flex-col">
        <header className="border-b border-[#E9E3D8] bg-white px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              to="/explore"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E9E3D8] text-xs font-semibold hover:bg-[#F7F5EF] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#35483C]" />
              <span className="text-xs font-bold text-[#242622]">GEAR UP 3D Visualizer</span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#E9E3D8] border border-[#35483C] flex items-center justify-center text-[#35483C]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg">
            <h1 className="font-heading font-extrabold text-2xl text-[#242622]">
              3D Model Asset Not Available
            </h1>
            <p className="text-sm text-[#85857E] leading-relaxed">
              No matching 3D vehicle asset exists for ID <code className="font-mono bg-[#E9E3D8] px-1.5 py-0.5 text-xs text-[#242622]">{id}</code>. 
              GEAR UP exclusively displays 3D digital twins for supported motorcycles and scooters in our verified marketplace catalogue.
            </p>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-[#E9E3D8]">
            <h2 className="font-heading font-bold text-sm text-[#85857E] uppercase tracking-wider">
              Available 3D Supported Vehicles ({SEED_LISTINGS.length} Models)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {SEED_LISTINGS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleSelectVehicle(b.id)}
                  className="p-3 bg-white border border-[#E9E3D8] hover:border-[#35483C] hover:shadow-md transition-all flex flex-col group text-left"
                >
                  <img
                    src={b.primaryImage}
                    alt={b.title}
                    className="w-full h-28 object-cover mb-2 border border-black/10 group-hover:scale-102 transition-transform"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#85857E] mb-1">
                    <span className="uppercase font-bold tracking-wider">{b.category}</span>
                    <span>{b.year}</span>
                  </div>
                  <h3 className="font-bold text-xs text-[#242622] group-hover:text-[#35483C] line-clamp-1">
                    {b.title}
                  </h3>
                  <p className="font-heading font-bold text-sm text-[#35483C] mt-1">
                    {formatINR(b.price)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isScooter =
    vehicle.category === 'scooter' ||
    vehicle.category === 'electric' ||
    vehicle.model.toLowerCase().includes('activa') ||
    vehicle.model.toLowerCase().includes('jupiter') ||
    vehicle.model.toLowerCase().includes('ather') ||
    vehicle.model.toLowerCase().includes('s1');

  return (
    <div className="min-h-screen bg-[#060C0A] text-[#242622] flex flex-col overflow-x-hidden selection:bg-[#35483C] selection:text-white">
      {/* Top Navigation Bar (Apple Liquid Glass Header) */}
      <header className="border-b border-[#242622]/[0.08] bg-[#FAF9F5]/85 backdrop-blur-[24px] saturate-[180%] px-4 sm:px-6 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={`/bike/${vehicle.id}`}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 text-[#85857E] hover:text-[#242622] hover:border-[#35483C] text-xs font-semibold transition-all shadow-sm tactile-btn"
            >
              <ChevronLeft className="w-4 h-4 text-[#242622]" />
              <span>Back to Listing</span>
            </Link>

            <div className="h-4 w-px bg-[#242622]/10 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-heading font-extrabold text-[#242622] tracking-tight">
                  {vehicle.title}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white text-[#242622] border border-[#242622]/10">
                  {vehicle.year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#35483C]/10 text-[#35483C] border border-[#35483C]/20">
                  {isScooter ? 'Scooter Platform' : 'Motorcycle Platform'}
                </span>
              </div>
              <p className="text-[11px] text-[#85857E] hidden sm:flex items-center gap-3 mt-0.5 font-mono">
                <span>{vehicle.km.toLocaleString('en-IN')} km</span>
                <span>•</span>
                <span>{vehicle.city}</span>
                <span>•</span>
                <span className="text-[#35483C] font-bold">{formatINR(vehicle.price)}</span>
                <span>•</span>
                <span className="text-[#85857E]">Variant: {vehicle.variant}</span>
              </p>
            </div>
          </div>

          {/* Quick Vehicle Model Switcher Button & Certified Score */}
          <div className="flex items-center gap-2.5">
            {/* Interactive Model Switcher Drawer Trigger */}
            <button
              onClick={() => setVehicleSelectorOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#242622]/10 hover:border-[#35483C] text-xs font-bold text-[#242622] shadow-sm transition-all tactile-btn font-mono"
              title="Switch to another verified motorcycle or scooter"
            >
              <Compass className="w-4 h-4 text-[#35483C]" />
              <span>Switch Model ({SEED_LISTINGS.length})</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#85857E]" />
            </button>

            {/* Certified Inspection Score Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#35483C]/30 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#35483C]" />
              <div>
                <span className="text-[10px] text-[#85857E] font-mono block leading-none">Inspection</span>
                <span className="text-xs font-bold text-[#242622] font-mono">
                  {vehicle.inspectionScore} / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col relative min-h-[calc(100vh-120px)]">
        {/* Assembly Category Filter Tabs */}
        <div className="bg-[#091411] border-b border-[#1A332B] px-4 py-2.5 z-20">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar font-mono">
            <span className="text-[11px] font-semibold text-[#85857E] uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
              <Compass className="w-3.5 h-3.5 text-white" /> Assembly:
            </span>
            {COMPONENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 tactile-btn ${
                  selectedCategory === cat.id
                    ? 'bg-[#35483C] text-white shadow-md font-bold'
                    : 'bg-[#0E1E19] text-[#85857E] hover:text-white hover:bg-[#152B24] border border-[#1A332B]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div className="flex-1 relative w-full h-[620px] lg:h-[calc(100vh-210px)] bg-gradient-to-b from-[#060C0A] via-[#091310] to-[#060C0A]">
          <MotorcycleViewer3D
            vehicle={vehicle}
            selectedComponentId={selectedComponentId}
            onSelectComponent={(compId) => setSelectedComponentId(compId)}
            activeCategory={selectedCategory}
            exploded={explodedView}
            onToggleExploded={() => setExplodedView(!explodedView)}
          />

          {/* Quick Component Picker Floating Bar (Bottom of 3D Canvas) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center pointer-events-none">
            <div className="pointer-events-auto bg-[#161816]/90 backdrop-blur-2xl border border-white/10 rounded-full px-3 py-2 max-w-4xl w-full shadow-2xl flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {filteredComponents.map((comp) => {
                  const isSelected = selectedComponentId === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs flex items-center gap-2 transition-all whitespace-nowrap shrink-0 tactile-btn ${
                        isSelected
                          ? 'bg-[#35483C] text-white font-bold shadow-md border border-white/20'
                          : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{comp.shortName || comp.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-white/10 shrink-0">
                <button
                  onClick={() => setExplodedView(!explodedView)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all tactile-btn ${
                    explodedView
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                  title="Toggle Exploded Mechanical Assembly"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{explodedView ? 'Collapse' : 'Exploded'}</span>
                </button>
                <button
                  onClick={() => setSelectedComponentId(null)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/10 flex items-center justify-center tactile-btn"
                  title="Clear Selection"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Component Detail Drawer Overlay */}
        <ComponentInfoDrawer
          selectedComponentId={selectedComponentId}
          vehicle={vehicle}
          onClose={() => setSelectedComponentId(null)}
          onSelectComponent={(compId) => setSelectedComponentId(compId)}
        />
      </main>

      {/* Interactive Vehicle Model Switcher Modal Drawer */}
      {vehicleSelectorOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F5] border border-[#242622]/10 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-[#242622]/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-[#242622]">
                  Select 3D Two-Wheeler Model
                </h3>
                <p className="text-xs text-[#85857E]">
                  Displaying existing verified motorcycles and scooters from the GEAR UP catalogue
                </p>
              </div>
              <button
                onClick={() => setVehicleSelectorOpen(false)}
                className="w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-[#85857E] hover:text-[#242622] flex items-center justify-center transition-colors tactile-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#242622]/[0.08] flex items-center gap-2">
              <span className="text-[11px] font-mono font-semibold text-[#85857E] uppercase">Filter:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all tactile-btn ${
                  filterType === 'all'
                    ? 'bg-[#35483C] text-white shadow-sm'
                    : 'bg-white text-[#242622] border border-[#242622]/10 hover:bg-[#E9E3D8]'
                }`}
              >
                All Models ({SEED_LISTINGS.length})
              </button>
              <button
                onClick={() => setFilterType('motorcycle')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all tactile-btn ${
                  filterType === 'motorcycle'
                    ? 'bg-[#35483C] text-white shadow-sm'
                    : 'bg-white text-[#242622] border border-[#242622]/10 hover:bg-[#E9E3D8]'
                }`}
              >
                Motorcycles (4)
              </button>
              <button
                onClick={() => setFilterType('scooter')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all tactile-btn ${
                  filterType === 'scooter'
                    ? 'bg-[#35483C] text-white shadow-sm'
                    : 'bg-white text-[#242622] border border-[#242622]/10 hover:bg-[#E9E3D8]'
                }`}
              >
                Scooters & EVs (4)
              </button>
            </div>

            {/* Vehicles Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredVehicles.map((v) => {
                const isSelected = v.id === vehicle.id;
                const vIsScooter = v.category === 'scooter' || v.category === 'electric';
                return (
                  <div
                    key={v.id}
                    onClick={() => handleSelectVehicle(v.id)}
                    className={`p-3.5 bg-white border rounded-2xl cursor-pointer transition-all flex gap-3.5 group tactile-btn ${
                      isSelected
                        ? 'border-[#35483C] ring-2 ring-[#35483C]/30 shadow-md'
                        : 'border-[#242622]/10 hover:border-[#35483C] hover:shadow-md'
                    }`}
                  >
                    <img
                      src={v.primaryImage}
                      alt={v.title}
                      className="w-20 h-20 rounded-xl object-cover border border-black/10 shrink-0 group-hover:scale-102 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-[#85857E] mb-0.5 font-mono">
                        <span className="font-bold uppercase tracking-wider text-[#35483C]">
                          {vIsScooter ? 'Scooter 3D' : 'Motorcycle 3D'}
                        </span>
                        <span>{v.year}</span>
                      </div>
                      <h4 className="font-bold text-xs text-[#242622] group-hover:text-[#35483C] truncate">
                        {v.brand} {v.model}
                      </h4>
                      <p className="text-[11px] text-[#85857E] truncate">
                        {v.variant}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#242622]/10 font-mono">
                        <span className="font-heading font-extrabold text-xs text-[#35483C]">
                          {formatINR(v.price)}
                        </span>
                        <span className="text-[10px] font-semibold text-[#85857E]">
                          {v.km.toLocaleString('en-IN')} km
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Action CTAs & Honest Disclosure Footer */}
      <footer className="border-t border-[#242622]/[0.08] bg-[#FAF9F5] px-4 sm:px-6 py-3.5 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#85857E]">
            <Info className="w-3.5 h-3.5 text-[#35483C] shrink-0" />
            <span>
              <strong>Transparency Guarantee:</strong> Representative 3D CAD visualization mapped with verified physical inspection telemetry.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto font-mono">
            <button
              onClick={() => setTestRideModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF9F5] text-[#242622] text-xs font-bold border border-[#242622]/10 transition-all flex items-center justify-center gap-2 tactile-btn shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#35483C]" />
              <span>Book Hub Test Ride</span>
            </button>
            <Link
              to={`/bike/${vehicle.id}`}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm tactile-btn border border-[#35483C]"
            >
              <span>View Full Listing & Buy ({formatINR(vehicle.price)})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Test Ride Modal */}
      {testRideModalOpen && (
        <BookTestRideModal
          vehicle={vehicle}
          onClose={() => setTestRideModalOpen(false)}
        />
      )}
    </div>
  );
};
