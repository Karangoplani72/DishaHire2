import React, { useState, useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, Instagram, MessageCircle, Phone, ArrowLeft, ArrowRight, Lock, ChevronRight, ShieldAlert, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Contact from './pages/Contact.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { NAV_LINKS, CONTACT_INFO, INDUSTRIES } from './constants.tsx';

const logoPath = "/logo.png";

const MotionDiv = (motion as any).div;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Premium Error Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <MotionDiv 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 space-y-8"
      >
        <div className="inline-flex p-6 rounded-[2.5rem] bg-brand-gold/10 border border-brand-gold/20 text-brand-gold mb-4">
          <ShieldAlert size={64} />
        </div>
        <h1 className="text-7xl sm:text-9xl font-serif font-bold text-white leading-none">404</h1>
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-brand-gold italic">Mandate Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-lg font-serif italic">
            The professional path you are seeking has been moved or does not exist in our current registry.
          </p>
        </div>
        <div className="pt-8">
          <Link to="/" className="inline-flex items-center gap-3 px-10 py-5 bg-brand-gold text-brand-dark rounded-full font-bold uppercase tracking-widest text-sm hover:bg-yellow-500 transition-all shadow-2xl">
            <ArrowLeft size={18} /> Return to Headquarters
          </Link>
        </div>
      </MotionDiv>
    </div>
  );
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

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav className="bg-brand-dark text-white sticky top-0 z-[60] shadow-xl border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            <Link to="/" className="flex items-center relative z-[110]">
              <img 
                src={logoPath} 
                alt="DishaHire Logo" 
                className="h-10 sm:h-16 w-auto object-contain hover:opacity-90 transition-opacity"
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
              <Link to="/admin/login" className="text-gray-500 hover:text-brand-gold transition-colors ml-4">
                <Lock size={16} />
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-brand-gold p-2 z-[110] relative focus:outline-none touch-manipulation"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            key="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-brand-dark z-[100] flex flex-col pt-24 px-8 overflow-y-auto mobile-menu-container"
          >
             <div className="flex flex-col space-y-6 pt-8">
                {NAV_LINKS.map((link: any) => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    className={`flex items-center justify-between py-5 border-b border-white/10 transition-all ${
                      location.pathname === link.href ? 'text-brand-gold' : 'text-gray-200'
                    }`}
                  >
                    <span className="text-3xl font-serif font-bold">{link.name}</span>
                    <ChevronRight size={24} className={location.pathname === link.href ? 'opacity-100' : 'opacity-20'} />
                  </Link>
                ))}
                <div className="pt-12 mt-auto pb-12">
                   <Link to="/admin/login" className="flex items-center gap-3 text-gray-500 text-sm font-black uppercase tracking-[0.3em]">
                      <Lock size={14} /> Personnel Access
                   </Link>
                </div>
             </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/dashboard');
  
  const isHideFooter = isAdmin || location.pathname === '/admin/login';
  
  const validPaths = [...NAV_LINKS.map(l => l.href), '/admin/login', '/admin/dashboard'];
  const isNotFound = !validPaths.includes(location.pathname);

  if (isHideFooter || isNotFound) return null;

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
            <div className="flex space-x-4">
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <Linkedin size={18} />
              </a>
              <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <Instagram size={18} />
              </a>
              <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-dark transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div className="lg:pl-8">
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-10">QUICK NAVIGATION</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-300 hover:text-brand-gold text-sm font-medium transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-10">Industries We Serve</h4>
            <div className="space-y-4">
              {INDUSTRIES.slice(0, 6).map(industry => (
                <div key={industry} className="text-gray-300 text-sm font-medium flex items-center hover:text-brand-gold transition-colors cursor-default">
                  <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-4 flex-shrink-0" />
                  <span className="truncate">{industry}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-brand-gold text-[10px] font-black uppercase tracking-[0.3em] mb-10">CORPORATE HUB</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <MapPin size={20} className="text-brand-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail size={20} className="text-brand-gold flex-shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-300 hover:text-brand-gold text-sm transition-colors">{CONTACT_INFO.email}</a>
              </li>
              <li className="flex items-center space-x-4">
                <Phone size={20} className="text-brand-gold flex-shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-gray-300 hover:text-brand-gold text-sm transition-colors">{CONTACT_INFO.phone}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-600 mb-2">ENGINEERED FOR EXCELLENCE</p>
              <p className="text-[10px] font-serif italic text-gray-400">© {new Date().getFullYear()} DishaHire Consultancy. All rights reserved.</p>
            </div>
            
            {/* Highlighted Developer Attribution */}
            <div className="flex items-center gap-3 px-6 py-3 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl group transition-all hover:bg-brand-gold/10 hover:border-brand-gold/40 shadow-[0_0_20px_rgba(176,141,62,0.05)]">
              <Code size={14} className="text-brand-gold" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Designed & Developed by <a 
                  href="https://karan-portfolio-self.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-gold font-bold hover:text-white transition-all underline decoration-brand-gold/30 underline-offset-4"
                >
                  Karan Goplani
                </a>
              </p>
            </div>
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
      <div className="min-h-screen flex flex-col bg-white overflow-x-hidden relative w-full max-w-full">
        <Navbar />
        <main className="flex-grow w-full relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;