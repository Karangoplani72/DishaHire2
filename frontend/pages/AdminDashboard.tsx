
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Briefcase, LayoutDashboard, LogOut, CheckCircle2, X, AlertCircle, 
  GraduationCap, Users, Banknote, Archive, MapPin, Info, History, Calendar, Download, 
  Building2, UserCircle2, Filter, Search, Globe, Mail, Phone, ExternalLink, Menu
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
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'companies' | 'candidates'>('overview');
  const [jobView, setJobView] = useState<'active' | 'archived'>('active');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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

  const NavItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === id ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} />
      <span className="text-sm uppercase tracking-widest">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-brand-light">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-brand-dark fixed h-full z-40 p-6">
        <div className="mb-12 px-2">
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-widest text-white leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
            <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Admin Control</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
          <NavItem id="jobs" icon={Briefcase} label="Job Mandates" />
          <NavItem id="companies" icon={Building2} label="Company Leads" />
          <NavItem id="candidates" icon={UserCircle2} label="Candidates" />
        </nav>

        <div className="pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all">
            <LogOut size={20} />
            <span className="text-sm uppercase tracking-widest font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <MotionDiv 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-[100] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MotionDiv 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              className="bg-brand-dark w-72 h-full p-6 shadow-4xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex flex-col">
                  <span className="text-xl font-serif font-bold tracking-widest text-white leading-none">DISHA<span className="text-brand-gold">HIRE</span></span>
                  <span className="text-[7px] uppercase tracking-[0.4em] text-gray-500 font-black">Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-white"><X size={24} /></button>
              </div>
              <nav className="space-y-2">
                <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
                <NavItem id="jobs" icon={Briefcase} label="Jobs" />
                <NavItem id="companies" icon={Building2} label="Companies" />
                <NavItem id="candidates" icon={UserCircle2} label="Candidates" />
              </nav>
              <div className="mt-12">
                <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-red-400 bg-red-400/5 transition-all">
                  <LogOut size={20} />
                  <span className="text-xs uppercase tracking-widest font-bold">Log Out</span>
                </button>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-72 p-4 sm:p-8 lg:p-12">
        {/* Top Header for Mobile */}
        <header className="flex justify-between items-center mb-10 lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-brand-dark text-brand-gold rounded-2xl shadow-lg">
            <Menu size={24} />
          </button>
          <div className="text-right">
            <h1 className="text-xl font-serif font-bold text-brand-dark">Dashboard</h1>
            <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">{activeTab}</p>
          </div>
        </header>

        {/* Content Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <MotionDiv key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="mb-12">
                <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">Platform Performance</h2>
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">Analytical Oversight & Growth Metrics</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {[
                  { label: 'Total Mandates', val: stats.jobCount, icon: Briefcase, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                  { label: 'Company Leads', val: stats.companyCount, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Candidate Profiles', val: stats.candidateCount, icon: UserCircle2, color: 'text-green-500', bg: 'bg-green-500/10' }
                ].map((s, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center justify-between group hover:shadow-2xl transition-all">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                      <p className="text-4xl font-serif font-bold text-brand-dark">{s.val}</p>
                    </div>
                    <div className={`p-5 rounded-3xl ${s.bg} ${s.color}`}><s.icon size={32} /></div>
                  </div>
                ))}
              </div>

              {/* Date Filter */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl mb-12 border border-gray-50">
                <div className="flex flex-col md:flex-row items-end gap-6">
                  <div className="flex-1 w-full">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Performance Range (Start)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
                      <input type="date" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-gold outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Performance Range (End)</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold" size={16} />
                      <input type="date" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-gold outline-none" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <button onClick={fetchAllData} className="bg-brand-dark text-brand-gold px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg">
                    <Filter size={16} /> Recalculate Metrics
                  </button>
                </div>
              </div>
            </MotionDiv>
          )}

          {activeTab === 'jobs' && (
            <MotionDiv key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-brand-dark">Mandate Portfolio</h2>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest font-black mt-1">Management of active & archived requirements</p>
                </div>
                <button onClick={() => setShowAddForm(true)} className="bg-brand-dark text-brand-gold px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-xl transition-all">
                  <Plus size={18} /> New Mandate
                </button>
              </div>

              <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
                <button onClick={() => setJobView('active')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${jobView === 'active' ? 'bg-white text-brand-dark shadow-md' : 'text-gray-400 hover:text-brand-dark'}`}>Live Positions</button>
                <button onClick={() => setJobView('archived')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${jobView === 'archived' ? 'bg-white text-brand-dark shadow-md' : 'text-gray-400 hover:text-brand-dark'}`}>Archive Vault</button>
              </div>

              <div className="grid gap-6">
                {filteredJobs.length === 0 ? (
                  <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 text-gray-400 italic">No {jobView} mandates found in the current selection.</div>
                ) : (
                  filteredJobs.map(job => (
                    <div key={job._id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-50 flex flex-col md:flex-row justify-between gap-8 group hover:shadow-2xl transition-all">
                      <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                           <span className="px-3 py-1 bg-brand-light text-brand-gold text-[9px] font-black uppercase tracking-widest rounded-full">{job.industry}</span>
                           <span className="flex items-center text-[10px] text-gray-400 font-bold uppercase"><MapPin size={12} className="mr-1.5" /> {job.location}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-brand-dark mb-4">{job.title}</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="flex items-center text-xs text-gray-500 font-medium"><GraduationCap size={16} className="mr-3 text-brand-gold" /> {job.education}</div>
                          <div className="flex items-center text-xs text-gray-500 font-medium"><Users size={16} className="mr-3 text-brand-gold" /> {job.gender}</div>
                          <div className="flex items-center text-xs text-gray-500 font-medium font-bold text-brand-dark"><Banknote size={16} className="mr-3 text-brand-gold" /> {job.salary}</div>
                        </div>
                        {job.otherInfo && <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-xs text-gray-400 italic flex gap-3"><Info size={16} className="flex-shrink-0 text-brand-gold" /> {job.otherInfo}</div>}
                      </div>
                      <div className="flex md:flex-col gap-3">
                        <button onClick={() => toggleArchive(job._id, job.isArchived)} className="flex-1 p-4 text-gray-400 hover:text-brand-gold hover:bg-brand-light rounded-2xl transition-all border border-transparent hover:border-brand-gold/20" title={job.isArchived ? "Restore" : "Archive"}>
                          {job.isArchived ? <History size={24} /> : <Archive size={24} />}
                        </button>
                        <button onClick={() => handleDeleteJob(job._id)} className="flex-1 p-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-500/20"><Trash2 size={24} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </MotionDiv>
          )}

          {activeTab === 'companies' && (
            <MotionDiv key="companies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-dark">Corporate Enquiries</h2>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-black mt-1">Direct recruitment mandates from enterprises</p>
              </div>

              <div className="grid gap-6">
                {companyEnquiries.length === 0 ? (
                  <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 text-gray-400 italic font-serif">Awaiting corporate engagements...</div>
                ) : (
                  companyEnquiries.map(enq => (
                    <div key={enq._id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 space-y-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center"><Building2 size={32} /></div>
                          <div>
                            <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[9px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">{enq.companyType}</span>
                            <h3 className="text-2xl font-serif font-bold text-brand-dark">{enq.companyName}</h3>
                            <div className="flex flex-wrap items-center gap-6 mt-2 text-xs text-gray-400 font-medium">
                              <span className="flex items-center gap-2"><Briefcase size={14} /> {enq.industry}</span>
                              <a href={enq.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-gold hover:underline"><Globe size={14} /> Official Site <ExternalLink size={12} /></a>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(enq.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 rounded-[2rem]">
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Stakeholder</p>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-brand-dark text-brand-gold rounded-full flex items-center justify-center font-bold">{enq.contactName[0]}</div>
                            <div>
                              <p className="font-bold text-brand-dark">{enq.contactName}</p>
                              <p className="text-xs text-gray-500 italic">{enq.designation}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Engagement Protocol</p>
                           <div className="space-y-2">
                             <div className="flex items-center gap-3 text-sm text-gray-600 font-medium"><Mail size={16} className="text-brand-gold" /> {enq.email}</div>
                             <div className="flex items-center gap-3 text-sm text-gray-600 font-medium"><Phone size={16} className="text-brand-gold" /> {enq.mobile} {enq.alternateNumber && `/ ${enq.alternateNumber}`}</div>
                           </div>
                        </div>
                        <div className="md:col-span-2 border-t border-gray-200 pt-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Registered Entity Address</p>
                          <p className="text-sm text-gray-600 leading-relaxed italic">{enq.address}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </MotionDiv>
          )}

          {activeTab === 'candidates' && (
            <MotionDiv key="candidates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-brand-dark">Talent Reservoir</h2>
                <p className="text-gray-400 text-[10px] uppercase tracking-widest font-black mt-1">Profile submissions & career applications</p>
              </div>

              <div className="grid gap-6">
                {candidateEnquiries.length === 0 ? (
                  <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 text-gray-400 italic font-serif">Awaiting elite candidate profiles...</div>
                ) : (
                  candidateEnquiries.map(enq => (
                    <div key={enq._id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 group hover:border-brand-gold/20 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-500 shadow-sm"><UserCircle2 size={40} /></div>
                          <div>
                            <h3 className="text-2xl font-serif font-bold text-brand-dark">{enq.name}</h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                              <span className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest"><MapPin size={12} className="mr-1.5" /> {enq.location}</span>
                              <span className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest"><GraduationCap size={12} className="mr-1.5" /> {enq.qualification}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => downloadResume(enq.resumeData, enq.resumeName)} className="flex items-center gap-3 bg-brand-dark text-brand-gold px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                          <Download size={18} /> Official Resume
                        </button>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-gray-50 p-8 rounded-[2rem]">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Preferred Designation</p>
                          <p className="text-sm font-bold text-brand-dark">{enq.preferredRole}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Current Capacity</p>
                          <p className="text-sm font-medium text-gray-600">{enq.currentTitle || 'Entry Level / Fresher'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Expected Compensation</p>
                          <p className="text-sm font-bold text-brand-dark">{enq.expectedSalary}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Notice Threshold</p>
                          <p className="text-sm font-medium text-gray-600">{enq.noticePeriod}</p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-8 text-[11px] text-gray-500 font-medium px-2">
                         <span className="flex items-center gap-2"><Phone size={14} className="text-brand-gold" /> {enq.mobile}</span>
                         <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-gold" /> Target Locations: {enq.preferredLocation}</span>
                         <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-gold" /> Filed on {new Date(enq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </main>

      {/* Creation Modal for Jobs */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md">
            <MotionDiv initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-4xl relative">
               <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 text-gray-400 hover:text-brand-dark transition-colors"><X size={24} /></button>
               
               <div className="p-10 sm:p-16">
                 <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">Create New Mandate</h2>
                 <p className="text-gray-400 text-[10px] uppercase tracking-widest font-black mb-10">Requirement Configuration Panel</p>

                 <form onSubmit={handleAddJob} className="space-y-6">
                   <div>
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Professional Designation</label>
                     <input required placeholder="Senior Recruitment Architect" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                     <div>
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Industry Vertical</label>
                       <input required placeholder="Investment Banking" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} />
                     </div>
                     <div>
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Primary Location</label>
                       <input required placeholder="Hybrid / Remote" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Gender Benchmark</label>
                        <select className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold appearance-none cursor-pointer" value={newJob.gender} onChange={e => setNewJob({...newJob, gender: e.target.value})}>
                          <option value="Any">Equal Opportunity / Any</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Compensation Slab</label>
                        <input required placeholder="18 - 25 LPA" className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                      </div>
                   </div>
                   <div>
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Detailed Mandate Information</label>
                     <textarea rows={3} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold resize-none" value={newJob.otherInfo} onChange={e => setNewJob({...newJob, otherInfo: e.target.value})} />
                   </div>
                   <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-6 rounded-full font-bold text-lg uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                     {isSubmitting ? 'Syncing...' : 'Publish Official Mandate'}
                   </button>
                 </form>
               </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
