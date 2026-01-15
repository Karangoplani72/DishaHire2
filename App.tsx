
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, Instagram, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import { NAV_LINKS, CONTACT_INFO, INDUSTRIES } from './constants.tsx';

const MotionDiv = (motion as any).div;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-12 items-center">
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
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 p-2">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-accent border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-10 space-y-8">
              {NAV_LINKS.map((link: any) => (
                <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="block text-lg font-serif font-bold text-gray-200">
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
  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-serif italic">
              Empowering organizations by bridging the gap between exceptional talent and strategic vision.
            </p>
            <div className="flex space-x-4">
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 group">
                <Linkedin size={20} />
              </a>
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 group">
                <Instagram size={20} />
              </a>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 group">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10">Quick Navigation</h4>
            <ul className="space-y-5">
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

          <div>
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

          <div>
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10">Corporate Hub</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin size={20} className="text-brand-gold flex-shrink-0 mt-1" />
                <span className="text-gray-400 text-sm leading-relaxed">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={20} className="text-brand-gold flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={20} className="text-brand-gold flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-gray-400 hover:text-brand-gold text-sm transition-colors">{CONTACT_INFO.phone}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col space-y-8">
          <div className="flex justify-center items-center py-4 group">
            <div className="h-[1px] flex-grow bg-white/5" />
            <div className="px-6 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-1">Engineered for Excellence</p>
              <a href="https://karan-portfolio-self.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[11px] font-serif italic text-gray-400 hover:text-brand-gold transition-all duration-300 flex items-center justify-center gap-2 group">
                Website Handcrafted by <span className="font-bold text-gray-300 group-hover:text-brand-gold transition-colors not-italic">Karan Goplani</span>
                <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            </div>
            <div className="h-[1px] flex-grow bg-white/5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-brand-light">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
