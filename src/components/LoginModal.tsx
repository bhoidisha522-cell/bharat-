import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, KeyRound, PhoneCall, CheckCircle } from 'lucide-react';
import { AuthState, StorageService } from '../services/storage';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (state: AuthState) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [phone, setPhone] = useState('9624235014');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = phone.replace(/\D/g, '');

    // Strict Authorization Check: Only 9624235014 (Bharat K)
    if (cleaned !== '9624235014') {
      setError('🚫 પ્રવેશ નિષેધ (Access Denied): ફક્ત અધિકૃત માલિક (શ્રી ભરત કે. - 9624235014) જ આ ઓર્ડર ડાયરી અને હિસાબ ખોલી શકે છે. તમારો મોબાઈલ નંબર સુરક્ષા કારણોસર બ્લોક કરવામાં આવ્યો છે.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate real SMS OTP dispatch to Bharat K's registered device
      const code = '123456';
      setGeneratedOtp(code);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp !== generatedOtp && otp !== '123456') {
      setError('❌ અમાન્ય OTP છે! કૃપા કરીને ૬-આંકડાનો સાચો OTP દાખલ કરો.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const authState: AuthState = {
        isAuthenticated: true,
        phoneNumber: '9624235014',
        isOwner: true,
        loginTime: new Date().toISOString()
      };
      StorageService.setAuthState(authState);
      onLoginSuccess(authState);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0a1228] border-2 border-[#d4af37]/60 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        
        {/* Religious & Brand Top Banner */}
        <div className="text-center pb-4 border-b border-[#d4af37]/20">
          <p className="text-[11px] font-semibold text-[#f3c64c] tracking-widest uppercase">
            || શ્રી ગણેશાય નમઃ || || જય માતાજી ||
          </p>
          <div className="w-16 h-16 mx-auto my-3 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#f3c64c] to-[#996515]">
            <img 
              src="/src/assets/images/isk_sound_logo_1793339507815.jpg" 
              alt="I.S.K Sound" 
              className="w-full h-full object-cover rounded-full bg-[#070d1e]"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide font-serif">
            I. S. K Sound &amp; Live DJ
          </h2>
          <p className="text-xs text-[#d4af37] font-medium mt-0.5">
            ઓર્ડર બુક ડાયરી • સુરક્ષિત લૉગિન સિસ્ટમ
          </p>
        </div>

        {/* Security Alert Badge */}
        <div className="mt-4 p-2.5 rounded-lg bg-[#001f54]/60 border border-[#d4af37]/30 flex items-start gap-2.5 text-xs text-slate-200">
          <ShieldCheck className="w-5 h-5 text-[#f3c64c] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#f3c64c]">અધિકૃત માલિક સુરક્ષા:</span> ફક્ત રજિસ્ટર્ડ નંબર <span className="font-mono text-white font-bold">9624235014</span> (ભરત કે.) માટે જ સુલભ છે.
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 flex items-start gap-2 text-xs text-red-200 animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{error}</div>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                માલિકનો અધિકૃત મોબાઈલ નંબર:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sm text-[#f3c64c] font-bold">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9624235014"
                  className="w-full pl-12 pr-4 py-2.5 bg-[#050b18] border border-[#d4af37]/40 rounded-lg text-white font-mono text-base tracking-wider focus:outline-none focus:border-[#f3c64c] transition-colors"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                નોંધ: અન્ય કોઈ પણ નંબરથી લૉગિન કરી શકાશે નહીં.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#f3c64c] hover:brightness-110 text-[#070d1e] font-bold text-sm rounded-lg shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{loading ? 'OTP મોકલાઈ રહ્યો છે...' : 'સુરક્ષિત SMS OTP મેળવો'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  મોબાઇલ પર આવેલ ૬-આંકડાનો OTP:
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-[#f3c64c] hover:underline"
                >
                  નંબર બદલો
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-[#f3c64c]" />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="દા.ત. 123456"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050b18] border border-[#d4af37]/50 rounded-lg text-white font-mono text-center text-lg tracking-[0.3em] focus:outline-none focus:border-[#f3c64c]"
                  autoFocus
                  required
                />
              </div>

              {/* Demo Helper Pill */}
              <div className="mt-2 p-2 rounded bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
                <span>સુરક્ષા ચકાસણી ટેસ્ટ OTP: <strong className="font-mono text-[#f3c64c]">123456</strong></span>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="px-2 py-0.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/40 text-[#f3c64c] font-semibold rounded text-[11px]"
                >
                  ઓટો-ભરો
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#f3c64c] hover:brightness-110 text-[#070d1e] font-bold text-sm rounded-lg shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{loading ? 'સત્યાપન થઈ રહ્યું છે...' : 'ઓર્ડર ડાયરી ખોલો (Unlock)'}</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            સર્વાધિકાર સુરક્ષિત © 2026 • I. S. K Sound &amp; Live DJ (ભરત કે.)
          </p>
        </div>
      </div>
    </div>
  );
};
