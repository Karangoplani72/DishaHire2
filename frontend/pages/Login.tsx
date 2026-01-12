
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Phone, ShieldCheck, ArrowRight, Loader2, AlertCircle, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

type LoginMethod = 'GOOGLE' | 'EMAIL' | 'PHONE';

const Login: React.FC = () => {
  const [method, setMethod] = useState<LoginMethod>('EMAIL');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [name, setName] = useState('');
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
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('Invalid email or password combination.');
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
      setError('Failed to send verification code. Try again.');
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await verifyOTP(phoneNumber, otpCode, name);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('Invalid or expired verification code.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const ok = await loginGoogle();
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('Google identity sync cancelled or failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
      >
        {success ? (
          <div className="p-20 text-center space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} />
            </motion.div>
            <h2 className="text-3xl font-serif font-bold text-brand-dark">Access Granted</h2>
            <p className="text-gray-400 font-serif italic">Redirecting to Secure Gateway...</p>
          </div>
        ) : (
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10 space-y-3">
              <div className="inline-flex p-4 bg-brand-gold/10 text-brand-gold rounded-3xl mb-2">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-4xl font-serif font-bold text-brand-dark">Welcome Back</h1>
              <p className="text-gray-400 font-serif italic">Securely access your professional hub.</p>
            </div>

            <div className="flex bg-gray-50 p-1 rounded-2xl mb-8">
              {(['EMAIL', 'PHONE', 'GOOGLE'] as LoginMethod[]).map(m => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setError(''); setStep(1); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${method === m ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {method === 'EMAIL' && (
                <motion.form 
                  key="email"
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleEmailLogin} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button disabled={loading} className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl">
                    {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
                  </button>
                </motion.form>
              )}

              {method === 'PHONE' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {step === 1 ? (
                    <form onSubmit={handlePhoneRequest} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required 
                            type="tel" 
                            value={phoneNumber} 
                            onChange={e => setPhoneNumber(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium"
                            placeholder="+91 00000 00000"
                          />
                        </div>
                      </div>
                      <button disabled={loading} className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl">
                        {loading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ArrowRight size={20} /></>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpVerify} className="space-y-6">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            required 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">6-Digit Code</label>
                        <div className="relative text-center">
                          <input 
                            required 
                            maxLength={6}
                            value={otpCode} 
                            onChange={e => setOtpCode(e.target.value)}
                            className="w-full py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-center text-3xl font-black tracking-[0.5em]"
                            placeholder="000000"
                          />
                        </div>
                        <p className="text-[10px] text-center text-gray-400 font-bold mt-2">Check your device for the code.</p>
                      </div>
                      <button disabled={loading} className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl">
                        {loading ? <Loader2 className="animate-spin" /> : <>Verify & Complete <ArrowRight size={20} /></>}
                      </button>
                      <button type="button" onClick={() => setStep(1)} className="w-full text-[10px] font-black uppercase text-brand-gold tracking-widest hover:underline">Change Number</button>
                    </form>
                  )}
                </motion.div>
              )}

              {method === 'GOOGLE' && (
                <motion.div
                  key="google"
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-8 py-4"
                >
                   <p className="text-center text-gray-400 font-serif italic">Use your Google Workspace account for single-click access.</p>
                   <button 
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-4 py-5 bg-white border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-black uppercase text-xs tracking-widest"
                   >
                     <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                     {loading ? 'Processing Identity Sync...' : 'Continue with Google'}
                   </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors">Return to DishaHire Public Site</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
