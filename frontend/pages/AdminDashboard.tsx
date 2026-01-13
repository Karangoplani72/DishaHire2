
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, LogOut, 
  Trash2, Plus, Database, ShieldCheck, Check, Newspaper, Loader2, Send
} from 'lucide-react';
import { db } from '../utils/db.ts';
import { useAuth } from '../components/AuthContext.tsx';

// Removed React.FC typing to resolve "Property 'children' is missing" error when this component is rendered in frontend/App.tsx
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs' | 'moderation' | 'blog'>('overview');
  const [data, setData] = useState({ enquiries: [], jobs: [], testimonials: [], blogs: [] });
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const { logout } = useAuth();
  
  const refresh = async () => {
    setLoading(true);
    try {
      const [e, j, t, b] = await Promise.all([
        db.getEnquiries(), db.getJobs(), db.getAdminTestimonials(), db.getBlogs()
      ]);
      setData({ enquiries: e || [], jobs: j || [], testimonials: t || [], blogs: b || [] });
    } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const handleApproveFeedback = async (id: string) => {
    await db.moderateTestimonial(id, { isApproved: true });
    refresh();
  };

  const handleDeleteJob = async (id: string) => {
    if(confirm('Delete?')) { await db.deleteJob(id); refresh(); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-80 bg-brand-dark text-white fixed inset-y-0 z-20 flex flex-col">
        <div className="p-10 border-b border-white/10 font-serif font-bold text-2xl">DISHA<span className="text-brand-gold">ADMIN</span></div>
        <nav className="flex-grow py-8 space-y-1">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
            { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Inquiries' },
            { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Jobs' },
            { id: 'moderation', icon: <ShieldCheck size={20}/>, label: 'Moderation' },
            { id: 'blog', icon: <Newspaper size={20}/>, label: 'Editorial' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center space-x-4 px-10 py-5 transition-all ${activeTab === item.id ? 'bg-brand-gold/10 text-brand-gold border-r-4 border-brand-gold' : 'text-gray-400 hover:text-white'}`}>
              {item.icon} <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={logout} className="p-10 border-t border-white/10 text-red-400 flex items-center gap-4 text-xs font-bold uppercase tracking-widest"><LogOut size={18}/> Sign Out</button>
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
                  <span className="text-[10px] font-black uppercase bg-brand-gold/10 text-brand-gold px-3 py-1 rounded">{e.type}</span>
                </div>
                <p className="text-gray-600 font-serif italic mb-4">"{e.message}"</p>
                <div className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-6">
            <button onClick={() => setShowBlogModal(true)} className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-all flex items-center justify-center gap-4">
              <Plus size={24}/> Write New Career Insight
            </button>
            {data.blogs.map((b: any) => (
              <div key={b._id} className="bg-white p-8 rounded-[2.5rem] flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{b.title}</h3>
                  <p className="text-sm text-gray-400">{b.excerpt}</p>
                </div>
                <button className="text-red-400 p-2"><Trash2 size={20}/></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-6">
            {data.testimonials.map((t: any) => (
              <div key={t._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{t.name} <span className="text-gray-400 font-normal">({t.company})</span></h3>
                  <p className="text-sm text-gray-500 italic">"{t.content}"</p>
                </div>
                {!t.isApproved && (
                  <button onClick={() => handleApproveFeedback(t._id)} className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all"><Check size={20}/></button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
