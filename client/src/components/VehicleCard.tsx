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
  Heart
} from 'lucide-react';
import { VehicleListing } from '../types';
import { formatINR } from '../utils/geo';

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
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border bg-white ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-elevated'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-elevated'
      }`}
    >
      {/* Top Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={vehicle.primaryImage}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Category Tag */}
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm uppercase tracking-wider">
            {vehicle.category === 'electric' && <Zap className="w-3 h-3 text-emerald-600" />}
            {vehicle.category}
          </span>

          {/* Save / Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(vehicle.id);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-600 hover:text-red-500 hover:scale-110 transition-transform"
            aria-label="Save listing"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </button>
        </div>

        {/* Verification Tier Badge */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {vehicle.verificationTier === 'physically_inspected' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3 h-3 text-white" /> 120-pt Inspected ({vehicle.inspectionScore})
            </span>
          )}
          {vehicle.verificationTier === 'document_verified' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-white" /> RTO Verified
            </span>
          )}
          {vehicle.batteryHealth && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-md shadow-sm">
              <Zap className="w-3 h-3 text-emerald-400" /> Batt: {vehicle.batteryHealth}%
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
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md shadow-sm transition-colors"
          >
            <Volume2 className="w-3 h-3 text-blue-600" />
            <span>Hear Story</span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Title & Brand */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">{vehicle.brand} • {vehicle.variant}</span>
            {vehicle.distanceKm !== undefined && (
              <span className="font-semibold text-blue-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                {vehicle.distanceKm} km away
              </span>
            )}
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {vehicle.title}
          </h3>
        </div>

        {/* Specs Pills */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {vehicle.year}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-slate-400" />
            {vehicle.km.toLocaleString('en-IN')} km
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 capitalize">
            <Fuel className="w-3 h-3 text-slate-400" />
            {vehicle.fuel}
          </span>
          <span className="text-slate-300">•</span>
          <span>{vehicle.owners === 1 ? '1st Owner' : `${vehicle.owners} Owners`}</span>
        </div>

        {/* AI Deal Detector Badge */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {vehicle.price < 100000 ? 'Attractive Value' : 'Fair Market Value'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[130px]">{vehicle.pickupLocality || vehicle.area || vehicle.city}</span>
        </div>

        {/* Price & CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Asking Price</span>
            <div className="font-heading font-extrabold text-xl text-slate-900">
              {formatINR(vehicle.price)}
            </div>
          </div>

          <Link
            to={`/bike/${vehicle.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
