import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  ArrowLeft,
  Loader2,
  Lock,
  Receipt,
  Sparkles
} from 'lucide-react';
import { VehicleListing } from '../types';
import { formatINR } from '../utils/geo';

interface BookTestRideModalProps {
  vehicle: VehicleListing | null;
  onClose: () => void;
}

type Step = 'details' | 'payment' | 'confirmed';
type PaymentMethod = 'upi' | 'card' | 'netbanking';

export const BookTestRideModal: React.FC<BookTestRideModalProps> = ({ vehicle, onClose }) => {
  const [step, setStep] = useState<Step>('details');
  const [selectedDate, setSelectedDate] = useState('2026-11-23');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM - 12:00 PM');
  const [rideType, setRideType] = useState<'doorstep' | 'hub'>('hub');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  if (!vehicle) return null;

  // Platform fee calculation
  const basePlatformFee = 199;
  const doorstepSurcharge = rideType === 'doorstep' ? 100 : 0;
  const totalPlatformFee = basePlatformFee + doorstepSurcharge;
  const gstAmount = Math.round((totalPlatformFee * 18) / 118);
  const baseBeforeGst = totalPlatformFee - gstAmount;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert('Please fill in your name and contact phone number.');
      return;
    }
    setStep('payment');
  };

  const handlePayAndConfirm = () => {
    setIsProcessing(true);

    // Simulate payment gateway verification
    setTimeout(() => {
      const generatedTxn = 'TXN-GU' + Math.floor(10000000 + Math.random() * 90000000);
      const generatedRef = 'GU-TR' + Math.floor(100000 + Math.random() * 900000);
      setTxnId(generatedTxn);
      setBookingRef(generatedRef);
      setIsProcessing(false);
      setStep('confirmed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white border border-[#E9E3D8] max-w-lg w-full p-4 sm:p-6 text-[#242622] shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        {/* Close Button (44x44px touch target) */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-[#F7F5EF] hover:bg-[#E9E3D8] text-[#85857E] hover:text-[#242622] transition-colors border border-[#E9E3D8] active:scale-95"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: TEST RIDE DETAILS & PLATFORM FEE BREAKDOWN */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#35483C]/10 text-[#35483C] text-[10px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Verified Inspection Escort</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#242622]">
                Book Test Ride
              </h3>
              <p className="text-xs text-[#85857E] mt-0.5">
                Reserve your slot with verified vehicle inspection & escort support
              </p>
            </div>

            {/* Vehicle preview */}
            <div className="flex items-center gap-3 p-3 bg-[#F7F5EF] border border-[#E9E3D8]">
              <img src={vehicle.primaryImage} alt={vehicle.title} className="w-14 h-14 object-cover border border-[#E9E3D8]" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-[#242622] truncate">{vehicle.title}</p>
                <p className="text-xs text-[#35483C] font-bold">{formatINR(vehicle.price)}</p>
                <p className="text-[11px] text-[#85857E] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#85857E] flex-shrink-0" />
                  <span className="truncate">{vehicle.area}, {vehicle.city}</span>
                </p>
              </div>
            </div>

            {/* Location Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#85857E]">Select Location Preference</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRideType('hub')}
                  className={`p-3 border text-xs font-semibold text-left transition-all ${
                    rideType === 'hub'
                      ? 'bg-[#E9E3D8] border-[#35483C] text-[#242622] shadow-sm'
                      : 'bg-white border-[#E9E3D8] text-[#85857E] hover:border-[#35483C]/40'
                  }`}
                >
                  <p className="font-bold text-[#242622]">Inspection Hub</p>
                  <p className="text-[10px] text-[#35483C]">GEAR UP Certified Hub</p>
                  <p className="text-[10px] font-bold text-[#242622] mt-1">Platform Fee: ₹199</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRideType('doorstep')}
                  className={`p-3 border text-xs font-semibold text-left transition-all ${
                    rideType === 'doorstep'
                      ? 'bg-[#E9E3D8] border-[#35483C] text-[#242622] shadow-sm'
                      : 'bg-white border-[#E9E3D8] text-[#85857E] hover:border-[#35483C]/40'
                  }`}
                >
                  <p className="font-bold text-[#242622]">Doorstep Delivery</p>
                  <p className="text-[10px] text-[#35483C]">Brought to your doorstep</p>
                  <p className="text-[10px] font-bold text-[#242622] mt-1">Platform Fee: ₹299</p>
                </button>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#85857E] mb-1 block">Preferred Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#85857E] mb-1 block">Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-white border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                >
                  <option>10:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 12:00 PM</option>
                  <option>02:00 PM - 03:00 PM</option>
                  <option>04:00 PM - 05:00 PM</option>
                  <option>05:30 PM - 06:30 PM</option>
                </select>
              </div>
            </div>

            {/* Rider Details */}
            <div className="space-y-2">
              <div>
                <label className="text-xs font-semibold text-[#85857E] mb-1 block">Rider Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jasmeet Singh"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#85857E] mb-1 block">Phone Number (with WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-white border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                />
              </div>
            </div>

            {/* Platform Fee Breakdown Highlight Card */}
            <div className="p-3 bg-[#F7F5EF] border border-[#E9E3D8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#242622] flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-[#35483C]" />
                  Platform Reservation Fee
                </span>
                <span className="text-xs font-mono font-bold text-[#35483C]">
                  ₹{totalPlatformFee}
                </span>
              </div>
              <div className="text-[11px] text-[#85857E] space-y-1 pt-1 border-t border-[#E9E3D8]">
                <div className="flex justify-between">
                  <span>Slot reservation & vehicle hold:</span>
                  <span>₹{baseBeforeGst}</span>
                </div>
                {doorstepSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Doorstep doorstep transit escort:</span>
                    <span>₹{doorstepSurcharge}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (18% inclusive):</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-[#242622] pt-1 border-t border-[#E9E3D8]">
                  <span>Total Payable:</span>
                  <span>₹{totalPlatformFee}</span>
                </div>
              </div>
              <p className="text-[10px] text-[#35483C] bg-white p-2 border border-[#E9E3D8] leading-tight">
                <strong>100% Assurance:</strong> The platform fee guarantees your reserved slot with our certified ride escort. Fully adjusted against purchase or refunded if seller fails to arrive.
              </p>
            </div>

            <div className="p-2.5 bg-white border border-[#E9E3D8] flex items-center gap-2 text-[11px] text-[#85857E]">
              <ShieldCheck className="w-4 h-4 text-[#35483C] flex-shrink-0" />
              <span>Valid physical driving license required at time of ride. Zero deposit.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#35483C] hover:bg-[#242622] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Pay Platform Fee (₹{totalPlatformFee})</span>
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT GATEWAY CHECKOUT */}
        {step === 'payment' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9E3D8] pb-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                disabled={isProcessing}
                className="flex items-center gap-1 text-xs text-[#85857E] hover:text-[#242622] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Details</span>
              </button>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#85857E] block">Amount to Pay</span>
                <span className="text-base font-heading font-bold text-[#35483C]">₹{totalPlatformFee}</span>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-[#242622]">
                Platform Fee Checkout
              </h3>
              <p className="text-xs text-[#85857E]">
                Complete ₹{totalPlatformFee} platform fee payment to confirm your test ride appointment.
              </p>
            </div>

            {/* Booking Summary Mini Card */}
            <div className="p-2.5 bg-[#F7F5EF] border border-[#E9E3D8] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#85857E]">Vehicle:</span>
                <span className="font-medium text-[#242622] truncate max-w-[200px]">{vehicle.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85857E]">Slot:</span>
                <span className="font-medium text-[#242622]">{selectedDate} ({selectedSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85857E]">Location:</span>
                <span className="font-medium text-[#242622]">
                  {rideType === 'hub' ? 'Inspection Hub' : 'Doorstep Delivery'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85857E]">Rider:</span>
                <span className="font-medium text-[#242622]">{userName} ({userPhone})</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#85857E]">Choose Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-[#E9E3D8] border-[#35483C] text-[#242622] font-bold'
                      : 'bg-white border-[#E9E3D8] text-[#85857E] hover:border-[#35483C]/40'
                  }`}
                >
                  <QrCode className="w-4 h-4 mx-auto mb-1 text-[#35483C]" />
                  <span className="text-[11px] block">UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#E9E3D8] border-[#35483C] text-[#242622] font-bold'
                      : 'bg-white border-[#E9E3D8] text-[#85857E] hover:border-[#35483C]/40'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-[#35483C]" />
                  <span className="text-[11px] block">Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 border text-center transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#E9E3D8] border-[#35483C] text-[#242622] font-bold'
                      : 'bg-white border-[#E9E3D8] text-[#85857E] hover:border-[#35483C]/40'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-[#35483C]" />
                  <span className="text-[11px] block">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Method Inputs */}
            {paymentMethod === 'upi' && (
              <div className="space-y-2 p-3 bg-white border border-[#E9E3D8]">
                <div className="flex items-center justify-between text-xs text-[#85857E] mb-1">
                  <span>Fast UPI Checkout</span>
                  <span className="text-[10px] text-[#35483C] font-semibold">GPay, PhonePe, Paytm, BHIM</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. mobile@upi or name@okhdfcbank)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#F7F5EF] border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                />
                <div className="flex gap-2 pt-1">
                  {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map((suf) => (
                    <button
                      type="button"
                      key={suf}
                      onClick={() => setUpiId((prev) => (prev.includes('@') ? prev.split('@')[0] + suf : prev + suf))}
                      className="px-2 py-1 bg-[#E9E3D8] hover:bg-[#35483C] hover:text-white text-[10px] text-[#242622] transition-colors"
                    >
                      {suf}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="space-y-2 p-3 bg-white border border-[#E9E3D8]">
                <div>
                  <label className="text-[10px] text-[#85857E] uppercase block mb-0.5">Card Number</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="4532 •••• •••• 8890"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#F7F5EF] border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#85857E] uppercase block mb-0.5">Valid Thru</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#F7F5EF] border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#85857E] uppercase block mb-0.5">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#F7F5EF] border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-2 p-3 bg-white border border-[#E9E3D8]">
                <label className="text-[10px] text-[#85857E] uppercase block">Select Popular Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-[#F7F5EF] border border-[#E9E3D8] px-3 py-2 text-xs text-[#242622] focus:outline-none focus:border-[#35483C]"
                >
                  <option>HDFC Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* Security disclaimer */}
            <div className="flex items-center gap-2 text-[10px] text-[#85857E]">
              <Lock className="w-3.5 h-3.5 text-[#35483C] flex-shrink-0" />
              <span>Encrypted with 256-bit SSL. RBI Compliant Sandbox Gateway.</span>
            </div>

            {/* Pay Button */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayAndConfirm}
              className="w-full py-3.5 bg-[#35483C] hover:bg-[#242622] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing ₹{totalPlatformFee} Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ₹{totalPlatformFee} & Confirm Slot</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: BOOKING CONFIRMED & PLATFORM FEE RECEIPT */}
        {step === 'confirmed' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#35483C] font-bold">
                Payment Received & Slot Confirmed
              </span>
              <h3 className="font-heading font-bold text-xl text-[#242622] mt-0.5">
                Test Ride Reserved!
              </h3>
              <p className="text-xs text-[#85857E] mt-1 max-w-sm mx-auto">
                We have notified the seller and assigned a certified GEAR UP ride escort for your appointment.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-[#F7F5EF] border border-[#E9E3D8] text-xs text-left space-y-2">
              <div className="flex justify-between pb-2 border-b border-[#E9E3D8]">
                <span className="text-[#85857E]">Booking Reference:</span>
                <span className="font-mono font-bold text-[#242622]">{bookingRef}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E9E3D8]">
                <span className="text-[#85857E]">Transaction ID:</span>
                <span className="font-mono text-[#35483C] font-semibold">{txnId}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E9E3D8]">
                <span className="text-[#85857E]">Platform Fee Paid:</span>
                <span className="font-bold text-emerald-700">₹{totalPlatformFee} (Paid)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E9E3D8]">
                <span className="text-[#85857E]">Vehicle:</span>
                <span className="font-medium text-[#242622] truncate max-w-[200px]">{vehicle.title}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E9E3D8]">
                <span className="text-[#85857E]">Scheduled Date & Slot:</span>
                <span className="font-medium text-[#242622]">{selectedDate} ({selectedSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85857E]">Meeting Location:</span>
                <span className="font-medium text-[#242622]">
                  {rideType === 'hub' ? `Inspection Hub (${vehicle.area})` : 'Doorstep Delivery'}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-left flex items-start gap-2 text-[11px] text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>
                Booking confirmation & receipt sent via WhatsApp/SMS to <strong>{userPhone}</strong>. Please bring your physical driving license to the test ride.
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#35483C] hover:bg-[#242622] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Done & Return to Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
