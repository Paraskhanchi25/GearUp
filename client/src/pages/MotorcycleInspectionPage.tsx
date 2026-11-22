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
  Maximize2
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

export const MotorcycleInspectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find vehicle or fallback
  const vehicle = SEED_LISTINGS.find((b) => b.id === id) || SEED_LISTINGS[0];

  // Active state
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [explodedView, setExplodedView] = useState(false);
  const [testRideModalOpen, setTestRideModalOpen] = useState(false);

  // Filter components by category
  const filteredComponents =
    selectedCategory === 'all'
      ? MOTORCYCLE_COMPONENTS
      : MOTORCYCLE_COMPONENTS.filter((c) => c.category === selectedCategory);

  // When changing vehicle via selector
  const handleSelectVehicle = (newId: string) => {
    navigate(`/inspect/${newId}`);
    setSelectedComponentId(null);
  };

  return (
    <div className="min-h-screen bg-[#060C0A] text-[#242622] flex flex-col overflow-x-hidden selection:bg-emerald-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#E9E3D8] bg-[#F7F5EF]/95 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to={`/bike/${vehicle.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white border border-[#E9E3D8] text-[#85857E] hover:text-white hover:border-emerald-500/50 text-xs font-medium transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#242622]" />
              <span>Back to Listing</span>
            </Link>

            <div className="h-4 w-px bg-[#1A332B] hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-heading font-bold text-white tracking-wide">
                  {vehicle.title}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-[#242622] border border-emerald-600/40">
                  {vehicle.year}
                </span>
              </div>
              <p className="text-[11px] text-[#85857E] hidden sm:flex items-center gap-3">
                <span>{vehicle.km.toLocaleString('en-IN')} km</span>
                <span>•</span>
                <span>{vehicle.city}</span>
                <span>•</span>
                <span className="text-[#242622] font-semibold">{formatINR(vehicle.price)}</span>
              </p>
            </div>
          </div>

          {/* Quick Vehicle Switcher & Certified Score */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 text-xs bg-white px-3 py-1.5 rounded-none border border-[#E9E3D8]">
              <span className="text-[#85857E] text-[11px]">Demo Vehicle:</span>
              <select
                value={vehicle.id}
                onChange={(e) => handleSelectVehicle(e.target.value)}
                className="bg-transparent text-[#242622] text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {SEED_LISTINGS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#E9E3D8] text-[#242622]">
                    {b.title} ({b.year})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-emerald-950/70 border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4 text-[#242622]" />
              <div>
                <span className="text-[10px] text-[#85857E] block leading-none">Inspection</span>
                <span className="text-xs font-bold text-[#242622]">
                  {vehicle.inspectionScore} / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 flex flex-col relative min-h-[calc(100vh-120px)]">
        {/* Category Tabs */}
        <div className="bg-[#E9E3D8]/90 border-b border-[#E9E3D8] px-4 py-2.5 z-20">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-semibold text-[#85857E] uppercase tracking-wider flex items-center gap-1 mr-1 flex-shrink-0">
              <Compass className="w-3.5 h-3.5 text-[#242622]" /> Assembly:
            </span>
            {COMPONENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-none text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-semibold'
                    : 'bg-white text-[#85857E] hover:text-white hover:bg-[#152722] border border-[#E9E3D8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D WebGL Canvas Container */}
        <div className="flex-1 relative w-full h-[600px] lg:h-[calc(100vh-210px)] bg-gradient-to-b from-[#060C0A] via-[#091310] to-[#060C0A]">
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
            <div className="pointer-events-auto bg-[#F7F5EF]/95 backdrop-blur-md border border-[#E9E3D8] rounded-none p-2 max-w-4xl w-full shadow-2xl flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {filteredComponents.map((comp) => {
                  const isSelected = selectedComponentId === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`px-3 py-1.5 rounded-none text-xs flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                          : 'bg-white text-[#85857E] hover:text-white hover:bg-[#152722] border border-[#E9E3D8]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{comp.shortName || comp.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-[#E9E3D8] flex-shrink-0">
                <button
                  onClick={() => setExplodedView(!explodedView)}
                  className={`px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 transition-all ${
                    explodedView
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-white text-[#85857E] hover:text-white border border-[#E9E3D8]'
                  }`}
                  title="Toggle Exploded Mechanical Assembly"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{explodedView ? 'Collapse' : 'Exploded'}</span>
                </button>
                <button
                  onClick={() => setSelectedComponentId(null)}
                  className="p-1.5 rounded-none bg-white text-[#85857E] hover:text-white border border-[#E9E3D8]"
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

      {/* Bottom Bar: Action CTAs & Honest Disclosure Footer */}
      <footer className="border-t border-[#E9E3D8] bg-[#E9E3D8] px-4 sm:px-6 py-3 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#85857E]">
            <Info className="w-3.5 h-3.5 text-[#242622] flex-shrink-0" />
            <span>
              <strong>Transparency Guarantee:</strong> Representative 3D CAD visualization mapped with verified on-ground physical inspection logs & wear indicators.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setTestRideModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-none bg-[#E9E3D8] hover:bg-[#E9E3D8]/40 text-[#242622] text-xs font-bold border border-emerald-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Hub Test Ride</span>
            </button>
            <Link
              to={`/bike/${vehicle.id}`}
              className="flex-1 sm:flex-none px-4 py-2 rounded-none bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
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
