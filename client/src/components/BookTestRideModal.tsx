import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { VehicleListing } from '../types';
import { formatINR } from '../utils/geo';

interface BookTestRideModalProps {
  vehicle: VehicleListing | null;
  onClose: () => void;
}

export const BookTestRideModal: React.FC<BookTestRideModalProps> = ({ vehicle, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM - 12:00 PM');
  const [rideType, setRideType] = useState<'doorstep' | 'hub'>('hub');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!vehicle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12221D] border border-[#E5E1D7] rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-[#F1EEE5] text-[#77796F] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#596B59] uppercase tracking-widest">
                GEAR UP Verified Booking
              </span>
              <h3 className="font-heading font-bold text-xl text-white">
                Schedule a Test Ride
              </h3>
            </div>

            {/* Vehicle preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F1EEE5] border border-[#E5E1D7]">
              <img src={vehicle.primaryImage} alt={vehicle.title} className="w-14 h-14 rounded-lg object-cover" />
              <div>
                <p className="font-bold text-xs text-white line-clamp-1">{vehicle.title}</p>
                <p className="text-xs text-[#596B59] font-bold">{formatINR(vehicle.price)}</p>
                <p className="text-[11px] text-[#77796F]">{vehicle.area}, {vehicle.city}</p>
              </div>
            </div>

            {/* Hub vs Doorstep */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#77796F]">Select Location Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRideType('hub')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors ${
                    rideType === 'hub'
                      ? 'bg-[#E5D9C7]/40 border-forest-400 text-white'
                      : 'bg-white/50 border-[#E5E1D7] text-[#77796F]'
                  }`}
                >
                  <p className="font-bold text-white">Inspection Hub</p>
                  <p className="text-[10px] text-[#354638]">GEAR UP Certified Hub (Free)</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRideType('doorstep')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors ${
                    rideType === 'doorstep'
                      ? 'bg-[#E5D9C7]/40 border-forest-400 text-white'
                      : 'bg-white/50 border-[#E5E1D7] text-[#77796F]'
                  }`}
                >
                  <p className="font-bold text-white">Doorstep Delivery</p>
                  <p className="text-[10px] text-[#354638]">Brought to your address (₹199)</p>
                </button>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#77796F] mb-1 block">Preferred Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D7] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#879783]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#77796F] mb-1 block">Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D7] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#879783]"
                >
                  <option>10:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 12:00 PM</option>
                  <option>02:00 PM - 03:00 PM</option>
                  <option>04:00 PM - 05:00 PM</option>
                </select>
              </div>
            </div>

            {/* Rider Details */}
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold text-[#77796F] mb-1 block">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jasmeet Singh"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D7] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#879783]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#77796F] mb-1 block">Phone Number (with WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D7] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#879783]"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-[#E5E1D7] flex items-center gap-2 text-[11px] text-[#77796F]">
              <ShieldCheck className="w-4 h-4 text-[#596B59] flex-shrink-0" />
              <span>Valid driving license required at time of ride. Zero deposit.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-elevated"
            >
              Confirm Test Ride
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[#596B59] flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-white">Test Ride Reserved!</h3>
              <p className="text-xs text-[#77796F] mt-1 max-w-xs mx-auto">
                We have notified the seller and scheduled your appointment for <span className="font-bold text-[#354638]">{selectedDate} ({selectedSlot})</span>.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5E1D7] text-xs text-[#77796F]">
              Booking Ref: <span className="font-mono text-white font-bold">GU-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#879783]/30 hover:bg-[#879783] text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
