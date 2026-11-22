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
    <div className="group relative bg-white border border-[#E9E3D8] hover:border-[#35483C] transition-all duration-500 flex flex-col overflow-hidden">
      {/* Visual Photography Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E3D8]/30">
        <img
          src={vehicle.primaryImage}
          alt={vehicle.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.2em] bg-[#242622]/90 text-white backdrop-blur-sm">
              {vehicle.category}
            </span>
            {vehicle.batteryHealth && (
              <span className="px-2 py-1 text-[9px] font-mono font-bold bg-[#35483C] text-white flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> {vehicle.batteryHealth}%
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSave(vehicle.id);
            }}
            className="pointer-events-auto p-2 bg-white/90 text-[#242622] hover:text-red-600 transition-colors border border-[#E9E3D8]"
            title={isSaved ? 'Remove from Saved' : 'Save Machine'}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>

        {/* Audio Engine Note pill if available */}
        {vehicle.audioStory && onOpenAudio && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAudio(vehicle);
            }}
            className="absolute bottom-3 left-3 z-10 px-3 py-1 bg-white/95 text-[#242622] border border-[#E9E3D8] text-[10px] font-mono font-medium flex items-center gap-1.5 hover:bg-[#F7F5EF] transition-colors"
          >
            <Volume2 className="w-3 h-3 text-[#35483C] animate-pulse" />
            <span>EXHAUST TELEMETRY</span>
          </button>
        )}

        {/* Inspection Certification Score Chip */}
        <div className="absolute bottom-3 right-3 z-10 px-2 py-1 bg-[#242622]/95 text-white text-[10px] font-mono font-bold border border-white/20">
          INDEX {vehicle.inspectionScore} / 5.0
        </div>
      </div>

      {/* Specification Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Brand & Hub Location */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#85857E]">
            <span className="uppercase tracking-[0.2em] font-bold text-[#35483C]">{vehicle.brand}</span>
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-[#85857E]" />
              <span>{vehicle.area}, {vehicle.city}</span>
            </span>
          </div>

          {/* Machine Title */}
          <h3 className="font-heading font-bold text-lg text-[#242622] group-hover:text-[#35483C] transition-colors line-clamp-1">
            {vehicle.title}
          </h3>

          {/* Technical Specs Strip */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E9E3D8] text-[10px] font-mono text-[#85857E]">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#85857E]">YEAR</span>
              <span className="font-semibold text-[#242622]">{vehicle.year}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#85857E]">MILEAGE</span>
              <span className="font-semibold text-[#242622]">{vehicle.km.toLocaleString('en-IN')} KM</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#85857E]">STATUS</span>
              <span className="font-semibold text-[#35483C] uppercase">{vehicle.documentVerified ? 'VERIFIED' : 'PASSED'}</span>
            </div>
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="pt-1 flex items-center justify-between">
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-[0.18em] text-[#85857E]">
              CERTIFIED VALUE
            </span>
            <div className="font-heading font-extrabold text-xl text-[#242622]">
              {formatINR(vehicle.price)}
            </div>
          </div>

          <Link
            to={`/bike/${vehicle.id}`}
            className="px-4 py-2 bg-[#35483C] hover:bg-[#242622] text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors group-hover:bg-[#242622]"
          >
            <span>DISCOVER</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
