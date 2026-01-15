
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, UserCircle2, CheckCircle, AlertCircle, Upload, Send, ArrowRight } from 'lucide-react';
import { API_BASE_URL, COMPANY_TYPES } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const Contact: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employer' | 'seeker'>('employer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Employer Form State
  const [employerForm, setEmployerForm] = useState({
    companyName: '',
    industry: '',
    website: '',
    address: '',
    companyType: '',
    contactName: '',
    designation: '',
    email: '',
    mobile: '',
    alternateNumber: ''
  });

  // Candidate Form State
  const [seekerForm, setSeekerForm] = useState({
    name: '',
    mobile: '',
    location: '',
    dob: '',
    qualification: '',
    passingYear: '',
    currentTitle: '',
    preferredRole: '',
    preferredIndustry: '',
    preferredLocation: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    resumeData: '',
    resumeName: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Resume must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSeekerForm({
          ...seekerForm,
          resumeData: reader.result as string,
          resumeName: file.name
        });
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
      else setError('Submission failed. Please check your network.');
    } catch (err) {
      setError('Communication error with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerForm.resumeData) {
      alert("Please upload your resume");
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seekerForm)
      });
      if (res.ok) setSuccess(true);
      else setError('Submission failed. Please check your network.');
    } catch (err) {
      setError('Communication error with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <MotionDiv initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[3rem] text-center max-w-md w-full shadow-4xl border border-gray-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Success!</h2>
          <p className="text-gray-500 mb-10 leading-relaxed font-serif italic">Your enquiry has been received. Our team will contact you shortly.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-brand-gold text-brand-dark py-5 rounded-full font-bold hover:bg-yellow-500 transition-all flex items-center justify-center">
            Send Another Enquiry <ArrowRight size={18} className="ml-2" />
          </button>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-24">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-brand-dark mb-6">Connect With <span className="text-brand-gold">Us</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-serif italic text-lg leading-relaxed">Whether you are looking to hire elite talent or seeking your next professional milestone, we are here to bridge the gap.</p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex bg-white p-2 rounded-[2rem] shadow-xl mb-12 border border-gray-100">
            <button 
              onClick={() => setActiveTab('employer')}
              className={`flex-1 flex items-center justify-center py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all ${activeTab === 'employer' ? 'bg-brand-dark text-brand-gold' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              <Building2 size={18} className="mr-2" /> Job Giver (Company)
            </button>
            <button 
              onClick={() => setActiveTab('seeker')}
              className={`flex-1 flex items-center justify-center py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all ${activeTab === 'seeker' ? 'bg-brand-dark text-brand-gold' : 'text-gray-400 hover:text-brand-dark'}`}
            >
              <UserCircle2 size={18} className="mr-2" /> Job Seeker
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
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Industry/Sector*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.industry} onChange={e => setEmployerForm({...employerForm, industry: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Company Website*</label>
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
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Registered Office Address*</label>
                      <textarea required rows={2} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold resize-none" value={employerForm.address} onChange={e => setEmployerForm({...employerForm, address: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Contact Person Name*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.contactName} onChange={e => setEmployerForm({...employerForm, contactName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Designation*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.designation} onChange={e => setEmployerForm({...employerForm, designation: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address*</label>
                      <input required type="email" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.email} onChange={e => setEmployerForm({...employerForm, email: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile Number*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.mobile} onChange={e => setEmployerForm({...employerForm, mobile: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Alternate Number</label>
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
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Mobile Number*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.mobile} onChange={e => setSeekerForm({...seekerForm, mobile: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Current City & State*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.location} onChange={e => setSeekerForm({...seekerForm, location: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Date of Birth*</label>
                      <input required type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.dob} onChange={e => setSeekerForm({...seekerForm, dob: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Highest Qualification*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.qualification} onChange={e => setSeekerForm({...seekerForm, qualification: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Passing Year*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.passingYear} onChange={e => setSeekerForm({...seekerForm, passingYear: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Current Job Title</label>
                      <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.currentTitle} onChange={e => setSeekerForm({...seekerForm, currentTitle: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Preferred Job Role*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.preferredRole} onChange={e => setSeekerForm({...seekerForm, preferredRole: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Preferred Industry</label>
                      <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.preferredIndustry} onChange={e => setSeekerForm({...seekerForm, preferredIndustry: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Preferred Work Location*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.preferredLocation} onChange={e => setSeekerForm({...seekerForm, preferredLocation: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Current Salary</label>
                      <input className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.currentSalary} onChange={e => setSeekerForm({...seekerForm, currentSalary: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Expected Salary*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.expectedSalary} onChange={e => setSeekerForm({...seekerForm, expectedSalary: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Notice Period*</label>
                      <input required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.noticePeriod} onChange={e => setSeekerForm({...seekerForm, noticePeriod: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Resume (Max 2MB)*</label>
                      <div className="relative group">
                        <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-brand-gold group-hover:text-brand-gold transition-all">
                          {seekerForm.resumeName ? <span className="text-brand-dark font-bold">{seekerForm.resumeName}</span> : <><Upload size={18} className="mr-2" /> Upload Resume</>}
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-2 pt-6">
                      <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 rounded-full font-bold flex items-center justify-center hover:bg-black transition-all shadow-xl">
                        {isSubmitting ? 'Submitting...' : 'Submit Profile Application'} <Send size={18} className="ml-2" />
                      </button>
                    </div>
                  </form>
                </MotionDiv>
              )}
            </AnimatePresence>

            {error && (
              <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-4 bg-red-50 text-red-500 rounded-2xl flex items-center text-sm border border-red-100">
                <AlertCircle size={18} className="mr-2" /> {error}
              </MotionDiv>
            )}
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default Contact;
