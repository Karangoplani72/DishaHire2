
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, Mail, Phone, MapPin, Linkedin, LogOut, User as UserIcon, ShieldCheck, Instagram, MessageCircle, Briefcase, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Career from './pages/Career.tsx';
import Terms from './pages/Terms.tsx';
import MyApplications from './pages/MyApplications.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import Login from './pages/Login.tsx';
import { NAV_LINKS, CONTACT_INFO } from './constants.tsx';
import { useAuth } from './components/AuthContext.tsx';

const NotFound = () => (
  <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4">
    <h1 className="text-9xl font-serif font-bold text-brand-gold mb-4">404</h1>
    <h2 className="text-3xl font-serif mb-8">Page Not Found</h2>
    <p className="text-gray-400 mb-12 text-center max-w-md italic">The requested professional resource is either unavailable or has been relocated within our enterprise network.</p>
    <Link to="/" className="flex items-center gap-4 bg-white text-brand-dark px-10 py-5 rounded-full font-bold">
      <ArrowLeft size={20}/> Return to Corporate Hub
    </Link>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
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
                <Link 
                  to="/my-applications" 
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${location.pathname === '/my-applications' ? 'text-brand-gold' : 'text-gray-400 hover:text-white'}`}
                >
                  <Briefcase size={14} /> Tracking
                </Link>
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-brand-gold">
                   <UserIcon size={16}/>
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
                <Link 
                  to="/login"
                  className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-5 py-2 rounded-full hover:bg-white/5 transition flex items-center gap-2"
                >
                  <ShieldCheck size={14} /> Secure Access
                </Link>
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
              {isAuthenticated && (
                <Link
                  to="/my-applications"
                  onClick={() => setIsOpen(false)}
                  className="block text-xl font-serif font-bold text-brand-gold"
                >
                  My Applications
                </Link>
              )}
              <div className="h-px bg-white/5 w-full" />
              {!isAuthenticated ? (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-brand-gold text-brand-dark py-4 rounded-2xl font-bold">Client Login</Link>
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
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/login';

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
          <div className="flex space-x-5">
            <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
              <Linkedin size={18} />
            </a>
            <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
              <Instagram size={18} />
            </a>
            <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Direct Verticals</h4>
          <ul className="space-y-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
            {['IT & Technology', 'Manufacturing', 'Healthcare', 'BPO Support'].map(v => (
              <li key={v} className="hover:text-white transition-colors cursor-default">{v}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Connect</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-brand-gold mt-1 flex-shrink-0" />
              <span>{CONTACT_INFO.address}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-brand-gold flex-shrink-0" />
              <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors truncate">{CONTACT_INFO.email}</a>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={16} className="text-brand-gold flex-shrink-0" />
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">{CONTACT_INFO.phone}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Compliance</h4>
          <p className="text-xs text-gray-500 mb-6 font-serif italic">Dedicated to ethical recruitment and long-term partnerships.</p>
          <div className="flex flex-col gap-2">
             <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors">Commercial Terms</Link>
             <Link to="/about" className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors">Corporate Philosophy</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/5 text-center flex flex-col items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
          © {new Date().getFullYear()} DishaHire Consultancy | Excellence Guaranteed
        </p>
        <ShieldCheck className="text-brand-gold/20" size={32} />
      </div>
    </footer>
  );
};

const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isAuthenticated, isChecking } = useAuth();
  if (isChecking) return null; 
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { isChecking } = useAuth();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-serif font-bold tracking-widest leading-none text-white">DISHA<span className="text-brand-gold">HIRE</span></span>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-500 font-black mt-2">Security Hub</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-brand-gold animate-spin" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Verifying Secure Link...</p>
        </div>
      </div>
    );
  }

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
            <Route path="/career" element={<Career />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
