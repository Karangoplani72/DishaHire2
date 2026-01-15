
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, LayoutDashboard, LogOut, CheckCircle2, X, AlertCircle, MapPin, Building2 } from 'lucide-react';
import { INDUSTRIES, API_BASE_URL } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    industry: INDUSTRIES[0],
    description: ''
  });

  useEffect(() => {
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin/login');
      return;
    }
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewJob({ title: '', company: '', location: '', industry: INDUSTRIES[0], description: '' });
        fetchJobs();
      } else {
        alert("Failed to save mandate. Check required fields.");
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to retire this mandate from the database?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchJobs();
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="bg-brand-light min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 sm:mb-16 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-brand-dark rounded-2xl text-brand-gold shadow-lg">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-brand-dark">Mandate Management</h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">Executive Control Panel</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition-all"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-brand-dark flex items-center">
                Active Mandates 
                <span className="ml-3 px-3 py-1 bg-brand-dark text-white text-xs rounded-full">{jobs.length}</span>
              </h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-brand-dark text-white p-4 rounded-full hover:bg-brand-gold transition-all shadow-xl lg:hidden"
              >
                <Plus size={24} />
              </button>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-[2rem]"></div>)}
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                    <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-400 italic">No active job mandates in the database.</p>
                  </div>
                ) : (
                  jobs.map(job => (
                    <MotionDiv 
                      layout
                      key={job._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-lg border border-gray-100 flex justify-between items-center group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/20 flex-shrink-0">
                          <Briefcase size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-brand-dark">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500">
                             <div className="flex items-center"><Building2 size={12} className="mr-1" /> {job.company}</div>
                             <div className="flex items-center"><MapPin size={12} className="mr-1" /> {job.location}</div>
                          </div>
                          <span className="inline-block mt-2 px-3 py-1 bg-brand-light text-brand-gold text-[9px] font-black uppercase tracking-widest rounded-full">
                            {job.industry}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </MotionDiv>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Desktop Sidebar Form */}
          <div className="hidden lg:block">
            <div className="sticky top-32 bg-brand-dark p-10 rounded-[3rem] text-white shadow-4xl border border-white/5">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center">
                <Plus className="mr-3 text-brand-gold" size={24} /> New Mandate
              </h2>
              <form onSubmit={handleAddJob} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Job Title</label>
                  <input 
                    required
                    className="w-full mt-2 bg-brand-accent/50 border border-white/5 p-4 rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
                    value={newJob.title}
                    onChange={e => setNewJob({...newJob, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Company</label>
                  <input 
                    required
                    className="w-full mt-2 bg-brand-accent/50 border border-white/5 p-4 rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
                    value={newJob.company}
                    onChange={e => setNewJob({...newJob, company: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Location</label>
                    <input 
                      required
                      className="w-full mt-2 bg-brand-accent/50 border border-white/5 p-4 rounded-xl text-sm outline-none focus:border-brand-gold transition-colors"
                      value={newJob.location}
                      onChange={e => setNewJob({...newJob, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Industry</label>
                    <select 
                      className="w-full mt-2 bg-brand-accent/50 border border-white/5 p-4 rounded-xl text-sm outline-none focus:border-brand-gold appearance-none cursor-pointer transition-colors"
                      value={newJob.industry}
                      onChange={e => setNewJob({...newJob, industry: e.target.value})}
                    >
                      {INDUSTRIES.map(i => <option key={i} value={i} className="bg-brand-dark">{i}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mandate Brief</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full mt-2 bg-brand-accent/50 border border-white/5 p-4 rounded-xl text-sm outline-none focus:border-brand-gold resize-none transition-colors"
                    value={newJob.description}
                    onChange={e => setNewJob({...newJob, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-gold text-brand-dark py-4 rounded-full font-bold flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl shadow-brand-gold/10 disabled:opacity-50"
                >
                  {isSubmitting ? 'Syncing...' : 'Confirm Posting'} <CheckCircle2 size={18} className="ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Modal Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-brand-dark/90 backdrop-blur-sm lg:hidden p-4">
             <MotionDiv 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              className="bg-brand-dark w-full max-w-xl p-8 rounded-t-[3rem] sm:rounded-[3rem] border-t border-white/10"
             >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif font-bold text-white">Post Mandate</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAddJob} className="space-y-4">
                  <input placeholder="Job Title" required className="w-full bg-brand-accent/50 p-4 rounded-xl text-white border border-white/5 outline-none" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                  <input placeholder="Company Name" required className="w-full bg-brand-accent/50 p-4 rounded-xl text-white border border-white/5 outline-none" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
                  <input placeholder="Location" required className="w-full bg-brand-accent/50 p-4 rounded-xl text-white border border-white/5 outline-none" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                  <select 
                    className="w-full bg-brand-accent/50 p-4 rounded-xl text-white border border-white/5 outline-none"
                    value={newJob.industry}
                    onChange={e => setNewJob({...newJob, industry: e.target.value})}
                  >
                    {INDUSTRIES.map(i => <option key={i} value={i} className="bg-brand-dark">{i}</option>)}
                  </select>
                  <textarea placeholder="Job Brief" required rows={3} className="w-full bg-brand-accent/50 p-4 rounded-xl text-white border border-white/5 outline-none resize-none" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} />
                  <button type="submit" disabled={isSubmitting} className="w-full bg-brand-gold text-brand-dark py-5 rounded-full font-bold shadow-lg shadow-brand-gold/10">
                    {isSubmitting ? 'Syncing...' : 'Publish Mandate'}
                  </button>
                </form>
             </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
