
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { ShieldAlert, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin, adminEmail, isChecking } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAdmin(password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Authorization Denied');
      setLoading(false);
    }
  };

  if (isChecking) return null;

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 selection:bg-brand-gold/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] overflow-hidden shadow-4xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
        
        <div className="p-10 sm:p-14 space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex p-5 rounded-[2rem] bg-brand-gold/10 text-brand-gold mb-2">
              <ShieldAlert size={48} />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-serif font-bold text-brand-dark tracking-tight">Enterprise Access</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Personnel Terminal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Administrative Identity</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  readOnly
                  value={adminEmail || 'Fetching Identity...'}
                  className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-bold text-sm cursor-not-allowed select-none focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Master Security Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:border-brand-gold focus:bg-white outline-none transition-all font-medium text-brand-dark shadow-inner"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 p-5 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100"
              >
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-brand-accent transition-all flex items-center justify-center gap-4 group disabled:opacity-50 transform active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Establish Secure Session <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="text-center pt-4">
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors border-b border-transparent hover:border-brand-dark"
            >
              Return to Public Portal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
