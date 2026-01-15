
import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, Instagram, MessageCircle, Phone, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Contact from './pages/Contact.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { NAV_LINKS, CONTACT_INFO, INDUSTRIES } from './constants.tsx';

const MotionDiv = (motion as any).div;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/dashboard');

  if (isAdmin) return null;

  return (
    <nav className="bg-brand-dark md:bg-brand-dark/95 text-white sticky top-0 z-50 shadow-xl border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-10 lg:space-x-12 items-center">
            {NAV_LINKS.map((link: any) => (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
                  location.pathname === link.href ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/admin/login" className="text-gray-500 hover:text-brand-gold transition-colors">
              <Lock size={16} />
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 p-2 focus:outline-none">
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
            className="md:hidden bg-brand-dark/95 backdrop-blur-2xl border-t border-white/5 fixed inset-x-0 top-20 bottom-0 z-50 overflow-hidden"
          >
            <div className="px-6 py-12 space-y-8 flex flex-col items-center justify-center h-full text-center">
              {NAV_LINKS.map((link: any) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className={`text-2xl font-serif font-bold ${location.pathname === link.href ? 'text-brand-gold' : 'text-gray-200'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-8 border-t border-white/10 w-full flex flex-col items-center">
                <Link to="/admin/login" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand-gold transition-colors">
                  Personnel Portal
                </Link>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/dashboard');

  if (isAdmin) return null;

  return (
    <footer className="bg-brand-dark text-white pt-16 sm:pt-24 pb-8 sm:pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16 sm:mb-20">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
              Empowering organizations by bridging the gap between exceptional talent and strategic vision.
            </p>
            <div className="flex space-x-4">
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all duration-300">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div className="hidden sm:block">
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8 sm:mb-10">Navigation</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-brand-gold text-sm font-medium flex items-center group transition-colors">
                    <ArrowRight size={14} className="mr-3 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden lg:block">
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10">Elite Verticals</h4>
            <ul className="space-y-5">
              {INDUSTRIES.slice(0, 5).map(industry => (
                <li key={industry} className="text-gray-400 text-sm font-medium flex items-center">
                  <div className="w-1 h-1 bg-brand-gold rounded-full mr-3" />
                  {industry}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 sm:space-y-10">
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 sm:mb-10">Corporate Hub</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin size={20} className="text-brand-gold flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={20} className="text-brand-gold flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-400 hover:text-brand-gold text-sm transition-colors truncate">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={20} className="text-brand-gold flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{CONTACT_INFO.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 sm:pt-12 border-t border-white/5 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-2">Engineered for Excellence</p>
          <a href="https://karan-portfolio-self.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-[11px] font-serif italic text-gray-400 hover:text-brand-gold transition-all duration-300">
            Website Handcrafted by <span className="font-bold text-gray-300 not-italic">Karan Goplani</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-brand-light">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
