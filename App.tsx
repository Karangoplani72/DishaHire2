import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, Instagram, MessageCircle, Phone, ArrowRight, Lock, ChevronRight, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './frontend/pages/Home.tsx';
import About from './frontend/pages/About.tsx';
import Services from './frontend/pages/Services.tsx';
import Jobs from './frontend/pages/Jobs.tsx';
import Contact from './frontend/pages/Contact.tsx';
import AdminLogin from './frontend/pages/AdminLogin.tsx';
import AdminDashboard from './frontend/pages/AdminDashboard.tsx';
import { NAV_LINKS, CONTACT_INFO, INDUSTRIES } from './frontend/constants.tsx';

const logoPath = "/logo.png";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <img 
              src={logoPath} 
              alt="DishaHire Logo" 
              className="h-12 sm:h-16 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </Link>

          <div className="hidden md:flex space-x-8 lg:space-x-12 items-center">
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
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-brand-gold p-2 z-[110] relative focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            key="mobile-menu-overlay"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 bg-brand-dark z-[100] flex flex-col pt-24 px-8 overflow-y-auto"
          >
             <div className="flex flex-col space-y-6 pt-8">
                {NAV_LINKS.map((link: any) => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-between py-4 border-b border-white/5 transition-all text-gray-200"
                  >
                    <span className="text-2xl font-serif font-bold">{link.name}</span>
                    <ChevronRight size={20} />
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
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/dashboard');
  if (isAdmin) return null;

  return (
    <footer className="bg-brand-dark text-white pt-20 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-20">
          <div className="space-y-8">
            <Link to="/" className="inline-block">
              <img 
                src={logoPath} 
                alt="DishaHire Logo" 
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-serif italic max-w-xs">
              Empowering organizations by bridging the gap between exceptional talent and strategic vision.
            </p>
            <div className="flex space-x-4 pt-4">
               <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all"><Linkedin size={18}/></a>
               <a href={CONTACT_INFO.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all"><Instagram size={18}/></a>
               <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all"><MessageCircle size={18}/></a>
            </div>
          </div>
          <div>
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-10">QUICK NAVIGATION</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}><Link to={link.href} className="text-gray-300 hover:text-brand-gold text-sm transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-10">Contact Hub</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-brand-gold shrink-0"/>
                <span className="text-gray-300 text-sm">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-brand-gold shrink-0"/>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-300 hover:text-brand-gold text-sm truncate">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-brand-gold shrink-0"/>
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-gray-300 hover:text-brand-gold text-sm">{CONTACT_INFO.phone}</a>
              </li>
            </ul>
          </div>
          <div>
             <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-10">Strategic Verticals</h4>
             <ul className="space-y-2">
                {INDUSTRIES.slice(0, 4).map(ind => (
                  <li key={ind} className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{ind}</li>
                ))}
             </ul>
          </div>
        </div>

        {/* Developer Attribution Section - Highlighted with link to Karan Goplani */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-center md:text-left">
              <p className="text-[10px] font-serif italic text-gray-500">© {new Date().getFullYear()} DishaHire Consulting. All Rights Reserved.</p>
           </div>
           <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl group transition-all hover:bg-white/10">
              <Code size={14} className="text-brand-gold" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Designed & Developed by <a href="https://karan-portfolio-self.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-bold hover:underline">Karan Goplani</a>
              </p>
           </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white">
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