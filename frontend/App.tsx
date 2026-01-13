
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, ShieldCheck, Instagram, MessageCircle, ArrowLeft, LogOut, User as UserIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import Login from './pages/Login.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import { NAV_LINKS, CONTACT_INFO } from './constants.tsx';
import { AuthProvider, useAuth } from './components/AuthContext.tsx';
import { AdminGuard, UserGuard } from './components/RouteGuards.tsx';

// Fixed: Using any casting for motion component to bypass property missing errors
const MotionDiv = (motion as any).div;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath && user?.role === 'admin') return null;

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link: any) => (
              <Link key={link.name} to={link.href} className="text-[10px] font-bold uppercase tracking-widest hover:text-brand-gold transition-colors">
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-white/10 mx-2" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-brand-gold flex items-center gap-2">
                  <UserIcon size={14}/> {user.name || 'Admin'}
                </span>
                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white hover:text-brand-gold">Sign In</Link>
                <Link to="/admin/login" className="text-[10px] font-black uppercase tracking-widest text-brand-gold border border-brand-gold/30 px-4 py-2 rounded-full hover:bg-brand-gold hover:text-brand-dark transition-all">Portal</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 p-2 focus:outline-none">
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-accent border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-10 space-y-8">
              <div className="flex flex-col space-y-4">
                {NAV_LINKS.map((link: any) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between text-lg font-serif font-bold text-gray-200 group"
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={18} className="text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-6">
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Welcome Back</p>
                        <p className="text-white font-serif font-bold">{user.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                    >
                      <LogOut size={16} /> Secure Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="bg-white/5 border border-white/10 text-white py-4 rounded-2xl text-center font-black uppercase tracking-widest text-[10px]"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setIsOpen(false)}
                      className="bg-brand-gold text-brand-dark py-4 rounded-2xl text-center font-black uppercase tracking-widest text-[10px]"
                    >
                      Admin Portal
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-center space-x-6">
                <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold">
                  <Linkedin size={20} />
                </a>
                <a href={CONTACT_INFO.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold">
                  <Instagram size={20} />
                </a>
                <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-gold">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          } />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
