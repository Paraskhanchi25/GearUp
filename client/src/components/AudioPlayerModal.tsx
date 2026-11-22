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
      <div className="bg-white border border-[#E9E3D8] rounded-none max-w-lg w-full p-6 text-[#242622] shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-[#E9E3D8] text-[#85857E] hover:text-[#242622] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-none bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Volume2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Verified Rider Audio Story
            </span>
            <h3 className="font-heading font-bold text-lg text-[#242622] line-clamp-1">
              {audioStory.title}
            </h3>
          </div>
        </div>

        {/* Vehicle Mini Bar */}
        <div className="flex items-center gap-3 p-3 rounded-none bg-white/70 border border-[#E9E3D8]">
          <img src={vehicle.primaryImage} alt={vehicle.title} className="w-12 h-12 rounded-lg object-cover" />
          <div className="text-xs">
            <p className="font-bold text-[#242622] line-clamp-1">{vehicle.title}</p>
            <p className="text-[#85857E]">{vehicle.area}, {vehicle.city} • By {audioStory.speakerName}</p>
          </div>
        </div>

        {/* Audio Player Element */}
        <div className="bg-[#F7F5EF] p-4 rounded-none border border-[#E9E3D8] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#85857E]">
            <span>Audio Testimonial Duration</span>
            <span className="font-bold text-[#242622]">{audioStory.duration}s</span>
          </div>

          {/* HTML5 Native Audio Control */}
          <audio controls className="w-full rounded-lg" autoPlay>
            <source src={audioStory.audioUrl} type="audio/ogg" />
            Your browser does not support audio playback.
          </audio>
        </div>

        {/* Transcript Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#85857E]">
            <span className="font-semibold text-[#35483C]">AI Voice-to-Text Transcript</span>
            <span className="flex items-center gap-1 text-[11px] text-[#242622]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
            </span>
          </div>
          <p className="p-3.5 rounded-none bg-white/50 border border-[#E9E3D8] text-xs text-[#85857E] italic leading-relaxed">
            &ldquo;{audioStory.transcript}&rdquo;
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-none bg-[#35483C]/30 hover:bg-[#35483C] text-white font-bold text-xs transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
