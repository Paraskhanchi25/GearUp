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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12221D] border border-[#E5E1D7] rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-[#F1EEE5] text-[#77796F] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Verified Rider Audio Story
            </span>
            <h3 className="font-heading font-bold text-lg text-white line-clamp-1">
              {audioStory.title}
            </h3>
          </div>
        </div>

        {/* Vehicle Mini Bar */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-[#E5E1D7]">
          <img src={vehicle.primaryImage} alt={vehicle.title} className="w-12 h-12 rounded-lg object-cover" />
          <div className="text-xs">
            <p className="font-bold text-white line-clamp-1">{vehicle.title}</p>
            <p className="text-[#77796F]">{vehicle.area}, {vehicle.city} • By {audioStory.speakerName}</p>
          </div>
        </div>

        {/* Audio Player Element */}
        <div className="bg-[#0B1512] p-4 rounded-2xl border border-[#E5E1D7]/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#77796F]">
            <span>Audio Testimonial Duration</span>
            <span className="font-bold text-[#596B59]">{audioStory.duration}s</span>
          </div>

          {/* HTML5 Native Audio Control */}
          <audio controls className="w-full rounded-lg" autoPlay>
            <source src={audioStory.audioUrl} type="audio/ogg" />
            Your browser does not support audio playback.
          </audio>
        </div>

        {/* Transcript Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#77796F]">
            <span className="font-semibold text-[#354638]">AI Voice-to-Text Transcript</span>
            <span className="flex items-center gap-1 text-[11px] text-[#596B59]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
            </span>
          </div>
          <p className="p-3.5 rounded-xl bg-white/50 border border-[#E5E1D7] text-xs text-[#77796F] italic leading-relaxed">
            &ldquo;{audioStory.transcript}&rdquo;
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#879783]/30 hover:bg-[#879783] text-white font-bold text-xs transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
