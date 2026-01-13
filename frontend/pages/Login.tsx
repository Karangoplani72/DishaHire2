
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
const MotionDiv = (motion as any).div;
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

type AuthMode = 'LOGIN' | 'SIGNUP';

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Destructure 'register' instead of 'signup' to match AuthContext
  const { login, register, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setLocalError('');
    
    try {
      if (mode === 'LOGIN') {
        // Correct signature: login({ email, password }, isAdmin: false)
        await login({ email, password }, false);
      } else {
        // Correct signature: register(userData)
        await register({ name, email, password, confirmPassword: password });
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (err: any) {
      setLocalError(err.message || 'Identity verification failed.');
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {success ? (
            <MotionDiv 
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-brand-gold text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-brand-dark">Access Granted</h2>
              <p className="text-gray-400 font-serif italic">Redirecting to professional network...</p>
            </MotionDiv>
          ) : (
            <MotionDiv 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 sm:p-14"
            >
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl font-serif font-bold text-brand-dark">Client Portal</h1>
                <p className="text-gray-400 text-sm mt-2 font-serif italic">Strategic Entry Point</p>
              </div>

              <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
                <button
                  type="button"
                  onClick={() => { setMode('LOGIN'); setLocalError(''); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'LOGIN' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('SIGNUP'); setLocalError(''); }}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'SIGNUP' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {mode === 'SIGNUP' && (
                    <MotionDiv 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-1"
                    >
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Legal Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="John Doe" />
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="name@company.com" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Access Key</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="••••••••••••" />
                  </div>
                </div>

                {displayError && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold animate-pulse">
                    <AlertCircle size={18} />
                    <span>{displayError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading} 
                  className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>{mode === 'LOGIN' ? 'Secure Login' : 'Join Network'} <ArrowRight size={20} /></>}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <button 
                  type="button"
                  onClick={() => navigate('/')} 
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors"
                >
                  Return to Homepage
                </button>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
