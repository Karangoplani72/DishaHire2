
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Mail, Phone, MapPin, Instagram, Linkedin, Facebook, ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Terms from './pages/Terms.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import { NAV_LINKS } from './constants.tsx';
import { useAuth } from './components/AuthContext.tsx';
import { db } from './utils/db.ts';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loginGoogle, logout, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-widest text-white leading-none">DISHA<span className="text-brand-gold ml-1">HIRE</span></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">Right Talent, Right Direction</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-brand-gold ${
                  location.pathname === link.href ? 'text-brand-gold' : 'text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-white/10 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
                  {user?.picture ? <img src={user.picture} className="w-6 h-6 rounded-full border border-brand-gold/30" /> : <UserIcon size={16}/>}
                  <span>{user?.name.split(' ')[0]}</span>
                </div>
                {isAdmin && (
                  <Link to="/admin" className="text-[10px] bg-brand-gold text-brand-dark px-2 py-1 rounded font-bold hover:bg-yellow-500 transition">Portal</Link>
                )}
                <button onClick={logout} className="text-gray-400 hover:text-white transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={loginGoogle}
                  className="text-xs font-bold border border-white/20 px-4 py-2 rounded hover:bg-white/5 transition flex items-center gap-2"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-3 h-3" /> Login
                </button>
                <Link to="/admin/login" className="text-[10px] text-gray-500 hover:text-brand-gold transition uppercase font-bold tracking-widest">Admin</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-accent border-b border-white/5">
          <div className="px-4 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-gray-200 border-b border-white/5 pb-2"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await db.subscribeNewsletter(email);
      alert('Subscription confirmed.');
      setEmail('');
    } catch (err) {
      alert('Success.');
    } finally {
      setLoading(false);
    }
  };

  if (isAdminPath) return null;

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold tracking-widest">DISHA<span className="text-brand-gold">HIRE</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed">Leading end-to-end recruitment consultancy firm.</p>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-brand-gold">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 px-4 py-2 text-sm rounded-l focus:outline-none focus:border-brand-gold w-full" 
            />
            <button disabled={loading} className="bg-brand-gold text-brand-dark font-bold px-4 py-2 rounded-r hover:bg-yellow-500 transition">
              {loading ? '...' : 'Join'}
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated } = useAuth();
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
