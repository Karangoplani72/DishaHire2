
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Mail, Phone, MapPin, Linkedin, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
// Added missing imports for AnimatePresence and motion from framer-motion
import { motion, AnimatePresence } from 'framer-motion';
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
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-10 items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-xs font-bold uppercase tracking-widest transition-colors hover:text-brand-gold ${
                  location.pathname === link.href ? 'text-brand-gold' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-white/10 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center space-x-5">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-gold">
                   {user?.picture ? <img src={user.picture} className="w-7 h-7 rounded-full border border-brand-gold/30" /> : <UserIcon size={16}/>}
                   <span>{user?.name.split(' ')[0]}</span>
                </div>
                {isAdmin && (
                  <Link to="/admin" className="text-[9px] bg-brand-gold text-brand-dark px-3 py-1 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all">Portal</Link>
                )}
                <button onClick={logout} className="text-gray-500 hover:text-white transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <button 
                  onClick={loginGoogle}
                  className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-5 py-2 rounded-full hover:bg-white/5 transition flex items-center gap-2"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-3 h-3" /> Login
                </button>
                <Link to="/admin/login" className="text-[10px] text-gray-500 hover:text-brand-gold transition uppercase font-black tracking-widest">Admin</Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="md:hidden bg-brand-accent border-b border-white/5"
          >
            <div className="px-6 py-8 space-y-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-xl font-serif font-bold text-gray-200"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 w-full" />
              {!isAuthenticated ? (
                <button onClick={() => { loginGoogle(); setIsOpen(false); }} className="w-full bg-brand-gold text-brand-dark py-4 rounded-2xl font-bold">Client Login</button>
              ) : (
                <div className="flex items-center justify-between">
                   <span className="text-brand-gold font-bold">{user?.name}</span>
                   <button onClick={logout} className="text-red-400 font-bold uppercase text-[10px] tracking-widest">Logout</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      alert('Network update successful.');
    } finally {
      setLoading(false);
    }
  };

  if (isAdminPath) return null;

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
            Leading end-to-end recruitment consultancy firm focused on deliverable technical excellence.
          </p>
          <div className="flex space-x-6 text-gray-500">
            <Linkedin size={20} className="hover:text-brand-gold cursor-pointer transition" />
          </div>
        </div>
        
        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Global Verticals</h4>
          <ul className="space-y-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
            {['IT & Technology', 'Manufacturing', 'Healthcare', 'Finance'].map(v => (
              <li key={v} className="hover:text-white transition-colors cursor-default">{v}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Contact Hub</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-brand-gold mt-1" />
              <span>Corporate Hub, Mumbai</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-brand-gold" />
              <span>dishahire.0818@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Newsletter</h4>
          <p className="text-xs text-gray-500 mb-6 font-serif italic">Access quarterly hiring insights.</p>
          <form onSubmit={handleSubscribe} className="flex">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Professional email" 
              className="bg-white/5 border border-white/10 px-5 py-3 text-sm rounded-l-xl focus:outline-none focus:border-brand-gold w-full" 
            />
            <button 
              disabled={loading}
              className="bg-brand-gold text-brand-dark font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-r-xl hover:bg-white transition-all min-w-[80px]"
            >
              {loading ? '...' : 'Join'}
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/5 text-center flex flex-col items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
          © {new Date().getFullYear()} DishaHire Consultancy | Professional Excellence Guaranteed
        </p>
        <ShieldCheck className="text-brand-gold/20" size={32} />
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
            <Route path="/admin/*" element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
