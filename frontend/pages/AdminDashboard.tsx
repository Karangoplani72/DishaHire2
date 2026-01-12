
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, LogOut, 
  Trash2, Plus, X, Loader2, Database, Download, ExternalLink, Mail
} from 'lucide-react';
import { Job, Enquiry } from '../types.ts';
import { db } from '../utils/db.ts';
import { useAuth } from '../components/AuthContext.tsx';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'jobs' | 'subscribers'>('enquiries');
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
  }, [activeTab]);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      await db.addJob(newJob as any);
      setIsJobModalOpen(false);
      await refreshData();
      alert('Role successfully published.');
      setNewJob({ title: '', company: '', location: '', type: 'Full-time', industry: 'IT & Technology', description: '' });
    } catch (err) {
      alert('Failed to save job. Check console.');
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
      <motion.div initial={{ x: -20 }} animate={{ x: 0 }} className="w-80 bg-brand-dark text-white flex flex-col fixed inset-y-0 z-20">
        <div className="p-10 border-b border-white/10">
           <div className="text-2xl font-serif font-bold tracking-widest">DISHA<span className="text-brand-gold">ADMIN</span></div>
           <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Management Portal</div>
        </div>
        <nav className="flex-grow py-8 space-y-2">
          {[
            { id: 'enquiries', icon: <MessageSquare size={20}/>, label: 'Inquiries' },
            { id: 'jobs', icon: <Briefcase size={20}/>, label: 'Job Postings' },
            { id: 'subscribers', icon: <Users size={20}/>, label: 'Subscribers' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center space-x-4 px-10 py-5 transition-all ${activeTab === item.id ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:text-white'}`}
            >
              {item.icon}
              <span className="text-xs uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-white/10 space-y-4">
          <button onClick={() => window.location.hash = '/'} className="w-full flex items-center space-x-4 text-gray-500 hover:text-white transition-all text-xs uppercase tracking-widest">
            <ExternalLink size={18} />
            <span>Public Site</span>
          </button>
          <button onClick={logout} className="w-full flex items-center space-x-4 text-red-400 hover:text-red-300 transition-all text-xs uppercase tracking-widest">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-80">
        <header className="h-20 bg-white border-b px-12 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="font-serif font-bold text-xl text-brand-dark capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
             <div className="text-[10px] font-black text-brand-gold bg-brand-gold/5 px-3 py-1 rounded border border-brand-gold/20 flex items-center gap-2">
               <Database size={12}/> Live Atlas Sync
             </div>
             <button onClick={refreshData} className="p-2 text-gray-400 hover:text-brand-dark transition-colors">
               <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
        </header>

        <main className="p-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-50">
               <Loader2 size={40} className="animate-spin text-brand-gold mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Syncing with MongoDB...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'enquiries' && enquiries.map(e => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={e.id} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${e.type === 'EMPLOYER' ? 'bg-blue-50 text-blue-600' : 'bg-brand-gold/10 text-brand-gold'}`}>
                        {e.type} Enquiry
                      </span>
                      <h3 className="text-xl font-bold text-brand-dark mt-2">{e.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                        <span className="flex items-center gap-1"><Mail size={14}/> {e.email}</span>
                        {e.company && <span className="flex items-center gap-1 font-bold text-brand-dark">@ {e.company}</span>}
                      </div>
                    </div>
                    {e.priority === 'HIGH' && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded animate-pulse">HIGH PRIORITY</span>}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed mb-4">
                    {e.message}
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">
                      Submitted: {new Date(e.createdAt).toLocaleDateString()}
                    </div>
                    {e.resumeData && (
                      <button 
                        onClick={() => downloadResume(e.resumeData!, e.resumeName!)}
                        className="flex items-center gap-2 text-brand-gold text-xs font-bold hover:underline"
                      >
                        <Download size={14}/> Download Resume
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {activeTab === 'jobs' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark">Active Listings</h2>
                    <button onClick={() => setIsJobModalOpen(true)} className="bg-brand-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-accent transition shadow-lg">
                      <Plus size={20} /> Create New Role
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {jobs.map(job => (
                      <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between group">
                        <div>
                          <h4 className="font-bold text-brand-dark">{job.title}</h4>
                          <div className="flex gap-4 text-xs text-gray-400 mt-1 font-medium">
                            <span>{job.company}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span className="text-brand-gold">{job.industry}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteJob(job.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'subscribers' && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</th>
                        <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {subscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-8 py-4 font-medium text-brand-dark">{sub.email}</td>
                          <td className="px-8 py-4 text-sm text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Job Modal */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/90 backdrop-blur-sm" onClick={() => setIsJobModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-3xl p-10 relative z-10 shadow-2xl">
              <h3 className="text-3xl font-serif font-bold text-brand-dark mb-8">Publish New Role</h3>
              <form onSubmit={handleAddJob} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Job Title</label>
                    <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-brand-gold/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Organization</label>
                    <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-brand-gold/30" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Location</label>
                    <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-brand-gold/30" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Industry</label>
                    <select value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none font-bold">
                      <option>IT & Technology</option>
                      <option>Manufacturing</option>
                      <option>Sales & Marketing</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Job Description</label>
                  <textarea rows={4} required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-brand-gold/30 resize-none"></textarea>
                </div>
                <button disabled={publishing} type="submit" className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                  {publishing ? <Loader2 className="animate-spin"/> : <><Database size={20}/> Publish to MongoDB Atlas</>}
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
