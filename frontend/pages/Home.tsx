
import React, { useState } from 'react';
import { motion } from 'framer-motion';
const MotionDiv = (motion as any).div;
const MotionButton = (motion as any).button;
import { ArrowRight, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { INDUSTRIES, API_BASE_URL } from '../constants.tsx';
import { EnquiryType } from '../types.ts';

const EnquiryModal: React.FC<{ type: EnquiryType; onClose: () => void }> = ({ type, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md">
        <MotionDiv 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-3xl font-serif font-bold text-brand-dark mb-4">Request Sent</h3>
          <p className="text-gray-600 mb-8">Our executive staffing partners will contact you shortly to discuss your organizational needs.</p>
          <button onClick={onClose} className="w-full bg-brand-gold text-brand-dark py-4 rounded-full font-bold hover:bg-yellow-500 transition-colors">Return to Dashboard</button>
        </MotionDiv>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md">
      <MotionDiv 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="bg-white rounded-[3rem] overflow-hidden max-w-2xl w-full shadow-2xl relative"
      >
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-4xl font-serif font-bold text-brand-dark">Executive Sourcing</h3>
              <p className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mt-2">Strategic Talent Acquisition Request</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none text-brand-dark" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Corporate Email</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none text-brand-dark" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Organization / Department</label>
              <input 
                value={formData.company} 
                onChange={e => setFormData({...formData, company: e.target.value})} 
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none text-brand-dark" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Requirement Brief</label>
              <textarea 
                required 
                rows={4} 
                value={formData.message} 
                onChange={e => setFormData({...formData, message: e.target.value})} 
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-gold outline-none resize-none text-brand-dark" 
              />
            </div>
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-brand-gold text-brand-dark py-6 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg shadow-brand-gold/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Submit Engagement Request'} <ArrowRight size={20} className="ml-2" />
            </button>
          </form>
        </div>
      </MotionDiv>
    </div>
  );
};

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <MotionDiv initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
              <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-black uppercase tracking-[0.3em]">
                <ShieldCheck size={16} />
                <span>Executive Sourcing Excellence</span>
              </div>
              
              <h1 className="text-7xl lg:text-9xl font-serif font-bold text-white leading-[0.9] tracking-tight">
                Right Talent, <br/><span className="text-brand-gold italic">Right Direction.</span>
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl font-serif italic">
                Architecting the bridge between organizational ambitions and high-tier professional mastery.
              </p>
              
              <div className="pt-4">
                <MotionButton 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setModalOpen(true)} 
                  className="bg-brand-gold text-brand-dark px-14 py-6 rounded-full font-bold text-xl flex items-center justify-center group hover:bg-yellow-500 transition-all shadow-xl shadow-brand-gold/10"
                >
                  Consult With Us <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
                </MotionButton>
              </div>
            </MotionDiv>

            <MotionDiv 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="hidden lg:block relative"
            >
               <img 
                 src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" 
                 className="rounded-[4rem] shadow-2xl grayscale brightness-75 border border-white/10" 
                 alt="Professional Consulting" 
               />
               <div className="absolute bottom-10 left-10 p-8 bg-brand-dark/80 backdrop-blur-xl rounded-[2rem] border border-white/10 max-w-xs">
                  <p className="text-white font-serif italic text-lg leading-relaxed">"Strategic alignment is the catalyst for growth."</p>
               </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-gold">Our Expertise</h2>
            <h3 className="text-5xl font-serif font-bold text-brand-dark">Industries We Serve</h3>
            <div className="w-20 h-1 bg-brand-gold mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {INDUSTRIES.map((industry) => (
              <MotionDiv 
                whileHover={{ y: -10 }}
                key={industry} 
                className="p-16 bg-brand-dark rounded-[3rem] text-center group transition-all duration-500 shadow-2xl"
              >
                <div className="w-24 h-24 border-4 border-brand-gold rounded-full flex items-center justify-center mx-auto mb-10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                  <CheckCircle2 size={40} />
                </div>
                <p className="text-2xl font-serif font-bold text-white group-hover:text-brand-gold transition-colors">{industry}</p>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-4 font-bold">Premium Vertical</div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && <EnquiryModal type={EnquiryType.EMPLOYER} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Home;
