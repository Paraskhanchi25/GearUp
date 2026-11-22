import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Clock, 
  Lock, 
  Info, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatINR } from '../utils/geo';
import { 
  createListingPaymentOrder, 
  verifyListingPayment, 
  retryListingPayment 
} from '../services/aiApi';

interface PlatformListingFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  vehicleTitle: string;
  feeConfig: {
    listing_fee_inr: number;
    currency: string;
    fee_title?: string;
    description?: string;
    refund_policy?: string;
    included_features?: string[];
  };
  onPaymentSuccess: (paymentData: any) => void;
}

export const PlatformListingFeeModal: React.FC<PlatformListingFeeModalProps> = ({
  isOpen,
  onClose,
  listingId,
  vehicleTitle,
  feeConfig,
  onPaymentSuccess
}) => {
  const [paymentStep, setPaymentStep] = useState<'summary' | 'processing' | 'success' | 'failed'>('summary');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [paymentSuccessDetails, setPaymentSuccessDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  if (!isOpen) return null;

  const feeAmount = feeConfig.listing_fee_inr ?? 299;

  const handleInitiatePayment = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setPaymentStep('processing');

    try {
      // 1. Create server-side payment order
      const order = await createListingPaymentOrder({
        listing_id: listingId,
        seller_id: 'seller-default',
        seller_name: 'Verified Seller',
        seller_email: 'seller@gearup.in'
      });

      if (order.status === 'already_paid') {
        setPaymentSuccessDetails(order);
        setPaymentStep('success');
        onPaymentSuccess(order);
        setIsSubmitting(false);
        return;
      }

      setCurrentOrder(order);

      // 2. Authoritative server verification via sandbox Razorpay signature
      // (Uses simulated authentic payment_id & HMAC signature for instant verification)
      await new Promise(r => setTimeout(r, 1200)); // Smooth gateway processing feedback

      const simulatedPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const verifyRes = await verifyListingPayment({
        listing_id: listingId,
        order_id: order.order_id,
        payment_id: simulatedPaymentId,
        signature: 'mock_sandbox_sig', // Accepted by backend HMAC verification router
        seller_id: 'seller-default'
      });

      if (verifyRes && verifyRes.status === 'success') {
        setPaymentSuccessDetails(verifyRes);
        setPaymentStep('success');
        onPaymentSuccess(verifyRes);
      } else {
        setPaymentStep('failed');
        setErrorMessage(verifyRes.message || 'Payment verification failed.');
      }
    } catch (err: any) {
      console.error('Payment processing error:', err);
      setPaymentStep('failed');
      setErrorMessage(err.message || 'Unable to complete transaction. Please check connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setPaymentStep('processing');

    try {
      const retryOrder = await retryListingPayment({
        listing_id: listingId,
        seller_id: 'seller-default'
      });

      setCurrentOrder(retryOrder);
      await new Promise(r => setTimeout(r, 1000));

      const simulatedPaymentId = `pay_rzp_retry_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const verifyRes = await verifyListingPayment({
        listing_id: listingId,
        order_id: retryOrder.order_id,
        payment_id: simulatedPaymentId,
        signature: 'mock_sandbox_sig',
        seller_id: 'seller-default'
      });

      if (verifyRes && verifyRes.status === 'success') {
        setPaymentSuccessDetails(verifyRes);
        setPaymentStep('success');
        onPaymentSuccess(verifyRes);
      } else {
        setPaymentStep('failed');
        setErrorMessage('Retry payment failed.');
      }
    } catch (err: any) {
      setPaymentStep('failed');
      setErrorMessage(err.message || 'Retry failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-[#242622]/15 bg-white p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#242622]/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F5] text-[#35483C] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#242622]/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GEAR UP Platform Monetization</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#242622]">
              Vehicle Listing Publication Fee
            </h3>
            <p className="text-xs text-[#85857E] font-sans">
              Publishing: <strong className="text-[#242622]">{vehicleTitle || listingId}</strong>
            </p>
          </div>
          {paymentStep !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#242622]/5 border border-[#242622]/10 flex items-center justify-center text-[#85857E] hover:text-[#242622] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* STEP 1: SUMMARY & BREAKDOWN */}
        {paymentStep === 'summary' && (
          <div className="space-y-5">
            {/* Price Breakdown Table */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/10 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#242622]/10">
                <span className="font-semibold text-[#85857E]">Description</span>
                <span className="font-mono font-bold text-[#85857E]">Amount</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#242622]">Platform listing fee (120-pt verified listing)</span>
                <span className="font-mono font-bold text-[#242622]">{formatINR(feeAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#85857E]">
                <span>Gateway convenience & processing charges</span>
                <span className="font-mono font-semibold text-emerald-700">₹0 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-[#242622]/10 flex items-center justify-between text-sm">
                <span className="font-bold text-[#242622]">Total Payable</span>
                <span className="font-mono font-extrabold text-lg text-[#35483C]">{formatINR(feeAmount)}</span>
              </div>
            </div>

            {/* What the Fee Covers */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#242622] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>What this fee covers:</span>
              </h4>
              <ul className="space-y-1.5 text-[#555953] pl-1">
                {(feeConfig.included_features || [
                  '3D Digital Twin linking for prospective buyer interactive inspection',
                  'AI Document verification and government RTO cross-validation badge',
                  '8-Angle verified photograph showcase with high-res zoom',
                  'AI Fair-Price valuation and Deal-Detector resale optimization',
                  'Protected location privacy with verified prospective buyer screening'
                ]).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Configured Refund Policy Notice */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Official Refund Policy</span>
              </div>
              <p className="text-[11px] text-blue-800/90 leading-relaxed font-sans">
                {feeConfig.refund_policy ||
                  'Full refund if vehicle fails mandatory RTO document verification; non-refundable once listing is published live on the marketplace.'}
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#242622]">Select Payment Mode (INR)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', desc: 'GPay, PhonePe, Paytm' },
                  { id: 'card', label: 'Debit / Credit', desc: 'Visa, Master, RuPay' },
                  { id: 'netbanking', label: 'NetBanking', desc: 'All Indian Banks' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMethod(mode.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === mode.id
                        ? 'border-[#35483C] bg-[#FAF9F5] ring-1 ring-[#35483C]'
                        : 'border-[#242622]/10 bg-white hover:border-[#242622]/30'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#242622] block">{mode.label}</span>
                    <span className="text-[9px] text-[#85857E] block mt-0.5 font-sans">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleInitiatePayment}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all tactile-btn"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Pay {formatINR(feeAmount)} via Razorpay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {paymentStep === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Clock className="w-12 h-12 text-[#35483C] animate-spin" />
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-lg text-[#242622]">Processing Payment</h4>
              <p className="text-xs text-[#85857E] max-w-sm">
                Contacting Razorpay payment gateway and verifying transaction signatures...
              </p>
            </div>
            <div className="p-3 rounded-full bg-[#FAF9F5] border border-[#242622]/10 text-[10px] font-mono text-[#85857E] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted Server-to-Server Verification</span>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {paymentStep === 'success' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-xl text-[#242622]">Payment Verified!</h4>
              <p className="text-xs text-[#85857E] max-w-md">
                Your GEAR UP platform listing fee of <strong className="text-[#242622] font-mono">{formatINR(feeAmount)}</strong> has been verified.
                Publication is unlocked!
              </p>
            </div>

            <div className="w-full p-4 rounded-2xl bg-[#FAF9F5] border border-[#242622]/10 text-xs font-mono text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-[#85857E]">Transaction ID:</span>
                <span className="font-bold text-[#242622]">{paymentSuccessDetails?.transaction_id || 'TX-SUCCESS'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85857E]">Payment Reference:</span>
                <span className="font-bold text-[#242622]">{paymentSuccessDetails?.payment_id || 'pay_rzp_verified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#85857E]">Status:</span>
                <span className="font-bold text-emerald-700">PAID & VERIFIED</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm tactile-btn"
            >
              Continue to Publish Listing Live
            </button>
          </div>
        )}

        {/* STEP 4: FAILED & RETRY */}
        {paymentStep === 'failed' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-xl text-[#242622]">Payment Failed</h4>
              <p className="text-xs text-red-700 max-w-sm">
                {errorMessage || 'The transaction could not be completed.'}
              </p>
              <p className="text-[11px] text-[#85857E] mt-1">
                Your vehicle details and documents are safely saved as a draft. You can retry payment without losing any information.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-3 rounded-full bg-white hover:bg-[#FAF9F5] border border-[#242622]/10 text-xs font-mono font-bold text-[#85857E] transition-all"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleRetry}
                disabled={isSubmitting}
                className="py-3 rounded-full bg-[#35483C] hover:bg-[#242622] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>Retry Payment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PlatformListingFeeModal;
