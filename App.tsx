
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, LogOut, ShieldCheck, Briefcase, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Services from './pages/Services.tsx';
import Jobs from './pages/Jobs.tsx';
import Career from './pages/Career.tsx';
import Terms from './pages/Terms.tsx';
import MyApplications from './pages/MyApplications.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import Login from './pages/Login.tsx';
import { NAV_LINKS } from './constants.tsx';
import { useAuth } from './components/AuthContext.tsx';

const NotFound = () => (
  <div className="min-h-screen bg-brand-dark text-white flex flex-col items-center justify-center p-4">
    <h1 className="text-9xl font-serif font-bold text-brand-gold mb-4">404</h1>
    <h2 className="text-3xl font-serif mb-8">Page Not Found</h2>
    <p className="text-gray-400 mb-12 text-center max-w-md italic">The requested professional resource is either unavailable or has been relocated within our enterprise network.</p>
    <Link to="/" className="flex items-center gap-4 bg-white text-brand-dark px-10 py-5 rounded-full font-bold">
      <ArrowLeft size={20}/> Return to Corporate Hub
    </Link>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath) return null;

  return (
    <nav className="bg-brand-dark text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-24 flex justify-between items-center">
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-serif font-bold tracking-widest leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Right Talent, Right Direction</span>
        </Link>
        <div className="hidden md:flex space-x-8 items-center">
          {NAV_LINKS.map(link => (
            <Link key={link.name} to={link.href} className={`text-[10px] font-black uppercase tracking-widest ${location.pathname === link.href ? 'text-brand-gold' : 'text-gray-300 hover:text-white'}`}>{link.name}</Link>
          ))}
          {isAuthenticated ? (
            <button onClick={logout} className="text-gray-400 hover:text-white"><LogOut size={18}/></button>
          ) : (
            <Link to="/login" className="text-[10px] font-black uppercase tracking-widest bg-brand-gold text-brand-dark px-4 py-2 rounded-full">Secure Access</Link>
          )}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden"><Menu/></button>
      </div>
    </nav>
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
            <Route path="/career" element={<Career />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={ <AdminDashboard /> } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
