
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Phone, ShieldCheck, ArrowRight, Loader2, AlertCircle, User, CheckCircle, Smartphone } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

type LoginMethod = 'GOOGLE' | 'EMAIL' | 'PHONE';

const Login: React.FC = () => {
  const [method, setMethod] = useState<LoginMethod>('EMAIL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { loginEmail, requestOTP, verifyOTP, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const ok = await loginEmail(email, password);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError('Invalid credentials or security timeout. Please try again.');
      setLoading(false);
    }
  };

  const handlePhoneRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await requestOTP(phoneNumber);
    if (ok) {
      setStep(2);
      setLoading(false);
    } else {
      setError('System could not transmit code to this number.');
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await verifyOTP(phoneNumber, otpCode, userName);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError('Verification failed. Code may have expired.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const ok = await loginGoogle();
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError('External identity synchronization failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-full h-full border border-white/5 rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
      >
        {success ? (
          <div className="p-24 text-center space-y-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-brand-gold text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle size={54} />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-bold text-brand-dark tracking-tight">Identity Verified</h2>
              <p className="text-gray-400 font-serif italic text-lg">Establishing secure link to portal...</p>
            </div>
          </div>
        ) : (
          <div className="p-10 sm:p-14">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex p-4 bg-brand-gold/10 text-brand-gold rounded-full mb-2">
                <ShieldCheck size={44} />
              </div>
              <h1 className="text-4xl font-serif font-bold text-brand-dark tracking-tight">Access Secure Hub</h1>
              <p className="text-gray-400 font-serif italic">Enter your professional credentials to continue.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-10 border border-gray-100">
              {(['EMAIL', 'PHONE', 'GOOGLE'] as LoginMethod[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setError(''); setStep(1); }}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${method === m ? 'bg-brand-dark text-white shadow-xl' : 'text-gray-400 hover:text-brand-dark'}`}
                >
                  {m === 'PHONE' ? 'Mobile' : m}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {method === 'EMAIL' && (
                <motion.form key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleEmailLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Corporate Email</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="professional@company.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Security Key</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="••••••••••••" />
                    </div>
                  </div>
                  <button disabled={loading} className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-2xl">
                    {loading ? <Loader2 className="animate-spin" /> : <>Enter Hub <ArrowRight size={22} /></>}
                  </button>
                </motion.form>
              )}

              {method === 'PHONE' && (
                <motion.div key="phone" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {step === 1 ? (
                    <form onSubmit={handlePhoneRequest} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mobile Identity</label>
                        <div className="relative">
                          <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                          <input required type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium" placeholder="+91 00000 00000" />
                        </div>
                      </div>
                      <button disabled={loading} className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-2xl">
                        {loading ? <Loader2 className="animate-spin" /> : <>Request One-Time Code <ArrowRight size={22} /></>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpVerify} className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Enter 6-Digit Code</label>
                         <input required maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value)} className="w-full py-6 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-center text-4xl font-black tracking-[0.5em] text-brand-dark" placeholder="000000" />
                      </div>
                      <button disabled={loading} className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-2xl">
                        {loading ? <Loader2 className="animate-spin" /> : <>Verify Identity <ArrowRight size={22} /></>}
                      </button>
                      <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-black uppercase text-brand-gold tracking-widest hover:underline">Change Mobile Identity</button>
                    </form>
                  )}
                </motion.div>
              )}

              {method === 'GOOGLE' && (
                <motion.div key="google" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 py-4">
                   <p className="text-center text-gray-400 font-serif italic text-lg leading-relaxed">Seamlessly link your verified Google Workspace profile to access the DishaHire network.</p>
                   <button onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-4 py-6 bg-white border-2 border-gray-100 rounded-3xl hover:bg-gray-50 transition-all font-black uppercase text-xs tracking-[0.2em] shadow-lg">
                     <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="G" />
                     {loading ? 'Synchronizing...' : 'Authorize via Google'}
                   </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-10 flex items-center gap-4 p-5 bg-red-50 text-red-600 rounded-[1.5rem] border border-red-100 text-xs font-bold">
                <AlertCircle size={22} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brand-gold transition-colors">Return to DishaHire Public Site</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
