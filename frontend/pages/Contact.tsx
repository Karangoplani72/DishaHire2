
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as RouterDOM from 'react-router-dom';
const { useLocation } = RouterDOM as any;
import { 
  Building2, 
  UserCircle2, 
  CheckCircle, 
  Upload, 
  Send, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Globe,
  ChevronDown,
  MessageSquare,
  Briefcase,
  Zap
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

const AccordionItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group"
      >
        <span className={`text-lg font-serif font-bold transition-colors ${isOpen ? 'text-brand-gold' : 'text-brand-dark group-hover:text-brand-gold'}`}>{q}</span>
        <ChevronDown className={`text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-500 leading-relaxed text-sm sm:text-base">{a}</p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

const Contact: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'employer' | 'seeker'>('employer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab === 'seeker' ? 'seeker' : 'employer');
    }
  }, [location.state]);

  const [employerForm, setEmployerForm] = useState({
    companyName: '', industry: '', website: '', address: '', companyType: '', 
    contactName: '', designation: '', email: '', mobile: '', alternateNumber: ''
  });

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
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employerForm)
      });
      if (res.ok) setSuccess(true);
    } catch (err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  };

  const handleSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerForm.resumeData) { alert("Please upload your resume"); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seekerForm)
      });
      if (res.ok) setSuccess(true);
    } catch (err) { console.error(err); } 
    finally { setIsSubmitting(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <MotionDiv initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[3rem] text-center max-w-md w-full shadow-4xl border border-gray-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle size={48} /></div>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Request Received</h2>
          <p className="text-gray-500 mb-10 leading-relaxed font-serif italic">Your consultation request has been queued. An executive will contact you within 24 hours.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-brand-gold text-brand-dark py-5 rounded-full font-bold hover:bg-yellow-500 transition-all flex items-center justify-center">
            Return to Contact <ArrowRight size={18} className="ml-2" />
          </button>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="bg-brand-dark text-white pt-24 pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
           <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <h1 className="text-5xl sm:text-8xl font-serif font-bold mb-8">Get in <span className="text-brand-gold">Touch.</span></h1>
             <p className="text-gray-400 font-serif italic text-xl max-w-2xl mx-auto">
               Strategic consulting begins with a single conversation. Choose your path below to start the journey.
             </p>
           </MotionDiv>
        </div>
      </section>

      {/* Path Selection - Integrated Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-32 relative z-20">
        <div className="grid sm:grid-cols-2 gap-8 mb-16">
          {[
            { id: 'employer', label: 'I am looking for Talent', icon: Building2, color: 'brand-gold' },
            { id: 'seeker', label: 'I am looking for a Career', icon: UserCircle2, color: 'brand-gold' }
          ].map((path) => (
            <button 
              key={path.id}
              onClick={() => setActiveTab(path.id as any)}
              className={`p-10 rounded-[3rem] text-left transition-all duration-500 border-4 flex items-center justify-between group ${activeTab === path.id ? 'bg-white border-brand-gold shadow-4xl' : 'bg-brand-dark/50 backdrop-blur-md border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-6">
                <div className={`p-5 rounded-3xl transition-all ${activeTab === path.id ? 'bg-brand-gold text-white' : 'bg-white/10 text-brand-gold'}`}>
                  <path.icon size={32} />
                </div>
                <div>
                  <h3 className={`text-xl sm:text-2xl font-serif font-bold transition-colors ${activeTab === path.id ? 'text-brand-dark' : 'text-white/60'}`}>{path.label}</h3>
                  <p className={`text-[10px] uppercase tracking-widest font-black transition-colors ${activeTab === path.id ? 'text-brand-gold' : 'text-gray-500'}`}>Start Consultation</p>
                </div>
              </div>
              <ArrowRight className={`transition-all ${activeTab === path.id ? 'text-brand-gold opacity-100 translate-x-0' : 'text-white opacity-0 -translate-x-4'}`} size={24} />
            </button>
          ))}
        </div>

        {/* Dynamic Form Content */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <MotionDiv layout className="bg-white p-8 sm:p-14 rounded-[3.5rem] shadow-4xl border border-gray-100">
              <AnimatePresence mode="wait">
                {activeTab === 'employer' ? (
                  <MotionDiv key="employer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="mb-10">
                      <h2 className="text-3xl font-serif font-bold text-brand-dark">Corporate Mandate</h2>
                      <p className="text-brand-gold text-xs font-black uppercase tracking-widest mt-1">Talent Acquisition Request</p>
                    </div>
                    <form onSubmit={handleEmployerSubmit} className="space-y-10">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Entity Name</label>
                          <input required placeholder="Your Organization" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all" value={employerForm.companyName} onChange={e => setEmployerForm({...employerForm, companyName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Organization Type</label>
                          <select required className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.companyType} onChange={e => setEmployerForm({...employerForm, companyType: e.target.value})}>
                            <option value="">Select Type</option>
                            {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sector/Industry</label>
                          <input required placeholder="e.g. Finance, IT" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.industry} onChange={e => setEmployerForm({...employerForm, industry: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Corporate Website</label>
                          <input required type="url" placeholder="https://..." className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.website} onChange={e => setEmployerForm({...employerForm, website: e.target.value})} />
                        </div>
                      </div>

                      <div className="h-[1px] bg-gray-100" />

                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Point of Contact</label>
                          <input required placeholder="Full Name" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.contactName} onChange={e => setEmployerForm({...employerForm, contactName: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                          <input required type="email" placeholder="corporate@email.com" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.email} onChange={e => setEmployerForm({...employerForm, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Line</label>
                          <input required placeholder="+91 XXXX XXX XXX" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.mobile} onChange={e => setEmployerForm({...employerForm, mobile: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Position/Designation</label>
                          <input required placeholder="HR Manager / Director" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={employerForm.designation} onChange={e => setEmployerForm({...employerForm, designation: e.target.value})} />
                        </div>
                      </div>

                      <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-6 rounded-full font-bold text-lg flex items-center justify-center hover:bg-black transition-all shadow-xl">
                        {isSubmitting ? 'Processing Request...' : 'Initiate Corporate Partnership'} <Send size={20} className="ml-3" />
                      </button>
                    </form>
                  </MotionDiv>
                ) : (
                  <MotionDiv key="seeker" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="mb-10">
                      <h2 className="text-3xl font-serif font-bold text-brand-dark">Candidate Profile</h2>
                      <p className="text-brand-gold text-xs font-black uppercase tracking-widest mt-1">Career Growth Application</p>
                    </div>
                    <form onSubmit={handleSeekerSubmit} className="space-y-10">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                          <input required placeholder="Your Name" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.name} onChange={e => setSeekerForm({...seekerForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Location</label>
                          <input required placeholder="City, State" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.location} onChange={e => setSeekerForm({...seekerForm, location: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Qualification</label>
                          <input required placeholder="e.g. MBA, B.Tech" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.qualification} onChange={e => setSeekerForm({...seekerForm, qualification: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Passing Year</label>
                          <input required placeholder="YYYY" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.passingYear} onChange={e => setSeekerForm({...seekerForm, passingYear: e.target.value})} />
                        </div>
                      </div>

                      <div className="h-[1px] bg-gray-100" />

                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Desired Role</label>
                          <input required placeholder="Target Position" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.preferredRole} onChange={e => setSeekerForm({...seekerForm, preferredRole: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Notice Period</label>
                          <input required placeholder="e.g. 30 Days" className="w-full p-5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold" value={seekerForm.noticePeriod} onChange={e => setSeekerForm({...seekerForm, noticePeriod: e.target.value})} />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Curated CV (PDF/Word)</label>
                          <div className="relative group">
                            <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                            <div className="w-full p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 group-hover:border-brand-gold group-hover:text-brand-gold transition-all">
                              <Upload size={32} className="mb-4" />
                              <span className="font-bold text-sm">{seekerForm.resumeName || "Drop CV here or Browse"}</span>
                              <span className="text-[10px] mt-2">Maximum file size: 2MB</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-6 rounded-full font-bold text-lg flex items-center justify-center hover:bg-black transition-all shadow-xl">
                        {isSubmitting ? 'Submitting Application...' : 'Send Profile for Review'} <Send size={20} className="ml-3" />
                      </button>
                    </form>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-dark p-10 rounded-[3rem] text-white shadow-4xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={120} /></div>
               <h3 className="text-3xl font-serif font-bold mb-10 relative z-10">Direct <br/><span className="text-brand-gold italic">Connect.</span></h3>
               <div className="space-y-8 relative z-10">
                  {[
                    { icon: MapPin, label: 'Regional HQ', val: CONTACT_INFO.address },
                    { icon: Mail, label: 'Corporate Mail', val: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                    { icon: Phone, label: 'Enquiry Line', val: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}` },
                    { icon: Clock, label: 'Service Hours', val: 'Mon - Sat: 10AM - 7PM' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="p-3 bg-white/10 rounded-2xl text-brand-gold h-fit"><item.icon size={20} /></div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium hover:text-brand-gold transition-colors block break-all">{item.val}</a>
                        ) : (
                          <p className="text-sm font-medium">{item.val}</p>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
               <div className="flex items-center gap-4 text-brand-dark">
                  <Zap size={24} className="text-brand-gold" />
                  <h4 className="text-xl font-serif font-bold">Quick Assistance</h4>
               </div>
               <p className="text-gray-500 text-sm leading-relaxed">Need an immediate answer? Our WhatsApp concierge is online for real-time enquiries.</p>
               <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-5 rounded-full bg-green-50 text-green-600 font-bold hover:bg-green-600 hover:text-white transition-all text-sm border border-green-100">
                  <MessageSquare size={20} /> Chat with Consultant
               </a>
            </div>
          </div>
        </div>

        {/* FAQ Section - Premium Accordion */}
        <section className="mt-32 mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold mb-4">Support Hub</h2>
            <h3 className="text-3xl sm:text-5xl font-serif font-bold text-brand-dark">Common Questions</h3>
          </div>
          <div className="bg-white rounded-[3rem] p-8 sm:p-14 shadow-2xl border border-gray-100">
            {FAQ_DATA.map((faq, i) => (
              <AccordionItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
