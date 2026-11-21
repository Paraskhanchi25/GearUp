import React from 'react';
import { X, Volume2, UserCheck, CheckCircle2 } from 'lucide-react';
import { VehicleListing } from '../types';

interface AudioPlayerModalProps {
  vehicle: VehicleListing | null;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ vehicle, onClose }) => {
  if (!vehicle || !vehicle.audioStory) return null;

  const { audioStory } = vehicle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Verified Rider Audio Story
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 line-clamp-1">
              {audioStory.title}
            </h3>
          </div>
        </div>

        {/* Vehicle Mini Bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <img src={vehicle.primaryImage} alt={vehicle.title} className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
          <div className="text-xs">
            <p className="font-bold text-slate-900 line-clamp-1">{vehicle.title}</p>
            <p className="text-slate-500">{vehicle.area}, {vehicle.city} • By {audioStory.speakerName}</p>
          </div>
        </div>

        {/* Audio Player Element */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Audio Testimonial Duration</span>
            <span className="font-bold text-slate-900">{audioStory.duration}s</span>
          </div>

          {/* HTML5 Native Audio Control */}
          <audio controls className="w-full rounded-lg" autoPlay>
            <source src={audioStory.audioUrl} type="audio/ogg" />
            Your browser does not support audio playback.
          </audio>
        </div>

        {/* Transcript Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold text-slate-900">AI Voice-to-Text Transcript</span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authenticated
            </span>
          </div>
          <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic leading-relaxed">
            &ldquo;{audioStory.transcript}&rdquo;
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
