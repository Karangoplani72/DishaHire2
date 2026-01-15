
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, LayoutDashboard, LogOut, CheckCircle2, X, AlertCircle, GraduationCap, Users, Banknote } from 'lucide-react';
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
    education: '',
    gender: 'Any',
    salary: '',
    industry: INDUSTRIES[0]
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
        setNewJob({ title: '', education: '', gender: 'Any', salary: '', industry: INDUSTRIES[0] });
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

  const FormContent = ({ isMobile = false }) => (
    <form onSubmit={handleAddJob} className="space-y-4">
      <div>
        <label className={`text-[9px] font-black uppercase tracking-widest ${isMobile ? 'text-gray-400' : 'text-gray-500'} ml-1`}>Job Title</label>
        <input 
          required
          placeholder="e.g. Senior Software Engineer"
          className="w-full mt-1 bg-brand-accent/50 border border-white/5 p-3 rounded-xl text-sm outline-none focus:border-brand-gold transition-colors text-white"
          value={newJob.title}
          onChange={e => setNewJob({...newJob, title: e.target.value})}
        />
      </div>
      <div>
        <label className={`text-[9px] font-black uppercase tracking-widest ${isMobile ? 'text-gray-400' : 'text-gray-500'} ml-1`}>Education Required</label>
        <input 
          required
          placeholder="e.g. B.Tech / MBA / Graduate"
          className="w-full mt-1 bg-brand-accent/50 border border-white/5 p-3 rounded-xl text-sm outline-none focus:border-brand-gold transition-colors text-white"
          value={newJob.education}
          onChange={e => setNewJob({...newJob, education: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
         <div>
          <label className={`text-[9px] font-black uppercase tracking-widest ${isMobile ? 'text-gray-400' : 'text-gray-500'} ml-1`}>Gender</label>
          <select 
            className="w-full mt-1 bg-brand-accent/50 border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-brand-gold appearance-none cursor-pointer transition-colors text-white"
            value={newJob.gender}
            onChange={e => setNewJob({...newJob, gender: e.target.value})}
          >
            <option value="Any" className="bg-brand-dark">Any</option>
            <option value="Male" className="bg-brand-dark">Male</option>
            <option value="Female" className="bg-brand-dark">Female</option>
          </select>
        </div>
        <div>
          <label className={`text-[9px] font-black uppercase tracking-widest ${isMobile ? 'text-gray-400' : 'text-gray-500'} ml-1`}>Industry</label>
          <select 
            className="w-full mt-1 bg-brand-accent/50 border border-white/5 p-3 rounded-xl text-xs outline-none focus:border-brand-gold appearance-none cursor-pointer transition-colors text-white"
            value={newJob.industry}
            onChange={e => setNewJob({...newJob, industry: e.target.value})}
          >
            {INDUSTRIES.map(i => <option key={i} value={i} className="bg-brand-dark">{i}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={`text-[9px] font-black uppercase tracking-widest ${isMobile ? 'text-gray-400' : 'text-gray-500'} ml-1`}>Salary Range</label>
        <input 
          required
          placeholder="e.g. 5 LPA - 8 LPA"
          className="w-full mt-1 bg-brand-accent/50 border border-white/5 p-3 rounded-xl text-sm outline-none focus:border-brand-gold transition-colors text-white"
          value={newJob.salary}
          onChange={e => setNewJob({...newJob, salary: e.target.value})}
        />
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-gold text-brand-dark py-4 rounded-full font-bold flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl shadow-brand-gold/10 disabled:opacity-50 mt-4"
      >
        {isSubmitting ? 'Syncing...' : 'Confirm Posting'} <CheckCircle2 size={18} className="ml-2" />
      </button>
    </form>
  );

  return (
    <div className="bg-brand-light min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-16 gap-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 sm:p-4 bg-brand-dark rounded-xl sm:rounded-2xl text-brand-gold shadow-lg">
              <LayoutDashboard size={24} className="sm:size-[32px]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Dashboard</h1>
              <p className="text-gray-500 text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black">Executive Control Panel</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-500 font-bold uppercase text-[9px] sm:text-[10px] tracking-widest transition-all px-2 py-1"
          >
            <LogOut size={14} className="sm:size-[16px]" />
            <span>Terminate Session</span>
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="flex justify-between items-center px-2 sm:px-0">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-brand-dark flex items-center">
                Active Mandates 
                <span className="ml-3 px-2 py-0.5 bg-brand-dark text-white text-[10px] sm:text-xs rounded-full">{jobs.length}</span>
              </h2>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-brand-dark text-white p-3.5 sm:p-4 rounded-full hover:bg-brand-gold transition-all shadow-xl lg:hidden"
              >
                <Plus size={20} className="sm:size-[24px]" />
              </button>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-28 sm:h-32 bg-gray-200 rounded-[1.5rem] sm:rounded-[2rem]"></div>)}
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="bg-white p-10 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] text-center border-2 border-dashed border-gray-200">
                    <AlertCircle className="mx-auto text-gray-300 mb-4" size={40} />
                    <p className="text-gray-400 italic text-sm">No active job mandates in the database.</p>
                  </div>
                ) : (
                  jobs.map(job => (
                    <MotionDiv 
                      layout
                      key={job._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg border border-gray-100 flex justify-between items-center group"
                    >
                      <div className="flex items-center space-x-4 sm:space-x-6 overflow-hidden">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-light rounded-[1rem] sm:rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/20 flex-shrink-0">
                          <Briefcase size={22} className="sm:size-[28px]" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-base sm:text-xl font-serif font-bold text-brand-dark truncate">{job.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[10px] sm:text-xs text-gray-500 font-medium">
                             <div className="flex items-center"><GraduationCap size={12} className="mr-1 text-brand-gold" /> {job.education}</div>
                             <div className="flex items-center"><Banknote size={12} className="mr-1 text-brand-gold" /> {job.salary}</div>
                             <div className="flex items-center"><Users size={12} className="mr-1 text-brand-gold" /> {job.gender}</div>
                          </div>
                          <span className="inline-block mt-2 px-2.5 py-0.5 bg-brand-light text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-full">
                            {job.industry}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex-shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </MotionDiv>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32 bg-brand-dark p-8 rounded-[2.5rem] text-white shadow-4xl border border-white/5">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center">
                <Plus className="mr-2 text-brand-gold" size={20} /> New Mandate
              </h2>
              <FormContent />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-brand-dark/95 backdrop-blur-sm lg:hidden">
             <MotionDiv 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              className="bg-brand-dark w-full max-w-xl p-8 rounded-t-[2.5rem] sm:rounded-[3rem] border-t border-white/10 overflow-y-auto max-h-[90vh]"
             >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif font-bold text-white">Post Mandate</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-white transition-colors p-2">
                    <X size={24} />
                  </button>
                </div>
                <FormContent isMobile />
             </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
