
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, ShieldCheck, Instagram, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Career from './pages/Career.tsx';
import Terms from './pages/Terms.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { NAV_LINKS, CONTACT_INFO } from './constants.tsx';

const NotFound = () => (
  <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-9xl font-serif font-bold text-brand-gold mb-4">404</h1>
    <h2 className="text-3xl font-serif mb-8 tracking-wide">NOT FOUND</h2>
    <Link to="/" className="flex items-center gap-4 bg-white text-brand-dark px-10 py-5 rounded-full font-bold">
      <ArrowLeft size={20}/> Return to Corporate Hub
    </Link>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            {NAV_LINKS.map((link: any) => (
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
            <Link 
              to="/admin" 
              className="text-[10px] font-black uppercase tracking-widest text-brand-gold hover:text-white transition-colors flex items-center gap-2"
            >
              <ShieldCheck size={14} /> Admin Terminal
            </Link>
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
              {NAV_LINKS.map((link: any) => (
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
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-xl font-serif font-bold text-brand-gold">Admin Portal</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

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
            Architecting the bridge between world-class organizational ambitions and high-tier professional mastery.
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
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Enterprise Hub</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-brand-gold mt-1 flex-shrink-0" />
              <span>{CONTACT_INFO.address}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-brand-gold flex-shrink-0" />
              <span>{CONTACT_INFO.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-[10px] mb-8 uppercase tracking-[0.4em] text-brand-gold">Enterprise</h4>
          <Link 
            to="/admin" 
            className="inline-block bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">
          © {new Date().getFullYear()} DishaHire Consultancy
        </p>
      </div>
    </footer>
  );
};

const App = () => {
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
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
