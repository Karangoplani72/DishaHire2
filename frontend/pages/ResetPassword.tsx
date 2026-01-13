
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate, useSearchParams } = RouterDOM as any;
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionDiv = (motion as any).div;

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords mismatch');
    if (!token) return setError('Missing recovery token');
    
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        credentials: 'include', // Security requirement for state-changing operations
        body: JSON.stringify({ token, password })
      });
      if (res.ok) setDone(true);
      else {
        const data = await res.json();
        throw new Error(data.error || 'Reset failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-sm">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Invalid Session</h2>
        <p className="text-gray-400 mb-6">This recovery link is invalid or has expired.</p>
        <button onClick={() => navigate('/login')} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold">Return Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 sm:p-14 text-center">
        {!done ? (
          <>
            <h1 className="text-3xl font-serif font-bold text-brand-dark mb-4">Set New Key</h1>
            <p className="text-gray-400 text-sm mb-10">Establish a new professional access key for your account.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="••••••••••••" />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm New Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-brand-gold/30 outline-none transition-all font-medium text-brand-dark" placeholder="••••••••••••" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button disabled={loading} className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : 'Update Access Key'}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-6 py-10">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-dark">Account Secured</h2>
            <p className="text-gray-400 text-sm">Your access key has been successfully updated. You may now sign in.</p>
            <button onClick={() => navigate('/login')} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold mt-4">Sign In Now</button>
          </div>
        )}
      </MotionDiv>
    </div>
  );
};

export default ResetPassword;
