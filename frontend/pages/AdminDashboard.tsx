
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Briefcase, LayoutDashboard, LogOut, CheckCircle2, X, AlertCircle, 
  GraduationCap, Users, Banknote, Archive, MapPin, Info, History, Calendar, Download, 
  Building2, UserCircle2, Filter, Search, Globe, Mail, Phone, ExternalLink
} from 'lucide-react';
import { API_BASE_URL, COMPANY_TYPES } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [companyEnquiries, setCompanyEnquiries] = useState<any[]>([]);
  const [candidateEnquiries, setCandidateEnquiries] = useState<any[]>([]);
  const [stats, setStats] = useState({ jobCount: 0, companyCount: 0, candidateCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'companies' | 'candidates'>('jobs');
  const [jobView, setJobView] = useState<'active' | 'archived'>('active');
  
  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [newJob, setNewJob] = useState({
    title: '', education: '', gender: 'Any', salary: '', industry: '', location: '', otherInfo: ''
  });

  useEffect(() => {
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const statsUrl = `${API_BASE_URL}/api/admin/stats?startDate=${startDate}&endDate=${endDate}`;
      
      const [jobsRes, companyRes, candidateRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/jobs?includeArchived=true`),
        fetch(`${API_BASE_URL}/api/admin/enquiries/company`),
        fetch(`${API_BASE_URL}/api/admin/enquiries/candidate`),
        fetch(statsUrl)
      ]);

      const [jobsData, companyData, candidateData, statsData] = await Promise.all([
        jobsRes.json(), companyRes.json(), candidateRes.json(), statsRes.json()
      ]);

      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCompanyEnquiries(Array.isArray(companyData) ? companyData : []);
      setCandidateEnquiries(Array.isArray(candidateData) ? candidateData : []);
      setStats(statsData || { jobCount: 0, companyCount: 0, candidateCount: 0 });
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
        fetchAllData();
      }
    } catch (err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  };

  const toggleArchive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: !currentStatus })
      });
      if (res.ok) fetchAllData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('PERMANENT DELETE? This cannot be undone.')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAllData();
      } catch (err) { console.error(err); }
    }
  };

  const downloadResume = (base64: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename || 'resume.pdf';
    link.click();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const filteredJobs = jobs.filter(j => jobView === 'active' ? !j.isArchived : j.isArchived);

  return (
    <div className="bg-brand-light min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-brand-dark rounded-2xl text-brand-gold shadow-lg"><LayoutDashboard size={32} /></div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-brand-dark">Admin Dashboard</h1>
              <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">Personnel Management & Control</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition-all">
            <LogOut size={16} /> <span>Logout</span>
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active Jobs', val: stats.jobCount, icon: Briefcase, color: 'text-brand-gold' },
            { label: 'Company Enquiries', val: stats.companyCount, icon: Building2, color: 'text-blue-500' },
            { label: 'Candidate Enquiries', val: stats.candidateCount, icon: UserCircle2, color: 'text-green-500' }
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                <p className="text-4xl font-serif font-bold text-brand-dark">{s.val}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-gray-50 ${s.color}`}><s.icon size={28} /></div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl mb-10 border border-gray-50 flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
              <input type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
              <input type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <button onClick={fetchAllData} className="bg-brand-dark text-brand-gold px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
            <Filter size={16} /> Apply Filters
          </button>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center space-x-8 border-b border-gray-200 pb-2">
              {[
                { id: 'jobs', label: 'Jobs' },
                { id: 'companies', label: 'Company Leads' },
                { id: 'candidates', label: 'Candidates' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-sm font-black uppercase tracking-widest pb-4 transition-all relative ${activeTab === tab.id ? 'text-brand-dark' : 'text-gray-400'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <MotionDiv layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold rounded-full" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'jobs' && (
                <MotionDiv key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button onClick={() => setJobView('active')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${jobView === 'active' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'}`}>Active Job</button>
                      <button onClick={() => setJobView('archived')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${jobView === 'archived' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400'}`}>Archived Records</button>
                    </div>
                    <button onClick={() => setShowAddForm(true)} className="lg:hidden bg-brand-dark text-brand-gold p-3 rounded-full shadow-lg"><Plus size={20} /></button>
                  </div>

                  <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                      <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200 text-gray-400 italic">No {jobView} jobs found.</div>
                    ) : (
                      filteredJobs.map(job => (
                        <div key={job._id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 flex flex-col md:flex-row justify-between gap-6 group">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                               <span className="px-2 py-0.5 bg-brand-light text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-full">{job.industry}</span>
                               <span className="flex items-center text-[10px] text-gray-400 font-bold uppercase"><MapPin size={10} className="mr-1" /> {job.location}</span>
                            </div>
                            <h3 className="text-xl font-serif font-bold text-brand-dark mb-3">{job.title}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <div className="flex items-center text-[11px] text-gray-500 font-medium"><GraduationCap size={14} className="mr-2 text-brand-gold" /> {job.education}</div>
                              <div className="flex items-center text-[11px] text-gray-500 font-medium"><Users size={14} className="mr-2 text-brand-gold" /> {job.gender}</div>
                              <div className="flex items-center text-[11px] text-gray-500 font-medium"><Banknote size={14} className="mr-2 text-brand-gold" /> {job.salary}</div>
                            </div>
                            {job.otherInfo && <div className="mt-4 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-400 italic flex gap-2"><Info size={14} className="flex-shrink-0" /> {job.otherInfo}</div>}
                          </div>
                          <div className="flex md:flex-col gap-2">
                            <button onClick={() => toggleArchive(job._id, job.isArchived)} className="flex-1 p-3 text-gray-400 hover:text-brand-gold hover:bg-brand-light rounded-xl transition-all" title={job.isArchived ? "Restore" : "Archive"}>
                              {job.isArchived ? <History size={20} /> : <Archive size={20} />}
                            </button>
                            <button onClick={() => handleDeleteJob(job._id)} className="flex-1 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </MotionDiv>
              )}

              {activeTab === 'companies' && (
                <MotionDiv key="companies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {companyEnquiries.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200 text-gray-400 italic">No company enquiries yet.</div>
                  ) : (
                    companyEnquiries.map(enq => (
                      <div key={enq._id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <div>
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-500 text-[8px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">{enq.companyType}</span>
                            <h3 className="text-xl font-serif font-bold text-brand-dark">{enq.companyName}</h3>
                            <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-400 font-medium">
                              <span className="flex items-center gap-1"><Briefcase size={12} /> {enq.industry}</span>
                              <a href={enq.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-gold hover:underline"><Globe size={12} /> Website <ExternalLink size={10} /></a>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(enq.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Person</p>
                            <p className="font-bold text-brand-dark">{enq.contactName}</p>
                            <p className="text-xs text-gray-500">{enq.designation}</p>
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-gray-600"><Mail size={14} className="text-brand-gold" /> {enq.email}</div>
                             <div className="flex items-center gap-2 text-xs text-gray-600"><Phone size={14} className="text-brand-gold" /> {enq.mobile} {enq.alternateNumber && `/ ${enq.alternateNumber}`}</div>
                          </div>
                          <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Office Address</p>
                            <p className="text-xs text-gray-600">{enq.address}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </MotionDiv>
              )}

              {activeTab === 'candidates' && (
                <MotionDiv key="candidates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {candidateEnquiries.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-200 text-gray-400 italic">No candidate submissions yet.</div>
                  ) : (
                    candidateEnquiries.map(enq => (
                      <div key={enq._id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500"><UserCircle2 size={24} /></div>
                            <div>
                              <h3 className="text-lg font-serif font-bold text-brand-dark">{enq.name}</h3>
                              <p className="text-[10px] text-gray-400 font-bold uppercase">{enq.location} • DOQ: {enq.qualification}</p>
                            </div>
                          </div>
                          <button onClick={() => downloadResume(enq.resumeData, enq.resumeName)} className="flex items-center gap-2 bg-brand-light text-brand-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all">
                            <Download size={14} /> Resume
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-gray-50 p-6 rounded-2xl">
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Preferred Role</p>
                            <p className="text-xs font-bold text-brand-dark">{enq.preferredRole}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Experience/Title</p>
                            <p className="text-xs font-bold text-brand-dark">{enq.currentTitle || 'Fresher'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Expected Salary</p>
                            <p className="text-xs font-bold text-brand-dark">{enq.expectedSalary}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Notice Period</p>
                            <p className="text-xs font-bold text-brand-dark">{enq.noticePeriod}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-gray-500 px-2">
                           <span className="flex items-center gap-1"><Phone size={12} /> {enq.mobile}</span>
                           <span className="flex items-center gap-1"><MapPin size={12} /> Preferred: {enq.preferredLocation}</span>
                           <span className="flex items-center gap-1"><Calendar size={12} /> Submitted: {new Date(enq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          {/* Creation Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-32 bg-brand-dark p-8 rounded-[2.5rem] text-white shadow-3xl">
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center text-brand-gold"><Plus className="mr-2" /> New Job</h2>
              <form onSubmit={handleAddJob} className="space-y-5">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                  <input required placeholder="Operations Manager" className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-brand-gold" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Industry</label>
                    <input required placeholder="Healthcare" className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-brand-gold" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                    <input required placeholder="Mumbai" className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-brand-gold" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Education</label>
                  <input required placeholder="Graduate" className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-brand-gold" value={newJob.education} onChange={e => setNewJob({...newJob, education: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Gender</label>
                    <select className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none cursor-pointer" value={newJob.gender} onChange={e => setNewJob({...newJob, gender: e.target.value})}>
                      <option value="Any" className="bg-brand-dark">Any</option>
                      <option value="Male" className="bg-brand-dark">Male</option>
                      <option value="Female" className="bg-brand-dark">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Salary</label>
                    <input required placeholder="12 LPA" className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs outline-none focus:border-brand-gold" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Other Details</label>
                  <textarea rows={2} className="w-full mt-1 bg-white/5 border border-white/10 p-3 rounded-xl text-sm outline-none focus:border-brand-gold resize-none" value={newJob.otherInfo} onChange={e => setNewJob({...newJob, otherInfo: e.target.value})} />
                </div>
                <button disabled={isSubmitting} className="w-full bg-brand-gold text-brand-dark py-4 rounded-full font-bold flex items-center justify-center hover:bg-yellow-500 transition-all shadow-xl disabled:opacity-50">
                  {isSubmitting ? 'Syncing...' : 'Confirm Job Posting'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-end bg-brand-dark/95 backdrop-blur-sm lg:hidden">
            <MotionDiv initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-brand-dark w-full p-8 rounded-t-[3rem] overflow-y-auto max-h-[95vh] text-white">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-serif font-bold text-brand-gold">New Job Posting</h2>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-500 p-2"><X size={28} /></button>
               </div>
               <form onSubmit={handleAddJob} className="space-y-5">
                 {/* Reusing fields for mobile... abbreviated for brevity */}
                 <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label><input required className="w-full mt-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Industry</label><input required className="w-full mt-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} /></div>
                    <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label><input required className="w-full mt-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} /></div>
                 </div>
                 <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Education</label><input required className="w-full mt-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={newJob.education} onChange={e => setNewJob({...newJob, education: e.target.value})} /></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 text-white">Gender</label><select className="w-full mt-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={newJob.gender} onChange={e => setNewJob({...newJob, gender: e.target.value})}><option value="Any">Any</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                    <div><label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Salary</label><input required className="w-full mt-1 bg-white/5 border border-white/10 p-4 rounded-xl text-white" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} /></div>
                 </div>
                 <button disabled={isSubmitting} className="w-full bg-brand-gold text-brand-dark py-5 rounded-full font-bold shadow-xl mt-4">Post Job</button>
               </form>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
