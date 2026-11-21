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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            {isLogin ? 'Sign In to GEAR UP' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500">
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
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-700 font-semibold mb-1 block">Mobile Number (with WhatsApp)</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-slate-400">
              <span className="text-slate-500 font-bold">+91</span>
              <input
                type="tel"
                required
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="text-slate-700 font-semibold mb-1 block">Enter 4-Digit OTP</label>
              <input
                type="text"
                required
                placeholder="1234 (Demo Mode)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center font-mono text-base font-bold text-slate-900 tracking-widest focus:outline-none focus:border-slate-400"
              />
              <p className="text-[10px] text-emerald-700 font-medium mt-1">✓ Demo OTP: Enter any 4 digits to proceed</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            {otpSent ? 'Verify & Continue' : 'Send Verification OTP'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setOtpSent(false);
            }}
            className="text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
