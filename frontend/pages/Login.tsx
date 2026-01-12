
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

type AuthMode = 'LOGIN' | 'SIGNUP';

const Login: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { loginEmail, signupEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let ok = false;
    if (mode === 'LOGIN') {
      ok = await loginEmail(email, password);
    } else {
      ok = await signupEmail(name, email, password);
    }

    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } else {
      setError(mode === 'LOGIN' ? 'Invalid credentials provided.' : 'Account creation failed. Identity may already exist.');
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

            {/* Toggle Tabs */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-10 border border-gray-100">
              <button
                onClick={() => { setMode('LOGIN'); setError(''); }}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${mode === 'LOGIN' ? 'bg-brand-dark text-white shadow-xl' : 'text-gray-400 hover:text-brand-dark'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('SIGNUP'); setError(''); }}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${mode === 'SIGNUP' ? 'bg-brand-dark text-white shadow-xl' : 'text-gray-400 hover:text-brand-dark'}`}
              >
                Create Account
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form 
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                {mode === 'SIGNUP' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-16 pr-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="Legal Name" />
                    </div>
                  </div>
                )}
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

                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 p-5 bg-red-50 text-red-600 rounded-[1.5rem] border border-red-100 text-xs font-bold">
                    <AlertCircle size={22} className="flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button disabled={loading} className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-2xl disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : <>{mode === 'LOGIN' ? 'Enter Hub' : 'Join Network'} <ArrowRight size={22} /></>}
                </button>
              </motion.form>
            </AnimatePresence>

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
