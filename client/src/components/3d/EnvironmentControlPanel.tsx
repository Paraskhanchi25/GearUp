import React, { useState } from 'react';
import { 
  EnvironmentPresetId, 
  ENVIRONMENT_PRESETS, 
  ACCENT_COLOR_OPTIONS 
} from './environmentPresets';
import { 
  PAINT_COLOR_SWATCHES, 
  PaintColorOption 
} from './paintPresets';
import { 
  Sun, 
  Moon, 
  Palette, 
  Camera, 
  Compass, 
  Layers, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Check, 
  Eye, 
  X,
  Gauge,
  Flame,
  Zap,
  Maximize2
} from 'lucide-react';

export interface EnvironmentControlPanelProps {
  // Current Environment & Lighting
  currentEnvironment: EnvironmentPresetId;
  onSelectEnvironment: (envId: EnvironmentPresetId) => void;
  ambientIntensity: number;
  onAmbientIntensityChange: (val: number) => void;
  keyLightIntensity: number;
  onKeyLightIntensityChange: (val: number) => void;
  rimLightIntensity: number;
  onRimLightIntensityChange: (val: number) => void;

  // Camera & Orbit
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  autoRotateSpeed: number;
  onAutoRotateSpeedChange: (val: number) => void;
  fov: number;
  onFovChange: (val: number) => void;
  onApplyCameraPreset: (presetKey: string) => void;

  // Accent Lighting
  accentColor: string;
  onSelectAccentColor: (hex: string) => void;

  // Rendering Options
  wireframe: boolean;
  onToggleWireframe: () => void;
  bloomEnabled: boolean;
  onToggleBloom: () => void;
  floorReflection: boolean;
  onToggleFloorReflection: () => void;

  // Paint Customization
  selectedColorHex: string;
  onSelectPaintColor: (hex: string) => void;
  paintMetalness: number;
  onPaintMetalnessChange: (val: number) => void;
  paintRoughness: number;
  onPaintRoughnessChange: (val: number) => void;

  // Actions
  onCaptureScreenshot: () => void;
  onResetAppearance: () => void;
  onPlayCinematicIntro?: () => void;

  // UI Drawer State
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

type TabKey = 'environments' | 'paint' | 'lighting' | 'camera' | 'rendering';

export const EnvironmentControlPanel: React.FC<EnvironmentControlPanelProps> = ({
  currentEnvironment,
  onSelectEnvironment,
  ambientIntensity,
  onAmbientIntensityChange,
  keyLightIntensity,
  onKeyLightIntensityChange,
  rimLightIntensity,
  onRimLightIntensityChange,
  autoRotate,
  onToggleAutoRotate,
  autoRotateSpeed,
  onAutoRotateSpeedChange,
  fov,
  onFovChange,
  onApplyCameraPreset,
  accentColor,
  onSelectAccentColor,
  wireframe,
  onToggleWireframe,
  bloomEnabled,
  onToggleBloom,
  floorReflection,
  onToggleFloorReflection,
  selectedColorHex,
  onSelectPaintColor,
  paintMetalness,
  onPaintMetalnessChange,
  paintRoughness,
  onPaintRoughnessChange,
  onCaptureScreenshot,
  onResetAppearance,
  onPlayCinematicIntro,
  isOpen,
  onToggleOpen,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('environments');
  const [customColor, setCustomColor] = useState<string>(selectedColorHex || '#dc2626');

  const presetList = Object.values(ENVIRONMENT_PRESETS);

  return (
    <>
      {/* Floating Toggle Button (When Closed or Mobile) */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleOpen}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-none border text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xl backdrop-blur-md ${
            isOpen 
              ? 'bg-[#35483C] text-white border-[#35483C]' 
              : 'bg-[#060C0A]/90 hover:bg-[#0c1814] text-[#A4AD98] hover:text-white border-white/20'
          }`}
          title="Toggle Studio Environment & Lighting Drawer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">{isOpen ? 'Close Studio' : 'Studio Studio'}</span>
          <span className="sm:hidden">{isOpen ? 'Close' : 'Studio'}</span>
        </button>
      </div>

      {/* Floating Glassmorphic Drawer */}
      {isOpen && (
        <aside
          className={`absolute top-0 right-0 bottom-0 w-full sm:w-[380px] z-30 bg-[#060C0A]/95 backdrop-blur-2xl border-l border-white/10 text-white flex flex-col shadow-2xl transition-all select-none overflow-hidden ${className}`}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-none bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm tracking-wide text-white uppercase">
                  Studio Configurator
                </h3>
                <p className="text-[10px] font-mono text-[#A4AD98]">
                  Cinematic Lighting & Twin Controls
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleOpen}
              className="p-1.5 rounded-none hover:bg-white/10 text-[#85857E] hover:text-white transition-colors"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-white/10 bg-black/20 text-xs font-mono overflow-x-auto no-scrollbar">
            {[
              { id: 'environments', label: 'Scene', icon: Sun },
              { id: 'paint', label: 'Paint', icon: Palette },
              { id: 'lighting', label: 'Lights', icon: Flame },
              { id: 'camera', label: 'Camera', icon: Camera },
              { id: 'rendering', label: 'FX', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`flex-1 min-w-[70px] py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 text-[11px] font-bold transition-all ${
                    isActive
                      ? 'border-emerald-400 text-white bg-white/5'
                      : 'border-transparent text-[#85857E] hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-[#85857E]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs no-scrollbar">
            
            {/* ---------------------------------------------------------------- */}
            {/* TAB 1: ENVIRONMENTS */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'environments' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] tracking-widest block">
                    [ 01 // ATMOSPHERIC STAGES ]
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Select Cinematic Environment
                  </h4>
                  <p className="text-[11px] text-[#85857E]">
                    Switch studio lighting, fog, and reflective ground pedestals.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {presetList.map((preset) => {
                    const isSelected = currentEnvironment === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onSelectEnvironment(preset.id)}
                        className={`w-full p-3 text-left border rounded-none transition-all flex items-start justify-between gap-3 group ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 shadow-glow'
                            : 'bg-black/30 border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                              {preset.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-none text-[9px] font-mono uppercase bg-white/10 text-white/80">
                              {preset.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#85857E]">
                            {preset.tagline}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-white/20 mt-0.5">
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Accent Color Strip */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-[#A4AD98] tracking-wider">
                      Showroom Accent Light
                    </span>
                    <span className="text-[10px] font-mono text-white">{accentColor}</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {ACCENT_COLOR_OPTIONS.map((acc) => {
                      const isAccActive = accentColor.toLowerCase() === acc.hex.toLowerCase();
                      return (
                        <button
                          key={acc.id}
                          type="button"
                          onClick={() => onSelectAccentColor(acc.hex)}
                          className={`h-7 rounded-none border transition-all flex items-center justify-center ${
                            isAccActive ? 'border-white scale-110 shadow-lg' : 'border-white/20 opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: acc.hex }}
                          title={acc.name}
                        >
                          {isAccActive && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB 2: PAINT & FINISH */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'paint' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] tracking-widest block">
                    [ 02 // OEM BODYWORK PAINT ]
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Factory & Custom Colorways
                  </h4>
                  <p className="text-[11px] text-[#85857E]">
                    Recolors tank, fairings, and cowls while protecting engine, tyres, and chrome.
                  </p>
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {PAINT_COLOR_SWATCHES.map((swatch) => {
                    const isSelected = selectedColorHex.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.id}
                        type="button"
                        onClick={() => onSelectPaintColor(swatch.hex)}
                        className={`p-2 border rounded-none text-left transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-white/10 border-emerald-400 shadow-md'
                            : 'bg-black/30 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div
                          className="w-full h-8 border border-white/20 shadow-inner"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <div>
                          <span className="text-[11px] font-bold text-white block truncate">
                            {swatch.name}
                          </span>
                          <span className="text-[9px] font-mono text-[#85857E] uppercase block">
                            {swatch.hex}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Picker */}
                <div className="p-3 border border-white/10 bg-black/30 space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] block">
                    Custom Hex Color
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        onSelectPaintColor(e.target.value);
                      }}
                      className="w-10 h-9 rounded-none border border-white/30 bg-transparent cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                          onSelectPaintColor(e.target.value);
                        }
                      }}
                      className="flex-1 bg-black/60 border border-white/20 px-3 py-1.5 text-xs font-mono text-white uppercase focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Finish Sliders */}
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#A4AD98]">Metallic Gloss Refraction</span>
                      <span className="text-white font-bold">{Math.round(paintMetalness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={paintMetalness}
                      onChange={(e) => onPaintMetalnessChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#A4AD98]">Surface Roughness / Matte Diffusion</span>
                      <span className="text-white font-bold">{Math.round(paintRoughness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.95}
                      step={0.05}
                      value={paintRoughness}
                      onChange={(e) => onPaintRoughnessChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB 3: LIGHTING CONTROLS */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'lighting' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] tracking-widest block">
                    [ 03 // STUDIO PHOTOGRAPHY RIG ]
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Lighting Balance & Exposure
                  </h4>
                  <p className="text-[11px] text-[#85857E]">
                    Control directional key lamps, environmental fill, and silhouette rim lighting.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Ambient Lighting */}
                  <div className="space-y-1.5 p-3 border border-white/10 bg-black/20">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#A4AD98]">Ambient Room Fill</span>
                      <span className="text-white font-bold">{ambientIntensity.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2.5}
                      step={0.05}
                      value={ambientIntensity}
                      onChange={(e) => onAmbientIntensityChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Key Spotlight */}
                  <div className="space-y-1.5 p-3 border border-white/10 bg-black/20">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#A4AD98]">Primary Key Spotlight</span>
                      <span className="text-white font-bold">{keyLightIntensity.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={5.0}
                      step={0.1}
                      value={keyLightIntensity}
                      onChange={(e) => onKeyLightIntensityChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Rim Lighting */}
                  <div className="space-y-1.5 p-3 border border-white/10 bg-black/20">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#A4AD98]">Silhouette Rim Light</span>
                      <span className="text-white font-bold">{rimLightIntensity.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.0}
                      max={4.0}
                      step={0.1}
                      value={rimLightIntensity}
                      onChange={(e) => onRimLightIntensityChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB 4: CAMERA & ORBIT */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'camera' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] tracking-widest block">
                    [ 04 // CINEMATIC PROJECTION ]
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Lens & Camera Angles
                  </h4>
                  <p className="text-[11px] text-[#85857E]">
                    Field of view, turntable auto-orbit, and instant studio camera presets.
                  </p>
                </div>

                {/* Auto Rotate Toggle */}
                <div className="p-3 border border-white/10 bg-black/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-white block">Idle Turntable Orbit</span>
                    <span className="text-[10px] text-[#85857E]">Auto-rotates when inactive</span>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleAutoRotate}
                    className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border ${
                      autoRotate
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-white/10 border-white/20 text-[#85857E]'
                    }`}
                  >
                    {autoRotate ? 'ON' : 'OFF'}
                  </button>
                </div>

                {autoRotate && (
                  <div className="space-y-1.5 p-3 border border-white/10 bg-black/20">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-[#A4AD98]">Orbit Speed</span>
                      <span className="text-white font-bold">{autoRotateSpeed.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={3.0}
                      step={0.1}
                      value={autoRotateSpeed}
                      onChange={(e) => onAutoRotateSpeedChange(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                    />
                  </div>
                )}

                {/* FOV Slider */}
                <div className="space-y-1.5 p-3 border border-white/10 bg-black/20">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-[#A4AD98]">Field of View (Focal Length)</span>
                    <span className="text-white font-bold">{fov}°</span>
                  </div>
                  <input
                    type="range"
                    min={25}
                    max={85}
                    step={1}
                    value={fov}
                    onChange={(e) => onFovChange(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-400 bg-white/10 h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#85857E]">
                    <span>25° (Telephoto)</span>
                    <span>45° (Normal)</span>
                    <span>85° (Wide)</span>
                  </div>
                </div>

                {/* Camera Preset Quick Buttons */}
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] block">
                    Instant Angles
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: 'perspective', label: 'Diagonal 3/4' },
                      { id: 'front', label: 'Direct Front' },
                      { id: 'rear', label: 'Direct Rear' },
                      { id: 'left', label: 'Left Profile' },
                      { id: 'right', label: 'Right Profile' },
                      { id: 'top', label: 'Top-Down' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => onApplyCameraPreset(btn.id)}
                        className="py-2 px-2.5 bg-white/5 hover:bg-white/15 border border-white/15 text-white text-[11px] font-bold text-center transition-all active:scale-95"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TAB 5: RENDERING & FX */}
            {/* ---------------------------------------------------------------- */}
            {activeTab === 'rendering' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-[#A4AD98] tracking-widest block">
                    [ 05 // POSTPROCESSING & SHADERS ]
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Optics & Surface Shaders
                  </h4>
                  <p className="text-[11px] text-[#85857E]">
                    Enable real-time bloom glow, floor contact reflection, and topology wireframe.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Bloom Toggle */}
                  <div className="p-3 border border-white/10 bg-black/20 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">Unreal Bloom Pass</span>
                      <span className="text-[10px] text-[#85857E]">Cinematic glow for lights & neon</span>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleBloom}
                      className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border ${
                        bloomEnabled
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-white/10 border-white/20 text-[#85857E]'
                      }`}
                    >
                      {bloomEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Floor Reflection Toggle */}
                  <div className="p-3 border border-white/10 bg-black/20 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">Showroom Pedestal Reflectance</span>
                      <span className="text-[10px] text-[#85857E]">Dynamic ground specularity</span>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleFloorReflection}
                      className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border ${
                        floorReflection
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-white/10 border-white/20 text-[#85857E]'
                      }`}
                    >
                      {floorReflection ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  {/* Wireframe Mode Toggle */}
                  <div className="p-3 border border-white/10 bg-black/20 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-white block">CAD Wireframe Topology</span>
                      <span className="text-[10px] text-[#85857E]">Displays geometric mesh polygons</span>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleWireframe}
                      className={`px-3 py-1.5 text-xs font-mono font-bold transition-all border ${
                        wireframe
                          ? 'bg-amber-600 border-amber-500 text-white'
                          : 'bg-white/10 border-white/20 text-[#85857E]'
                      }`}
                    >
                      {wireframe ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer (Screenshot & Reset) */}
          <div className="p-4 border-t border-white/10 bg-black/50 space-y-2">
            {onPlayCinematicIntro && (
              <button
                type="button"
                onClick={onPlayCinematicIntro}
                className="w-full py-2.5 px-4 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Replay Workshop Intro</span>
              </button>
            )}

            <button
              type="button"
              onClick={onCaptureScreenshot}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Capture Screenshot (PNG)</span>
            </button>

            <button
              type="button"
              onClick={onResetAppearance}
              className="w-full py-2 px-4 bg-white/5 hover:bg-white/15 border border-white/20 text-[#A4AD98] hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Appearance</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
