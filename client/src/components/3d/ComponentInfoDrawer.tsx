import React, { useState } from 'react';
import { 
  MOTORCYCLE_COMPONENTS, 
  InspectionComponentDef, 
  ComponentCategory 
} from './inspectionComponentData';
import { VehicleListing } from '../../types';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  FileText, 
  Wrench, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Info
} from 'lucide-react';

interface ComponentInfoDrawerProps {
  selectedComponentId: string | null;
  onClose: () => void;
  vehicle?: VehicleListing;
  onSelectComponent: (id: string | null) => void;
}

export const ComponentInfoDrawer: React.FC<ComponentInfoDrawerProps> = ({
  selectedComponentId,
  onClose,
  vehicle,
  onSelectComponent
}) => {
  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  if (!selectedComponentId) return null;

  const component = MOTORCYCLE_COMPONENTS.find((c) => c.id === selectedComponentId);
  if (!component) return null;

  const inspection = component.getInspectionData(vehicle);

  // Badge color mapping
  const badgeConfig = {
    excellent: {
      bg: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      label: 'Certified Optimal'
    },
    good: {
      bg: 'bg-forest-950/80 border-forest-600/60 text-forest-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      label: 'Verified Good'
    },
    fair: {
      bg: 'bg-amber-950/80 border-amber-600/60 text-amber-300',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      label: 'Normal Wear'
    },
    attention: {
      bg: 'bg-red-950/80 border-red-600/60 text-red-300',
      icon: <AlertCircle className="w-4 h-4 text-red-400" />,
      label: 'Inspection Alert'
    }
  }[inspection.conditionGrade] || {
    bg: 'bg-forest-950 border-forest-800 text-slate-300',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    label: 'Inspected'
  };

  return (
    <>
      <div className="w-full sm:w-[420px] max-h-full overflow-y-auto bg-[#0A1411]/95 backdrop-blur-xl border border-forest-800/90 rounded-3xl shadow-2xl p-5 text-slate-100 flex flex-col gap-4 text-xs z-30 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-forest-900 pb-3">
          <div className="space-y-1 pr-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-forest-900/90 border border-forest-700 text-[10px] font-bold text-forest-300 uppercase tracking-wider">
                {component.categoryLabel}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeConfig.bg}`}>
                {badgeConfig.icon}
                <span>{badgeConfig.label}</span>
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-white leading-tight">
              {component.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-forest-950 text-slate-400 hover:text-white border border-forest-800 hover:border-forest-600 transition-colors flex-shrink-0"
            title="Close Component View (Show Full Motorcycle)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certified Inspection Assessment Box */}
        <div className="p-3.5 rounded-2xl bg-[#101D19] border border-forest-700/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-bold text-white text-[11px]">120-Point Certified Physical Inspection</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-forest-950 border border-forest-800 font-mono text-[10px] font-bold text-emerald-400">
              {inspection.score}% Health
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-forest-950/70 border border-forest-900/80">
            <p className="text-[11px] text-slate-300 leading-relaxed italic">
              &ldquo;{inspection.inspectorRemarks}&rdquo;
            </p>
          </div>

          {/* Measured Physical Metrics (Micrometer / Vernier / PSI) */}
          {inspection.metrics && inspection.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {inspection.metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-forest-950 border border-forest-900 space-y-0.5">
                  <span className="text-[10px] text-slate-400 block">{m.label}</span>
                  <span className={`text-[11px] font-bold block ${m.isGood ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OEM Engineering Specifications */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-[11px] text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-forest-400" />
              <span>OEM Engineering Specifications</span>
            </h3>
            <span className="text-[10px] text-slate-500">{vehicle?.brand || 'Royal Enfield'} Factory Spec</span>
          </div>

          <div className="divide-y divide-forest-900 rounded-2xl bg-forest-950/60 border border-forest-900/80 overflow-hidden">
            {Object.entries(component.specs).map(([label, val], idx) => (
              <div key={idx} className="flex justify-between items-center px-3 py-2 text-[11px]">
                <span className="text-slate-400">{label}</span>
                <span className="font-semibold text-slate-200 text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features & Innovations */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-[11px] text-slate-300 uppercase tracking-wider">
            Key Architecture Features
          </h3>
          <ul className="space-y-1.5">
            {component.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Inspection Photographic Evidence (If available from listing) */}
        {inspection.evidencePhotos && inspection.evidencePhotos.length > 0 ? (
          <div className="space-y-2 pt-1 border-t border-forest-900">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-[11px] text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Physical Inspection Evidence</span>
              </h3>
              <span className="text-[10px] text-emerald-400">Actual Vehicle Photos</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {inspection.evidencePhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoModal(photo.url)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-forest-950 border border-forest-800 cursor-pointer shadow-md hover:border-emerald-500 transition-colors"
                >
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">{photo.tag}</span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-forest-950/50 border border-forest-900/60 flex items-start gap-2 text-[10px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p>
              Physical 120-point inspection conducted at GEAR UP Hub. Component verified within OEM tolerances with zero defect alerts flagged for photographic recording.
            </p>
          </div>
        )}

        {/* Computer Vision AI Exterior Verification (Optional YOLO + OpenCV Integration) */}
        {inspection.visionAiDetection && (
          <div className="p-3 rounded-xl bg-[#091511] border border-forest-800/80 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Computer Vision Observation</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {Math.round(inspection.visionAiDetection.confidence * 100)}% Confidence
              </span>
            </div>
            <p className="text-slate-400 leading-normal">
              {inspection.visionAiDetection.surfaceQuality}
            </p>
            <p className="text-slate-500 italic text-[9px] pt-0.5 border-t border-forest-900">
              *Notice: Visual camera analysis assesses exterior surface finish and does not replace certified internal physical disassembly.
            </p>
          </div>
        )}

        {/* Related Components Quick Links */}
        <div className="pt-2 border-t border-forest-900">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Related Components in this Assembly:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MOTORCYCLE_COMPONENTS
              .filter((c) => c.category === component.category && c.id !== component.id)
              .slice(0, 4)
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectComponent(c.id)}
                  className="px-2.5 py-1 rounded-lg bg-forest-950 hover:bg-forest-900 text-slate-300 hover:text-white border border-forest-800 text-[10px] transition-colors flex items-center gap-1"
                >
                  <span>{c.shortName}</span>
                  <ChevronRight className="w-3 h-3 text-forest-500" />
                </button>
              ))}
          </div>
        </div>

        {/* Back to Full 3D Showroom View Action Button */}
        <button
          onClick={onClose}
          className="w-full mt-1 py-2.5 px-4 rounded-xl bg-forest-800/80 hover:bg-forest-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-forest-600/50 transition-colors"
        >
          <span>Exit Component Focus & Return to 360° Showroom</span>
        </button>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-forest-800" onClick={(e) => e.stopPropagation()}>
            <img src={activePhotoModal} alt="Inspection evidence full size" className="w-full h-full object-contain" />
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/70 text-white hover:bg-forest-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md p-3 text-xs text-white">
              Inspection Photo Evidence • {component.name}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
