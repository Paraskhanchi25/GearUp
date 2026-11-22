import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Gauge, 
  Volume2, 
  Sparkles, 
  Heart, 
  ArrowRight,
  Zap,
  CheckCircle2,
  FileCheck2
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
    <div className="group relative rounded-3xl bg-white border border-[#E5E1D7] hover:border-[#879783] transition-all duration-300 hover:shadow-elevated flex flex-col overflow-hidden">
      {/* Image Stage Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F1EEE5]">
        <img
          src={vehicle.primaryImage}
          alt={vehicle.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(vehicle.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#77796F] hover:text-red-500 shadow-sm transition-all"
          title={isSaved ? 'Remove from Saved' : 'Save Bike'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Badges on Image */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#242923]/80 backdrop-blur-md text-white">
            {vehicle.category}
          </span>
          {vehicle.batteryHealth && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#879783]/90 backdrop-blur-md text-white flex items-center gap-1">
              <Zap className="w-3 h-3 text-white" /> {vehicle.batteryHealth}% Health
            </span>
          )}
        </div>

        {/* Audio Story pill if available */}
        {vehicle.audioStory && onOpenAudio && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenAudio(vehicle);
            }}
            className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#242923] border border-[#E5E1D7] text-[11px] font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#F7F5EF] transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#879783] animate-pulse" />
            <span>Voice Story</span>
          </button>
        )}

        {/* Inspection Score Pill */}
        <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#596B59] border border-[#E5E1D7] text-[11px] font-semibold shadow-sm">
          ★ {vehicle.inspectionScore} / 5.0
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#77796F]">
            <span className="font-medium tracking-wide uppercase text-[10px] text-[#596B59]">{vehicle.brand}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#879783]" />
              <span>{vehicle.area}, {vehicle.city}</span>
            </span>
          </div>

          <h3 className="font-heading font-medium text-lg text-[#242923] group-hover:text-[#596B59] transition-colors line-clamp-1">
            {vehicle.title}
          </h3>

          {/* Quick Specs Ribbon */}
          <div className="flex items-center gap-3 pt-1 text-xs text-[#77796F]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#879783]" />
              <span>{vehicle.year}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-[#879783]" />
              <span>{vehicle.km.toLocaleString('en-IN')} km</span>
            </span>
            <span>•</span>
            <span className="capitalize">{vehicle.fuel}</span>
          </div>
        </div>

        {/* Verification Check & Deal Badge */}
        <div className="pt-2 border-t border-[#E5E1D7] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#596B59] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#879783]" />
            <span className="text-[11px]">{vehicle.documentVerified ? 'Document Verified' : 'Standard Verified'}</span>
          </div>

          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F1EEE5] text-[#596B59] border border-[#E5D9C7] uppercase tracking-wider">
            {vehicle.aiDealBadge.replace('_', ' ')}
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="font-heading font-medium text-2xl text-[#242923]">
              {formatINR(vehicle.price)}
            </div>
            {vehicle.originalMrp && (
              <span className="text-[11px] text-[#77796F] line-through">
                MRP {formatINR(vehicle.originalMrp)}
              </span>
            )}
          </div>

          <Link
            to={`/bike/${vehicle.id}`}
            className="px-4 py-2 rounded-full bg-[#879783] hover:bg-[#596B59] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
