import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Gauge, 
  Calendar, 
  Fuel, 
  Volume2, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Heart,
  Camera
} from 'lucide-react';
import { VehicleListing } from '../types';
import { formatINR, formatINRLakh } from '../utils/geo';

interface VehicleCardProps {
  vehicle: VehicleListing;
  isSelected?: boolean;
  onSelect?: () => void;
  onOpenAudio?: (vehicle: VehicleListing) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSelected = false,
  onSelect,
  onOpenAudio,
  isSaved = false,
  onToggleSave
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border ${
        isSelected
          ? 'bg-[#152721] border-forest-400 shadow-glow ring-1 ring-forest-400'
          : 'bg-[#101D19] border-[#1C362D] hover:border-forest-600/70 hover:shadow-elevated'
      }`}
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-forest-950">
        {vehicle.primaryImage ? (
          <img
            src={vehicle.primaryImage}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-forest-950/80 text-slate-500 border border-dashed border-forest-900 p-4 text-center">
            <Camera className="w-8 h-8 text-forest-700 mb-1" />
            <span className="text-[11px] font-semibold text-slate-400">No vehicle photos uploaded yet</span>
          </div>
        )}
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101D19] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Category Tag */}
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
            {vehicle.category === 'electric' && <Zap className="w-3 h-3 text-emerald-400" />}
            {vehicle.category}
          </span>

          {/* Save / Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(vehicle.id);
            }}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 hover:scale-110 transition-transform"
            aria-label="Save listing"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Verification Tier Badge */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {vehicle.verificationTier === 'physically_inspected' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-forest-700/90 text-white backdrop-blur-md border border-forest-500/50 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-forest-200" /> 120-pt Inspected ({vehicle.inspectionScore})
            </span>
          )}
          {vehicle.verificationTier === 'document_verified' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-900/90 text-emerald-200 backdrop-blur-md border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RTO Verified
            </span>
          )}
          {vehicle.batteryHealth && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-900/90 text-cyan-200 backdrop-blur-md border border-cyan-500/40">
              <Zap className="w-3 h-3 text-cyan-400" /> Batt: {vehicle.batteryHealth}%
            </span>
          )}
        </div>

        {/* Audio Story pill if available */}
        {vehicle.audioStory && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAudio?.(vehicle);
            }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-900/80 hover:bg-amber-800 text-amber-200 backdrop-blur-md border border-amber-600/50 shadow-sm transition-colors"
          >
            <Volume2 className="w-3 h-3 animate-pulse text-amber-300" />
            <span>Hear Story</span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Title & Brand */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">{vehicle.brand} • {vehicle.variant}</span>
            {vehicle.distanceKm !== undefined && (
              <span className="font-semibold text-forest-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-forest-400" />
                {vehicle.distanceKm} km away
              </span>
            )}
          </div>
          <h3 className="font-heading font-bold text-base text-white group-hover:text-forest-200 transition-colors line-clamp-1">
            {vehicle.title}
          </h3>
        </div>

        {/* Specs Pills */}
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-forest-950/60 p-2 rounded-xl border border-forest-900/60">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {vehicle.year}
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-400" />
            {vehicle.km.toLocaleString('en-IN')} km
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 capitalize">
            <Fuel className="w-3 h-3 text-slate-400" />
            {vehicle.fuel}
          </span>
          <span className="text-slate-600">•</span>
          <span>{vehicle.owners === 1 ? '1st Owner' : `${vehicle.owners} Owners`}</span>
        </div>

        {/* AI Deal Detector Badge */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[10px] text-emerald-300 font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {vehicle.price < 100000 ? 'AI Deal: Attractive Value' : 'AI Deal: Fair Market Value'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{vehicle.pickupLocality || vehicle.area || vehicle.city}</span>
        </div>

        {/* Price & CTA */}
        <div className="pt-2 border-t border-[#1C362D] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asking Price</span>
            <div className="font-heading font-extrabold text-xl text-white">
              {formatINR(vehicle.price)}
            </div>
          </div>

          <Link
            to={`/bike/${vehicle.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-forest-800 hover:bg-forest-700 text-forest-100 hover:text-white border border-forest-600/50 transition-all shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
