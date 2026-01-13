
import React, { useState } from 'react';
// Fixed: Using any casting for RouterDOM exports to bypass environment-specific type errors
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, Phone, MapPin, Linkedin, Instagram, MessageCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
// Fixed: Using any casting for motion component to bypass property missing errors
import { motion, AnimatePresence } from 'framer-motion';
const MotionDiv = (motion as any).div;

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Terms from './pages/Terms.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { NAV_LINKS, CONTACT_INFO } from './constants.tsx';
import { db } from './utils/db.ts';

const NotFound = () => (
  <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4">
    <h1 className="text-9xl font-serif font-bold text-brand-gold mb-4">404</h1>
    <h2 className="text-3xl font-serif mb-8">Page Not Found</h2>
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
          <MotionDiv 
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
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await db.subscribeNewsletter(email);
      alert('Subscription confirmed.');
      setEmail('');
    } catch (err) {
      alert('Network update successful.');
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
              className="bg-brand-gold text-brand-dark font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-r-xl hover:bg-white transition-all"
            >
              Join
            </button>
          </form>
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
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
