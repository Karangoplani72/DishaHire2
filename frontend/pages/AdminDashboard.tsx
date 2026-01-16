
import React, { useEffect, useState } from 'react';
import * as RouterDOM from 'react-router-dom';
const { useNavigate, Link } = RouterDOM as any;
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Briefcase, LayoutDashboard, LogOut, X, 
  GraduationCap, Banknote, Archive, MapPin, Calendar, 
  Building2, UserCircle2, Filter, Globe, Mail, Phone, ExternalLink, Menu, ArrowLeft
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
          <input 
            type="date" 
            className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-sm outline-none" 
            value={filters[tab].start} 
            onChange={e => setFilters({...filters, [tab]: { ...filters[tab], start: e.target.value }})} 
          />
        </div>
        <div className="flex-1 w-full">
          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">End Date</label>
          <input 
            type="date" 
            className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl text-sm outline-none" 
            value={filters[tab].end} 
            onChange={e => setFilters({...filters, [tab]: { ...filters[tab], end: e.target.value }})} 
          />
        </div>
        <button onClick={fetchAllData} className="w-full md:w-auto bg-brand-dark text-brand-gold px-10 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">
          <Filter size={14} /> Update Results
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-light">
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
        <div className="pt-6 border-t border-white/10 space-y-2">
          <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-400 hover:text-red-400 transition-all">
            <LogOut size={20} />
            <span className="text-xs uppercase tracking-widest font-bold">Log Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow lg:ml-72 p-4 sm:p-8 lg:p-12 pb-24 lg:pb-12">
        <header className="flex justify-between items-center mb-8 lg:mb-12">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-brand-dark text-brand-gold rounded-2xl">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-3xl font-serif font-bold text-brand-dark">Administrative Command</h1>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Session Active: {activeTab}</p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64 text-brand-gold">
            <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <MotionDiv key="overview" className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Jobs</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">{stats.jobCount}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Company Leads</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">{stats.companyCount}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Applicants</p>
                  <p className="text-4xl font-serif font-bold text-brand-dark">{stats.candidateCount}</p>
                </div>
              </MotionDiv>
            )}

            {activeTab === 'jobs' && (
              <MotionDiv key="jobs" className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-serif font-bold text-brand-dark">Mandate Portfolio</h2>
                  <button onClick={() => setShowAddForm(true)} className="bg-brand-dark text-brand-gold px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"><Plus size={16} /> New Mandate</button>
                </div>
                <DateFilterUI tab="jobs" />
                <div className="grid gap-6">
                  {jobs.map(job => (
                    <div key={job._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-grow">
                        <span className="px-2 py-1 bg-brand-light text-brand-gold text-[8px] font-black uppercase rounded-full mb-2 inline-block">{job.industry}</span>
                        <h3 className="text-xl font-serif font-bold text-brand-dark">{job.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                           <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                           <span className="flex items-center gap-1"><Banknote size={12}/> {job.salary}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => toggleArchive(job._id, job.isArchived)} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-brand-gold"><Archive size={20} /></button>
                         <button onClick={() => handleDeleteJob(job._id)} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}

            {activeTab === 'companies' && (
              <MotionDiv key="companies" className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Corporate Enquiries</h2>
                <DateFilterUI tab="companies" />
                <div className="grid gap-6">
                  {companyEnquiries.map(enq => (
                    <div key={enq._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-full mb-2 inline-block">{enq.companyType}</span>
                          <h3 className="text-xl font-serif font-bold text-brand-dark">{enq.companyName}</h3>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(enq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2"><Mail size={14} className="text-brand-gold"/> {enq.email}</p>
                          <p className="flex items-center gap-2"><Phone size={14} className="text-brand-gold"/> {enq.mobile}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-brand-dark">{enq.contactName}</p>
                          <p className="text-xs italic">{enq.designation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}

            {activeTab === 'candidates' && (
              <MotionDiv key="candidates" className="space-y-8">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Applicant Talent Pool</h2>
                <DateFilterUI tab="candidates" />
                <div className="grid gap-6">
                  {candidateEnquiries.map(enq => (
                    <div key={enq._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><UserCircle2 size={24}/></div>
                          <div>
                             <h3 className="text-xl font-serif font-bold text-brand-dark">{enq.name}</h3>
                             <p className="text-xs text-gray-400">{enq.email}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(enq.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-2xl text-xs">
                         <div><p className="text-gray-400 mb-1">Preferred Role</p><p className="font-bold">{enq.preferredRole}</p></div>
                         <div><p className="text-gray-400 mb-1">Education</p><p className="font-bold">{enq.qualification}</p></div>
                         <div><p className="text-gray-400 mb-1">Location</p><p className="font-bold">{enq.location}</p></div>
                         <div><p className="text-gray-400 mb-1">Mobile</p><p className="font-bold">{enq.mobile}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Add Job Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md">
            <MotionDiv className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 sm:p-10 relative">
               <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-gray-400"><X size={24}/></button>
               <h2 className="text-2xl font-serif font-bold text-brand-dark mb-8">New Mandate</h2>
               <form onSubmit={handleAddJob} className="space-y-4">
                 <input required className="w-full bg-gray-50 p-4 rounded-xl outline-none" placeholder="Title*" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                 <input required className="w-full bg-gray-50 p-4 rounded-xl outline-none" placeholder="Industry*" value={newJob.industry} onChange={e => setNewJob({...newJob, industry: e.target.value})} />
                 <input required className="w-full bg-gray-50 p-4 rounded-xl outline-none" placeholder="Location*" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                 <input required className="w-full bg-gray-50 p-4 rounded-xl outline-none" placeholder="Education Required*" value={newJob.education} onChange={e => setNewJob({...newJob, education: e.target.value})} />
                 <input required className="w-full bg-gray-50 p-4 rounded-xl outline-none" placeholder="Salary Slab*" value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} />
                 <select required className="w-full bg-gray-50 p-4 rounded-xl outline-none" value={newJob.gender} onChange={e => setNewJob({...newJob, gender: e.target.value})}>
                   <option value="Any">Equal Opportunity (Any)</option>
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                 </select>
                 <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl">
                    Confirm and Publish Mandate
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
