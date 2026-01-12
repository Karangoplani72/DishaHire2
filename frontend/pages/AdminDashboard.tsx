
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, LogOut, 
  Trash2, Plus, X, Loader2, Database, ExternalLink, Mail,
  Calendar, Filter, Send, Download
} from 'lucide-react';
import { Job, Enquiry, ApplicationStatus } from '../types.ts';
import { db } from '../utils/db.ts';
import { useAuth } from '../components/AuthContext.tsx';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs' | 'subscribers'>('overview');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { logout } = useAuth();
  
  const [newJob, setNewJob] = useState({ 
    title: '', 
    company: '', 
    location: '', 
    type: 'Full-time', 
    industry: 'IT & Technology', 
    description: '' 
  });

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
      console.error("Data refresh failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      // Direct call to root API
      const response = await db.addJob(newJob);
      setIsJobModalOpen(false);
      await refreshData();
      alert('Role successfully published to Atlas Hub.');
      setNewJob({ title: '', company: '', location: '', type: 'Full-time', industry: 'IT & Technology', description: '' });
    } catch (err: any) {
      alert(`Sync Error: ${err.message || 'Check cluster connection'}`);
    } finally {
      setPublishing(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if(confirm('Delete this job posting?')) {
      await db.deleteJob(id);
      refreshData();
    }
  };

  const downloadResume = (base64Data: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName || 'resume.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="w-80 bg-brand-dark text-white flex flex-col fixed inset-y-0 z-20 shadow-2xl">
        <div className="p-10 border-b border-white/10">
           <div className="text-2xl font-serif font-bold tracking-widest">DISHA<span className="text-brand-gold ml-1">ADMIN</span></div>
           <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">Secure Access Portal</div>
        </div>
        <nav className="flex-grow py-8 space-y-1">
          {[
            { id: 'overview', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
            { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Inquiries' },
            { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Job Listings' },
            { id: 'subscribers', icon: <Users size={20}/>, label: 'Subscribers' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center space-x-4 px-10 py-5 transition-all ${activeTab === item.id ? 'bg-brand-gold/10 text-brand-gold border-r-4 border-brand-gold font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              {item.icon}
              <span className="text-[11px] uppercase tracking-widest font-black">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-white/10 space-y-4">
          <button onClick={() => window.location.hash = '/'} className="w-full flex items-center space-x-4 text-gray-500 hover:text-white transition-all text-[11px] uppercase tracking-widest font-bold">
            <ExternalLink size={18} />
            <span>View Hub</span>
          </button>
          <button onClick={logout} className="w-full flex items-center space-x-4 text-red-400 hover:text-red-300 transition-all text-[11px] uppercase tracking-widest font-bold">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-80">
        <header className="h-24 bg-white border-b px-12 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="font-serif font-bold text-xl text-brand-dark capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
             <div className="text-[10px] font-black text-brand-gold bg-brand-gold/5 px-4 py-2 rounded-full border border-brand-gold/20 flex items-center gap-2">
               <Database size={14}/> CLUSTER SYNC ACTIVE
             </div>
             <button onClick={refreshData} className="p-2 text-gray-400 hover:text-brand-dark transition-colors">
               <Loader2 size={20} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
        </header>

        <main className="p-12 space-y-10">
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              {enquiries.map(e => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={e.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-brand-dark text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                        {e.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-brand-dark">{e.name}</h3>
                        <p className="text-sm text-gray-400">{e.email}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-brand-gold bg-brand-gold/5 px-3 py-1 rounded uppercase tracking-widest">
                      {e.type}
                    </div>
                  </div>
                  <p className="bg-gray-50 p-6 rounded-2xl text-sm italic mb-6 border border-gray-100 font-serif">"{e.message}"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      {e.resumeData && (
                        <button onClick={() => downloadResume(e.resumeData!, e.resumeName!)} className="bg-brand-light text-brand-dark px-6 py-2 rounded-xl text-xs font-bold border border-brand-gold/10 hover:bg-brand-gold/10">
                          <Download size={14}/> CV
                        </button>
                      )}
                      <a href={`mailto:${e.email}`} className="bg-brand-dark text-white px-6 py-2 rounded-xl text-xs font-bold hover:bg-brand-accent">Reply</a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Atlas Recruitment Listings</h2>
                <button onClick={() => setIsJobModalOpen(true)} className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3">
                  <Plus size={20} /> Add Role
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    <div>
                      <h4 className="font-bold text-lg text-brand-dark">{job.title}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{job.company} • {job.location} • {job.type}</p>
                    </div>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-10 py-6 font-bold text-brand-dark">{sub.email}</td>
                      <td className="px-10 py-6 text-xs text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={() => setIsJobModalOpen(false)} />
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-12 relative z-10 shadow-2xl">
              <h3 className="text-3xl font-serif font-bold text-brand-dark mb-10">New Atlas Posting</h3>
              <form onSubmit={handleAddJob} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Job Title</label>
                    <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30" placeholder="e.g. HR Lead" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Company</label>
                    <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30" placeholder="Organization" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Location</label>
                    <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30" placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Industry</label>
                    <input required value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30" placeholder="e.g. Technology" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Job Type</label>
                  <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none cursor-pointer">
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Part-time</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                  <textarea rows={4} required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none resize-none leading-relaxed focus:border-brand-gold/30" placeholder="Key responsibilities..."></textarea>
                </div>
                <button disabled={publishing} type="submit" className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl">
                  {publishing ? <Loader2 className="animate-spin"/> : <><Database size={20}/> Publish Listing</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
