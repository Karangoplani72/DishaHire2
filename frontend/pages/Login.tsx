
import React, { useState } from 'react';
// Fixed: Using any casting for RouterDOM exports to bypass environment-specific type errors
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
// Fixed: Using any casting for motion component to bypass property missing errors
import { motion, AnimatePresence } from 'framer-motion';
const MotionDiv = (motion as any).div;
import { Mail, Lock, User, ArrowRight, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = mode === 'LOGIN' 
      ? await loginUser(email, password)
      : await register(name, email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden p-10 sm:p-14">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-dark">Candidate Portal</h1>
          <p className="text-gray-400 text-sm mt-2 font-serif italic">Secure access to your career journey</p>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
          <button onClick={() => setMode('LOGIN')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'LOGIN' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}>Login</button>
          <button onClick={() => setMode('SIGNUP')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'SIGNUP' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'SIGNUP' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="Your Name" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="name@email.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="••••••••••••" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold animate-pulse">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button disabled={loading} className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <>{mode === 'LOGIN' ? 'Sign In' : 'Join Network'} <ArrowRight size={20} /></>}
          </button>
        </form>

        <button onClick={() => navigate('/')} className="w-full text-center mt-8 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark">Return to Corporate Hub</button>
      </MotionDiv>
    </div>
  );
};

export default Login;
