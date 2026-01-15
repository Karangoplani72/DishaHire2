
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
  Globe,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { API_BASE_URL, COMPANY_TYPES, CONTACT_INFO } from '../constants.tsx';

const MotionDiv = (motion as any).div;

const FAQ_DATA = [
  {
    q: "How long does the recruitment process typically take?",
    a: "Our standard turnaround time for initial shortlisting is 3-5 business days. The complete hiring cycle depends on the role's complexity and client interview availability."
  },
  {
    q: "Do you charge candidates for placements?",
    a: "Absolutely not. We follow ethical recruitment practices and never charge candidates for job placements or interview opportunities."
  },
  {
    q: "What industries does DishaHire specialize in?",
    a: "We serve 15 core sectors including IT, BFSI, Healthcare, Manufacturing, and Logistics, providing both executive and general staffing solutions."
  },
  {
    q: "How can I update my existing application?",
    a: "You can reach out to us via our official WhatsApp or email with your updated resume, and our team will synchronize it with your current profile."
  }
];

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
    <div className="bg-brand-light min-h-screen">
      {/* Page Header */}
      <section className="bg-brand-dark text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
           <h1 className="text-4xl sm:text-7xl font-serif font-bold mb-6">Connect With <span className="text-brand-gold">Us</span></h1>
           <p className="text-gray-400 font-serif italic text-lg max-w-2xl mx-auto">Bridging the gap between organizational ambition and professional mastery through strategic consultation.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 pb-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Form Selection Tabs */}
            <div className="flex bg-white p-2 rounded-[2.5rem] shadow-xl border border-gray-100">
              <button 
                onClick={() => setActiveTab('employer')}
                className={`flex-1 flex items-center justify-center py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all ${activeTab === 'employer' ? 'bg-brand-dark text-brand-gold' : 'text-gray-400 hover:text-brand-dark'}`}
              >
                <Building2 size={18} className="mr-2" /> Employer / Company
              </button>
              <button 
                onClick={() => setActiveTab('seeker')}
                className={`flex-1 flex items-center justify-center py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all ${activeTab === 'seeker' ? 'bg-brand-dark text-brand-gold' : 'text-gray-400 hover:text-brand-dark'}`}
              >
                <UserCircle2 size={18} className="mr-2" /> Candidate / Seeker
              </button>
            </div>

            {/* Main Enquiry Form */}
            <MotionDiv layout className="bg-white p-8 sm:p-14 rounded-[3.5rem] shadow-4xl border border-gray-100">
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
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Corporate Address*</label>
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
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name*</label>
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
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1">Current Role</label>
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

            {/* FAQs Section */}
            <div className="bg-white p-8 sm:p-14 rounded-[3.5rem] shadow-xl border border-gray-100">
               <div className="flex items-center gap-4 mb-10">
                 <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-2xl"><HelpCircle size={24} /></div>
                 <div>
                   <h3 className="text-2xl font-serif font-bold text-brand-dark">Frequently Asked Questions</h3>
                   <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Common Support Queries</p>
                 </div>
               </div>
               <div className="grid gap-8">
                 {FAQ_DATA.map((faq, i) => (
                   <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                     <h4 className="font-bold text-brand-dark mb-2 text-base">{faq.q}</h4>
                     <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-8">
            <div className="bg-brand-dark p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={80} /></div>
               <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Corporate Hub</h3>
               <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><MapPin size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Regional HQ</p>
                      <p className="text-sm font-medium">{CONTACT_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><Mail size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Corporate Mail</p>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-medium hover:text-brand-gold transition-colors truncate block max-w-[180px]">{CONTACT_INFO.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><Phone size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Consultation Line</p>
                      <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-sm font-medium hover:text-brand-gold transition-colors">{CONTACT_INFO.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl text-brand-gold"><Clock size={20} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Engagement Hours</p>
                      <p className="text-sm font-medium">Mon - Sat: 10:00 AM - 7:00 PM</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-brand-gold" size={24} />
                <h4 className="text-xl font-serif font-bold text-brand-dark">Our Commitment</h4>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-light text-brand-gold flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                  <p className="text-xs text-gray-600 leading-relaxed"><strong>24h Feedback:</strong> Initial response within one business day for all corporate mandates.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-light text-brand-gold flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                  <p className="text-xs text-gray-600 leading-relaxed"><strong>Ethical Vetting:</strong> Every candidate profile undergoes a rigorous 3-step quality verification.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-brand-light text-brand-gold flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                  <p className="text-xs text-gray-600 leading-relaxed"><strong>Data Privacy:</strong> Secure handling of corporate requirements and sensitive talent data.</p>
                </div>
              </div>
              <div className="pt-4">
                <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-green-50 text-green-600 font-bold hover:bg-green-600 hover:text-white transition-all text-sm border border-green-100">
                  <MessageSquare size={18} /> Chat with Consultant
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
