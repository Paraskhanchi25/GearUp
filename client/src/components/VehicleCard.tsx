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
    <div className="group relative bg-white border border-[#E9E3D8] hover:border-[#35483C] transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-md">
      {/* Visual Photography Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E3D8]/30">
        <img
          src={vehicle.primaryImage}
          alt={vehicle.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges Bar */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-[#242622]/90 text-white backdrop-blur-sm border border-white/20">
              {vehicle.category}
            </span>
            {vehicle.batteryHealth && (
              <span className="px-2 py-1 text-[9px] font-mono font-bold bg-[#35483C] text-white flex items-center gap-1 border border-white/20">
                <Zap className="w-2.5 h-2.5" /> {vehicle.batteryHealth}%
              </span>
            )}
          </div>

          {/* Favorite Toggle Button (Touch-friendly 44x44px target) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(vehicle.id);
            }}
            className="pointer-events-auto w-11 h-11 flex items-center justify-center bg-white/95 text-[#242622] hover:text-red-600 transition-all border border-[#E9E3D8] active:scale-95 shadow-sm"
            title={isSaved ? 'Remove from Saved' : 'Save Machine'}
            aria-label={isSaved ? 'Remove from Saved' : 'Save Machine'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
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
            className="absolute bottom-2.5 left-2.5 z-10 px-2.5 py-1.5 min-h-[36px] bg-white/95 text-[#242622] border border-[#E9E3D8] text-[9px] sm:text-[10px] font-mono font-medium flex items-center gap-1.5 hover:bg-[#F7F5EF] transition-colors shadow-sm active:scale-95"
            aria-label="Play Exhaust Telemetry"
          >
            <Volume2 className="w-3 h-3 text-[#35483C] animate-pulse shrink-0" />
            <span className="font-bold">EXHAUST NOTE</span>
          </button>
        )}

        {/* Inspection Certification Score Chip */}
        <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-1 bg-[#242622]/95 text-white text-[9px] sm:text-[10px] font-mono font-bold border border-white/20">
          INDEX {vehicle.inspectionScore} / 5.0
        </div>
      </div>

      {/* Specification Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Brand & Hub Location */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#85857E]">
            <span className="uppercase tracking-[0.18em] font-bold text-[#35483C]">{vehicle.brand}</span>
            <span className="flex items-center gap-1 truncate max-w-[130px] sm:max-w-[160px]">
              <MapPin className="w-3 h-3 text-[#85857E] shrink-0" />
              <span className="truncate">{vehicle.area}, {vehicle.city}</span>
            </span>
          </div>

          {/* Machine Title */}
          <h3 className="font-heading font-bold text-base sm:text-lg text-[#242622] group-hover:text-[#35483C] transition-colors line-clamp-1">
            {vehicle.title}
          </h3>

          {/* Technical Specs Strip */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2 border-y border-[#E9E3D8] text-[9px] sm:text-[10px] font-mono text-[#85857E]">
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

        {/* Price & Primary Action (Touch-friendly 44px min height) */}
        <div className="pt-1 flex items-center justify-between gap-2">
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
            className="px-4 py-2.5 min-h-[44px] bg-[#35483C] hover:bg-[#242622] text-white border border-[#35483C] text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0"
          >
            <span>DISCOVER</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};
