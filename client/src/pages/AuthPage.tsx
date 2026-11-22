import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'buyer' | 'seller' | 'dealer'>('buyer');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      alert(`Welcome to GEAR UP! Signed in as ${role}.`);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#242622] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl border border-[#242622]/[0.08] bg-white shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#35483C] text-white flex items-center justify-center mx-auto shadow-sm">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#242622] tracking-tight">
            {isLogin ? 'Sign In to GEAR UP' : 'Create an Account'}
          </h2>
          <p className="text-xs text-[#85857E]">
            Secure OTP verification for buyers, sellers & verified dealers
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono font-medium">
          {(['buyer', 'seller', 'dealer'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-full border capitalize transition-all duration-200 tactile-btn ${
                role === r
                  ? 'bg-[#35483C] border-[#35483C] text-white shadow-sm font-bold'
                  : 'bg-[#FAF9F5] border-[#242622]/10 text-[#85857E] hover:text-[#242622]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4 text-xs font-sans">
          <div>
            <label className="text-[#242622] font-semibold mb-1.5 block">Mobile Number (with WhatsApp)</label>
            <div className="flex items-center gap-2 bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 focus-within:border-[#35483C] focus-within:ring-2 focus-within:ring-[#35483C]/10 transition-all">
              <span className="text-[#85857E] font-mono font-semibold">+91</span>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-[#242622] placeholder-[#85857E]/50 focus:outline-none font-medium text-xs sm:text-sm"
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="text-[#242622] font-semibold mb-1.5 block">Enter 4-Digit OTP</label>
              <input
                type="text"
                required
                placeholder="1234 (Demo Mode)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#242622]/10 rounded-xl px-3.5 py-2.5 text-center font-mono text-base font-semibold text-[#242622] tracking-widest focus:outline-none focus:border-[#35483C] focus:ring-2 focus:ring-[#35483C]/10"
              />
              <p className="text-[11px] text-[#35483C] mt-1.5 font-medium">✓ Demo OTP: Enter any 4 digits to proceed</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 min-h-[44px] rounded-full bg-[#35483C] hover:bg-[#242622] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-sm tactile-btn border border-[#35483C]"
          >
            {otpSent ? 'Verify & Continue' : 'Send Verification OTP'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#85857E] font-mono">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setOtpSent(false);
            }}
            className="hover:text-[#242622] underline underline-offset-4"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        <div className="pt-4 border-t border-[#242622]/[0.08] text-center">
          <p className="text-[11px] text-[#85857E] flex items-center justify-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#35483C]" />
            <span>256-bit Encrypted & Privacy Protected</span>
          </p>
        </div>
      </div>
    </div>
  );
};
