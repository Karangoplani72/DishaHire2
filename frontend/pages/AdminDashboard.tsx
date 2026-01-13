
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, MessageSquare, 
  Database, Loader2
} from 'lucide-react';
import { db } from '../utils/db.ts';

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
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-80 bg-brand-dark text-white fixed inset-y-0 z-20 flex flex-col">
        <div className="p-10 border-b border-white/10 font-serif font-bold text-2xl">DISHA<span className="text-brand-gold">ADMIN</span></div>
        <nav className="flex-grow py-8 space-y-1">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
            { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Inquiries' },
            { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Jobs' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center space-x-4 px-10 py-5 transition-all ${activeTab === item.id ? 'bg-brand-gold/10 text-brand-gold border-r-4 border-brand-gold' : 'text-gray-400 hover:text-white'}`}>
              {item.icon} <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 ml-80 p-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-brand-dark capitalize">{activeTab}</h1>
          <button onClick={refresh} className="p-4 bg-white border rounded-2xl">
            <Database size={20} className={loading ? 'animate-spin' : ''}/>
          </button>
        </header>

        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {data.enquiries.map((e: any) => (
              <div key={e._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold">{e.name} <span className="text-sm font-normal text-gray-400">({e.email})</span></h3>
                </div>
                <p className="text-gray-600 font-serif italic mb-4">"{e.message}"</p>
                <div className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'overview' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-4">
                 <div className="text-4xl font-serif font-bold text-brand-gold">{data.enquiries.length}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Inquiries</div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-4">
                 <div className="text-4xl font-serif font-bold text-brand-gold">{data.jobs.length}</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Job Postings</div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
