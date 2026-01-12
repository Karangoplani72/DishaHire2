
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../components/AuthContext.tsx';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await loginAdmin(password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Access denied.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 rounded-2xl bg-brand-gold/10 text-brand-gold mb-2">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-brand-dark">Admin Access</h2>
            <p className="text-gray-400 text-sm">Authorized personnel only. Sessions are logged.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  disabled
                  value="dishahire.0818@gmail.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:border-brand-gold focus:bg-white outline-none transition"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 animate-pulse">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold shadow-xl hover:bg-brand-accent transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Enter Admin Portal'}
            </button>
          </form>

          <button 
            onClick={() => navigate('/')}
            className="w-full text-center text-xs text-gray-400 hover:text-brand-dark transition uppercase font-bold tracking-widest"
          >
            Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
