
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Briefcase, 
  LayoutDashboard, 
  LogOut, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  GraduationCap, 
  Users, 
  Banknote,
  Archive,
  MapPin,
  Info,
  History
} from 'lucide-react';
import { API_BASE_URL } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [newJob, setNewJob] = useState({
    title: '',
    education: '',
    gender: 'Any',
    salary: '',
    industry: '',
    location: '',
    otherInfo: ''
  });

  useEffect(() => {
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin/login');
      return;
    }
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs?includeArchived=true`);
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
        setNewJob({ title: '', education: '', gender: 'Any', salary: '', industry: '', location: '', otherInfo: '' });
        fetchJobs();
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !currentStatus })
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      console.error("Archive error:", err);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('PERMANENT DELETE: This cannot be undone. Use Archive instead to keep records. Proceed?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) fetchJobs();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const filteredJobs = jobs.filter(j => view === 'active' ? !j.isArchived : j.isArchived);

  const FormFields = ({ isMobile = false }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Job Title</label>
          <input required placeholder="Senior Executive" className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Industry</label>
          <input required placeholder="e.g. Healthcare / IT" className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Education</label>
          <input required placeholder="Graduate / Post-Grad" className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white" value={newJob.education} onChange={e => setNewJob({...newJob, education: e.target.value})} />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
          <input required placeholder="City, State" className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Salary</label>
          <input required placeholder="e.g. 10 LPA" className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
        </div>
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Gender</label>
          <select className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white outline-none" value={newJob.gender} onChange={e => setNewJob({...newJob, gender: e.target.value})}>
            <option value="Any" className="bg-brand-dark">Any</option>
            <option value="Male" className="bg-brand-dark">Male</option>
            <option value="Female" className="bg-brand-dark">Female</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Other Information</label>
        <textarea rows={2} placeholder="Additional requirements or details..." className="w-full mt-1 bg-brand-accent/30 border border-white/10 p-3 rounded-xl text-sm text-white resize-none" value={newJob.otherInfo} onChange={e => setNewJob({...newJob, otherInfo: e.target.value})} />
      </div>
    </div>
  );

  return (
    <div className="bg-brand-light min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-brand-dark rounded-2xl text-brand-gold shadow-lg">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-brand-dark">Admin Console</h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">Professional Recruitment Management</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition-all">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex space-x-8">
                <button onClick={() => setView('active')} className={`text-sm font-black uppercase tracking-widest pb-2 transition-all ${view === 'active' ? 'text-brand-dark border-b-2 border-brand-gold' : 'text-gray-400'}`}>
                  Active Jobs
                </button>
                <button onClick={() => setView('archived')} className={`text-sm font-black uppercase tracking-widest pb-2 transition-all ${view === 'archived' ? 'text-brand-dark border-b-2 border-brand-gold' : 'text-gray-400'}`}>
                  Archived Records
                </button>
              </div>
              <button onClick={() => setShowAddForm(true)} className="lg:hidden bg-brand-dark text-white p-3 rounded-full"><Plus size={20} /></button>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 italic">No {view} jobs found.</p>
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <MotionDiv layout key={job._id} className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-2 py-0.5 bg-brand-light text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-full">{job.industry}</span>
                           <span className="flex items-center text-[10px] text-gray-400 font-bold uppercase"><MapPin size={10} className="mr-1" /> {job.location}</span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-brand-dark">{job.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                           <span className="flex items-center"><GraduationCap size={14} className="mr-1 text-brand-gold" /> {job.education}</span>
                           <span className="flex items-center"><Banknote size={14} className="mr-1 text-brand-gold" /> {job.salary}</span>
                           <span className="flex items-center"><Users size={14} className="mr-1 text-brand-gold" /> {job.gender}</span>
                        </div>
                        {job.otherInfo && (
                          <div className="mt-3 text-[11px] text-gray-400 italic flex items-start gap-2">
                            <Info size={12} className="mt-0.5 flex-shrink-0" /> {job.otherInfo}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <button onClick={() => toggleArchive(job._id, job.isArchived)} className="flex-1 sm:flex-none p-3 text-gray-400 hover:text-brand-gold hover:bg-brand-light rounded-xl transition-all" title={job.isArchived ? "Restore Job" : "Archive Job"}>
                          {job.isArchived ? <History size={18} /> : <Archive size={18} />}
                        </button>
                        <button onClick={() => handleDeleteJob(job._id)} className="flex-1 sm:flex-none p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </MotionDiv>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32 bg-brand-dark p-8 rounded-[2.5rem] text-white shadow-3xl">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center">
                <Plus className="mr-2 text-brand-gold" /> New Job
              </h2>
              <form onSubmit={handleAddJob} className="space-y-6">
                <FormFields />
                <button disabled={isSubmitting} className="w-full bg-brand-gold text-brand-dark py-4 rounded-full font-bold flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl disabled:opacity-50">
                  {isSubmitting ? 'Processing...' : 'Post New Job'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-end bg-brand-dark/95 backdrop-blur-sm lg:hidden">
             <MotionDiv initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-brand-dark w-full p-8 rounded-t-[3rem] overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif font-bold text-white">New Job Mandate</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-500 p-2"><X size={24} /></button>
                </div>
                <form onSubmit={handleAddJob} className="space-y-6">
                  <FormFields isMobile />
                  <button disabled={isSubmitting} className="w-full bg-brand-gold text-brand-dark py-5 rounded-full font-bold flex items-center justify-center shadow-xl">
                    Post Job
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
