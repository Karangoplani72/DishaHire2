
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login('dishahire.0818@gmail.com', password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Access denied for this identity.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="bg-white p-10 sm:p-14 rounded-[3rem] w-full max-w-md space-y-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-block p-4 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark">Admin Hub</h2>
          <p className="text-gray-400 text-sm mt-2 font-serif italic">Verified personnel only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Verified Identity</label>
             <input disabled value="dishahire.0818@gmail.com" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 font-bold text-sm" />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Master Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 p-4 border border-gray-100 rounded-xl outline-none focus:border-brand-gold focus:ring-4 ring-brand-gold/5 transition-all" placeholder="Password" />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          
          <button disabled={loading} className="w-full bg-brand-dark text-white py-5 rounded-xl font-bold shadow-xl hover:shadow-brand-gold/20 transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
          </button>
        </form>
        
        <div className="text-center">
           <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark">Return to Site</button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
