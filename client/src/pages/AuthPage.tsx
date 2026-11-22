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
    <div className="min-h-screen bg-[#F7F5EF] text-[#242923] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E1D7] shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F1EEE5] text-[#596B59] flex items-center justify-center mx-auto border border-[#E5D9C7]">
            <User className="w-6 h-6 text-[#879783]" />
          </div>
          <h2 className="font-heading font-medium text-2xl sm:text-3xl text-[#242923] tracking-tight">
            {isLogin ? 'Sign In to GEAR UP' : 'Create an Account'}
          </h2>
          <p className="text-xs text-[#77796F]">
            Secure OTP verification for buyers, sellers & verified dealers
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 text-xs font-medium">
          {(['buyer', 'seller', 'dealer'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2.5 rounded-xl border capitalize transition-all ${
                role === r
                  ? 'bg-[#879783] border-[#879783] text-white shadow-sm'
                  : 'bg-[#F7F5EF] border-[#E5E1D7] text-[#77796F] hover:text-[#242923]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4 text-xs">
          <div>
            <label className="text-[#242923] font-medium mb-1.5 block">Mobile Number (with WhatsApp)</label>
            <div className="flex items-center gap-2 bg-[#F7F5EF] border border-[#E5E1D7] rounded-xl px-3.5 py-2.5 focus-within:border-[#879783] transition-colors">
              <span className="text-[#77796F] font-semibold">+91</span>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-[#242923] placeholder-[#77796F]/50 focus:outline-none font-medium"
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="text-[#242923] font-medium mb-1.5 block">Enter 4-Digit OTP</label>
              <input
                type="text"
                required
                placeholder="1234 (Demo Mode)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-[#E5E1D7] rounded-xl px-3.5 py-2.5 text-center font-mono text-base font-semibold text-[#242923] tracking-widest focus:outline-none focus:border-[#879783]"
              />
              <p className="text-[11px] text-[#596B59] mt-1.5">✓ Demo OTP: Enter any 4 digits to proceed</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#879783] hover:bg-[#596B59] text-white font-medium text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            {otpSent ? 'Verify & Continue' : 'Send Verification OTP'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#77796F]">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setOtpSent(false);
            }}
            className="hover:text-[#242923] underline underline-offset-4"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

        <div className="pt-4 border-t border-[#E5E1D7] text-center">
          <p className="text-[11px] text-[#77796F] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#879783]" />
            <span>256-bit Encrypted & Privacy Protected</span>
          </p>
        </div>
      </div>
    </div>
  );
};
