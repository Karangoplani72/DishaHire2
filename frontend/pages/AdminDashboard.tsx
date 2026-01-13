
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, MessageSquare, 
  Database, Loader2, ShieldAlert
} from 'lucide-react';
import { db } from '../utils/db.ts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs'>('overview');
  const [data, setData] = useState({ enquiries: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-80 bg-brand-dark text-white fixed inset-y-0 z-20 flex flex-col shadow-4xl">
        <div className="p-10 border-b border-white/10 font-serif font-bold text-2xl tracking-tighter">
          DISHA<span className="text-brand-gold">ADMIN</span>
        </div>
        
        <nav className="flex-grow py-8 space-y-1">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
            { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Inquiries' },
            { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Jobs' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center space-x-4 px-10 py-5 transition-all ${activeTab === item.id ? 'bg-brand-gold/10 text-brand-gold border-r-4 border-brand-gold' : 'text-gray-400 hover:text-white'}`}
            >
              {item.icon} <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-80 p-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex flex-col">
            <h1 className="text-4xl font-serif font-bold text-brand-dark capitalize tracking-tight">{activeTab}</h1>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">Public Management Console</p>
          </div>
          <button 
            onClick={refresh} 
            disabled={loading}
            className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            <Database size={20} className={`${loading ? 'animate-spin text-brand-gold' : 'text-gray-400'}`}/>
          </button>
        </header>

        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {data.enquiries.length > 0 ? data.enquiries.map((e: any) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={e._id} 
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-gold transition-colors">{e.name}</h3>
                    <span className="text-xs text-gray-400 font-medium">{e.email}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 font-serif italic text-gray-600 leading-relaxed shadow-inner">
                  "{e.message}"
                </div>
              </motion.div>
            )) : (
              <div className="py-40 text-center space-y-4">
                <MessageSquare size={48} className="mx-auto text-gray-200" />
                <p className="text-gray-400 font-serif text-xl italic">No incoming inquiries.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'overview' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm text-center space-y-6">
                 <div className="text-6xl font-serif font-bold text-brand-dark">{data.enquiries.length}</div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Captured Inquiries</div>
              </div>
              <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm text-center space-y-6">
                 <div className="text-6xl font-serif font-bold text-brand-dark">{data.jobs.length}</div>
                 <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Live Opportunities</div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
