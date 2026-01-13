
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }

      if (response.ok) {
        setDone(true);
      } else {
        throw new Error(data?.error || 'System unavailable. Please try later.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 sm:p-14 text-center">
        {!done ? (
          <>
            <h1 className="text-3xl font-serif font-bold text-brand-dark mb-4">Reset Access</h1>
            <p className="text-gray-400 text-sm mb-10">Enter your identity to receive a secure recovery link.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="name@email.com" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold animate-pulse">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button disabled={loading} className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : 'Send Recovery Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6 py-10">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">Request Transmitted</h2>
            <p className="text-gray-400 text-sm">If an account exists for <b>{email}</b>, a recovery link has been dispatched to your inbox.</p>
          </div>
        )}

        <button onClick={() => navigate('/login')} className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark transition-colors mx-auto">
          <ArrowLeft size={14} /> Back to Entry
        </button>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
