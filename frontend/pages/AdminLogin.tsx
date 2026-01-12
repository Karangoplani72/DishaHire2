
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
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
    const success = await loginAdmin(password);
    if (success) navigate('/admin');
    else {
      setError('Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl w-full max-w-md space-y-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-block p-4 bg-brand-gold/10 text-brand-gold rounded-full mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input disabled value="dishahire.0818@gmail.com" className="w-full p-4 bg-gray-50 border rounded-xl text-gray-400" />
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 p-4 border rounded-xl outline-none" placeholder="Password" />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button disabled={loading} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold">
            {loading ? 'Logging in...' : 'Enter Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
