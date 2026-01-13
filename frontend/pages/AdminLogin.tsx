
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setLocalError('');
    
    try {
      // Explicit call to login with isAdmin flag
      await login({ email, password }, true);
      navigate('/admin');
    } catch (err: any) {
      setLocalError(err.message || 'Access denied. Verify your administrative keys.');
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-4xl p-10 sm:p-14 border border-white/10">
        <div className="text-center mb-10">
          <div className="inline-block p-5 bg-brand-gold/10 text-brand-gold rounded-full mb-4 shadow-inner">
            <ShieldCheck size={44} />
          </div>
          <h1 className="text-4xl font-serif font-bold text-brand-dark tracking-tight">Admin Terminal</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Authorized Entry Point Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Corporate Identifier</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required 
                type="email"
                name="email"
                autoComplete="email"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" 
                placeholder="admin@dishahire.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Administrative Key</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required 
                type="password" 
                name="password"
                autoComplete="current-password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" 
                placeholder="••••••••••••" 
              />
            </div>
          </div>

          {displayError && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[11px] font-bold animate-pulse">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading} 
            className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Request Access'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-gold transition-colors"
          >
            ← Disengage to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
