
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, MessageSquare, 
  Database, Loader2, ShieldAlert, Menu, X, LogOut
} from 'lucide-react';
import { db } from '../utils/db.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/AuthContext.tsx';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;

// Fixed: Using any casting for motion component to bypass property missing errors
const MotionDiv = (motion as any).div;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs'>('overview');
  const [data, setData] = useState({ enquiries: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const refresh = async () => {
    setLoading(true);
    try {
      const [e, j] = await Promise.all([
        db.getEnquiries(), db.getJobs()
      ]);
      setData({ enquiries: e || [], jobs: j || [] });
    } catch (err) {
      console.error("Dashboard synchronization failure");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    refresh(); 
  }, []);

  const menuItems = [
    { id: 'overview', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
    { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Inquiries' },
    { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Jobs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-brand-dark text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex flex-col">
          <span className="text-lg font-serif font-bold tracking-tight">DISHA<span className="text-brand-gold">ADMIN</span></span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-300 hover:text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={`
        w-80 bg-brand-dark text-white fixed lg:sticky inset-y-0 left-0 z-50 
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        transition-transform duration-300 ease-in-out flex flex-col shadow-4xl
      `}>
        <div className="p-10 border-b border-white/10 font-serif font-bold text-2xl tracking-tighter hidden lg:block">
          DISHA<span className="text-brand-gold">ADMIN</span>
        </div>
        
        <nav className="flex-grow py-8 space-y-1">
          {menuItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }} 
              className={`w-full flex items-center space-x-4 px-10 py-5 transition-all ${activeTab === item.id ? 'bg-brand-gold/10 text-brand-gold border-r-4 border-brand-gold' : 'text-gray-400 hover:text-white'}`}
            >
              {item.icon} <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all text-xs font-black uppercase tracking-widest text-gray-400"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-6">
          <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-brand-dark capitalize tracking-tight">{activeTab}</h1>
            <p className="text-gray-400 text-[10px] lg:text-xs mt-1 lg:mt-2 uppercase tracking-widest font-bold">Public Management Console</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={refresh} 
              disabled={loading}
              className="flex-1 sm:flex-none p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex justify-center items-center"
            >
              <Database size={20} className={`${loading ? 'animate-spin text-brand-gold' : 'text-gray-400'}`}/>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none px-6 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all"
            >
              View Site
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              {data.enquiries.length > 0 ? data.enquiries.map((e: any) => (
                <MotionDiv 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={e._id || e.id} 
                  className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border border-gray-100 shadow-sm transition-all group"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg lg:text-xl font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{e.name}</h3>
                      <span className="text-xs text-gray-400 font-medium">{e.email}</span>
                      <div className="flex gap-3 mt-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${e.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                          {e.priority || 'Normal'}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/10">
                          {e.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                      {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-5 lg:p-6 rounded-2xl border border-gray-100 font-serif italic text-gray-600 leading-relaxed shadow-inner text-sm lg:text-base">
                    "{e.message}"
                  </div>
                </MotionDiv>
              )) : (
                <div className="py-24 lg:py-40 text-center space-y-4">
                  <MessageSquare size={48} className="mx-auto text-gray-200" />
                  <p className="text-gray-400 font-serif text-xl italic">No incoming inquiries.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                <MotionDiv 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] border border-gray-100 shadow-sm text-center space-y-4 lg:space-y-6"
                >
                   <div className="text-5xl lg:text-6xl font-serif font-bold text-brand-dark">{data.enquiries.length}</div>
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Captured Inquiries</div>
                </MotionDiv>
                <MotionDiv 
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] border border-gray-100 shadow-sm text-center space-y-4 lg:space-y-6"
                >
                   <div className="text-5xl lg:text-6xl font-serif font-bold text-brand-dark">{data.jobs.length}</div>
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live Opportunities</div>
                </MotionDiv>
             </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center bg-brand-gold/5 p-6 rounded-3xl border border-brand-gold/10">
                 <p className="text-brand-dark font-serif italic">Role management is active.</p>
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">{data.jobs.length} Listings Found</span>
               </div>
               {data.jobs.map((job: any) => (
                 <div key={job.id} className="bg-white p-6 lg:p-8 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-brand-dark">{job.title}</h4>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">{job.company} — {job.location}</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-5 py-2 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">Edit</button>
                      <button className="flex-1 sm:flex-none px-5 py-2 border border-red-100 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50">Delete</button>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
