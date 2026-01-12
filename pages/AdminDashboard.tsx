
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, LogOut, 
  Trash2, Plus, X, Loader2, Database
} from 'lucide-react';
import { Job, Enquiry } from '../types.ts';
import { db } from '../utils/db.ts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs' | 'subscribers'>('overview');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', type: 'Full-time', industry: 'IT & Technology', description: '' });

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [eData, jData, sData] = await Promise.all([
        db.getEnquiries(), 
        db.getJobs(),
        db.getSubscribers()
      ]);
      setEnquiries(eData || []);
      setJobs(jData || []);
      setSubscribers(sData || []);
    } catch (err) {
      console.error("Atlas Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      await db.addJob(newJob as any);
      setIsJobModalOpen(false);
      await refreshData();
      alert('Role successfully pushed to MongoDB Atlas.');
      setNewJob({ title: '', company: '', location: '', type: 'Full-time', industry: 'IT & Technology', description: '' });
    } catch (err) {
      alert('Atlas Cluster connectivity error. Verify cluster status.');
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if(confirm('Irreversibly delete this role from MongoDB?')) {
      await db.deleteJob(id);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="w-80 bg-brand-dark text-white flex flex-col fixed inset-y-0 z-20">
        <div className="p-12 border-b border-white/10 text-2xl font-serif font-bold tracking-widest">
           DISHA<span className="text-brand-gold">ADMIN</span>
        </div>
        <nav className="flex-grow py-12 space-y-4">
          {[
            { id: 'overview', icon: <LayoutDashboard size={22}/>, label: 'Control' },
            { id: 'enquiries', icon: <MessageSquare size={22}/>, label: 'Inquiries' },
            { id: 'jobs', icon: <Briefcase size={22}/>, label: 'Atlas Jobs' },
            { id: 'subscribers', icon: <Users size={22}/>, label: 'Network' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center space-x-6 px-12 py-6 transition-all ${activeTab === item.id ? 'bg-brand-gold/10 text-brand-gold border-r-4 border-brand-gold' : 'text-gray-500 hover:text-white'}`}>
              {item.icon}
              <span className="text-xs uppercase tracking-[0.3em] font-black">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-12 border-t border-white/10">
          <button onClick={() => window.location.href = '#/'} className="flex items-center space-x-6 text-gray-500 hover:text-white transition-all">
            <LogOut size={22} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Exit Portal</span>
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col ml-80">
        <header className="h-24 bg-white border-b px-16 flex items-center justify-between sticky top-0 z-10">
          <h1 className="font-serif font-bold text-2xl text-brand-dark capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4 px-4 py-2 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
            <Database size={16} className="text-brand-gold" />
            <span className="text-[10px] uppercase font-black text-brand-gold">Live Cluster Sync</span>
          </div>
        </header>

        <main className="p-16">
          {activeTab === 'jobs' && (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-serif font-bold text-brand-dark">Atlas Job Inventory</h2>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsJobModalOpen(true)} className="bg-brand-dark text-white px-10 py-5 rounded-[2rem] font-bold flex items-center gap-4">
                  <Plus size={24} /> Add Role
                </motion.button>
              </div>
              <div className="space-y-6">
                {jobs.map(job => (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={job.id} className="bg-white p-10 rounded-[2.5rem] shadow-sm border flex items-center justify-between group hover:shadow-xl transition-all">
                    <div>
                      <h4 className="text-2xl font-serif font-bold text-brand-dark">{job.title}</h4>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{job.company} • {job.location}</p>
                    </div>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={20}/></button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl" onClick={() => setIsJobModalOpen(false)} />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white w-full max-w-3xl rounded-[3rem] p-16 relative z-10">
              <h3 className="text-4xl font-serif font-bold text-brand-dark mb-12">New Atlas Posting</h3>
              <form onSubmit={handleAddJob} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} type="text" className="w-full px-6 py-5 bg-gray-50 rounded-[1.5rem] border outline-none font-serif text-lg" placeholder="Role Title" />
                  <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} type="text" className="w-full px-6 py-5 bg-gray-50 rounded-[1.5rem] border outline-none font-serif text-lg" placeholder="Organization" />
                </div>
                <textarea rows={4} required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-6 py-5 bg-gray-50 rounded-[1.5rem] border outline-none font-serif" placeholder="Requirements..."></textarea>
                <button disabled={publishing} type="submit" className="w-full bg-brand-dark text-white py-6 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-4">
                  {publishing ? <Loader2 className="animate-spin"/> : <><Database size={24}/> Publish to MongoDB Atlas</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
