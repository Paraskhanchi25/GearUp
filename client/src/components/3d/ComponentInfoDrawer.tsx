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
      bg: 'bg-emerald-950/80 border-emerald-500/60 text-[#242622]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#242622]" />,
      label: 'Certified Optimal'
    },
    good: {
      bg: 'bg-white/95 border-[#35483C]/50 text-[#242622]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#242622]" />,
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
    bg: 'bg-white border-[#E9E3D8] text-[#85857E]',
    icon: <CheckCircle2 className="w-4 h-4 text-[#242622]" />,
    label: 'Inspected'
  };

  return (
    <>
      <div className="w-full sm:w-[420px] max-h-full overflow-y-auto bg-white/95 backdrop-blur-xl border border-[#E9E3D8] rounded-none border border-[#E9E3D8] shadow-2xl p-5 text-[#242622] flex flex-col gap-4 text-xs z-30 transition-all animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-[#E9E3D8] pb-3">
          <div className="space-y-1 pr-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#E9E3D8] border border-[#E9E3D8] text-[10px] font-bold text-[#242622] uppercase tracking-wider">
                {component.categoryLabel}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${badgeConfig.bg}`}>
                {badgeConfig.icon}
                <span>{badgeConfig.label}</span>
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#242622] leading-tight">
              {component.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-none bg-white text-[#85857E] hover:text-white border border-[#E9E3D8] hover:border-[#35483C] transition-colors flex-shrink-0"
            title="Close Component View (Show Full Motorcycle)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certified Inspection Assessment Box */}
        <div className="p-3.5 rounded-none bg-white border border-[#E9E3D8] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#242622] flex-shrink-0" />
              <span className="font-bold text-white text-[11px]">120-Point Certified Physical Inspection</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-[#E9E3D8] font-mono text-[10px] font-bold text-[#242622]">
              {inspection.score}% Health
            </span>
          </div>

          <div className="p-2.5 rounded-none bg-[#E9E3D8] border border-[#E9E3D8]">
            <p className="text-[11px] text-[#85857E] leading-relaxed italic">
              &ldquo;{inspection.inspectorRemarks}&rdquo;
            </p>
          </div>

          {/* Measured Physical Metrics (Micrometer / Vernier / PSI) */}
          {inspection.metrics && inspection.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              {inspection.metrics.map((m, idx) => (
                <div key={idx} className="p-2 rounded-none bg-white border border-[#E9E3D8] space-y-0.5">
                  <span className="text-[10px] text-[#85857E] block">{m.label}</span>
                  <span className={`text-[11px] font-bold block ${m.isGood ? 'text-[#242622]' : 'text-[#242622]'}`}>
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
            <h3 className="font-heading font-bold text-[11px] text-[#85857E] uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#242622]" />
              <span>OEM Engineering Specifications</span>
            </h3>
            <span className="text-[10px] text-slate-500">{vehicle?.brand || 'Royal Enfield'} Factory Spec</span>
          </div>

          <div className="divide-y divide-forest-900 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] overflow-hidden">
            {Object.entries(component.specs).map(([label, val], idx) => (
              <div key={idx} className="flex justify-between items-center px-3 py-2 text-[11px]">
                <span className="text-[#85857E]">{label}</span>
                <span className="font-semibold text-[#242622] text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features & Innovations */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-[11px] text-[#85857E] uppercase tracking-wider">
            Key Architecture Features
          </h3>
          <ul className="space-y-1.5">
            {component.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[11px] text-[#85857E]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#242622] flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Inspection Photographic Evidence (If available from listing) */}
        {inspection.evidencePhotos && inspection.evidencePhotos.length > 0 ? (
          <div className="space-y-2 pt-1 border-t border-[#E9E3D8]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-[11px] text-[#85857E] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#242622]" />
                <span>Physical Inspection Evidence</span>
              </h3>
              <span className="text-[10px] text-[#242622]">Actual Vehicle Photos</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {inspection.evidencePhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePhotoModal(photo.url)}
                  className="group relative aspect-[4/3] rounded-none overflow-hidden bg-white border border-[#E9E3D8] cursor-pointer shadow-md hover:border-emerald-500 transition-colors"
                >
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-[#242622] leading-tight line-clamp-1">{photo.tag}</span>
                  </div>
                  <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-none bg-[#E9E3D8] border border-[#E9E3D8] flex items-start gap-2 text-[10px] text-[#85857E]">
            <Info className="w-3.5 h-3.5 text-[#85857E] flex-shrink-0 mt-0.5" />
            <p>
              Physical 120-point inspection conducted at GEAR UP Hub. Component verified within OEM tolerances with zero defect alerts flagged for photographic recording.
            </p>
          </div>
        )}

        {/* Computer Vision AI Exterior Verification (Optional YOLO + OpenCV Integration) */}
        {inspection.visionAiDetection && (
          <div className="p-3 rounded-none bg-[#091511] border border-[#E9E3D8] space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#85857E] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#242622]" />
                <span>AI Computer Vision Observation</span>
              </span>
              <span className="font-mono text-[#242622] font-bold">
                {Math.round(inspection.visionAiDetection.confidence * 100)}% Confidence
              </span>
            </div>
            <p className="text-[#85857E] leading-normal">
              {inspection.visionAiDetection.surfaceQuality}
            </p>
            <p className="text-slate-500 italic text-[9px] pt-0.5 border-t border-[#E9E3D8]">
              *Notice: Visual camera analysis assesses exterior surface finish and does not replace certified internal physical disassembly.
            </p>
          </div>
        )}

        {/* Related Components Quick Links */}
        <div className="pt-2 border-t border-[#E9E3D8]">
          <span className="text-[10px] font-bold text-[#85857E] uppercase tracking-wider block mb-2">
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
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E9E3D8] text-[#85857E] hover:text-white border border-[#E9E3D8] text-[10px] transition-colors flex items-center gap-1"
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
          className="w-full mt-1 py-2.5 px-4 rounded-none bg-[#E9E3D8] hover:bg-[#35483C]/30 text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#35483C]/50 transition-colors"
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
          <div className="relative max-w-3xl max-h-[85vh] rounded-none overflow-hidden border border-[#E9E3D8]" onClick={(e) => e.stopPropagation()}>
            <img src={activePhotoModal} alt="Inspection evidence full size" className="w-full h-full object-contain" />
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-3 right-3 p-2 rounded-none bg-black/70 text-white hover:bg-[#E9E3D8]/40"
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
