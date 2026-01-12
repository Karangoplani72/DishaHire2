
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Briefcase, MessageSquare, LogOut, 
  Trash2, Plus, X, Loader2, Database, Download, ExternalLink, Mail,
  TrendingUp, Calendar, Filter, Send, ArrowUpRight,
  // Added Building and MapPin to resolve "Cannot find name" errors
  Building, MapPin
} from 'lucide-react';
import { Job, Enquiry } from '../types.ts';
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
  
  // Filtering States
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Stats Logic
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      totalEnquiries: enquiries.length,
      todayEnquiries: enquiries.filter(e => new Date(e.createdAt).toDateString() === today).length,
      activeJobs: jobs.length,
      totalNetwork: subscribers.length
    };
  }, [enquiries, jobs, subscribers]);

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.email.toLowerCase().includes(searchQuery.toLowerCase());
      const eDate = new Date(e.createdAt).getTime();
      const matchStart = dateStart ? eDate >= new Date(dateStart).getTime() : true;
      const matchEnd = dateEnd ? eDate <= new Date(dateEnd).getTime() + 86400000 : true; // Add 1 day to include selected end day
      return matchSearch && matchStart && matchEnd;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [enquiries, searchQuery, dateStart, dateEnd]);

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

  const handleEmailReply = (enquiry: Enquiry) => {
    const subject = encodeURIComponent(`RE: DishaHire Inquiry - ${enquiry.name}`);
    const body = encodeURIComponent(`Dear ${enquiry.name},\n\nThank you for reaching out to DishaHire. We have reviewed your message regarding "${enquiry.message.substring(0, 30)}..." and would like to discuss this further.\n\nBest regards,\nDishaHire Team`);
    window.location.href = `mailto:${enquiry.email}?subject=${subject}&body=${body}`;
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
           <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-bold">Rajkot Hub Controller</div>
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
            <span>View Website</span>
          </button>
          <button onClick={logout} className="w-full flex items-center space-x-4 text-red-400 hover:text-red-300 transition-all text-[11px] uppercase tracking-widest font-bold">
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
               <Database size={12}/> ATLAS SYNC ACTIVE
             </div>
             <button onClick={refreshData} className="p-2 text-gray-400 hover:text-brand-dark transition-colors">
               <Loader2 size={18} className={loading ? 'animate-spin' : ''} />
             </button>
          </div>
        </header>

        <main className="p-12 space-y-10">
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               {/* Dashboard Stats */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Today's Inquiries", val: stats.todayEnquiries, icon: <Calendar className="text-brand-gold"/>, color: 'bg-brand-gold/10' },
                    { label: "Total Inquiries", val: stats.totalEnquiries, icon: <MessageSquare className="text-blue-500"/>, color: 'bg-blue-50' },
                    { label: "Active Roles", val: stats.activeJobs, icon: <Briefcase className="text-green-500"/>, color: 'bg-green-50' },
                    { label: "Talent Network", val: stats.totalNetwork, icon: <Users className="text-purple-500"/>, color: 'bg-purple-50' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
                        {s.icon}
                      </div>
                      <div className="text-3xl font-serif font-bold text-brand-dark">{s.val}</div>
                      <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-1">{s.label}</div>
                    </div>
                  ))}
               </div>

               {/* Recent Activity Mini-View */}
               <div className="bg-white rounded-3xl border border-gray-100 p-10">
                  <h2 className="text-xl font-serif font-bold text-brand-dark mb-6">Recent Global Inquiries</h2>
                  <div className="space-y-4">
                    {enquiries.slice(0, 5).map(e => (
                      <div key={e.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-brand-gold/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-brand-dark shadow-sm">
                            {e.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark text-sm">{e.name}</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{e.type}</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400">{new Date(e.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Filter Controls */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Search</label>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <input 
                      type="text" 
                      placeholder="Name or Email..." 
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-brand-gold/30 text-sm"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">From Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none text-sm"
                    value={dateStart}
                    onChange={e => setDateStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">To Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none text-sm"
                    value={dateEnd}
                    onChange={e => setDateEnd(e.target.value)}
                  />
                </div>
                <button onClick={() => { setSearchQuery(''); setDateStart(''); setDateEnd(''); }} className="px-6 py-3 text-brand-gold text-xs font-bold hover:underline">Reset Filters</button>
              </div>

              {/* Inquiry Cards */}
              <div className="space-y-6">
                {filteredEnquiries.map(e => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={e.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-brand-dark text-white rounded-[1.5rem] flex items-center justify-center text-xl font-bold shadow-xl">
                          {e.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-brand-dark">{e.name}</h3>
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${e.type === 'EMPLOYER' ? 'bg-blue-50 text-blue-600' : 'bg-brand-gold/10 text-brand-gold'}`}>
                              {e.type}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1 gap-4 font-medium">
                            <span className="flex items-center gap-1"><Mail size={14}/> {e.email}</span>
                            {e.company && <span className="flex items-center gap-1 font-bold text-brand-dark border-l pl-4 border-gray-100">@ {e.company}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(e.createdAt).toLocaleDateString()}</div>
                         <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">{new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl text-sm text-gray-700 leading-relaxed border border-gray-100 mb-6 font-serif italic">
                      "{e.message}"
                    </div>

                    <div className="flex items-center justify-between pt-2">
                       <div className="flex items-center gap-6">
                          {e.experience && (
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Experience Profile</span>
                              <span className="text-xs font-bold text-brand-dark">{e.experience}</span>
                            </div>
                          )}
                          {e.priority === 'HIGH' && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase animate-pulse">
                              <TrendingUp size={14}/> Urgent Processing
                            </div>
                          )}
                       </div>
                       
                       <div className="flex items-center gap-4">
                         {e.resumeData && (
                           <button onClick={() => downloadResume(e.resumeData!, e.resumeName!)} className="flex items-center gap-2 bg-brand-light text-brand-dark px-6 py-3 rounded-xl text-xs font-bold border border-brand-gold/10 hover:bg-brand-gold/20 transition-all">
                             <Download size={14}/> CV
                           </button>
                         )}
                         <button onClick={() => handleEmailReply(e)} className="flex items-center gap-2 bg-brand-dark text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-brand-accent transition-all shadow-lg">
                           <Send size={14}/> Draft Email Reply
                         </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Active Recruitment Listings</h2>
                <button onClick={() => setIsJobModalOpen(true)} className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-accent transition shadow-xl">
                  <Plus size={20} /> New Atlas Posting
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {jobs.map(job => (
                  <div key={job.id} className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-lg text-brand-dark">{job.title}</h4>
                        <span className="text-[10px] bg-brand-gold/5 text-brand-gold px-2 py-1 rounded font-black uppercase">{job.industry}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Building size={12}/> {job.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Talent Network Member</th>
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Date Joined</th>
                    <th className="px-10 py-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-all">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center"><Mail size={14} className="text-brand-gold"/></div>
                           <span className="font-bold text-brand-dark">{sub.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-xs text-gray-500 font-bold">{new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="px-10 py-6 text-right">
                         <a href={`mailto:${sub.email}`} className="text-[10px] font-black text-brand-gold hover:underline uppercase tracking-widest">Compose <ArrowUpRight size={10} className="inline ml-1"/></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Add Job Modal */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={() => setIsJobModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-[3rem] p-12 relative z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-serif font-bold text-brand-dark">Atlas Posting Hub</h3>
                <button onClick={() => setIsJobModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X/></button>
              </div>
              <form onSubmit={handleAddJob} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Role Identification</label>
                    <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30 text-brand-dark font-serif" placeholder="e.g. Senior Software Architect" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Hiring Client</label>
                    <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30 text-brand-dark font-serif" placeholder="e.g. Reliance Group" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</label>
                    <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30 text-brand-dark font-serif" placeholder="Rajkot, Mumbai, etc." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Industry Vertical</label>
                    <select value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none font-black text-brand-dark text-xs tracking-widest">
                      <option>IT & Technology</option>
                      <option>Manufacturing</option>
                      <option>Sales & Marketing</option>
                      <option>Healthcare</option>
                      <option>Finance</option>
                      <option>BPO Support</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Detailed Context / Requirements</label>
                  <textarea rows={6} required value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} className="w-full px-5 py-4 bg-gray-50 border rounded-2xl outline-none focus:border-brand-gold/30 resize-none font-serif leading-relaxed"></textarea>
                </div>
                <button disabled={publishing} type="submit" className="w-full bg-brand-dark text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-4 hover:bg-brand-accent transition shadow-2xl">
                  {publishing ? <Loader2 className="animate-spin"/> : <><Database size={20}/> Deploy to Atlas Cluster</>}
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
