
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as RouterDOM from 'react-router-dom';
const { useLocation } = RouterDOM as any;
import { 
  Building2, 
  UserCircle2, 
  CheckCircle, 
  Send, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronDown,
  MessageSquare,
  Zap,
  Loader2
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
        className="w-full py-5 sm:py-6 flex justify-between items-center text-left group"
      >
        <span className={`text-base sm:text-lg font-serif font-bold transition-colors ${isOpen ? 'text-brand-gold' : 'text-brand-dark group-hover:text-brand-gold'}`}>{q}</span>
        <ChevronDown className={`text-brand-gold transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 text-gray-500 leading-relaxed text-xs sm:text-base">{a}</p>
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
    name: '', email: '', mobile: '', location: '', qualification: '', 
    passingYear: '', preferredRole: '', noticePeriod: ''
  });

  const handleEmployerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employerForm)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        alert(data.error || "Submission Failed. Please try again.");
      }
    } catch (err) { 
      console.error(err); 
      alert("Network Error. Check your connection.");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries/candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seekerForm)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        alert(data.error || "Submission Failed. Please try again.");
      }
    } catch (err) { 
      console.error(err); 
      alert("Network Error. Check your connection.");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
        <MotionDiv initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 sm:p-12 rounded-[2.5rem] text-center max-w-md w-full shadow-4xl border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8"><CheckCircle size={40} /></div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark mb-4">Request Received</h2>
          <p className="text-gray-500 mb-8 sm:mb-10 leading-relaxed font-serif italic text-sm sm:text-base">Your consultation request has been queued. An executive will contact you within 24 hours.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-brand-gold text-brand-dark py-4 sm:py-5 rounded-full font-bold hover:bg-yellow-500 transition-all flex items-center justify-center">
            Return to Contact <ArrowRight size={18} className="ml-2" />
          </button>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="bg-brand-light min-h-screen">
      <section className="bg-brand-dark text-white pt-16 sm:pt-24 pb-32 sm:pb-48 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
           <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <h1 className="text-4xl sm:text-6xl lg:text-8xl font-serif font-bold mb-4 sm:mb-8 leading-tight">Get in <span className="text-brand-gold">Touch.</span></h1>
             <p className="text-gray-400 font-serif italic text-base sm:text-xl max-w-2xl mx-auto px-4">
               Strategic consulting begins with a single conversation. Choose your path below to start the journey.
             </p>
           </MotionDiv>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-20 sm:-mt-32 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-16">
          {[
            { id: 'employer', label: 'Talent Sourcing', icon: Building2 },
            { id: 'seeker', label: 'Career Growth', icon: UserCircle2 }
          ].map((path) => (
            <button 
              key={path.id}
              onClick={() => setActiveTab(path.id as any)}
              className={`p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] text-left transition-all duration-500 border-2 sm:border-4 flex items-center justify-between group ${activeTab === path.id ? 'bg-white border-brand-gold shadow-4xl' : 'bg-brand-dark/50 backdrop-blur-md border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className={`p-3 sm:p-5 rounded-2xl transition-all ${activeTab === path.id ? 'bg-brand-gold text-white' : 'bg-white/10 text-brand-gold'}`}>
                  <path.icon size={24} className="sm:size-[32px]" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-2xl font-serif font-bold transition-colors ${activeTab === path.id ? 'text-brand-dark' : 'text-white/60'}`}>{path.label}</h3>
                  <p className={`text-[8px] sm:text-[10px] uppercase tracking-widest font-black transition-colors ${activeTab === path.id ? 'text-brand-gold' : 'text-gray-500'}`}>Initiate Path</p>
                </div>
              </div>
              <ArrowRight className={`transition-all hidden sm:block ${activeTab === path.id ? 'text-brand-gold opacity-100 translate-x-0' : 'text-white opacity-0 -translate-x-4'}`} size={24} />
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          <div className="lg:col-span-2">
            <MotionDiv layout className="bg-white p-6 sm:p-14 rounded-[2rem] sm:rounded-[3.5rem] shadow-4xl border border-gray-100 overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'employer' ? (
                  <MotionDiv key="employer" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <div className="mb-8 sm:mb-10">
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Corporate Mandate</h2>
                      <p className="text-brand-gold text-[9px] sm:text-xs font-black uppercase tracking-widest mt-1">Personnel Procurement Request</p>
                    </div>
                    <form onSubmit={handleEmployerSubmit} className="space-y-6 sm:space-y-10">
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Entity Name*</label>
                          <input required placeholder="Your Organization" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold transition-all text-sm" value={employerForm.companyName} onChange={e => setEmployerForm({...employerForm, companyName: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Entity Type*</label>
                          <select required className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={employerForm.companyType} onChange={e => setEmployerForm({...employerForm, companyType: e.target.value})}>
                            <option value="">Select Type</option>
                            {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Sector/Industry*</label>
                          <input required placeholder="e.g. IT, Logistics" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={employerForm.industry} onChange={e => setEmployerForm({...employerForm, industry: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Work Email*</label>
                          <input required type="email" placeholder="hr@yourcompany.com" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={employerForm.email} onChange={e => setEmployerForm({...employerForm, email: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">POC Name*</label>
                          <input required placeholder="Contact Person" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={employerForm.contactName} onChange={e => setEmployerForm({...employerForm, contactName: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Direct Mobile*</label>
                          <input required placeholder="+91 XXXXX XXXXX" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={employerForm.mobile} onChange={e => setEmployerForm({...employerForm, mobile: e.target.value})} />
                        </div>
                      </div>

                      <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 sm:py-6 rounded-full font-bold text-sm sm:text-lg flex items-center justify-center hover:bg-black transition-all shadow-xl disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                        {isSubmitting ? 'Processing...' : 'Register Corporate Mandate'}
                      </button>
                    </form>
                  </MotionDiv>
                ) : (
                  <MotionDiv key="seeker" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <div className="mb-8 sm:mb-10">
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-dark">Candidate Profile</h2>
                      <p className="text-brand-gold text-[9px] sm:text-xs font-black uppercase tracking-widest mt-1">Strategic Career Mapping</p>
                    </div>
                    <form onSubmit={handleSeekerSubmit} className="space-y-6 sm:space-y-10">
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name*</label>
                          <input required placeholder="Your Legal Name" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.name} onChange={e => setSeekerForm({...seekerForm, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address*</label>
                          <input required type="email" placeholder="email@example.com" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.email} onChange={e => setSeekerForm({...seekerForm, email: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Location*</label>
                          <input required placeholder="Current City" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.location} onChange={e => setSeekerForm({...seekerForm, location: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Mobile Number*</label>
                          <input required placeholder="+91 XXXXX XXXXX" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.mobile} onChange={e => setSeekerForm({...seekerForm, mobile: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Highest Degree*</label>
                          <input required placeholder="e.g. MBA, B.Tech" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.qualification} onChange={e => setSeekerForm({...seekerForm, qualification: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Passing Year*</label>
                          <input required placeholder="YYYY" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.passingYear} onChange={e => setSeekerForm({...seekerForm, passingYear: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Desired Role*</label>
                          <input required placeholder="Target Position" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.preferredRole} onChange={e => setSeekerForm({...seekerForm, preferredRole: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Notice Period*</label>
                          <input required placeholder="Availability (Days)" className="w-full p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-brand-gold text-sm" value={seekerForm.noticePeriod} onChange={e => setSeekerForm({...seekerForm, noticePeriod: e.target.value})} />
                        </div>
                      </div>

                      <button disabled={isSubmitting} className="w-full bg-brand-dark text-brand-gold py-5 sm:py-6 rounded-full font-bold text-sm sm:text-lg flex items-center justify-center hover:bg-black transition-all shadow-xl disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send size={18} className="mr-2" />}
                        {isSubmitting ? 'Sending Profile...' : 'Submit Profile for Review'}
                      </button>
                    </form>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </MotionDiv>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-brand-dark p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] text-white shadow-4xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"><ShieldCheck size={100} /></div>
               <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-8 sm:mb-10 relative z-10">Direct <br/><span className="text-brand-gold italic">Connect.</span></h3>
               <div className="space-y-6 sm:space-y-8 relative z-10">
                  {[
                    { icon: MapPin, label: 'Headquarters', val: CONTACT_INFO.address },
                    { icon: Mail, label: 'Official Mail', val: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                    { icon: Phone, label: 'Enquiry Line', val: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, '')}` },
                    { icon: Clock, label: 'Office Hours', val: '10AM - 7PM (Mon-Sat)' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="p-2 sm:p-3 bg-white/10 rounded-xl text-brand-gold h-fit"><item.icon size={18} className="sm:size-[20px]" /></div>
                      <div className="overflow-hidden">
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-xs sm:text-sm font-medium hover:text-brand-gold transition-colors block truncate">{item.val}</a>
                        ) : (
                          <p className="text-xs sm:text-sm font-medium truncate">{item.val}</p>
                        )}
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-xl space-y-6 sm:space-y-8">
               <div className="flex items-center gap-3 text-brand-dark">
                  <Zap size={20} className="text-brand-gold sm:size-[24px]" />
                  <h4 className="text-lg sm:text-xl font-serif font-bold">Quick Assistance</h4>
               </div>
               <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Prefer a faster response? Our consultants are available on WhatsApp for immediate support.</p>
               <a href={CONTACT_INFO.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 sm:gap-3 w-full py-4 sm:py-5 rounded-full bg-green-50 text-green-600 font-bold hover:bg-green-600 hover:text-white transition-all text-xs sm:text-sm border border-green-100">
                  <MessageSquare size={18} className="sm:size-[20px]" /> Instant Contact
               </a>
            </div>
          </div>
        </div>

        <section className="mt-20 sm:mt-32 mb-16 sm:mb-24 max-w-4xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-brand-gold mb-3 sm:mb-4">Support Center</h2>
            <h3 className="text-2xl sm:text-5xl font-serif font-bold text-brand-dark">Common Questions</h3>
          </div>
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-14 shadow-2xl border border-gray-100">
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
