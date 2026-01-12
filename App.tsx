
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, Mail, Phone, MapPin, Instagram, Linkedin, Facebook, ShieldCheck } from 'lucide-react';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Terms from './pages/Terms.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import { NAV_LINKS, BRAND_COLORS } from './constants.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

          {/* Desktop Nav */}
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
            <Link to="/admin" className="text-xs border border-white/20 px-3 py-1 rounded hover:bg-white/10 transition">Admin Portal</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-brand-accent animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium border-b border-white/5 last:border-0"
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
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath) return null;

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold tracking-widest">DISHA<span className="text-brand-gold">HIRE</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Leading end-to-end recruitment consultancy firm focused on delivering technical excellence and cultural alignment.
          </p>
          <div className="flex space-x-4">
            <Facebook size={20} className="text-gray-400 hover:text-brand-gold cursor-pointer transition" />
            <Linkedin size={20} className="text-gray-400 hover:text-brand-gold cursor-pointer transition" />
            <Instagram size={20} className="text-gray-400 hover:text-brand-gold cursor-pointer transition" />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-brand-gold">Quick Links</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            {NAV_LINKS.map(link => (
              <li key={link.name}>
                <Link to={link.href} className="hover:text-white transition-colors">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-brand-gold">Our Offices</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start space-x-3">
              <MapPin size={16} className="text-brand-gold flex-shrink-0 mt-1" />
              <span>Corporate Hub, Business District<br/>Mumbai, Maharashtra, India</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={16} className="text-brand-gold" />
              <span>+91 90000 00000</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={16} className="text-brand-gold" />
              <span>contact@dishahire.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-brand-gold">Newsletter</h4>
          <p className="text-xs text-gray-400 mb-4">Subscribe for quarterly hiring insights and recruitment trends.</p>
          <div className="flex">
            <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 px-4 py-2 text-sm rounded-l focus:outline-none focus:border-brand-gold w-full" />
            <button className="bg-brand-gold text-brand-dark font-bold px-4 py-2 rounded-r hover:bg-yellow-500 transition">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} DishaHire Consultancy. All rights reserved. | <ShieldCheck className="inline-block w-3 h-3 ml-1"/> Professional Excellence Guaranteed.
      </div>
    </footer>
  );
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
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
