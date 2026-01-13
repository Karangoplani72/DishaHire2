
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { INDUSTRIES } from '../constants.tsx';
import EnquiryModal from '../components/EnquiryModal.tsx';
import { EnquiryType } from '../types.ts';

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEnquiryType, setActiveEnquiryType] = useState<EnquiryType>(EnquiryType.CANDIDATE);

  const openEnquiry = (type: EnquiryType) => {
    setActiveEnquiryType(type);
    setModalOpen(true);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-brand-gold/5 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-accent/25 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -60 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1 }}
              className="space-y-12"
            >
              <div className="inline-flex items-center space-x-4 px-6 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[11px] font-black tracking-[0.4em] uppercase">
                <ShieldCheck size={18} />
                <span>Executive Sourcing Excellence</span>
              </div>
              
              <h1 className="text-7xl lg:text-9xl font-serif font-bold text-white leading-[0.95] tracking-tight">
                Right Talent, <br/>
                <span className="text-brand-gold italic">Right Direction.</span>
              </h1>
              
              <p className="text-2xl text-gray-400 leading-relaxed max-w-xl font-serif italic">
                Architecting the bridge between world-class organizational ambitions and high-tier professional mastery.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 pt-6">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEnquiry(EnquiryType.EMPLOYER)}
                  className="bg-brand-gold text-brand-dark px-12 py-6 rounded-[2rem] font-serif font-black text-2xl flex items-center justify-center group transition-all shadow-3xl shadow-brand-gold/30"
                >
                  Hire Talent <ArrowRight size={24} className="ml-4 group-hover:translate-x-3 transition-transform" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openEnquiry(EnquiryType.CANDIDATE)}
                  className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-12 py-6 rounded-[2rem] font-serif font-black text-2xl transition-all"
                >
                  Find a Job
                </motion.button>
              </div>
            </motion.div>

            <div className="hidden lg:block relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="relative z-10 rounded-[5rem] overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] border border-white/10 group"
              >
                 <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1400" 
                  alt="Senior Recruitment" 
                  className="w-full h-[850px] object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2000ms]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 space-y-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-brand-gold">Global Verticals</h2>
            <h3 className="text-6xl font-serif font-bold text-brand-dark">Specialized Industries</h3>
            <div className="w-32 h-1.5 bg-brand-gold mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {INDUSTRIES.map((industry) => (
              <motion.div 
                whileHover={{ scale: 1.05, y: -10 }}
                key={industry} 
                className="p-16 bg-brand-dark rounded-[3.5rem] shadow-3xl border border-white/5 group text-center cursor-default transition-all duration-500"
              >
                <div className="w-24 h-24 bg-transparent border-4 border-brand-gold rounded-full flex items-center justify-center mx-auto mb-10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all duration-500">
                  <CheckCircle2 size={44} />
                </div>
                <p className="text-2xl font-serif font-bold text-white leading-tight group-hover:text-brand-gold transition-colors duration-500">{industry}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-4">Premium Vertical</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-48 bg-white relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-16">
          <h2 className="text-6xl md:text-9xl font-serif font-bold text-brand-dark tracking-tighter">Secure Your Strategic Advantage.</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-10 pt-8">
             <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openEnquiry(EnquiryType.EMPLOYER)} 
              className="bg-brand-dark text-white px-20 py-8 rounded-[2.5rem] font-serif font-black text-2xl shadow-4xl"
             >
               Consultation
             </motion.button>
             <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openEnquiry(EnquiryType.CANDIDATE)} 
              className="bg-white border-4 border-brand-dark text-brand-dark px-20 py-8 rounded-[2.5rem] font-serif font-black text-2xl"
             >
               Submit Executive CV
             </motion.button>
          </div>
        </div>
      </section>

      {modalOpen && <EnquiryModal type={activeEnquiryType} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Home;
