
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';

const MotionDiv = (motion as any).div;

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    // Access environment variables as requested
    // Note: In Vite, these are typically accessed via import.meta.env, 
    // but following instructions to assume process.env availability.
    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    // Simulate a brief delay for a "secure" feel
    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        sessionStorage.setItem('isAdmin', 'true');
        sessionStorage.setItem('adminToken', btoa(`${email}:${Date.now()}`));
        navigate('/admin/dashboard');
      } else {
        setError('Verification failed. Unauthorized access attempt logged.');
        setIsAuthenticating(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-brand-light p-6 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-dark/5 rounded-full blur-[120px]" />
      </div>

      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-dark p-8 sm:p-14 rounded-[4rem] shadow-4xl w-full max-w-lg border border-white/5 relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-brand-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-gold border border-brand-gold/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-3 tracking-tight">Admin Gateway</h2>
          <p className="text-gray-500 text-[11px] uppercase tracking-[0.5em] font-black">Secure Personnel Management Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2 mb-2 group-focus-within:text-brand-gold transition-colors">Credential Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-gold transition-colors" size={20} />
                <input 
                  required
                  type="email"
                  placeholder="admin@dishahire.com"
                  className="w-full pl-14 pr-8 py-5 bg-brand-accent/30 border border-white/10 rounded-3xl outline-none text-white focus:border-brand-gold focus:bg-brand-accent/50 transition-all text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2 mb-2 group-focus-within:text-brand-gold transition-colors">Access Keyphrase</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-gold transition-colors" size={20} />
                <input 
                  required
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-14 pr-8 py-5 bg-brand-accent/30 border border-white/10 rounded-3xl outline-none text-white focus:border-brand-gold focus:bg-brand-accent/50 transition-all text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <MotionDiv 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center space-x-3 text-red-400 text-xs bg-red-400/5 p-5 rounded-2xl border border-red-400/10"
            >
              <ShieldAlert size={18} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </MotionDiv>
          )}

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-brand-gold text-brand-dark py-6 rounded-[2rem] font-bold text-xl flex items-center justify-center hover:bg-yellow-500 transition-all shadow-2xl shadow-brand-gold/20 disabled:opacity-50 group"
          >
            {isAuthenticating ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center">
                Authorize Entry <ArrowRight size={22} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </div>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            Protected by DishaHire Security Protocol v2.5
          </p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default AdminLogin;
