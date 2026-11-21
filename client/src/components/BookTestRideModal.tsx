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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                GEAR UP Verified Booking
              </span>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Schedule a Test Ride
              </h3>
            </div>

            {/* Vehicle preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <img src={vehicle.primaryImage} alt={vehicle.title} className="w-14 h-14 rounded-lg object-cover bg-slate-200" />
              <div>
                <p className="font-bold text-xs text-slate-900 line-clamp-1">{vehicle.title}</p>
                <p className="text-xs text-blue-700 font-bold">{formatINR(vehicle.price)}</p>
                <p className="text-[11px] text-slate-500">{vehicle.area}, {vehicle.city}</p>
              </div>
            </div>

            {/* Hub vs Doorstep */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Select Location Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRideType('hub')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors ${
                    rideType === 'hub'
                      ? 'bg-blue-50 border-blue-500 text-slate-900 ring-1 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900">Inspection Hub</p>
                  <p className="text-[10px] text-blue-700">GEAR UP Certified Hub (Free)</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRideType('doorstep')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-colors ${
                    rideType === 'doorstep'
                      ? 'bg-blue-50 border-blue-500 text-slate-900 ring-1 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-slate-900">Doorstep Delivery</p>
                  <p className="text-[10px] text-blue-700">Brought to your address (₹199)</p>
                </button>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Preferred Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-medium"
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
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jasmeet Singh"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Phone Number (with WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Valid driving license required at time of ride. Zero deposit.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              Confirm Test Ride
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">Test Ride Reserved!</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                We have notified the seller and scheduled your appointment for <span className="font-bold text-slate-900">{selectedDate} ({selectedSlot})</span>.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              Booking Ref: <span className="font-mono text-slate-900 font-bold">GU-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
