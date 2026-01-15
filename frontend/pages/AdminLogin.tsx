
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    try {
      // Use the absolute URL from constants
      const apiUrl = `${API_BASE_URL}/api/auth/login`;
      console.log('Attempting login at:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Cannot reach security server. Verify backend URL in constants.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-brand-light p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-brand-gold/5 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-brand-dark/5 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-dark p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[4rem] shadow-4xl w-full max-w-lg border border-white/5 relative z-10"
      >
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-brand-gold/10 rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 text-brand-gold border border-brand-gold/20 transform rotate-3">
            <ShieldCheck size={40} className="sm:size-[48px]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3 tracking-tight">Admin Gateway</h2>
          <p className="text-gray-500 text-[9px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] font-black">Personnel Management Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="group">
              <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2 mb-2">Credential Identifier</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="Corporate Email"
                  className="w-full pl-12 sm:pl-14 pr-6 sm:pr-8 py-4 sm:py-5 bg-brand-accent/30 border border-white/10 rounded-[1.5rem] sm:rounded-3xl outline-none text-white focus:border-brand-gold transition-all text-base sm:text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[9px] font-black uppercase tracking-widest text-gray-500 ml-2 mb-2">Access Keyphrase</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  required
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-12 sm:pl-14 pr-6 sm:pr-8 py-4 sm:py-5 bg-brand-accent/30 border border-white/10 rounded-[1.5rem] sm:rounded-3xl outline-none text-white focus:border-brand-gold transition-all text-base sm:text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3 text-red-400 text-[11px] bg-red-400/5 p-4 rounded-xl border border-red-400/10">
              <ShieldAlert size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </MotionDiv>
          )}

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-brand-gold text-brand-dark py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center hover:bg-yellow-500 transition-all shadow-2xl disabled:opacity-50"
          >
            {isAuthenticating ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              <div className="flex items-center">
                Authorize Entry <ArrowRight size={20} className="ml-2 sm:ml-3" />
              </div>
            )}
          </button>
        </form>
      </MotionDiv>
    </div>
  );
};

export default AdminLogin;
