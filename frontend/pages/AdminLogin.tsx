
import React, { useState } from 'react';
// Fixed: Using any casting for RouterDOM exports to bypass environment-specific type errors
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { ShieldCheck, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await loginAdmin(password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Access Denied: Master Key Invalid');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="bg-white p-12 sm:p-16 rounded-[4rem] w-full max-w-md space-y-10 shadow-4xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
        
        <div className="text-center">
          <div className="inline-block p-5 bg-brand-gold/10 text-brand-gold rounded-full mb-6">
            <ShieldCheck size={48} />
          </div>
          <h2 className="text-4xl font-serif font-bold text-brand-dark tracking-tight">Admin Terminal</h2>
          <p className="text-gray-400 text-sm mt-3 font-serif italic">Restricted Enterprise Access</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Target Identity</label>
             <input disabled value="dishahire.0818@gmail.com" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-300 font-bold text-sm cursor-not-allowed" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Master Security Key</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required 
                autoFocus
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full pl-14 pr-5 py-5 border-2 border-gray-100 rounded-2xl outline-none focus:border-brand-gold transition-all font-medium text-brand-dark" 
                placeholder="Enter Access Code" 
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-start gap-3 p-5 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 shadow-inner">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            disabled={loading} 
            className="w-full bg-brand-dark text-white py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-brand-accent transition-all flex items-center justify-center gap-4 disabled:opacity-50 transform active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Authorize Access <ArrowRight size={20}/></>}
          </button>
        </form>
        
        <div className="text-center">
           <button onClick={() => navigate('/')} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors underline underline-offset-8">Return to Public Portal</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
