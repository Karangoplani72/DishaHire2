
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';

const Login: React.FC = () => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', city: '', state: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register, error } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'LOGIN') {
        await login({ email: formData.email, password: formData.password }, false);
      } else {
        await register(formData);
      }
      navigate('/');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden p-10 sm:p-14">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-brand-dark">{mode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-gray-400 text-sm mt-2 font-serif italic">The premium professional network</p>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-2xl mb-8 border border-gray-100">
          <button onClick={() => setMode('LOGIN')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'LOGIN' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}>Login</button>
          <button onClick={() => setMode('REGISTER')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'REGISTER' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-400 hover:text-brand-dark'}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'REGISTER' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input required name="name" onChange={handleInput} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="Legal Name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input required name="phoneNumber" onChange={handleInput} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="+91" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input required name="city" onChange={handleInput} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="City" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">State</label>
                  <input required name="state" onChange={handleInput} className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="State" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              <input required type="email" name="email" onChange={handleInput} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="name@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input required type="password" name="password" onChange={handleInput} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="••••••" />
              </div>
            </div>
            {mode === 'REGISTER' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input required type="password" name="confirmPassword" onChange={handleInput} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all text-sm font-medium" placeholder="••••••" />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold animate-pulse">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button disabled={loading} className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50 mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <>{mode === 'LOGIN' ? 'Sign In' : 'Join Network'} <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
           {mode === 'LOGIN' && (
             <button onClick={() => navigate('/forgot-password')} className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:underline">Forgot Password?</button>
           )}
           <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors">Return Home</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
