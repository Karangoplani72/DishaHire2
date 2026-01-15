
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as RouterDOM from 'react-router-dom';
const { useLocation } = RouterDOM as any;
import { 
  Building2, 
  UserCircle2, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Send, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';
import { API_BASE_URL, COMPANY_TYPES, CONTACT_INFO } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const Contact: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'employer' | 'seeker'>('employer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab === 'seeker' ? 'seeker' : 'employer');
    }
  }, [location.state]);

  // Employer Form State
  const [employerForm, setEmployerForm] = useState({
    companyName: '', industry: '', website: '', address: '', companyType: '', 
    contactName: '', designation: '', email: '', mobile: '', alternateNumber: ''
  });

  // Candidate Form State
  const [seekerForm, setSeekerForm] = useState({
    name: '', mobile: '', location: '', dob: '', qualification: '', 
    passingYear: '', currentTitle: '', preferredRole: '', preferredIndustry: '', 
    preferredLocation: '', currentSalary: '', expectedSalary: '', 
    noticePeriod: '', resumeData: '', resumeName: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = ['pdf', 'doc', 'docx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert("Invalid format. Only PDF or Word files (.doc, .docx) are permitted.");
        e.target.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSeekerForm({ ...seekerForm, resumeData: reader.result as string, resumeName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employerForm)
      });
      if (res.ok) setSuccess(true);
      else setError('Submission failed. Check connectivity.');
    } catch (err) { setError('Communication error.'); } 
    finally { setIsSubmitting(false); }
  };

  const handleSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerForm.resumeData) { alert("Please upload your resume"); return; }
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seekerForm)
      });
      if (res.ok) setSuccess(true);
      else setError('Submission failed.');
    } catch (err) { setError('Communication error.'); } 
    finally { setIsSubmitting(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <MotionDiv initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[3rem] text-center max-w-md w-full shadow-4xl border border-gray-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle size={48} /></div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Success!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed font-serif italic">Your enquiry has been received. Our team will contact you shortly.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-brand-gold text-brand-dark py-5 rounded-full font-bold hover:bg-yellow-500 transition-all flex items-center justify-center">
            New Enquiry <ArrowRight size={18} className="ml-2" />
          </button>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark mb-6">Connect With <span className="text-brand-gold">Us</span></h1>
              <p className="text-gray-500 font-serif italic text-lg">Choose your specific requirement below to start our engagement process.</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-2 rounded-[2rem] shadow-xl mb-12 border border-gray-100">
              <button 
                onClick={() => setActiveTab('employer')}
                className={`flex-1 flex items-center justify-center py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all ${activeTab === 'employer' ? 'bg-brand-dark text-brand-gold' : 'text-gray-400 hover:text-brand-dark'}`}
              >
                <Building2 size={18} className="mr-2" /> Employer / Company
              </button>
              <button 
                onClick={() => setActiveTab('seeker')}
                className={`flex-1 flex items-center justify-center py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all ${activeTab === 'seeker' ? 'bg-brand-dark text-brand-gold' : 'text-gray-400 hover:text-brand-dark'}`}
              >
                <UserCircle2 size={18} className="mr-2" /> Candidate / Seeker
              </button>
            </div>

            <MotionDiv layout className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-4xl border border-gray-100">
              <AnimatePresence mode="wait">
                {activeTab === 'employer' ? (
                  <MotionDiv key="employer" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <form onSubmit={handleEmployerSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Company Name*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.companyName} onChange={e => setEmployerForm({...employerForm, companyName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Industry*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.industry} onChange={e => setEmployerForm({...employerForm, industry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Website*</label>
                        <input required type="url" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.website} onChange={e => setEmployerForm({...employerForm, website: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Company Type*</label>
                        <select required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold appearance-none" value={employerForm.companyType} onChange={e => setEmployerForm({...employerForm, companyType: e.target.value})}>
                          <option value="">Select Type</option>
                          {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Address*</label>
                        <textarea required rows={2} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold resize-none" value={employerForm.address} onChange={e => setEmployerForm({...employerForm, address: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Person Name*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.contactName} onChange={e => setEmployerForm({...employerForm, contactName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Designation*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.designation} onChange={e => setEmployerForm({...employerForm, designation: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Email*</label>
                        <input required type="email" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.email} onChange={e => setEmployerForm({...employerForm, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.mobile} onChange={e => setEmployerForm({...employerForm, mobile: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Alt Number</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.alternateNumber} onChange={e => setEmployerForm({...employerForm, alternateNumber: e.target.value})} />
                      </div>
                      <div className="sm:col-span-2 pt-6">
                        <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 rounded-full font-bold flex items-center justify-center hover:bg-black transition-all shadow-xl">
                          {isSubmitting ? 'Submitting...' : 'Register Corporate Mandate'} <Send size={18} className="ml-2" />
                        </button>
                      </div>
                    </form>
                  </MotionDiv>
                ) : (
                  <MotionDiv key="seeker" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <form onSubmit={handleSeekerSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Name*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.name} onChange={e => setSeekerForm({...seekerForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.mobile} onChange={e => setSeekerForm({...seekerForm, mobile: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Location*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.location} onChange={e => setSeekerForm({...seekerForm, location: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">DOB*</label>
                        <input required type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.dob} onChange={e => setSeekerForm({...seekerForm, dob: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Qualification*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.qualification} onChange={e => setSeekerForm({...seekerForm, qualification: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Passing Year*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.passingYear} onChange={e => setSeekerForm({...seekerForm, passingYear: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Job Title</label>
                        <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.currentTitle} onChange={e => setSeekerForm({...seekerForm, currentTitle: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Preferred Role*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.preferredRole} onChange={e => setSeekerForm({...seekerForm, preferredRole: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Resume (PDF/Doc, Max 2MB)*</label>
                        <div className="relative group">
                          <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-brand-gold group-hover:text-brand-gold transition-all text-sm font-bold">
                            {seekerForm.resumeName ? seekerForm.resumeName : <><Upload size={18} className="mr-2" /> Upload Resume</>}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Expected Salary*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.expectedSalary} onChange={e => setSeekerForm({...seekerForm, expectedSalary: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Notice Period*</label>
                        <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.noticePeriod} onChange={e => setSeekerForm({...seekerForm, noticePeriod: e.target.value})} />
                      </div>
                      <div className="sm:col-span-2 pt-6">
                        <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 rounded-full font-bold flex items-center justify-center hover:bg-black transition-all shadow-xl">
                          {isSubmitting ? 'Submitting...' : 'Submit Profile'} <Send size={18} className="ml-2" />
                        </button>
                      </div>
                    </form>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-12">
            <div className="bg-brand-dark p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={80} /></div>
               <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Corporate Hub</h3>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><MapPin size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Headquarters</p>
                      <p className="text-sm font-medium">{CONTACT_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><Mail size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Official Correspondence</p>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-medium hover:text-brand-gold transition-colors">{CONTACT_INFO.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><Phone size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Elite Support</p>
                      <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-sm font-medium hover:text-brand-gold transition-colors">{CONTACT_INFO.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><Clock size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Service Hours</p>
                      <p className="text-sm font-medium">Mon - Sat: 10:00 AM - 7:00 PM</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-6">
              <h4 className="text-xl font-serif font-bold text-brand-dark">Why Connect?</h4>
              <ul className="space-y-4">
                {[
                  "Verified Elite Opportunities",
                  "Direct Access to Key Decision Makers",
                  "Tailored Recruitment Strategies",
                  "Strategic Career Guidance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle size={16} className="text-brand-gold flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-full border-2 border-brand-dark text-brand-dark font-bold hover:bg-brand-dark hover:text-white transition-all text-sm">
                  <Globe size={18} /> Global Inquiries
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
