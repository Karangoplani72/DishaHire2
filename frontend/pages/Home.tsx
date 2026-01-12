
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { INDUSTRIES } from '../constants.tsx';
import EnquiryModal from '../components/EnquiryModal.tsx';
import { EnquiryType } from '../types.ts';

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<EnquiryType>(EnquiryType.CANDIDATE);

  const openEnquiry = (type: EnquiryType) => {
    setActiveType(type);
    setModalOpen(true);
  };

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center bg-brand-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck size={16} />
                <span>Executive Sourcing Excellence</span>
              </div>
              <h1 className="text-6xl lg:text-8xl font-serif font-bold text-white leading-tight">
                Right Talent, <br/><span className="text-brand-gold italic">Right Direction.</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl font-serif">
                Connecting top-tier organizational ambitions with high-performance professional mastery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => openEnquiry(EnquiryType.EMPLOYER)} className="bg-brand-gold text-brand-dark px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center group hover:bg-yellow-500 transition-all">
                  Hire Talent <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => openEnquiry(EnquiryType.CANDIDATE)} className="bg-white/10 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                  Find a Job
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-4">Verticals</h2>
            <h3 className="text-4xl font-serif font-bold text-brand-dark">Industries Served</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRIES.map((industry) => (
              <div key={industry} className="p-10 bg-brand-dark rounded-3xl text-center group hover:bg-brand-accent transition-all">
                <div className="w-16 h-16 border-2 border-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-all">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-xl font-serif font-bold text-white">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && <EnquiryModal type={activeType} onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default Home;
