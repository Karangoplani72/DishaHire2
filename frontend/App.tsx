
import React, { useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { HashRouter: Router, Routes, Route, Link, useLocation } = RouterDOM as any;
import { Menu, X, Mail, MapPin, Linkedin, ShieldCheck, Instagram, MessageCircle, ArrowLeft, LogOut, User as UserIcon } from 'lucide-react';
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
          <Link to="/" className="flex items-center">
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
              <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
            </div>
          </Link>

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

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-200 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
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
