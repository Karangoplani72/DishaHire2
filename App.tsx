import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, Instagram, MessageCircle, Phone, ArrowRight, Lock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './frontend/pages/Home.tsx';
import About from './frontend/pages/About.tsx';
import Services from './frontend/pages/Services.tsx';
import Jobs from './frontend/pages/Jobs.tsx';
import Contact from './frontend/pages/Contact.tsx';
import AdminLogin from './frontend/pages/AdminLogin.tsx';
import AdminDashboard from './frontend/pages/AdminDashboard.tsx';
import { NAV_LINKS, CONTACT_INFO, INDUSTRIES } from './frontend/constants.tsx';

const MotionDiv = (motion as any).div;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/dashboard');

  if (isAdmin) return null;

  return (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            <img 
              src="/frontend/pages/logo.png" 
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
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-gold p-2 relative focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="md:hidden fixed inset-0 bg-brand-dark z-[100] flex flex-col pt-24 px-8 overflow-y-auto"
          >
             <div className="flex flex-col space-y-6 pt-8">
                {NAV_LINKS.map((link: any) => (
                  <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)} className="flex items-center justify-between py-4 border-b border-white/5 transition-all text-gray-200">
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
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;