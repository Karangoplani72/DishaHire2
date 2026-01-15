
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Briefcase, LayoutDashboard, LogOut, X, 
  GraduationCap, Users, Banknote, Archive, MapPin, Info, History, Calendar, Download, 
  Building2, UserCircle2, Filter, Globe, Mail, Phone, ExternalLink, Menu
} from 'lucide-react';
import { API_BASE_URL } from '../constants.tsx';

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
  
  const [filters, setFilters] = useState({
    jobs: { start: '', end: '' },
    companies: { start: '', end: '' },
    candidates: { start: '', end: '' }
  });

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
      const currentFilters = activeTab === 'jobs' ? filters.jobs :
                             activeTab === 'companies' ? filters.companies :
                             activeTab === 'candidates' ? filters.candidates : { start: '', end: '' };

      const filterQuery = `startDate=${currentFilters.start}&endDate=${currentFilters.end}`;

      const [jobsRes, companyRes, candidateRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/jobs?includeArchived=true&${filterQuery}`),
        fetch(`${API_BASE_URL}/api/admin/enquiries/company?${filterQuery}`),
        fetch(`${API_BASE_URL}/api/admin/enquiries/candidate?${filterQuery}`),
        fetch(`${API_BASE_URL}/api/admin/stats`)
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
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create mandate.");
      }
    } catch (err) { console.error(err); alert("Network error occurred."); } 
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
    if (window.confirm('Delete Permanently?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAllData();
      } catch (err) { console.error(err); }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const NavItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${activeTab === id ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={20} />
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </button>
  );

  const DateFilterUI = ({ tab }: { tab: 'jobs' | 'companies' | 'candidates' }) => (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl mb-10 border border-gray-50">
      <div className="flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold opacity-50" size={16} />
            <input 
              type="date" 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-gold outline-none" 
              value={filters[tab].start} 
              onChange={e => setFilters({...filters, [tab]: { ...filters[tab], start: e.target.value }})} 
            />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold opacity-50" size={16} />
            <input 
              type="date" 
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-brand-gold outline-none" 
              value={filters[tab].end} 
              onChange={e => setFilters({...filters, [tab]: { ...filters[tab], end: e.target.value }})} 
            />
          </div>
        </div>
        <button onClick={fetchAllData} className="w-full md:w-auto bg-brand-dark text-brand-gold px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">
          <Filter size={14} /> Update Results
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-light">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-brand-dark fixed h-full z-40 p-6">
        <div className="mb-12 px-2">
          <span className="text-2xl font-serif font-bold tracking-widest text-white block">DISHA<span className="text-brand-gold">HIRE</span></span>
          <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500 font-black mt-1">Personnel Ops</span>
        </div>
        <nav className="flex-grow space-y-2">
          <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="jobs" icon={Briefcase} label="Mandates" />
          <NavItem id="companies" icon={Building2} label="Leads" />
          <NavItem id="candidates" icon={UserCircle2} label="Applicants" />
        </nav>
        <div className="pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-400 hover:text-red-400 transition-all">
            <LogOut size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <MotionDiv 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md z-[100] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MotionDiv 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              className="bg-brand-dark w-72 h-full p-6 shadow-4xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-serif font-bold tracking-widest text-white">DISHA<span className="text-brand-gold">HIRE</span></span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-white"><X size={24} /></button>
              </div>
              <nav className="space-y-2 flex-grow">
                <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
                <NavItem id="jobs" icon={Briefcase} label="Jobs" />
                <NavItem id="companies" icon={Building2} label="Companies" />
                <NavItem id="candidates" icon={UserCircle2} label="Candidates" />
              </nav>
              <button onClick={handleLogout} className="w-full mt-auto flex items-center space-x-4 px-6 py-4 text-red-400 font-bold uppercase tracking-widest text-[10px]">
                <LogOut size={20} /> Logout Account
              </button>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 p-4 sm:p-8 lg:p-12 pb-24 lg:pb-12">
        <header className="flex justify-between items-center mb-8 lg:mb-12">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-brand-dark text-brand-gold rounded-2xl">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-3xl font-serif font-bold text-brand-dark">Administrative Command</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Session Active: {activeTab}</p>
          </div>
          <div className="text-right lg:hidden">
            <span className="text-sm font-black uppercase tracking-widest text-brand-gold">{activeTab}</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <MotionDiv key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {[
                  { label: 'Total Jobs', val: stats.jobCount, icon: Briefcase, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
                  { label: 'Company Leads', val: stats.companyCount, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { label: 'Applicants', val: stats.candidateCount, icon: UserCircle2, color: 'text-green-500', bg: 'bg-green-500/10' }
                ].map((s, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                      <p className="text-4xl font-serif font-bold text-brand-dark">{s.val}</p>
                    </div>
                    <div className={`p-5 rounded-3xl ${s.bg} ${s.color}`}><s.icon size={28} /></div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          )}

          {activeTab === 'jobs' && (
            <MotionDiv key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Mandate Portfolio</h2>
                <button onClick={() => setShowAddForm(true)} className="bg-brand-dark text-brand-gold px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Plus size={16} /> New Mandate
                </button>
              </div>
              <DateFilterUI tab="jobs" />
              <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
                <button onClick={() => setJobView('active')} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${jobView === 'active' ? 'bg-white text-brand-dark shadow' : 'text-gray-400'}`}>Active</button>
                <button onClick={() => setJobView('archived')} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${jobView === 'archived' ? 'bg-white text-brand-dark shadow' : 'text-gray-400'}`}>Archive</button>
              </div>
              <div className="grid gap-6">
                {jobs.filter(j => jobView === 'active' ? !j.isArchived : j.isArchived).map(job => (
                  <div key={job._id} className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-3">
                         <span className="px-3 py-1 bg-brand-light text-brand-gold text-[8px] font-black uppercase tracking-widest rounded-full">{job.industry}</span>
                         <span className="flex items-center text-[9px] text-gray-400 font-bold uppercase"><MapPin size={12} className="mr-1" /> {job.location}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-brand-dark mb-4">{job.title}</h3>
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-gray-500">
                        <span className="flex items-center gap-2"><GraduationCap size={14} className="text-brand-gold" /> {job.education}</span>
                        <span className="flex items-center gap-2"><Banknote size={14} className="text-brand-gold" /> {job.salary}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleArchive(job._id, job.isArchived)} className="flex-1 p-4 text-gray-400 hover:text-brand-gold bg-gray-50 rounded-2xl transition-all">
                        {job.isArchived ? <History size={20} /> : <Archive size={20} />}
                      </button>
                      <button onClick={() => handleDeleteJob(job._id)} className="flex-1 p-4 text-gray-400 hover:text-red-500 bg-gray-50 rounded-2xl transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          )}

          {activeTab === 'companies' && (
            <MotionDiv key="companies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Corporate Enquiries</h2>
              <DateFilterUI tab="companies" />
              <div className="grid gap-6">
                {companyEnquiries.map(enq => (
                  <div key={enq._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-full mb-2 inline-block">{enq.companyType}</span>
                        <h3 className="text-xl font-serif font-bold text-brand-dark">{enq.companyName}</h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <a href={enq.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-brand-gold hover:underline"><Globe size={12} /> Website <ExternalLink size={10} /></a>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(enq.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right border-t sm:border-t-0 pt-4 sm:pt-0">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Primary Contact</p>
                        <p className="font-bold text-brand-dark">{enq.contactName}</p>
                        <p className="text-xs text-gray-500 italic">{enq.designation}</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 p-6 bg-gray-50 rounded-3xl text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3"><Mail size={14} className="text-brand-gold" /> {enq.email}</div>
                        <div className="flex items-center gap-3"><Phone size={14} className="text-brand-gold" /> {enq.mobile}</div>
                      </div>
                      <div className="flex items-start gap-3 italic text-gray-500"><MapPin size={14} className="text-brand-gold mt-1" /> {enq.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          )}

          {activeTab === 'candidates' && (
            <MotionDiv key="candidates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Applicant Talent Pool</h2>
              <DateFilterUI tab="candidates" />
              <div className="grid gap-6">
                {candidateEnquiries.map(enq => (
                  <div key={enq._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center"><UserCircle2 size={32} /></div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-brand-dark">{enq.name}</h3>
                          <div className="flex gap-4 mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {enq.location}</span>
                            <span className="flex items-center gap-1"><GraduationCap size={12} /> {enq.qualification}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => window.open(enq.resumeData)} className="bg-brand-dark text-brand-gold px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                        <Download size={16} /> View Profile
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-3xl text-xs">
                      <div><p className="text-[9px] uppercase text-gray-400 mb-1">Role</p><p className="font-bold">{enq.preferredRole}</p></div>
                      <div><p className="text-[9px] uppercase text-gray-400 mb-1">Expected</p><p className="font-bold">{enq.expectedSalary}</p></div>
                      <div><p className="text-[9px] uppercase text-gray-400 mb-1">Notice</p><p className="font-bold">{enq.noticePeriod}</p></div>
                      <div><p className="text-[9px] uppercase text-gray-400 mb-1">Mobile</p><p className="font-bold">{enq.mobile}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </main>

      {/* Add Job Modal - Fixed Form Logic and Sizing */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md">
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white w-full max-w-2xl rounded-[2.5rem] sm:rounded-[3.5rem] relative overflow-hidden flex flex-col max-h-[90vh]"
            >
               <div className="p-6 sm:p-10 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                 <div>
                   <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">New Mandate</h2>
                   <p className="text-gray-400 text-[9px] uppercase tracking-widest font-black">Publish Recruitment Requirement</p>
                 </div>
                 <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                   <X size={28} />
                 </button>
               </div>
               
               <div className="flex-grow overflow-y-auto p-6 sm:p-10">
                 <form onSubmit={handleAddJob} className="space-y-6">
                   <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Position Title*</label>
                       <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" placeholder="Senior Sales Executive" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Industry*</label>
                       <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" placeholder="e.g. Finance" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} />
                     </div>
                   </div>

                   <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Location*</label>
                       <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" placeholder="Rajkot, Gujarat / Remote" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Education Required*</label>
                       <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" placeholder="Graduate / MBA" value={newJob.education} onChange={e => setNewJob({...newJob, education: e.target.value})} />
                     </div>
                   </div>

                   <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Salary Slab*</label>
                       <input required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" placeholder="15,000 - 25,000 / month" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                     </div>
                     <div className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Gender Preference*</label>
                       <select required className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm appearance-none cursor-pointer" value={newJob.gender} onChange={e => setNewJob({...newJob, gender: e.target.value})}>
                         <option value="Any">Equal Opportunity (Any)</option>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                       </select>
                     </div>
                   </div>

                   <div className="space-y-1.5">
                     <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Detailed Information (Optional)</label>
                     <textarea rows={3} className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm resize-none" placeholder="Enter job description or other benefits..." value={newJob.otherInfo} onChange={e => setNewJob({...newJob, otherInfo: e.target.value})} />
                   </div>

                   <div className="pt-4 sticky bottom-0 bg-white">
                     <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl disabled:opacity-50">
                       {isSubmitting ? 'Syncing with Server...' : 'Confirm and Publish Mandate'}
                     </button>
                   </div>
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
