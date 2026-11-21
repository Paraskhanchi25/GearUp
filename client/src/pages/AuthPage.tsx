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
    <div className="min-h-screen bg-[#0A1411] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#101D19] border border-forest-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-forest-200 flex items-center justify-center mx-auto border border-forest-600/50">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-white">
            {isLogin ? 'Sign In to GEAR UP' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400">
            Secure OTP sign-in for buyers, sellers & verified dealers
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          {(['buyer', 'seller', 'dealer'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 rounded-xl border capitalize transition-all ${
                role === r
                  ? 'bg-forest-700 border-forest-400 text-white'
                  : 'bg-forest-950/60 border-forest-900 text-slate-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Mobile Number (with WhatsApp)</label>
            <div className="flex items-center gap-2 bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5">
              <span className="text-slate-400 font-bold">+91</span>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none"
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Enter 4-Digit OTP</label>
              <input
                type="text"
                required
                placeholder="1234 (Demo Mode)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-forest-950 border border-forest-800 rounded-xl px-3 py-2.5 text-center font-mono text-base font-bold text-white tracking-widest focus:outline-none focus:border-forest-500"
              />
              <p className="text-[10px] text-emerald-400 mt-1">✓ Demo OTP: Enter any 4 digits to proceed</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-elevated"
          >
            {otpSent ? 'Verify & Continue' : 'Send Verification OTP'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setOtpSent(false);
            }}
            className="text-forest-300 hover:underline font-semibold"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
