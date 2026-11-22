import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Gauge, 
  Volume2, 
  Heart, 
  ArrowRight, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { VehicleListing } from '../types';
import { formatINR } from '../utils/geo';

interface VehicleCardProps {
  vehicle: VehicleListing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenAudio?: (vehicle: VehicleListing) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSaved,
  onToggleSave,
  onOpenAudio,
}) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-[#242622]/10 hover:border-[#35483C]/40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(36,38,34,0.1)] flex flex-col overflow-hidden">
      {/* Visual Photography Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E3D8]/30">
        <img
          src={vehicle.primaryImage}
          alt={vehicle.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />

        {/* Top Badges Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-[#242622]/85 text-white backdrop-blur-md rounded-full border border-white/20 shadow-sm">
              {vehicle.category}
            </span>
            {vehicle.batteryHealth && (
              <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#35483C]/90 text-white flex items-center gap-1 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                <Zap className="w-2.5 h-2.5 text-amber-300" /> {vehicle.batteryHealth}%
              </span>
            )}
          </div>

          {/* Favorite Toggle Button (Apple tactile circular glass pill) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(vehicle.id);
            }}
            className="pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-white/85 backdrop-blur-md text-[#242622] hover:text-red-600 transition-all duration-300 border border-white/40 active:scale-90 shadow-sm hover:bg-white"
            title={isSaved ? 'Remove from Saved' : 'Save Machine'}
            aria-label={isSaved ? 'Remove from Saved' : 'Save Machine'}
          >
            <Heart className={`w-4 h-4 transition-transform duration-300 ${isSaved ? 'fill-red-600 text-red-600 scale-110' : ''}`} />
          </button>
        </div>

        {/* Audio Engine Note pill if available */}
        {vehicle.audioStory && onOpenAudio && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAudio(vehicle);
            }}
            className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#242622] border border-white/40 text-[9px] sm:text-[10px] font-mono font-semibold flex items-center gap-1.5 hover:bg-white transition-all duration-300 shadow-sm active:scale-95"
            aria-label="Play Exhaust Telemetry"
          >
            <Volume2 className="w-3 h-3 text-[#35483C] animate-pulse shrink-0" />
            <span className="font-bold tracking-wider">EXHAUST NOTE</span>
          </button>
        )}

        {/* Inspection Certification Score Chip */}
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-[#242622]/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-mono font-bold border border-white/20 shadow-sm">
          INDEX {vehicle.inspectionScore} / 5.0
        </div>
      </div>

      {/* Specification Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Brand & Hub Location */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#85857E]">
            <span className="uppercase tracking-[0.2em] font-bold text-[#35483C]">{vehicle.brand}</span>
            <span className="flex items-center gap-1 truncate max-w-[130px] sm:max-w-[160px]">
              <MapPin className="w-3 h-3 text-[#85857E] shrink-0" />
              <span className="truncate">{vehicle.area}, {vehicle.city}</span>
            </span>
          </div>

          {/* Machine Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#242622] group-hover:text-[#35483C] transition-colors line-clamp-1">
            {vehicle.title}
          </h3>

          {/* Technical Specs Strip (Refined rounded card pill) */}
          <div className="bg-[#F7F5EF]/80 rounded-xl p-2.5 grid grid-cols-3 gap-2 border border-[#E9E3D8]/60 text-[9px] sm:text-[10px] font-mono text-[#85857E]">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#85857E]">YEAR</span>
              <span className="font-semibold text-[#242622]">{vehicle.year}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#85857E]">ODOMETER</span>
              <span className="font-semibold text-[#242622]">{vehicle.km.toLocaleString('en-IN')} KM</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#85857E]">STATUS</span>
              <span className="font-semibold text-[#35483C] uppercase truncate block">
                {vehicle.documentVerified ? 'VERIFIED' : 'PASSED'}
              </span>
            </div>
          </div>
        </div>

        {/* Price & Primary Action (Apple tactile pill) */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="block text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.16em] text-[#85857E]">
              CERTIFIED VALUE
            </span>
            <div className="font-heading font-extrabold text-lg sm:text-xl text-[#242622] truncate">
              {formatINR(vehicle.price)}
            </div>
          </div>

          <Link
            to={`/bike/${vehicle.id}`}
            className="px-5 py-2.5 min-h-[40px] rounded-full bg-[#35483C] hover:bg-[#28372e] text-white border border-[#35483C] text-xs font-mono uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 shadow-[0_2px_10px_rgba(53,72,60,0.25)] hover:shadow-[0_4px_16px_rgba(53,72,60,0.4)] shrink-0"
          >
            <span>DISCOVER</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};
