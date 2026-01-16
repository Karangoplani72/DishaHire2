import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate, Link } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Briefcase, LayoutDashboard, LogOut, X, 
  GraduationCap, Banknote, Archive, MapPin, 
  Building2, UserCircle2, Globe, Mail, Phone, Menu,
  ChevronRight, ClipboardCheck, Users, Info, Loader2, CheckCircle
} from 'lucide-react';
import { API_BASE_URL } from '../constants.tsx';

// Logo import
import logo from './logo.png';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [newJob, setNewJob] = useState({
    title: '', education: '', gender: 'Any', salary: '', industry: '', location: '', otherInfo: ''
  });

  useEffect(() => {
    if (!sessionStorage.getItem('isAdmin')) {
      navigate('/admin/login');
      return;
    }
    fetchAllData();
  }, [navigate, activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [jobsRes, companyRes, candidateRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/jobs?includeArchived=true`),
        fetch(`${API_BASE_URL}/api/admin/enquiries/company`),
        fetch(`${API_BASE_URL}/api/admin/enquiries/candidate`),
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
      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all relative ${activeTab === id ? 'bg-brand-gold text-brand-dark font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={18} />
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
      {activeTab === id && <MotionDiv layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-brand-dark rounded-r-full" />}
    </button>
  );

  const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle: string, action?: React.ReactNode }) => (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-dark">{title}</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mt-1">{subtitle}</p>
      </div>
      {action}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F0F2F5]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark p-6 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-12 px-2 flex justify-between items-center">
          <Link to="/" className="block">
            <img 
              src={logo} 
              alt="DishaHire Logo" 
              className="h-12 w-auto object-contain"
            />
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white"><X size={20}/></button>
        </div>
        
        <nav className="space-y-2">
          <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="jobs" icon={Briefcase} label="Mandate Hub" />
          <NavItem id="companies" icon={Building2} label="Entity Leads" />
          <NavItem id="candidates" icon={UserCircle2} label="Talent Pipeline" />
        </nav>

        <div className="absolute bottom-10 left-6 right-6 pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-500 hover:text-red-400 transition-all">
            <LogOut size={18} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Terminate Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow lg:ml-72 p-6 sm:p-10 lg:p-14">
        <header className="flex justify-between items-center mb-10">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-brand-dark text-brand-gold rounded-2xl shadow-xl">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Administrative Interface</p>
            <h1 className="text-sm font-bold text-brand-dark">Control Center v1.1.0</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-bold text-brand-dark">Super Admin</p>
               <p className="text-[9px] text-gray-400">Secure Environment</p>
            </div>
            <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark font-bold">A</div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-[60vh] text-brand-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-widest">Synchronizing Encrypted Data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <MotionDiv key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <SectionHeader title="Operational Summary" subtitle="Live Intelligence Feed" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {[
                    { label: 'Active Mandates', val: stats.jobCount, icon: Briefcase, color: 'text-brand-gold' },
                    { label: 'Company Enquiries', val: stats.companyCount, icon: Building2, color: 'text-blue-500' },
                    { label: 'Candidate Submissions', val: stats.candidateCount, icon: UserCircle2, color: 'text-green-500' }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-white flex flex-col items-center text-center group hover:border-brand-gold transition-all duration-500">
                      <div className={`p-5 rounded-3xl bg-gray-50 ${s.color} mb-6 transition-transform group-hover:scale-110`}><s.icon size={28}/></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{s.label}</p>
                      <p className="text-5xl font-serif font-bold text-brand-dark">{s.val}</p>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}

            {activeTab === 'jobs' && (
              <MotionDiv key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <SectionHeader 
                  title="Mandate Hub" 
                  subtitle="Enterprise Opportunities" 
                  action={
                    <button onClick={() => setShowAddForm(true)} className="px-8 py-4 bg-brand-dark text-brand-gold rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl hover:bg-black transition-all">
                      <Plus size={16} /> Create Mandate
                    </button>
                  } 
                />
                <div className="grid gap-8">
                  {jobs.map(job => (
                    <div key={job._id} className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col md:flex-row justify-between gap-6 hover:shadow-xl transition-all ${job.isArchived ? 'opacity-60 grayscale' : ''}`}>
                      <div className="flex-grow flex items-start gap-6">
                        <div className={`p-4 rounded-2xl ${job.isArchived ? 'bg-gray-100 text-gray-400' : 'bg-brand-light text-brand-gold'}`}><Briefcase size={24}/></div>
                        <div>
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-gold mb-1 block">{job.industry}</span>
                          <h3 className="text-2xl font-serif font-bold text-brand-dark">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 mt-3 font-medium">
                             <span className="flex items-center gap-1.5"><MapPin size={14}/> {job.location}</span>
                             <span className="flex items-center gap-1.5"><Banknote size={14}/> {job.salary}</span>
                             <span className="flex items-center gap-1.5"><Users size={14}/> {job.gender}</span>
                             <span className="flex items-center gap-1.5"><GraduationCap size={14}/> {job.education}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => toggleArchive(job._id, job.isArchived)} title={job.isArchived ? 'Activate' : 'Archive'} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-brand-gold transition-all"><Archive size={18} /></button>
                         <button onClick={() => handleDeleteJob(job._id)} title="Delete" className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}

            {activeTab === 'companies' && (
              <MotionDiv key="companies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <SectionHeader title="Entity Leads" subtitle="B2B Acquisition Requests" />
                <div className="grid gap-8">
                  {companyEnquiries.map(enq => (
                    <div key={enq._id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-white hover:shadow-xl transition-all">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl">{enq.companyName.charAt(0)}</div>
                           <div>
                              <h3 className="text-2xl font-serif font-bold text-brand-dark">{enq.companyName}</h3>
                              <p className="text-[10px] font-black uppercase text-gray-400">{enq.companyType} • {enq.industry}</p>
                           </div>
                        </div>
                        <span className="px-4 py-2 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded-full">{new Date(enq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                         <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase text-gray-400">Primary Contact</p>
                            <p className="text-sm font-bold text-brand-dark">{enq.contactName}</p>
                         </div>
                         <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase text-gray-400">Communication</p>
                            <a href={`mailto:${enq.email}`} className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-2"><Mail size={12}/> {enq.email}</a>
                            <a href={`tel:${enq.mobile}`} className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-2"><Phone size={12}/> {enq.mobile}</a>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}

            {activeTab === 'candidates' && (
              <MotionDiv key="candidates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <SectionHeader title="Talent Pipeline" subtitle="Career Mapping Pool" />
                <div className="grid gap-8">
                  {candidateEnquiries.map(enq => (
                    <div key={enq._id} className="bg-white p-10 rounded-[3rem] shadow-sm border border-white hover:shadow-xl transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center"><UserCircle2 size={32}/></div>
                          <div>
                             <h3 className="text-2xl font-serif font-bold text-brand-dark">{enq.name}</h3>
                             <div className="flex items-center gap-4 text-xs font-bold mt-1">
                                <a href={`mailto:${enq.email}`} className="text-brand-gold hover:underline flex items-center gap-1"><Mail size={12}/> {enq.email}</a>
                                <a href={`tel:${enq.mobile}`} className="text-brand-gold hover:underline flex items-center gap-1"><Phone size={12}/> {enq.mobile}</a>
                             </div>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase">Received At</p>
                           <p className="text-sm font-bold text-brand-dark">{new Date(enq.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-brand-dark/90 backdrop-blur-md">
            <MotionDiv initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-[3rem] p-10 relative shadow-4xl">
               <button onClick={() => setShowAddForm(false)} className="absolute top-10 right-10 text-gray-400 hover:text-brand-dark"><X size={28}/></button>
               <h2 className="text-3xl font-serif font-bold text-brand-dark mb-10">Create Mandate</h2>
               <form onSubmit={handleAddJob} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="sm:col-span-2">
                    <label className="text-[9px] font-black uppercase text-gray-400 mb-2 block">Job Title*</label>
                    <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none" placeholder="e.g. Senior VP of Operations" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 mb-2 block">Industry Verticals*</label>
                    <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 mb-2 block">Location*</label>
                    <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 mb-2 block">Academic Prerequisites*</label>
                    <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none" value={newJob.education} onChange={e => setNewJob({...newJob, education: e.target.value})} />
                 </div>
                 <div>
                    <label className="text-[9px] font-black uppercase text-gray-400 mb-2 block">Compensation Slab*</label>
                    <input required className="w-full bg-gray-50 p-5 rounded-2xl outline-none" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                 </div>
                 <div className="sm:col-span-2 pt-4">
                    <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-6 rounded-3xl font-bold uppercase tracking-[0.3em] text-[12px] shadow-2xl flex items-center justify-center gap-4 hover:bg-black transition-all">
                       {isSubmitting ? <Loader2 className="animate-spin"/> : <CheckCircle size={20}/>}
                       {isSubmitting ? 'Publishing...' : 'Confirm Mandate'}
                    </button>
                 </div>
               </form>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
